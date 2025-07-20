import express from 'express'
//import type { RequestProps } from './types'
//import type { ChatMessage } from './chatgpt'
//import { chatConfig, chatReplyProcess, currentModel } from './chatgpt'
import { auth } from './middleware/auth'
import { limiter } from './middleware/limiter'
import { isNotEmptyString } from './utils/is'
import { llmService } from './service/llmService'

const app = express()
const router = express.Router()

app.use(express.static('public'))
app.use(express.json())

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };
const messageStore = new Map<string, ChatMessage[]>();


app.all('*', (_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'authorization, Content-Type')
  res.header('Access-Control-Allow-Methods', '*')
  next()
})

// /chat-process
// 在你的主文件中，比如 app.ts 或 server.ts，添加以下内容：

router.post('/session', async (req, res) => {
  try {
    const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY
    const hasAuth = isNotEmptyString(AUTH_SECRET_KEY)
    res.send({ status: 'Success', message: '', data: { auth: hasAuth, model: '0GCompute' } })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})

router.post('/llm/ask', auth, async (req, res) => {
  try {
    const { provider, prompt, history = [], options = {}, systemMessage } = req.body;
    const parentMessageId: string | null = options?.parentMessageId ?? null;

    if (!provider || !prompt) {
      return res.status(400).json({ status: 'Fail', message: 'provider 和 prompt 不能为空' });
    }

    // 构造对话历史
    let finalHistory: ChatMessage[] = [];

    if (systemMessage) {
      finalHistory.push({ role: 'system', content: systemMessage });
    }

    if (parentMessageId && messageStore.has(parentMessageId)) {
      const old = messageStore.get(parentMessageId)!;
      finalHistory = [...finalHistory, ...old.filter(m => m.role !== 'system')];
    }

    // 执行 LLM 调用
    const result = await llmService.ask({
      provider,
      prompt,
      history: [...finalHistory],
    });

    // 拼接新的历史
    const newHistory: ChatMessage[] = [
      ...finalHistory,
      { role: 'user', content: prompt },
      { role: 'assistant', content: result.text },
    ];

    // 记录当前的对话（使用 completion.id 作为新 parentMessageId）
    const newId = result.id;
    messageStore.set(newId, newHistory);

    res.json({
      status: 'Success',
      data: {
        ...result,
        parentMessageId: newId, // 前端需存这个
      },
    });
  } catch (error: any) {
    res.status(500).json({ status: 'Fail', message: error.message || '内部错误' });
  }
});



router.get('/llm/models', auth, async (_, res) => {
  try {
    const models = await llmService.listModels()
    //console.log('123123')
    const modelsSafe = convertBigIntToString(models)
    res.json({ status: 'Success', data: modelsSafe })
  } catch (error: any) {
    res.status(500).json({ status: 'Fail', message: error.message })
  }
})

router.get('/llm/balance', auth, async (_, res) => {
  try {
    const balance = await llmService.balance()
    res.json({ status: 'Success', data: balance })
  } catch (error: any) {
    res.status(500).json({ status: 'Fail', message: error.message })
  }
})

router.post('/llm/fund', auth, async (req, res) => {
  try {
    const { amount } = req.body
    if (typeof amount !== 'number') {
      return res.status(400).json({ status: 'Fail', message: 'amount 必须为数字' })
    }

    const tx = await llmService.fund(amount)
    res.json({ status: 'Success', data: tx })
  } catch (error: any) {
    res.status(500).json({ status: 'Fail', message: error.message })
  }
})


app.use('', router)
app.use('/api', router)
app.set('trust proxy', 1)

app.listen(3002, () => globalThis.console.log('Server is running on port 3002'))

function convertBigIntToString(obj: any) {
  return JSON.parse(JSON.stringify(obj, (_, value) =>
    typeof value === 'bigint' ? value.toString() : value
  ));
}
