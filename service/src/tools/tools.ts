import axios from 'axios'
export const toolFunctions = {
  get_wallet_rank: async (args: { wallet: string }) => {
    // TODO: 这里可以根据 wallet 查询链上信息
    // return {
    //   wallet: args.wallet,
    //   rank: 7, // 假设排名是第7
    //   total: 100
    // }

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

      // 查找是否当前这一页有这个地址
      const index = list.findIndex(
        (item: any) => item.miner.toLowerCase() === wallet,
      )

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
      rank: rank === -1 ? null : rank, // 没找到就是 null
      total,
    }
  },
}
