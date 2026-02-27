# Blockchain Donation Platform - Frontend Update Guide

## ✅ Completed: Phase 1-3

### Phase 1: Comprehensive Contract Interaction Hooks ✓
Created 4 new hooks that fully integrate with the Donation.sol smart contract:

#### 1. **useWithdrawalRequests.js** - NGO Withdrawal Management
```javascript
const {
  createWithdrawalRequest,  // Create new withdrawal request
  approveRequest,           // Approve a request (for approvers)
  rejectRequest,           // Reject a request (for approvers)
  executeWithdrawal,       // Execute after all approvals
  cancelRequest,           // NGO can cancel own request
  pendingRequests,         // Array of pending request IDs
  pendingRequestCount      // Total pending requests
} = useWithdrawalRequests(ngoAddress)
```

**Usage:**
```javascript
// Create withdrawal request with donation IDs
await createWithdrawalRequest(
  tokenAddress,           // address(0) for MATIC
  ethers.BigNumber.from(amountInWei),
  purposeHash,            // keccak256(purposeString)
  purposeString,          // Plain text purpose
  [donationId1, donationId2],    // Which donations to withdraw
  [amount1, amount2]      // Amounts for each donation
)
```

#### 2. **useNGOOperations.js** - NGO-Specific Data & Actions
```javascript
const {
  ngoInfo,                 // NGO details and status
  ngoBalance,              // Balance for MATIC
  withdrawalCooldownRemaining,  // Seconds until can withdraw
  generalCooldownRemaining,     // General pool cooldown
  withdrawGeneralFunds    // Withdraw from general pool allocation
} = useNGOOperations(ngoAddress)
```

**NGO Info Structure:**
```javascript
{
  totalWithdrawn,         // Total amount withdrawn so far
  lastWithdrawal,         // Timestamp of last withdrawal
  lastGeneralWithdrawal,  // Timestamp of last general pool withdrawal
  withdrawalCount,        // Total withdrawals made
  pendingRequests,        // Current pending requests count
  isActive,               // NGO is active
  withdrawalsPaused,      // Withdrawals paused by admin
  minApprovals,          // Minimum approvals needed
  approversCount         // Total approvers for this NGO
}
```

#### 3. **useAdminOperations.js** - Full Admin Panel Functionality
```javascript
const {
  // Data
  allNGOs,                // List of all registered NGO addresses
  totalNGOsCount,        // Total NGOs count
  platformStats,          // Platform-wide statistics
  platformFeePercent,     // Current platform fee

  // Actions
  registerNGO,           // Register new NGO
  updateNGOStatus,       // Enable/disable NGO
  pauseNGOWithdrawals,   // Pause/unpause withdrawals
  updatePlatformFee,     // Change fee percentage
  whitelistToken,        // Add/remove token
  setFeeOnTransferBlacklist,
  setTokenMinDonation,
  pausePlatform,         // Pause all operations
  unpausePlatform,
  activateEmergencyMode,
  deactivateEmergencyMode
} = useAdminOperations()
```

#### 4. **useContractQuery.js** - View Functions & Event Queries
```javascript
const { ngos, loading } = useRegisteredNGOs()
const { donations, loading: donLoading } = useRecentDonations(limit)
const { donation } = useDonationRecord(donationId)
const { hasApproved } = useRequestApprovalStatus(requestId, approverAddress)
```

### Phase 2: Updated Donation Flow ✓
- ✅ `src/app/donate/page.jsx` - Fetches NGOs from contract
- ✅ `src/components/donate/DonateForm.jsx` - Ready for real data
- ✅ `src/components/donate/NGOSelector.jsx` - Simplified to use real NGO list

### Phase 3: Multi-Sig Approval UI ✓
- ✅ `src/components/dashboard/WithdrawalApprovalPanel.jsx` - Complete approval workflow component

## 📋 Remaining: Phase 4-5

### Phase 4: NGO Dashboard Integration (NEXT STEP)

