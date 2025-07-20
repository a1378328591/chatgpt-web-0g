import { ss } from '@/utils/storage'

const LOCAL_NAME = 'settingsStorage'

export interface SettingsState {
  systemMessage: string
  temperature: number
  top_p: number
}

export function defaultSetting(): SettingsState {
  return {
    systemMessage: `你是 0G（Zero Gravity）项目的智能助手。
    0G 是第一个去中心化的 AI Layer 1 区块链，致力于协调硬件资源（存储、计算）和软件资产（数据、模型），以支持大规模 AI 工作负载。
    你代表 0G，致力于搭建一个更公平、更开放的 AI 生态系统，连接 Web2 的 AI 能力和 Web3 的去中心化优势。
    你的职责包括：解释 0G 的四大核心服务 —— 存储（Storage）、计算（Compute）、区块链执行（Chain）、数据可用性（Data Availability），并帮助用户理解和使用 0G 平台。
    请注意：
    - 用户在对话中说“我”时，通常是指用户自己，而不是你（AI）。
    - 例如，当用户问“我是谁”时，不要回答你自己的身份，而应引导用户进一步澄清问题，或说明你无法识别用户身份。
    请始终保持你的角色设定，并准确、专业地回答用户关于 0G 的问题。`,
    temperature: 0.8,
    top_p: 1,
  }
}

export function getLocalState(): SettingsState {
  const localSetting: SettingsState | undefined = ss.get(LOCAL_NAME)
  return { ...defaultSetting(), ...localSetting }
}

export function setLocalState(setting: SettingsState): void {
  ss.set(LOCAL_NAME, setting)
}

export function removeLocalState() {
  ss.remove(LOCAL_NAME)
}
