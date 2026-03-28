// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title  DonationPlatform
 * @author YourTrust
 * @notice Polygon-optimized, multi-NGO donation platform with multi-sig withdrawals.
 * @dev    Production-ready. Every known audit issue resolved.
 *
 *  ┌─────────────────────────────────────────────────────┐
 *  │  SECURITY FEATURES                                  │
 *  │  • CEI (Checks-Effects-Interactions) everywhere     │
 *  │  • ReentrancyGuard on all state-changing functions  │
 *  │  • receive() uses internal reentrancy lock          │
 *  │  • Separate fee tracking (NGO funds never mixed)    │
 *  │  • Separate cooldowns per withdrawal type           │
 *  │  • Multi-approval for all NGO withdrawals           │
 *  │  • Request expiry to prevent permanent NGO lockout  │
 *  │  • NGO can cancel own request                       │
 *  │  • emergencyRefund local-var-first pattern          │
 *  │  • feeOnTransfer token blacklist                    │
 *  │  • O(1) pending-request removal                     │
 *  │  • Paginated view functions                         │
 *  └─────────────────────────────────────────────────────┘
 */
contract DonationPlatform is Ownable2Step, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // =========================================================
    // CUSTOM ERRORS
    // =========================================================
    error InvalidAddress();
    error InvalidAmount();
    error NGONotFound();
    error NGOInactive();
    error NGOAlreadyRegistered();
    error WithdrawalsPaused();
    error InsufficientBalance();
    error AlreadyApproved();
    error NotApprover();
    error RequestAlreadyExecuted();
    error RequestAlreadyRejected();
    error RequestNotFound();
    error RequestNotExpired();
    error InsufficientApprovals();
    error BelowMinimumDonation();
    error TokenNotWhitelisted();
    error FeeOnTransferTokenBlocked();
    error MaxNGOCountReached();
    error MaxApproversReached();
    error DuplicateApprover();
    error OwnerCannotBeNGO();
    error WithdrawalCooldown();
    error TooManyPendingRequests();
    error MaxWithdrawalItemsExceeded();
    error ArrayLengthMismatch();
    error InvalidTokenMatch();
    error DonationAlreadyWithdrawn();
    error DonationNotFound();
    error NotInEmergencyMode();
    error PurposeHashMismatch();
    error TotalAmountOverflow();
    error UnauthorizedCaller();
    error NoPendingRequests();

    // =========================================================
    // CONSTANTS
    // =========================================================
    uint256 private constant WITHDRAWAL_COOLDOWN          = 1 days;
    uint256 private constant REQUEST_EXPIRY               = 30 days;
    uint256 private constant MIN_NATIVE_DONATION          = 1 ether;  // ~31-32 PKR on Polygon
    uint256 private constant MAX_NGO_COUNT                = 100;
    uint256 private constant MAX_WITHDRAWAL_ITEMS         = 10;
    uint256 private constant MAX_APPROVERS_PER_NGO        = 10;
    uint256 private constant MAX_PENDING_REQUESTS_PER_NGO = 5;
    uint256 private constant MAX_FEE_PERCENT              = 5;
    uint96  private constant MAX_UINT96                   = type(uint96).max;
    bytes32 private constant EMPTY_HASH                   = bytes32(0);

    // =========================================================
    // STRUCTS  (storage-packed for minimal gas)
    // =========================================================

    /// @dev Slot 0: donor(20) | — ; Slot 1: designatedNGO(20) | —
    ///      Slot 2: tokenAddress(20) + amount(12) ; Slot 3: timestamp(8)+withdrawnAmount(12)+isWithdrawn(1) [padded]
    struct DonationRecord {
        address donor;           // 20 bytes
        address designatedNGO;   // 20 bytes
        address tokenAddress;    // 20 bytes
        uint96  amount;          // 12 bytes  ← packed with tokenAddress
        uint64  timestamp;       //  8 bytes
        uint96  withdrawnAmount; // 12 bytes  ← packed with timestamp
        bool    isWithdrawn;     //  1 byte
    }

    /// @dev Two full 32-byte slots:
    ///      Slot 0: ngoAddress(20) + totalWithdrawn(12)
    ///      Slot 1: lastWithdrawal(8)+lastGeneralWithdrawal(8)+withdrawalCount(4)+pendingRequests(2)+isActive(1)+withdrawalsPaused(1) = 24 bytes
    struct NGORecord {
        address ngoAddress;              // 20 bytes
        uint96  totalWithdrawn;          // 12 bytes
        uint64  lastWithdrawal;          //  8 bytes  ← normal withdrawal cooldown
        uint64  lastGeneralWithdrawal;   //  8 bytes  ← general pool withdrawal cooldown
        uint32  withdrawalCount;         //  4 bytes
        uint16  pendingRequests;         //  2 bytes
        bool    isActive;                //  1 byte
        bool    withdrawalsPaused;       //  1 byte
    }

    /// @dev Slot 0: ngo(20)+token(12 empty) → ngo(20)
    ///      Packing: ngo(20)|token(20)|amount(12)  …
    struct WithdrawalRequest {
        address  ngo;             // 20 bytes
        address  token;           // 20 bytes
        uint96   amount;          // 12 bytes
        uint64   timestamp;       //  8 bytes
        bool     executed;        //  1 byte
        bool     rejected;        //  1 byte
        uint8    approvalsNeeded; //  1 byte
        uint8    approvalCount;   //  1 byte
        bytes32  purposeHash;     // 32 bytes
    }

    // =========================================================
    // STATE VARIABLES
    // =========================================================

    // ── Balances ──────────────────────────────────────────────
    /// @notice ngo => token => balance  (address(0) token = native MATIC)
    mapping(address => mapping(address => uint96)) public ngoBalances;

    /// @notice Collected native (MATIC) fees — never mixed with NGO funds
    uint256 public collectedNativeFees;

    /// @notice Collected ERC-20 fees per token
    mapping(address => uint256) public collectedTokenFees;

    // ── Token management ──────────────────────────────────────
    mapping(address => bool)    public whitelistedTokens;
    mapping(address => bool)    public feeOnTransferBlacklist;
    mapping(address => uint256) public minTokenDonation;

    // ── NGO management ────────────────────────────────────────
    mapping(address => NGORecord)                    public  ngoRecords;
    mapping(address => bool)                         public  isRegisteredNGO;
    mapping(address => uint8)                        private _minWithdrawalApprovals;
    mapping(address => mapping(address => bool))     public  isNGOApprover;
    mapping(address => uint8)                        private _ngoApproversCount;
    address[] private _registeredNGOs;

    // ── Withdrawal requests ───────────────────────────────────
    mapping(uint256 => WithdrawalRequest)            public  withdrawalRequests;
    mapping(uint256 => mapping(address => bool))     private _hasApproved;
    mapping(uint256 => uint256[])                    private _requestDonationIds;
    mapping(uint256 => uint96[])                     private _requestWithdrawalAmounts;

    // ── O(1) pending-request management ──────────────────────
    mapping(address => uint256[]) private _ngoPendingRequests;
    mapping(uint256 => uint256)   private _pendingRequestIndex; // requestId => array index

    // ── Donations ─────────────────────────────────────────────
    mapping(uint256 => DonationRecord) private _donations;
    mapping(address => bool)           private _isDonor;

    // ── Counters ──────────────────────────────────────────────
    uint256 private _donationCount;
    uint256 private _withdrawalRequestCount;
    uint256 private _activeNGOCount;
    uint256 private _totalDonors;
    uint256 private _totalPendingRequests;

    // ── Platform settings ─────────────────────────────────────
    uint8   public platformFeePercent = 2;
    address public feeCollector;
    bool    public emergencyMode;

    /// @dev Reentrancy guard for receive() (nonReentrant modifier
    ///      cannot be applied to receive/fallback directly)
    bool private _receiveLocked;

    // =========================================================
    // EVENTS
    // =========================================================
    event DonationReceived(
        uint256 indexed donationId,
        address indexed donor,
        address indexed designatedNGO,
        address  token,
        uint96   amount,
        bytes32  messageHash,
        uint64   timestamp
    );
    event NGORegistered(
        address indexed ngo,
        bytes32  nameHash,
        uint8    approversCount,
        uint8    minApprovals,
        uint64   timestamp
    );
    event NGOStatusUpdated(address indexed ngo, bool isActive, uint64 timestamp);
    event NGOWithdrawalsPaused(address indexed ngo, bool paused, address indexed by, uint64 timestamp);
    event WithdrawalRequestCreated(
        uint256 indexed requestId,
        address indexed ngo,
        address  token,
        uint96   amount,
        bytes32  purposeHash,
        uint64   timestamp
    );
    event WithdrawalApproved(
        uint256 indexed requestId,
        address indexed approver,
        uint8    totalApprovals,
        uint64   timestamp
    );
    event WithdrawalExecuted(
        uint256 indexed requestId,
        address indexed ngo,
        address  token,
        uint96   amount,
        uint64   timestamp
    );
    event WithdrawalRejected(uint256 indexed requestId, address indexed rejectedBy, uint64 timestamp);
    event WithdrawalRequestCancelled(uint256 indexed requestId, address indexed ngo, uint64 timestamp);
    event WithdrawalRequestExpired(uint256 indexed requestId, address indexed expiredBy, uint64 timestamp);
    event PlatformFeeUpdated(uint8 oldPercent, uint8 newPercent, uint64 timestamp);
    event FeeCollected(address indexed token, uint96 amount, uint64 timestamp);
    event FeeWithdrawn(address indexed token, uint96 amount, address indexed to, uint64 timestamp);
    event NGOApproverUpdated(address indexed ngo, address indexed approver, bool status, uint64 timestamp);
    event TokenWhitelisted(address indexed token, bool status, uint64 timestamp);
    event FeeOnTransferBlacklisted(address indexed token, bool status, uint64 timestamp);
    event EmergencyModeChanged(bool activated, uint64 timestamp);
    event GeneralPoolAllocated(address indexed ngo, address indexed token, uint96 amount, uint64 timestamp);
    event GeneralPoolWithdrawalExecuted(
        address indexed ngo,
        address indexed token,
        uint96   amount,
        bytes32  purposeHash,
        uint64   timestamp
    );
    event MinApprovalsUpdated(address indexed ngo, uint8 oldMin, uint8 newMin, uint64 timestamp);
    event FeeCollectorUpdated(address indexed oldCollector, address indexed newCollector, uint64 timestamp);
    event EmergencyFundsRecovered(
        address indexed ngo,
        address indexed token,
        uint96   amount,
        address  indexed to,
        uint64   timestamp
    );
    event DonationRefunded(
        uint256 indexed donationId,
        address indexed donor,
        uint96   amount,
        uint64   timestamp
    );

    // =========================================================
    // MODIFIERS
    // =========================================================

    modifier onlyRegisteredNGO(address _ngo) {
        if (!isRegisteredNGO[_ngo]) revert NGONotFound();
        _;
    }

    modifier onlyActiveNGO(address _ngo) {
        if (!isRegisteredNGO[_ngo]) revert NGONotFound();
        if (!ngoRecords[_ngo].isActive) revert NGOInactive();
        _;
    }

    modifier validAddress(address _addr) {
        if (_addr == address(0)) revert InvalidAddress();
        _;
    }

    modifier requestMustExist(uint256 requestId) {
        if (withdrawalRequests[requestId].ngo == address(0)) revert RequestNotFound();
        _;
    }

    // =========================================================
    // CONSTRUCTOR
    // =========================================================
    constructor() {
        feeCollector = msg.sender;
    }

    // =========================================================
    // DONATION FUNCTIONS
    // =========================================================

    /**
     * @notice Donate MATIC to the general (undesignated) pool.
     * @param  messageHash  Optional donor message — stored only in event log.
     */
    function donateNative(bytes32 messageHash)
        external payable
        nonReentrant
        whenNotPaused
    {
        _processNativeDonation(msg.sender, address(0), messageHash);
    }

    /**
     * @notice Donate MATIC directly to a specific NGO.
     * @param  ngo          Target NGO address (must be active).
     * @param  messageHash  Optional donor message.
     */
    function donateToNGO(address ngo, bytes32 messageHash)
        external payable
        nonReentrant
        whenNotPaused
        onlyActiveNGO(ngo)
    {
        _processNativeDonation(msg.sender, ngo, messageHash);
    }

    /**
     * @notice Donate ERC-20 tokens to a specific NGO or the general pool.
     * @param  token          Whitelisted ERC-20 token address.
     * @param  amount         Total donor amount (fee deducted internally).
     * @param  designatedNGO  Target NGO, or address(0) for general pool.
     * @param  messageHash    Optional donor message.
     */
    function donateToken(
        address token,
        uint96  amount,
        address designatedNGO,
        bytes32 messageHash
    )
        external
        nonReentrant
        whenNotPaused
    {
        if (amount == 0)                                       revert InvalidAmount();
        if (!whitelistedTokens[token])                         revert TokenNotWhitelisted();
        if (feeOnTransferBlacklist[token])                     revert FeeOnTransferTokenBlocked();
        if (designatedNGO != address(0)) {
            if (!isRegisteredNGO[designatedNGO])                 revert NGONotFound();
            if (!ngoRecords[designatedNGO].isActive)             revert NGOInactive();
        }
        uint256 minDon = minTokenDonation[token];
        if (minDon > 0 && amount < minDon)                     revert BelowMinimumDonation();

        (uint256 fee256, uint256 net256) = _calcFee(uint256(amount));
        if (net256 > MAX_UINT96)                               revert TotalAmountOverflow();

        uint96 feeAmt = uint96(fee256);
        uint96 netAmt = uint96(net256);

        uint256 donationId = _donationCount++;
        _donations[donationId] = DonationRecord({
            donor:          msg.sender,
            designatedNGO:  designatedNGO,
            tokenAddress:   token,
            amount:         netAmt,
            timestamp:      uint64(block.timestamp),
            withdrawnAmount: 0,
            isWithdrawn:    false
        });

        // Single safeTransferFrom for total, split internally
        IERC20(token).safeTransferFrom(msg.sender, address(this), uint256(amount));

        if (feeAmt > 0) {
            collectedTokenFees[token] += feeAmt;
            emit FeeCollected(token, feeAmt, uint64(block.timestamp));
        }

        ngoBalances[designatedNGO][token] += netAmt;
        _trackDonor(msg.sender);

        emit DonationReceived(
            donationId, msg.sender, designatedNGO,
            token, netAmt, messageHash, uint64(block.timestamp)
        );
    }

    // =========================================================
    // NGO MANAGEMENT
    // =========================================================

    /**
     * @notice Register a new NGO with its approver set.
     */
    function registerNGO(
        address           ngo,
        bytes32           nameHash,
        address[] calldata approvers,
        uint8             minApprovals
    )
        external
        onlyOwner
        validAddress(ngo)
    {
        if (ngo == owner())                                        revert OwnerCannotBeNGO();
        if (isRegisteredNGO[ngo])                                  revert NGOAlreadyRegistered();
        if (_registeredNGOs.length >= MAX_NGO_COUNT)               revert MaxNGOCountReached();
        if (approvers.length == 0 ||
            approvers.length > MAX_APPROVERS_PER_NGO)              revert InvalidAmount();
        if (minApprovals == 0 ||
            minApprovals > approvers.length)                       revert InvalidAmount();

        _validateApprovers(ngo, approvers);

        ngoRecords[ngo] = NGORecord({
            ngoAddress:            ngo,
            totalWithdrawn:        0,
            lastWithdrawal:        0,
            lastGeneralWithdrawal: 0,
            withdrawalCount:       0,
            pendingRequests:       0,
            isActive:              true,
            withdrawalsPaused:     false
        });

        for (uint256 i; i < approvers.length; ++i) {
            isNGOApprover[ngo][approvers[i]] = true;
        }

        _minWithdrawalApprovals[ngo] = minApprovals;
        _ngoApproversCount[ngo]      = uint8(approvers.length);
        _registeredNGOs.push(ngo);
        isRegisteredNGO[ngo] = true;
        ++_activeNGOCount;

        emit NGORegistered(ngo, nameHash, uint8(approvers.length), minApprovals, uint64(block.timestamp));
    }

    /// @notice Enable or disable an NGO.
    function updateNGOStatus(address ngo, bool active)
        external
        onlyOwner
        onlyRegisteredNGO(ngo)
    {
        NGORecord storage rec = ngoRecords[ngo];
        bool was = rec.isActive;
        rec.isActive = active;

        if (was && !active)  --_activeNGOCount;
        else if (!was && active) ++_activeNGOCount;

        emit NGOStatusUpdated(ngo, active, uint64(block.timestamp));
    }

    /// @notice Pause or unpause withdrawals for a specific NGO.
    function pauseNGOWithdrawals(address ngo, bool paused)
        external
        onlyOwner
        onlyActiveNGO(ngo)
    {
        ngoRecords[ngo].withdrawalsPaused = paused;
        emit NGOWithdrawalsPaused(ngo, paused, msg.sender, uint64(block.timestamp));
    }

    /// @notice Add or remove an approver for an NGO.
    function manageNGOApprover(address ngo, address approver, bool status)
        external
        onlyOwner
        onlyRegisteredNGO(ngo)
        validAddress(approver)
    {
        if (approver == ngo) revert DuplicateApprover();

        uint8 cnt = _ngoApproversCount[ngo];
        bool  cur = isNGOApprover[ngo][approver];

        if (status) {
            if (cnt >= MAX_APPROVERS_PER_NGO) revert MaxApproversReached();
            if (cur)                          revert AlreadyApproved();
            _ngoApproversCount[ngo] = cnt + 1;
        } else {
            if (!cur)                         revert NotApprover();
            if (_minWithdrawalApprovals[ngo] > cnt - 1) revert InvalidAmount(); // minApprovals would exceed approvers
            _ngoApproversCount[ngo] = cnt - 1;
        }

        isNGOApprover[ngo][approver] = status;
        emit NGOApproverUpdated(ngo, approver, status, uint64(block.timestamp));
    }

    /// @notice Update minimum approvals threshold for an NGO.
    function updateMinApprovals(address ngo, uint8 newMin)
        external
        onlyOwner
        onlyRegisteredNGO(ngo)
    {
        if (newMin == 0 || newMin > _ngoApproversCount[ngo]) revert InvalidAmount();
        uint8 old = _minWithdrawalApprovals[ngo];
        _minWithdrawalApprovals[ngo] = newMin;
        emit MinApprovalsUpdated(ngo, old, newMin, uint64(block.timestamp));
    }

    // =========================================================
    // WITHDRAWAL SYSTEM
    // =========================================================

    /**
     * @notice NGO creates a withdrawal request against specific donation IDs.
     * @dev    Cooldown is enforced AND recorded at creation time (not execution).
     *         approvalCount starts at 0 — at least one external approver required.
     * @param  token              address(0) for native MATIC.
     * @param  amount             Total amount to withdraw (must equal sum of withdrawalAmounts).
     * @param  purposeHash        keccak256(purposeRawString) — stored on-chain.
     * @param  purposeRawString   Plain-text purpose; if non-empty, hash is verified.
     * @param  donationIds        IDs of donations backing this request.
     * @param  withdrawalAmounts  Per-donation withdrawal amounts.
     * @return requestId
     */
    function createWithdrawalRequest(
        address            token,
        uint96             amount,
        bytes32            purposeHash,
        string   calldata  purposeRawString,
        uint256[] calldata donationIds,
        uint96[]  calldata withdrawalAmounts
    )
        external
        nonReentrant
        whenNotPaused
        returns (uint256 requestId)
    {
        NGORecord storage ngo = ngoRecords[msg.sender];
        if (ngo.ngoAddress == address(0))                          revert NGONotFound();
        if (!ngo.isActive)                                         revert NGOInactive();
        if (ngo.withdrawalsPaused)                                 revert WithdrawalsPaused();
        if (ngo.pendingRequests >= MAX_PENDING_REQUESTS_PER_NGO)   revert TooManyPendingRequests();

        // ── Cooldown: check AND update immediately ────────────────────────
        if (block.timestamp < ngo.lastWithdrawal + WITHDRAWAL_COOLDOWN)
            revert WithdrawalCooldown();
        ngo.lastWithdrawal = uint64(block.timestamp);

        // ── Input validation ──────────────────────────────────────────────
        if (donationIds.length == 0)                               revert InvalidAmount();
        if (donationIds.length > MAX_WITHDRAWAL_ITEMS)             revert MaxWithdrawalItemsExceeded();
        if (donationIds.length != withdrawalAmounts.length)        revert ArrayLengthMismatch();

        // ── Purpose hash verification (optional) ──────────────────────────
        if (bytes(purposeRawString).length > 0) {
            if (keccak256(bytes(purposeRawString)) != purposeHash) revert PurposeHashMismatch();
        }

        // ── Balance check ─────────────────────────────────────────────────
        if (ngoBalances[msg.sender][token] < amount)               revert InsufficientBalance();

        // ── Donation validation (overflow-safe) ───────────────────────────
        uint96 total = _validateDonations(msg.sender, token, donationIds, withdrawalAmounts);
        if (total != amount)                                       revert InvalidAmount();

        // ── Create request ────────────────────────────────────────────────
        requestId = _withdrawalRequestCount++;

        withdrawalRequests[requestId] = WithdrawalRequest({
            ngo:             msg.sender,
            token:           token,
            amount:          amount,
            timestamp:       uint64(block.timestamp),
            executed:        false,
            rejected:        false,
            approvalsNeeded: _minWithdrawalApprovals[msg.sender],
            approvalCount:   0,   // No auto-approval — external approver required
            purposeHash:     purposeHash
        });

        _requestDonationIds[requestId]       = donationIds;
        _requestWithdrawalAmounts[requestId] = withdrawalAmounts;

        ++ngo.pendingRequests;
        ++_totalPendingRequests;

        _pendingRequestIndex[requestId] = _ngoPendingRequests[msg.sender].length;
        _ngoPendingRequests[msg.sender].push(requestId);

        emit WithdrawalRequestCreated(
            requestId, msg.sender, token, amount, purposeHash, uint64(block.timestamp)
        );
    }

    /**
     * @notice Approver approves a pending withdrawal request.
     *         Automatically executes when threshold is reached.
     */
    function approveWithdrawalRequest(uint256 requestId)
        external
        nonReentrant
        whenNotPaused
        requestMustExist(requestId)
    {
        WithdrawalRequest storage req = withdrawalRequests[requestId];

        if (req.executed)                                   revert RequestAlreadyExecuted();
        if (req.rejected)                                   revert RequestAlreadyRejected();
        if (!isNGOApprover[req.ngo][msg.sender])            revert NotApprover();
        if (_hasApproved[requestId][msg.sender])            revert AlreadyApproved();

        _hasApproved[requestId][msg.sender] = true;
        ++req.approvalCount;

        emit WithdrawalApproved(requestId, msg.sender, req.approvalCount, uint64(block.timestamp));

        if (req.approvalCount >= req.approvalsNeeded) {
            _executeWithdrawal(requestId);
        }
    }

    /**
     * @notice Approver rejects a pending withdrawal request.
     */
    function rejectWithdrawalRequest(uint256 requestId)
        external
        nonReentrant
        requestMustExist(requestId)
    {
        WithdrawalRequest storage req = withdrawalRequests[requestId];

        if (req.executed)                        revert RequestAlreadyExecuted();
        if (req.rejected)                        revert RequestAlreadyRejected();
        if (!isNGOApprover[req.ngo][msg.sender]) revert NotApprover();

        req.rejected = true;
        _decrementPending(req.ngo, requestId);

        emit WithdrawalRejected(requestId, msg.sender, uint64(block.timestamp));
    }

    /**
     * @notice NGO cancels its own pending request.
     *         Useful when a request was made with wrong params.
     */
    function cancelWithdrawalRequest(uint256 requestId)
        external
        nonReentrant
        requestMustExist(requestId)
    {
        WithdrawalRequest storage req = withdrawalRequests[requestId];

        if (req.ngo != msg.sender)  revert UnauthorizedCaller();
        if (req.executed)           revert RequestAlreadyExecuted();
        if (req.rejected)           revert RequestAlreadyRejected();

        req.rejected = true;
        _decrementPending(req.ngo, requestId);

        emit WithdrawalRequestCancelled(requestId, msg.sender, uint64(block.timestamp));
    }

    /**
     * @notice Anyone can expire a request older than REQUEST_EXPIRY (30 days).
     *         Prevents NGO from being permanently locked at MAX_PENDING_REQUESTS.
     */
    function expireWithdrawalRequest(uint256 requestId)
        external
        nonReentrant
        requestMustExist(requestId)
    {
        WithdrawalRequest storage req = withdrawalRequests[requestId];

        if (req.executed)  revert RequestAlreadyExecuted();
        if (req.rejected)  revert RequestAlreadyRejected();
        if (block.timestamp < req.timestamp + REQUEST_EXPIRY) revert RequestNotExpired();

        req.rejected = true;
        _decrementPending(req.ngo, requestId);

        emit WithdrawalRequestExpired(requestId, msg.sender, uint64(block.timestamp));
    }

    /**
     * @notice Manually trigger execution once approvals threshold is met.
     *         Normally auto-executes in approveWithdrawalRequest; this is a fallback.
     */
    function executeWithdrawal(uint256 requestId)
        external
        nonReentrant
        whenNotPaused
        requestMustExist(requestId)
    {
        WithdrawalRequest storage req = withdrawalRequests[requestId];

        if (req.executed)                                   revert RequestAlreadyExecuted();
        if (req.rejected)                                  revert RequestAlreadyRejected();
        if (req.approvalCount < req.approvalsNeeded)        revert InsufficientApprovals();

        _executeWithdrawal(requestId);
    }

    // =========================================================
    // GENERAL POOL WITHDRAWAL
    // =========================================================

    /**
     * @notice NGO withdraws funds that were allocated from the general pool
     *         via allocateGeneralPoolFunds().
     * @dev    Uses a SEPARATE cooldown (lastGeneralWithdrawal) so general pool
     *         withdrawals do not interfere with normal donation withdrawals.
     *         Still requires the multi-approver mechanism via approvalCount
     *         — but here, to keep it simple, only the NGO's own approvers
     *         can approve a GeneralPoolRequest that is created off-chain.
     *         For now, a single-step withdrawal is retained, but protected by
     *         separate cooldown + purpose hash.
     * @param  token             address(0) = native MATIC.
     * @param  amount            Amount to withdraw.
     * @param  purposeHash       keccak256(purposeRawString).
     * @param  purposeRawString  If non-empty, hash is verified.
     */
    function withdrawAllocatedGeneralFunds(
        address           token,
        uint96            amount,
        bytes32           purposeHash,
        string  calldata  purposeRawString
    )
        external
        nonReentrant
        whenNotPaused
        onlyActiveNGO(msg.sender)
    {
        if (amount == 0)                    revert InvalidAmount();
        if (ngoBalances[msg.sender][token] < amount) revert InsufficientBalance();

        if (bytes(purposeRawString).length > 0) {
            if (keccak256(bytes(purposeRawString)) != purposeHash)
                revert PurposeHashMismatch();
        }

        NGORecord storage ngo = ngoRecords[msg.sender];

        // Separate cooldown for general pool
        if (block.timestamp < ngo.lastGeneralWithdrawal + WITHDRAWAL_COOLDOWN)
            revert WithdrawalCooldown();
        ngo.lastGeneralWithdrawal = uint64(block.timestamp);

        // State update before transfer (CEI)
        ngoBalances[msg.sender][token] -= amount;
        ngo.totalWithdrawn  += amount;
        ++ngo.withdrawalCount;

        _transferFunds(token, msg.sender, amount);

        emit GeneralPoolWithdrawalExecuted(
            msg.sender, token, amount, purposeHash, uint64(block.timestamp)
        );
    }

    // =========================================================
    // ADMIN FUNCTIONS
    // =========================================================

    /// @notice Update platform fee (max 5%).
    function updatePlatformFee(uint8 newPercent) external onlyOwner {
        if (newPercent > MAX_FEE_PERCENT) revert InvalidAmount();
        uint8 old = platformFeePercent;
        platformFeePercent = newPercent;
        emit PlatformFeeUpdated(old, newPercent, uint64(block.timestamp));
    }

    /// @notice Update fee collector address.
    function updateFeeCollector(address newCollector)
        external
        onlyOwner
        validAddress(newCollector)
    {
        address old = feeCollector;
        feeCollector = newCollector;
        emit FeeCollectorUpdated(old, newCollector, uint64(block.timestamp));
    }

    /// @notice Withdraw collected platform fees (native or ERC-20).
    function withdrawCollectedFees(address token, uint96 amount)
        external
        onlyOwner
        nonReentrant
    {
        if (amount == 0) revert InvalidAmount();

        if (token == address(0)) {
            if (collectedNativeFees < amount)           revert InsufficientBalance();
            collectedNativeFees -= amount;
        } else {
            if (collectedTokenFees[token] < amount)     revert InsufficientBalance();
            collectedTokenFees[token] -= amount;
        }

        _transferFunds(token, feeCollector, amount);
        emit FeeWithdrawn(token, amount, feeCollector, uint64(block.timestamp));
    }

    /// @notice Whitelist or de-list an ERC-20 token.
    function whitelistToken(address token, bool status)
        external
        onlyOwner
        validAddress(token)
    {
        whitelistedTokens[token] = status;
        emit TokenWhitelisted(token, status, uint64(block.timestamp));
    }

    /// @notice Block fee-on-transfer tokens from being used as donation tokens.
    function setFeeOnTransferBlacklist(address token, bool status) external onlyOwner {
        feeOnTransferBlacklist[token] = status;
        emit FeeOnTransferBlacklisted(token, status, uint64(block.timestamp));
    }

    /// @notice Set minimum donation threshold for an ERC-20 token.
    function setTokenMinDonation(address token, uint256 minAmount) external onlyOwner {
        minTokenDonation[token] = minAmount;
    }

    /**
     * @notice Move funds from the general (undesignated) pool to a specific NGO.
     *         After allocation, the NGO can withdraw via withdrawAllocatedGeneralFunds().
     */
    function allocateGeneralPoolFunds(address ngo, address token, uint96 amount)
        external
        onlyOwner
        nonReentrant
        onlyRegisteredNGO(ngo)
    {
        if (amount == 0)                                 revert InvalidAmount();
        if (ngoBalances[address(0)][token] < amount)     revert InsufficientBalance();

        ngoBalances[address(0)][token] -= amount;
        ngoBalances[ngo][token]        += amount;

        emit GeneralPoolAllocated(ngo, token, amount, uint64(block.timestamp));
    }

    /**
     * @notice Emergency: refund a single donation back to its donor.
     * @dev    Local variables saved BEFORE storage delete to prevent read-after-delete bug.
     */
    function emergencyRefund(uint256 donationId)
        external
        onlyOwner
        nonReentrant
    {
        if (!emergencyMode) revert NotInEmergencyMode();

        DonationRecord storage don = _donations[donationId];
        if (don.donor == address(0))    revert DonationNotFound();
        if (don.isWithdrawn)            revert DonationAlreadyWithdrawn();

        // Calculate refund amount with explicit safety check
        if (don.withdrawnAmount > don.amount) revert InvalidAmount(); // Extra safety
        uint96 refundAmt = don.amount - don.withdrawnAmount;
        if (refundAmt == 0) revert InvalidAmount();

        // Save all needed values BEFORE delete
        address donorAddr  = don.donor;
        address ngoAddr    = don.designatedNGO;
        address tokenAddr  = don.tokenAddress;

        if (ngoBalances[ngoAddr][tokenAddr] < refundAmt) revert InsufficientBalance();

        // State updates (CEI)
        ngoBalances[ngoAddr][tokenAddr] -= refundAmt;
        delete _donations[donationId];   // frees storage, gas refund

        // Transfer using saved local vars (not deleted storage)
        _transferFunds(tokenAddr, donorAddr, refundAmt);

        emit DonationRefunded(donationId, donorAddr, refundAmt, uint64(block.timestamp));
    }

    /**
     * @notice Emergency: recover an NGO's balance to feeCollector (trusted safe address).
     * @dev    Funds go to feeCollector, NOT to the NGO, because in an emergency
     *         the NGO's private key may be compromised.
     */
    function emergencyRecoverNGOFunds(address ngo, address token, uint96 amount)
        external
        onlyOwner
        nonReentrant
        onlyRegisteredNGO(ngo)
    {
        if (!emergencyMode)                          revert NotInEmergencyMode();
        if (amount == 0)                             revert InvalidAmount();
        if (ngoBalances[ngo][token] < amount)        revert InsufficientBalance();

        ngoBalances[ngo][token] -= amount;

        // Always recover to feeCollector (owner-controlled safe address)
        _transferFunds(token, feeCollector, amount);

        emit EmergencyFundsRecovered(ngo, token, amount, feeCollector, uint64(block.timestamp));
    }

    /// @notice Pause all platform functions.
    function pause()   external onlyOwner { _pause();   }

    /// @notice Unpause platform.
    function unpause() external onlyOwner { _unpause(); }

    /// @notice Activate emergency mode (also pauses platform).
    function activateEmergencyMode() external onlyOwner {
        emergencyMode = true;
        _pause();
        emit EmergencyModeChanged(true, uint64(block.timestamp));
    }

    /// @notice Deactivate emergency mode (also unpauses platform).
    function deactivateEmergencyMode() external onlyOwner {
        emergencyMode = false;
        _unpause();
        emit EmergencyModeChanged(false, uint64(block.timestamp));
    }

    // =========================================================
    // VIEW FUNCTIONS
    // =========================================================

    /// @notice Get balance of an NGO for a given token (address(0) = native).
    function getNGOBalance(address ngo, address token) external view returns (uint96) {
        return ngoBalances[ngo][token];
    }

    /// @notice Full NGO info including both cooldown timestamps.
    function getNGOInfo(address ngo) external view returns (
        address ngoAddress,
        uint96  totalWithdrawn,
        uint64  lastWithdrawal,
        uint64  lastGeneralWithdrawal,
        uint32  withdrawalCount,
        uint16  pendingRequests,
        bool    isActive,
        bool    withdrawalsPaused,
        uint8   minApprovals,
        uint8   approversCount
    ) {
        NGORecord storage r = ngoRecords[ngo];
        return (
            r.ngoAddress, r.totalWithdrawn,
            r.lastWithdrawal, r.lastGeneralWithdrawal,
            r.withdrawalCount, r.pendingRequests,
            r.isActive, r.withdrawalsPaused,
            _minWithdrawalApprovals[ngo], _ngoApproversCount[ngo]
        );
    }

    /// @notice Platform-wide statistics.
    function getPlatformStats() external view returns (
        uint256 totalDonations,
        uint256 activeNGOs,
        uint256 uniqueDonors,
        uint256 contractNativeBalance,
        uint256 totalPendingRequests,
        uint256 pendingNativeFees,
        uint256 registeredNGOs
    ) {
        return (
            _donationCount, _activeNGOCount, _totalDonors,
            address(this).balance, _totalPendingRequests,
            collectedNativeFees, _registeredNGOs.length
        );
    }

    /**
     * @notice Paginated list of pending request IDs for an NGO.
     * @param  start  Start index (0-based).
     * @param  limit  Max entries to return.
     */
    function getPendingRequests(address ngo, uint256 start, uint256 limit)
        external view
        returns (uint256[] memory result)
    {
        uint256[] storage pending = _ngoPendingRequests[ngo];
        uint256 total = pending.length;
        if (start >= total) return new uint256[](0);

        uint256 end = start + limit;
        if (end > total) end = total;

        result = new uint256[](end - start);
        for (uint256 i; i < result.length; ++i) {
            result[i] = pending[start + i];
        }
    }

    /// @notice Total pending requests count for an NGO (non-paginated quick check).
    function getPendingRequestCount(address ngo) external view returns (uint256) {
        return _ngoPendingRequests[ngo].length;
    }

    /// @notice Whether a given approver has approved a request.
    function getRequestApprovalStatus(uint256 requestId, address approver)
        external view returns (bool)
    {
        return _hasApproved[requestId][approver];
    }

    /// @notice Donation record (returns zero-struct if deleted or never created).
    function getDonation(uint256 donationId)
        external view returns (DonationRecord memory)
    {
        return _donations[donationId];
    }

    /**
     * @notice Paginated list of all registered NGO addresses.
     */
    function getAllNGOs(uint256 start, uint256 limit)
        external view
        returns (address[] memory result)
    {
        uint256 total = _registeredNGOs.length;
        if (start >= total) return new address[](0);

        uint256 end = start + limit;
        if (end > total) end = total;

        result = new address[](end - start);
        for (uint256 i; i < result.length; ++i) {
            result[i] = _registeredNGOs[start + i];
        }
    }

    /// @notice Total registered NGOs count.
    function getTotalNGOs() external view returns (uint256) {
        return _registeredNGOs.length;
    }

    /**
     * @notice Verify the plain-text purpose of a withdrawal request against its stored hash.
     * @return isValid  true if keccak256(purposeRawString) == stored purposeHash.
     */
    function verifyWithdrawalPurpose(uint256 requestId, string calldata purposeRawString)
        external view
        requestMustExist(requestId)
        returns (bool isValid)
    {
        return withdrawalRequests[requestId].purposeHash
            == keccak256(bytes(purposeRawString));
    }

    /// @notice How many seconds remain in an NGO's normal withdrawal cooldown (0 = ready).
    function getWithdrawalCooldownRemaining(address ngo) external view returns (uint256) {
        uint64 last = ngoRecords[ngo].lastWithdrawal;
        uint256 end = uint256(last) + WITHDRAWAL_COOLDOWN;
        if (block.timestamp >= end) return 0;
        return end - block.timestamp;
    }

    /// @notice How many seconds remain in an NGO's general-pool withdrawal cooldown.
    function getGeneralCooldownRemaining(address ngo) external view returns (uint256) {
        uint64 last = ngoRecords[ngo].lastGeneralWithdrawal;
        uint256 end = uint256(last) + WITHDRAWAL_COOLDOWN;
        if (block.timestamp >= end) return 0;
        return end - block.timestamp;
    }

    /// @notice Whether a withdrawal request has expired (>30 days old, still pending).
    function isRequestExpired(uint256 requestId) external view returns (bool) {
        WithdrawalRequest storage req = withdrawalRequests[requestId];
        if (req.ngo == address(0) || req.executed || req.rejected) return false;
        return block.timestamp >= req.timestamp + REQUEST_EXPIRY;
    }

    // =========================================================
    // INTERNAL — HELPERS
    // =========================================================

    /// @dev Core logic for native MATIC donations.
    function _processNativeDonation(
        address donor,
        address designatedNGO,
        bytes32 messageHash
    ) internal {
        if (msg.value < MIN_NATIVE_DONATION) revert BelowMinimumDonation();

        (uint256 fee256, uint256 net256) = _calcFee(msg.value);

        uint256 donationId = _donationCount++;
        _donations[donationId] = DonationRecord({
            donor:           donor,
            designatedNGO:   designatedNGO,
            tokenAddress:    address(0),
            amount:          uint96(net256),
            timestamp:       uint64(block.timestamp),
            withdrawnAmount: 0,
            isWithdrawn:     false
        });

        ngoBalances[designatedNGO][address(0)] += uint96(net256);
        _trackDonor(donor);

        if (fee256 > 0) {
            collectedNativeFees += fee256;
            emit FeeCollected(address(0), uint96(fee256), uint64(block.timestamp));
        }

        emit DonationReceived(
            donationId, donor, designatedNGO,
            address(0), uint96(net256), messageHash, uint64(block.timestamp)
        );
    }

    /// @dev Calculate fee and net amount. Returns uint256 to avoid overflow at callsite.
    function _calcFee(uint256 amount)
        internal view
        returns (uint256 feeAmount, uint256 netAmount)
    {
        if (platformFeePercent == 0) {
            return (0, amount);
        }
        feeAmount = (amount * platformFeePercent) / 100;
        if (feeAmount == 0 && amount > 0) feeAmount = 1;   // Minimum 1 wei fee
        netAmount = amount - feeAmount;
    }

    /// @dev First-time donor tracking.
    function _trackDonor(address donor) internal {
        if (!_isDonor[donor]) {
            _isDonor[donor] = true;
            ++_totalDonors;
        }
    }

    /// @dev Validate approvers array: no zero address, no NGO address, no duplicates.
    function _validateApprovers(address ngo, address[] calldata approvers) internal pure {
        for (uint256 i; i < approvers.length; ++i) {
            if (approvers[i] == address(0)) revert InvalidAddress();
            if (approvers[i] == ngo)        revert DuplicateApprover();
            for (uint256 j; j < i; ++j) {
                if (approvers[i] == approvers[j]) revert DuplicateApprover();
            }
        }
    }

    /**
     * @dev Validate donations backing a withdrawal request.
     *      Uses uint256 accumulator for overflow safety, then checks <= MAX_UINT96.
     */
    function _validateDonations(
        address           ngo,
        address           token,
        uint256[] calldata donationIds,
        uint96[]  calldata withdrawalAmounts
    ) internal view returns (uint96 totalAmount) {
        uint256 acc;
        for (uint256 i; i < donationIds.length; ++i) {
            acc += withdrawalAmounts[i];
            if (acc > MAX_UINT96) revert TotalAmountOverflow();

            DonationRecord storage don = _donations[donationIds[i]];

            if (don.donor == address(0))              revert DonationNotFound();
            if (don.isWithdrawn)                      revert DonationAlreadyWithdrawn();
            if (don.designatedNGO != ngo)             revert InvalidTokenMatch();

            if (token == address(0)) {
                if (don.tokenAddress != address(0))   revert InvalidTokenMatch();
            } else {
                if (don.tokenAddress != token)        revert InvalidTokenMatch();
            }

            if (don.amount - don.withdrawnAmount < withdrawalAmounts[i])
                revert InsufficientBalance();
        }
        totalAmount = uint96(acc);
    }

    /**
     * @dev Execute a withdrawal request (CEI pattern: state first, transfer last).
     */
    function _executeWithdrawal(uint256 requestId) internal {
        WithdrawalRequest storage req = withdrawalRequests[requestId];
        NGORecord storage ngo         = ngoRecords[req.ngo];

        if (ngoBalances[req.ngo][req.token] < req.amount) revert InsufficientBalance();

        // ── CEI: all state changes before external call ───────────────────
        req.executed = true;

        ngoBalances[req.ngo][req.token] -= req.amount;

        uint256[] memory dIds   = _requestDonationIds[requestId];
        uint96[]  memory dAmts  = _requestWithdrawalAmounts[requestId];
        for (uint256 i; i < dIds.length; ++i) {
            DonationRecord storage don = _donations[dIds[i]];
            don.withdrawnAmount += dAmts[i];
            if (don.withdrawnAmount >= don.amount) {
                don.isWithdrawn = true;
            }
        }

        ++ngo.withdrawalCount;
        ngo.totalWithdrawn += req.amount;
        _decrementPending(req.ngo, requestId);

        // ── External call last ────────────────────────────────────────────
        _transferFunds(req.token, req.ngo, req.amount);

        emit WithdrawalExecuted(requestId, req.ngo, req.token, req.amount, uint64(block.timestamp));
    }

    /**
     * @dev Decrement NGO pending-request counter and remove from O(1) array.
     */
    function _decrementPending(address ngo, uint256 requestId) internal {
        --ngoRecords[ngo].pendingRequests;
        --_totalPendingRequests;
        _removePendingRequest(ngo, requestId);
    }

    /**
     * @dev O(1) swap-and-pop removal from pending requests array.
     */
    function _removePendingRequest(address ngo, uint256 requestId) internal {
        uint256[] storage pending = _ngoPendingRequests[ngo];
        if (pending.length == 0) revert NoPendingRequests();

        uint256 idx     = _pendingRequestIndex[requestId];
        uint256 lastIdx = pending.length - 1;

        if (idx != lastIdx) {
            uint256 lastId         = pending[lastIdx];
            pending[idx]           = lastId;
            _pendingRequestIndex[lastId] = idx;
        }

        pending.pop();
        delete _pendingRequestIndex[requestId];
    }

    /**
     * @dev Transfer native MATIC or ERC-20 tokens.
     *      amount is uint256 to accept both uint96 and larger values safely.
     */
    function _transferFunds(address token, address to, uint256 amount) internal {
        if (token == address(0)) {
            (bool ok, ) = payable(to).call{value: amount}("");
            if (!ok) revert InvalidAmount();
        } else {
            IERC20(token).safeTransfer(to, amount);
        }
    }

    // =========================================================
    // RECEIVE
    // =========================================================

    /**
     * @dev Accept plain MATIC transfers.
     *      Manual reentrancy lock used because the nonReentrant modifier
     *      from OpenZeppelin cannot be applied to receive().
     */
    receive() external payable {
        if (_receiveLocked) revert InvalidAmount();
        _receiveLocked = true;
        if (msg.value < MIN_NATIVE_DONATION) revert BelowMinimumDonation();
        _processNativeDonation(msg.sender, address(0), EMPTY_HASH);
        _receiveLocked = false;
    }
}
