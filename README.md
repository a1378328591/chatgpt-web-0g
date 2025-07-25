# 探索 0G Compute

> 声明：fork了一位大佬的开源项目：https://github.com/Chanzhaoyu/chatgpt-web 在此基础上升级了链上大模型调用（基于0G Compute SDK） 。

## 介绍

支持多模型，提供了三种模型

| 方式                                          | 免费？ | 可靠性     | 质量 |
| --------------------------------------------- | ------ | ---------- | ---- |
| `phala/deepseek-r1-70b`                           | 否     | 可靠       | 聪明 |
| `phala/llama-3.3-70b-instruct` | 否     | 可靠 | 聪明 |
| `meta-llama/Llama-3.1-8B-Instruct` | 否     | 相对不可靠 | 相对较笨 |


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
pnpm install
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

## 打包
### 前端

```
pnpm install
pnpm build-only
```
### 后端
```
# 安装
pnpm install
# 打包
pnpm build
# 运行
pnpm prod
```


