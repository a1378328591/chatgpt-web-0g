require('dotenv').config()
require('@nomiclabs/hardhat-ethers')

module.exports = {
  solidity: {
    version: '0.8.19',
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    '0g-testnet': {
      url: 'https://evmrpc-testnet.0g.ai',
      chainId: 16601,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
}
