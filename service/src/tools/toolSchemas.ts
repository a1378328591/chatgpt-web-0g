import type { OpenAI } from 'openai'

export const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'get_wallet_rank',
      description: '获取指定钱包地址的存储节点排名',
      parameters: {
        type: 'object',
        properties: {
          wallet: {
            type: 'string',
            description: '钱包地址',
          },
        },
        required: ['wallet'],
      },
    },
  },
]
