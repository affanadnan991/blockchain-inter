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

    // donate 0.5 ether to general pool and check event
    const receipt = await donation.connect(addr1).donateNative(ethers.utils.formatBytes32String(''), { value: ethers.utils.parseEther('0.5') });
    const rcpt = await receipt.wait();
    const event = rcpt.events.find(e => e.event === 'DonationReceived');
    expect(event).to.exist;
    expect(event.args.donor).to.equal(addr1.address);
    expect(event.args.amount).to.equal(ethers.utils.parseEther('0.5'));
  });

  it('should whitelist token and allow ERC20 donation', async function () {
    // deploy a simple ERC20 test token
    const TestToken = await ethers.getContractFactory('ERC20Mock');
    const token = await TestToken.deploy('Test', 'TST', owner.address, ethers.utils.parseEther('1000'));
    await token.deployed();

    await donation.whitelistToken(token.address, true);
    expect(await donation.whitelistedTokens(token.address)).to.equal(true);

    // approve
    await token.connect(owner).approve(donation.address, ethers.utils.parseEther('10'));
    await donation.connect(owner).donateToken(token.address, ethers.utils.parseEther('5'), ethers.constants.AddressZero, ethers.utils.formatBytes32String(''));

    const rcpt = await donation.connect(owner).donateToken(token.address, ethers.utils.parseEther('1'), ethers.constants.AddressZero, ethers.utils.formatBytes32String(''));
    const rec = await rcpt.wait();
    const event = rec.events.find(e => e.event === 'DonationReceived');
    expect(event).to.exist;
    expect(event.args.token).to.equal(token.address);
    expect(event.args.amount).to.equal(ethers.utils.parseEther('1'));
  });

  it('should allow owner to register and manage NGO settings', async function () {
    const approver1 = addr1.address;
    const approver2 = addr2.address;

    // register new NGO
    const nameHash = ethers.utils.formatBytes32String('MyNGO');
    await donation.registerNGO(approver1, nameHash, [approver1, approver2], 1);

    const info = await donation.getNGOInfo(approver1);
    expect(info[0]).to.equal(approver1); // ngoAddress
    expect(info[6]).to.equal(true); // isActive
    expect(info[8]).to.equal(1); // minApprovals
    expect(info[9]).to.equal(2); // approversCount

    // update min approvals
    await donation.updateMinApprovals(approver1, 2);
    const info2 = await donation.getNGOInfo(approver1);
    expect(info2[8]).to.equal(2);

    // add and remove approver
    await donation.manageNGOApprover(approver1, owner.address, true);
    const info3 = await donation.getNGOInfo(approver1);
    expect(info3[9]).to.equal(3);
    await donation.manageNGOApprover(approver1, owner.address, false);
    const info4 = await donation.getNGOInfo(approver1);
    expect(info4[9]).to.equal(2);

    // pause withdrawals
    await donation.pauseNGOWithdrawals(approver1, true);
    const info5 = await donation.getNGOInfo(approver1);
    expect(info5[7]).to.equal(true);
    await donation.pauseNGOWithdrawals(approver1, false);
    const info6 = await donation.getNGOInfo(approver1);
    expect(info6[7]).to.equal(false);
  });
});