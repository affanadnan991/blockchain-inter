/**
 * Local Deployment Configuration
 * This file is automatically populated by the deployment script
 * It contains the addresses of contracts deployed to your local Hardhat network
 */

export const LOCAL_CONFIG = {
  // Hardhat Chain ID
  chainId: 31337,
  
  // Contract Addresses (populated by deploy script)
  donationPlatform: process.env.NEXT_PUBLIC_DONATION_PLATFORM_ADDRESS || '',
  mockUSDC: process.env.NEXT_PUBLIC_MOCK_USDC_ADDRESS || '',
  mockUSDT: process.env.NEXT_PUBLIC_MOCK_USDT_ADDRESS || '',
  mockDAI: process.env.NEXT_PUBLIC_MOCK_DAI_ADDRESS || '',
  
  // Registered NGOs
  registeredNGOs: [
    {
      address: process.env.NEXT_PUBLIC_TEST_NGO_ADDRESS || '',
      name: 'Test NGO',
      category: 'General Welfare',
      description: 'Test NGO for local development'
    }
  ],
  
  // Mock tokens for local development
  tokens: [
    {
      symbol: 'USDC',
      name: 'USD Coin',
      address: process.env.NEXT_PUBLIC_MOCK_USDC_ADDRESS || '',
      decimals: 6,
      minDonation: '5000000', // 5 USDC
      type: 'stablecoin',
      color: '#2775CA'
    },
    {
      symbol: 'USDT',
      name: 'Tether USD',
      address: process.env.NEXT_PUBLIC_MOCK_USDT_ADDRESS || '',
      decimals: 6,
      minDonation: '5000000', // 5 USDT
      type: 'stablecoin',
      color: '#26A17B'
    },
    {
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      address: process.env.NEXT_PUBLIC_MOCK_DAI_ADDRESS || '',
      decimals: 18,
      minDonation: '5000000000000000000', // 5 DAI
      type: 'stablecoin',
      color: '#F5AF1D'
    }
  ]
};

export default LOCAL_CONFIG;
