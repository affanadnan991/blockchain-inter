async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with account:', deployer.address);
  console.log('Account balance:', (await deployer.getBalance()).toString());

  const Donation = await ethers.getContractFactory('DonationPlatform');
  const donation = await Donation.deploy();
  await donation.deployed();

  console.log('DonationPlatform deployed to:', donation.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
