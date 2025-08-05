const { ethers } = require('hardhat')
require('dotenv').config()

async function main() {
  const rockPaperScissors = await ethers.getContractFactory('RockPaperScissors')
  const contract = await rockPaperScissors.deploy()
  await contract.deployed()
}

main().catch(() => {
  process.exitCode = 1
})
