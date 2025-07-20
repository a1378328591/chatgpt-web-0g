// src/llmService.ts
import { Wallet, JsonRpcProvider } from 'ethers';
import { createZGComputeNetworkBroker } from '@0glabs/0g-serving-broker';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { askLLM, getAvailableModels, getBrokerBalance, fundBroker } from '../utils/askLLM';

dotenv.config();

class LLMService {
  private wallet: Wallet;

  constructor() {
    const provider = new JsonRpcProvider(process.env.RPC_URL!);
    this.wallet = new Wallet(process.env.PRIVATE_KEY!, provider);
  }

  getWallet() {
    return this.wallet;
  }

  async listModels() {
    return await getAvailableModels(this.wallet);
  }

  async ask(input: {
    provider: string;
    prompt: string;
    history: { role: 'user' | 'system' | 'assistant'; content: string }[];
  }) {
    return await askLLM(this.wallet, input.provider, input.prompt, input.history);
  }

  async balance() {
    return await getBrokerBalance(this.wallet);
  }

  async fund(amount: number) {
    return await fundBroker(this.wallet, amount);
  }
}

export const llmService = new LLMService();