**Update `src/app/ngo/dashboard/page.jsx` to:**
```javascript
import { useNGOOperations } from '../../../hooks/useNGOOperations'
import { useWithdrawalRequests } from '../../../hooks/useWithdrawalRequests'
import { useAccount } from 'wagmi'

export default function NGODashboardPage() {
  const { address } = useAccount()
  const { ngoInfo, withdrawalCooldownRemaining } = useNGOOperations(address)
  const { pendingRequests, createWithdrawalRequest, approveRequest } = useWithdrawalRequests(address)

  // Use these to display:
  // - Current balances from ngoInfo
  // - Withdrawal cooldown status
  // - List of pending requests
  // - Create new request form
}
```

### Phase 5: Admin Panel (TO DO)

**Create admin components:**
- `src/components/admin/NGOManagementPanel.jsx`
- `src/components/admin/TokenManagementPanel.jsx`
- `src/components/admin/FeeManagementPanel.jsx`
- `src/components/admin/EmergencyControlsPanel.jsx`

Use `useAdminOperations()` hook for all admin functionality.

## 🔄 Hook Integration Pattern

All hooks follow this pattern:
```javascript
// Import
import { useWithdrawalRequests } from '../../hooks/useWithdrawalRequests'

// Use in component
const { action, data, isLoading, error } = useHookName(params)

// Handle states
if (isLoading) return <LoadingState />
if (error) return <ErrorState error={error} />

// Render based on data
return <YourComponent data={data} onAction={action} />
```

## 🚀 Key Contract Integration Points

### Donation Flow
```javascript
// For MATIC donations
const { donate } = useDonateMATIC()
await donate(amountInEther, messageHash)

// For ERC20 donations
const { donate } = useDonateToken()
await donate(tokenAddress, amountInWei, decimals, designatedNGO, messageHash)
```

### Withdrawal Flow (Multi-step)
```javascript
// Step 1: NGO creates request
const { createWithdrawalRequest } = useWithdrawalRequests(ngoAddress)
await createWithdrawalRequest(token, amount, purposeHash, purposeString, donationIds, amounts)

// Step 2: Approvers approve
const { approveRequest } = useWithdrawalRequests(ngoAddress)
await approveRequest(requestId)

// Step 3: Execute when ready
const { executeWithdrawal } = useWithdrawalRequests(ngoAddress)
await executeWithdrawal(requestId)
```

## 📊 Smart Contract Features Mapped to Frontend

| Contract Feature | Frontend Hook | Component |
|---|---|---|
| Donation tracking | useDonateMATIC, useDonateToken | DonateForm |
| NGO registration | useAdminOperations.registerNGO | Admin Panel |
| Balance tracking | useNGOOperations.ngoInfo | Dashboard |
| Withdrawal requests | useWithdrawalRequests | Dashboard |
| Multi-sig approval | useRequestApprovalStatus | WithdrawalApprovalPanel |
| Platform fees | useDonationContract.platformFeePercent | Admin Panel |
| Token whitelist | useAdminOperations.whitelistToken | Admin Panel |
| Emergency mode | useAdminOperations.activateEmergencyMode | Admin Panel |

## 📝 Environment Setup

Required environment variables in `.env.local`:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...       # Mainnet contract
NEXT_PUBLIC_TESTNET_CONTRACT_ADDRESS=0x... # Testnet contract
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...
NEXT_PUBLIC_IS_TESTNET=false
```

## 🔗 Supported Tokens

Defined in `src/utils/web3Config.js`:
- MATIC (native)
- USDT (0xc2132D05D31c914a87C6611C10748AEb04B58e8F)
- USDC (0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174)
- DAI (0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063)

## ✨ Next Steps

1. **Update NGO Dashboard** - Integrate all new hooks into dashboard page
2. **Create Admin Panel** - Build admin UI components using useAdminOperations
3. **Test Withdrawal Flow** - Test complete multi-sig approval workflow
4. **Add Error Handling** - Add comprehensive error handling and notifications
5. **Optimize Performance** - Add caching and pagination where needed

## 💡 Tips

- All read operations use `watch: true` for real-time updates
- All write operations return transaction hashes
- Use `refetch` functions to manually update data
- Check `isLoading` states before rendering buttons
- Handle errors with try-catch and toast notifications
