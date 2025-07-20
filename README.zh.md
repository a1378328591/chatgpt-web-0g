# ChatGPT Web

> 声明：fork了一位大佬的开源项目：https://github.com/Chanzhaoyu/chatgpt-web 在此基础上升级了链上大模型调用（基于0G Compute SDK） 。

## 介绍

支持双模型，提供了两种非官方 `ChatGPT API` 方法

| 方式                                          | 免费？ | 可靠性     | 质量 |
| --------------------------------------------- | ------ | ---------- | ---- |
| `ChatGPTAPI(gpt-3.5-turbo-0301)`                           | 否     | 可靠       | 相对较笨 |
| `ChatGPTUnofficialProxyAPI(网页 accessToken)` | 是     | 相对不可靠 | 聪明 |

对比：
1. `ChatGPTAPI` 使用 `gpt-3.5-turbo` 通过 `OpenAI` 官方 `API` 调用 `ChatGPT`
2. `ChatGPTUnofficialProxyAPI` 使用非官方代理服务器访问 `ChatGPT` 的后端`API`，绕过`Cloudflare`（依赖于第三方服务器，并且有速率限制）

警告：
1. 你应该首先使用 `API` 方式
2. 使用 `API` 时，如果网络不通，那是国内被墙了，你需要自建代理，绝对不要使用别人的公开代理，那是危险的。
3. 使用 `accessToken` 方式时反向代理将向第三方暴露您的访问令牌，这样做应该不会产生任何不良影响，但在使用这种方法之前请考虑风险。
4. 使用 `accessToken` 时，不管你是国内还是国外的机器，都会使用代理。默认代理为 [pengzhile](https://github.com/pengzhile) 大佬的 `https://ai.fakeopen.com/api/conversation`，这不是后门也不是监听，除非你有能力自己翻过 `CF` 验证，用前请知悉。[社区代理](https://github.com/transitive-bullshit/chatgpt-api#reverse-proxy)（注意：只有这两个是推荐，其他第三方来源，请自行甄别）
5. 把项目发布到公共网络时，你应该设置 `AUTH_SECRET_KEY` 变量添加你的密码访问权限，你也应该修改 `index.html` 中的 `title`，防止被关键词搜索到。

切换方式：
1. 进入 `service/.env.example` 文件，复制内容到 `service/.env` 文件
2. 使用 `OpenAI API Key` 请填写 `OPENAI_API_KEY` 字段 [(获取 apiKey)](https://platform.openai.com/overview)
3. 使用 `Web API` 请填写 `OPENAI_ACCESS_TOKEN` 字段 [(获取 accessToken)](https://chat.openai.com/api/auth/session)
4. 同时存在时以 `OpenAI API Key` 优先

环境变量：

全部参数变量请查看或[这里](#环境变量)

```
/service/.env.example
```

## 待实现路线
[✓] 多模型协同

[✓] Function Calling

## 前置要求

### Node

`node` 需要 `^16 || ^18 || ^19` 版本，也可以使用 [nvm] 可管理本地多个 `node` 版本

```shell
node -v
```

### PNPM
如果你没有安装过 `pnpm`
```shell
npm install pnpm -g
```

### 填写密钥


```
# service/.env 文件

# 0g v3测试网上有水的evm钱包地址私钥 0x开头
PRIVATE_KEY=你的私钥
# rpc地址
RPC_URL=https://evmrpc-testnet.0g.ai
```

## 安装依赖

> 为了简便 `后端开发人员` 的了解负担，所以并没有采用前端 `workspace` 模式，而是分文件夹存放。如果只需要前端页面做二次开发，删除 `service` 文件夹即可。

### 后端

进入文件夹 `/service` 运行以下命令

```shell
pnpm install
```

### 前端
根目录下运行以下命令
```shell
pnpm dev
```

## 测试环境运行
### 后端服务

进入文件夹 `/service` 运行以下命令

```shell
# dev: watch 监听了文件改动
pnpm dev
```

### 前端网页
根目录下运行以下命令
```shell
pnpm dev
```

