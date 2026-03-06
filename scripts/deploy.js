async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with account:', deployer.address);
  console.log('Account balance:', (await deployer.getBalance()).toString());

  // Deploy DonationPlatform
  const Donation = await ethers.getContractFactory('DonationPlatform');
  const donation = await Donation.deploy();
  await donation.deployed();

  console.log('DonationPlatform deployed to:', donation.address);

  // Deploy mock tokens for testing
  const MockToken = await ethers.getContractFactory('ERC20Mock');
  
  const mockUSDC = await MockToken.deploy('Test USDC', 'USDC', ethers.utils.parseUnits('1000000', 6));
  await mockUSDC.deployed();
  console.log('Mock USDC deployed to:', mockUSDC.address);

  const mockUSDT = await MockToken.deploy('Test USDT', 'USDT', ethers.utils.parseUnits('1000000', 6));
  await mockUSDT.deployed();
  console.log('Mock USDT deployed to:', mockUSDT.address);

  const mockDAI = await MockToken.deploy('Test DAI', 'DAI', ethers.utils.parseUnits('1000000', 18));
  await mockDAI.deployed();
  console.log('Mock DAI deployed to:', mockDAI.address);

  // Whitelist all tokens
  let tx;
  
  tx = await donation.whitelistToken(mockUSDC.address, true);
  await tx.wait();
  console.log('✅ USDC whitelisted');

  tx = await donation.whitelistToken(mockUSDT.address, true);
  await tx.wait();
  console.log('✅ USDT whitelisted');

  tx = await donation.whitelistToken(mockDAI.address, true);
  await tx.wait();
  console.log('✅ DAI whitelisted');

  // Set minimum donations
  tx = await donation.setTokenMinDonation(mockUSDC.address, ethers.utils.parseUnits('5', 6));
  await tx.wait();
  
  tx = await donation.setTokenMinDonation(mockUSDT.address, ethers.utils.parseUnits('5', 6));
  await tx.wait();
  
  tx = await donation.setTokenMinDonation(mockDAI.address, ethers.utils.parseUnits('5', 18));
  await tx.wait();
  console.log('✅ Minimum donations set');

  // Update platform fee
  tx = await donation.updatePlatformFee(2);
  await tx.wait();
  console.log('✅ Platform fee set to 2%');

  // Create test NGOs with proper names
  const testNGO1 = ethers.Wallet.createRandom().address;
  const testNGO2 = ethers.Wallet.createRandom().address;
  
  const approver1 = ethers.Wallet.createRandom().address;
  const approver2 = ethers.Wallet.createRandom().address;
  const approver3 = ethers.Wallet.createRandom().address;
  const approver4 = ethers.Wallet.createRandom().address;

  // Register NGO 1
  tx = await donation.registerNGO(
    testNGO1,
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes('Education First NGO')),
    [approver1, approver2],
    2
  );
  await tx.wait();
  console.log('✅ NGO 1 registered:', testNGO1);

  // Register NGO 2
  tx = await donation.registerNGO(
    testNGO2,
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes('Healthcare Initiative')),
    [approver3, approver4],
    1
  );
  await tx.wait();
  console.log('✅ NGO 2 registered:', testNGO2);

  console.log('\n=== DEPLOYMENT SUMMARY ===');
  console.log('DonationPlatform:', donation.address);
  console.log('Mock USDC:', mockUSDC.address);
  console.log('Mock USDT:', mockUSDT.address);
  console.log('Mock DAI:', mockDAI.address);
  console.log('\nTest NGOs:');
  console.log('NGO 1:', testNGO1);
  console.log('NGO 2:', testNGO2);
  console.log('=========================\n');

  // Save to .env.local for frontend
  const fs = require('fs');
  
  const envContent = `NEXT_PUBLIC_DONATION_PLATFORM_ADDRESS=${donation.address}
NEXT_PUBLIC_MOCK_USDC_ADDRESS=${mockUSDC.address}
NEXT_PUBLIC_MOCK_USDT_ADDRESS=${mockUSDT.address}
NEXT_PUBLIC_MOCK_DAI_ADDRESS=${mockDAI.address}
NEXT_PUBLIC_TEST_NGO_1_ADDRESS=${testNGO1}
NEXT_PUBLIC_TEST_NGO_2_ADDRESS=${testNGO2}
NEXT_PUBLIC_APPROVER_1_ADDRESS=${approver1}
NEXT_PUBLIC_APPROVER_2_ADDRESS=${approver2}
NEXT_PUBLIC_APPROVER_3_ADDRESS=${approver3}
NEXT_PUBLIC_APPROVER_4_ADDRESS=${approver4}
`;

  fs.writeFileSync('.env.local', envContent);
  console.log('✅ Written to .env.local');

  // Save local config JSON with NGO names for frontend
  const localConfig = {
    chainId: 31337,
    donationPlatform: donation.address,
    mockUSDC: mockUSDC.address,
    mockUSDT: mockUSDT.address,
    mockDAI: mockDAI.address,
    ngos: [
      {
        address: testNGO1,
        name: 'Education First NGO',
        category: 'Education',
        description: 'Supporting quality education for underprivileged children'
      },
      {
        address: testNGO2,
        name: 'Healthcare Initiative',
        category: 'Healthcare',
        description: 'Providing accessible healthcare to rural communities'
      }
    ]
  };

  fs.writeFileSync('local-deployment.json', JSON.stringify(localConfig, null, 2));
  console.log('✅ Written to local-deployment.json');

  console.log('\n📋 NGO REGISTRATION IN FRONTEND:');
  console.log('Run this in browser console on /donate page to register NGO names:');
  console.log('');
  console.log('```javascript');
  console.log('import { registerNGOName } from "@/utils/ngoRegistry"');
  console.log(`registerNGOName("${testNGO1}", "Education First NGO", "Education")`);
  console.log(`registerNGOName("${testNGO2}", "Healthcare Initiative", "Healthcare")`);
  console.log('```');
  console.log('');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
