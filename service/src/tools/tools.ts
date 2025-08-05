import axios from 'axios'
import { JsonRpcProvider, Wallet, ethers } from 'ethers'
import dotenv from 'dotenv'
dotenv.config()

// 合约地址和 ABI
const CONTRACT_ADDRESS = '0x51d37b7fC59a53E5b198e1B76050cC0E34f93781'
const CONTRACT_ABI = [
  'function playGame(uint8 userMove) public payable',
  'function prizePool() public view returns (uint256)',
  'function depositPrizePool() external payable',
  'event GameResult(address indexed user, uint8 userMove, uint8 contractMove, uint8 result, uint256 amountWon)',
]

// Provider 和 signer（替换成你本地或后端私钥）
const provider = new JsonRpcProvider(process.env.RPC_URL)
const wallet = new Wallet(process.env.PRIVATE_KEY, provider)
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, CONTRACT_ABI, wallet)

// 枚举映射
const moveMap = {
  Rock: 0,
  Paper: 1,
  Scissors: 2,
}

// 这个是你已有的 get_wallet_rank 实现
async function getWalletRank(args: { wallet: string }) {
  const wallet = args.wallet.toLowerCase()
  const limit = 1000
  let skip = 0
  let rank = -1
  let total = 0

  while (true) {
    const res = await axios.get('https://storagescan-galileo.0g.ai/api/miners', {
      params: {
        network: 'turbo',
        skip,
        limit,
        sortField: 'total_reward',
      },
    })

    const { list, total: totalCount } = res.data.data
    total = totalCount

    const index = list.findIndex((item: any) => item.miner.toLowerCase() === wallet)
    if (index !== -1) {
      rank = skip + index + 1
      break
    }

    skip += limit
    if (skip >= totalCount)
      break
  }

  return {
    wallet: args.wallet,
    rank: rank === -1 ? null : rank,
    total,
  }
}

// 查询奖池余额（ETH）
async function getPrizePool() {
  const pool = await contract.prizePool()
  return {
    prizePoolEth: ethers.formatEther(pool),
    symbol: '0G',
  }
}

// 猜拳游戏
async function playRPSGame(args: { wallet: string; move: string; amount: string }) {
  const moveValue = moveMap[args.move]
  const valueInWei = ethers.parseEther(args.amount)

  const tx = await contract.playGame(moveValue, {
    value: valueInWei,
  })

  const receipt = await tx.wait()

  // 解析事件
  const event = receipt.logs
    .map((log: any) => {
      try {
        return contract.interface.parseLog(log)
      }
      catch {
        return null
      }
    })
    .find(e => e?.name === 'GameResult')

  if (!event)
    throw new Error('GameResult event not found')

  const { user, userMove, contractMove, result, amountWon } = event.args

  const prizePoolAfter = await contract.prizePool()

  return {
    wallet: user,
    userMove: Object.keys(moveMap)[userMove],
    contractMove: Object.keys(moveMap)[contractMove],
    result: ['Draw', 'UserWin', 'ContractWin'][result],
    amountWon: ethers.formatEther(amountWon),
    currentPrizePoolEth: ethers.formatEther(prizePoolAfter),
    userBalance: await getWalletBalance(),
    symbol: '0G',
  }
}

async function depositPrizePool(args: { amount: number }) {
  const { amount } = args

  const tx = await contract.depositPrizePool({
    value: ethers.parseEther(amount.toString()), // 转为 wei
  })

  const receipt = await tx.wait()

  return {
    success: true,
    txHash: receipt.transactionHash,
    deposited: amount,
    symbol: '0G',
  }
}

function formatAmount(amountInWei: bigint) {
  return `${ethers.formatEther(amountInWei)} 0G`
}

async function getWalletBalance() {
  const balance = await provider.getBalance(wallet.address)
  return formatAmount(balance) // 使用上面的 formatAmount
}

export const toolFunctions = {
  get_wallet_rank: getWalletRank,
  play_rps_game: playRPSGame,
  get_prize_pool: getPrizePool,
  deposit_prize_pool: depositPrizePool,
}
