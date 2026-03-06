require('@nomicfoundation/hardhat-toolbox');

/**
 * Hardhat configuration for local development and cross-network testing.
 *
 * Usage (from project root):
 *   npx hardhat test            # runs tests against the in‑memory hardhat network
 *   npx hardhat run scripts/deploy.js --network hardhat
 *   npx hardhat run scripts/deploy.js --network polygon
 *   npx hardhat run scripts/deploy.js --network mainnet
 *
 * Set environment variables for remote networks:
 *   POLYGON_RPC  - polygon node url
 *   ETH_RPC      - ethereum node url
 *   PRIVATE_KEY  - deployer private key (prefixed by 0x)
 */

module.exports = {
  defaultNetwork: 'hardhat',
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
  networks: {
    hardhat: {
      // you can fork mainnet or polygon here if needed
    },
    polygon: {
      url: process.env.POLYGON_RPC || '',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    mainnet: {
      url: process.env.ETH_RPC || '',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  solidity: {
    version: '0.8.24',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
};
