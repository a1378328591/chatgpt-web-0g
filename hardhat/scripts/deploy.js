import hardhat from 'hardhat'
const { ethers } = hardhat

async function main() {
  process.stdout.write('Start deploying contract...' + '\n')

  const RockPaperScissors = await ethers.getContractFactory('RockPaperScissors')
  const rps = await RockPaperScissors.deploy()
  await rps.deployed()

  process.stdout.write(`Contract deployed to: ${rps.address}\n`)
  // console.log("Contract deployed to:", rps.address);
}

main()
  .then(() => process.stdout.write('Deployment finished' + '\n'))
  .catch((error) => {
    process.stdout.write(`Deployment failed: ${error.message}\n`)
    process.exit(1)
  })
