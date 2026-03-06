const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('DonationPlatform', function () {
  let Donation;
  let donation;
  let owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    Donation = await ethers.getContractFactory('DonationPlatform');
    donation = await Donation.deploy();
    await donation.deployed();
  });

  it('should start with owner set and allow donations', async function () {
    expect(await donation.owner()).to.equal(owner.address);

    // donate 1 ether to general pool (minimum required)
    const receipt = await donation.connect(addr1).donateNative(ethers.utils.formatBytes32String(''), { value: ethers.utils.parseEther('1.0') });
    const rcpt = await receipt.wait();
    const event = rcpt.events.find(e => e.event === 'DonationReceived');
    expect(event).to.exist;
    expect(event.args.donor).to.equal(addr1.address);
    // After 2% fee, 980000000000000000 (0.98 ether) will be net amount
    expect(event.args.amount).to.equal(ethers.utils.parseEther('0.98'));
  });

  it('should whitelist token and allow ERC20 donation', async function () {
    // deploy a simple ERC20 test token
    const TestToken = await ethers.getContractFactory('ERC20Mock');
    const token = await TestToken.deploy('Test', 'TST', owner.address, ethers.utils.parseEther('1000'));
    await token.deployed();

    await donation.whitelistToken(token.address, true);
    expect(await donation.whitelistedTokens(token.address)).to.equal(true);

    // approve more tokens
    await token.connect(owner).approve(donation.address, ethers.utils.parseEther('100'));
    
    // First donation: 5 ether - 2% fee = 4.9 ether net
    await donation.connect(owner).donateToken(token.address, ethers.utils.parseEther('5'), ethers.constants.AddressZero, ethers.utils.formatBytes32String(''));
    
    // Second donation: 1 ether - 2% fee = 0.98 ether net
    const rcpt = await donation.connect(owner).donateToken(token.address, ethers.utils.parseEther('1'), ethers.constants.AddressZero, ethers.utils.formatBytes32String(''));
    const rec = await rcpt.wait();
    const event = rec.events.find(e => e.event === 'DonationReceived');
    expect(event).to.exist;
    expect(event.args.token).to.equal(token.address);
    // Net amount after 2% fee: 0.98 ether
    expect(event.args.amount).to.equal(ethers.utils.parseEther('0.98'));
  });

  it('should allow owner to register and manage NGO settings', async function () {
    const ngoAddr = addr1.address;        // NGO address is addr1
    const approver1 = addr2.address;      // Approver 1 is addr2
    const approver2 = owner.address;      // Approver 2 is owner

    // register new NGO with different approvers
    const nameHash = ethers.utils.formatBytes32String('MyNGO');
    await donation.registerNGO(ngoAddr, nameHash, [approver1, approver2], 1);

    const info = await donation.getNGOInfo(ngoAddr);
    expect(info[0]).to.equal(ngoAddr); // ngoAddress
    expect(info[6]).to.equal(true); // isActive
    expect(info[8]).to.equal(1); // minApprovals
    expect(info[9]).to.equal(2); // approversCount

    // update min approvals
    await donation.updateMinApprovals(ngoAddr, 2);
    const info2 = await donation.getNGOInfo(ngoAddr);
    expect(info2[8]).to.equal(2);

    // test pause/unpause withdrawals
    await donation.pauseNGOWithdrawals(ngoAddr, true);
    const info5 = await donation.getNGOInfo(ngoAddr);
    expect(info5[7]).to.equal(true); // withdrawalsPaused is true
    
    await donation.pauseNGOWithdrawals(ngoAddr, false);
    const info6 = await donation.getNGOInfo(ngoAddr);
    expect(info6[7]).to.equal(false); // withdrawalsPaused is false
  });
});
