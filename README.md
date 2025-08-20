# Exploring 0G Compute  
AI-Powered On-chain Agent (Rock-Paper-Scissors Game)

Based on [chatgpt-web](https://github.com/Chanzhaoyu/chatgpt-web), integrated with the 0G Compute SDK, it ultimately presents a decentralized, AI-driven on-chain gaming agent.

## 📌 Project Overview
This project consists of three main parts:

1. **Frontend (frontend)**  
   - Chat interface with multi-model support, conversation history, language settings, etc.
  
2. **Backend (service)**  
   - Invoke on-chain models via 0G Compute SDK  
   - Support for Function Calling  
   - Provide REST API for frontend integration  

3. **Smart Contract (hardhat)**  
   - Deploy example smart contracts (Rock-Paper-Scissors) using Hardhat  

---

## Roadmap
[x] Multi-model collaboration  

## Supported Models

| Model ID                              | Free | Reliability | Quality |
| ------------------------------------- | ---- | ----------- | ------- |
| `phala/deepseek-chat-v3-0324`         | No   | High        | Smart   |
| `phala/llama-3.3-70b-instruct`        | No   | High        | Smart   |

---

# Environment Setup

Node.js version `^20` is required:
```bash
node -v
```

Manage dependencies using pnpm
```shell
npm install pnpm -g
```

Configure environment variables
```bash
#Fill in your private key, RPC URL, and Rock-Paper-Scissors contract address in .env
cp /service/.env.example /service/.env
```


# Quick Start (windows)


## Deploy Smart Contract (Hardhat)
```
cd hardhat
pnpm install
pnpm hardhat compile
npx hardhat run scripts/deploy.js --network 0g-testnet
```

## Backend Service
```
cd service
pnpm install
pnpm dev
```

## Frontend
```
pnpm install
pnpm dev
```
