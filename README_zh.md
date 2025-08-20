# 探索 0G Compute 
AI 驱动的链上智能体（石头剪刀布游戏）
基于 [chatgpt-web](https://github.com/Chanzhaoyu/chatgpt-web) 改造，集成 **0G Compute SDK**，最终呈现的是一个 去中心化、AI 驱动的链上博弈智能体

## 📌 项目介绍
本项目包含三个部分：

1. **前端（frontend）**  
   - 对话界面，支持多模型选择与交互, 聊天记录， 语言设置等
  

2. **后端（service）**  
   - 基于 0G Compute SDK 调用链上模型  
   - 支持Function Calling  
   - 提供 REST API 给前端调用  

3. **合约（hardhat）**  
   - 使用 Hardhat 部署示例合约（石头剪刀布）  

---

## 待实现路线
[x] 多模型协同  

## 支持模型：

| 方式                                          | 免费 | 可靠性     | 质量 |
| --------------------------------------------- | ------ | ---------- | ---- |
| `phala/deepseek-chat-v3-0324`                           | 否     | 可靠       | 聪明 |
| `phala/llama-3.3-70b-instruct` | 否     | 可靠 | 聪明 |


---

# 环境准备


node需要 `^20` 版本
```bash
node -v
```

通过 `pnpm` 管理依赖
```shell
npm install pnpm -g
```

```bash
# 完善.env配置文件里的 私钥，rpc， 石头剪刀布游戏的合约地址
cp /service/.env.example /service/.env
```


# 快速启动


## 部署合约 Hardhat
```
cd hardhat
pnpm install
pnpm hardhat compile
npx hardhat run scripts/deploy.js --network 0g-testnet
```

## 后端 Service
```
cd service
pnpm install
pnpm dev
```

## 前端 Frontend
```
pnpm install
pnpm dev   # 启动前端网页
```


