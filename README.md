# 百家姓暗号转换工具

> 🏷️ 百家姓暗号 / 核心价值观暗号 / 与佛论禅 — 一键互相转换

部署在 [Cloudflare Workers](https://workers.cloudflare.com/) 上的在线工具，数据全部本地处理，**不上传任何服务器**。

## 🎯 功能

| 模式 | 方向 | 说明 |
|------|------|------|
| 📜 **百家姓暗号** | 明文 ⇄ 暗号 | 用百家姓汉字替代 ASCII 字符（`赵`=`0`，`钱`=`1`，`陈`=`9`，`褚`=`a`…） |
| ⭐ **核心价值观暗号** | 明文 ⇄ 暗号 | 用「富强民主文明和谐…」十二词进行 base-12 编码 |
| 🪷 **与佛论禅** | 明文 ⇄ 暗号 | XOR 加密后映射为佛经字符 |

**典型用法：** 把磁力链接或 ed2k 链接转成百家姓暗号，在聊天中发送时不会被平台识别拦截。

## 🚀 部署

### 前置条件

- Node.js ≥ 18
- [Cloudflare 账号](https://dash.cloudflare.com/sign-up)
- 全局安装 `wrangler`：

```bash
npm install -g wrangler
```

### 一键部署

```bash
# 克隆仓库
git clone https://github.com/<你的用户名>/百家姓互转.git
cd 百家姓互转

# 登录 Cloudflare（会打开浏览器授权）
wrangler login

# 部署
wrangler deploy worker.js --name baijiaxing
```

部署成功后会输出你的 Worker URL：

```
https://baijiaxing.<你的子域>.workers.dev
```

### 自定义域名（可选）

```bash
wrangler route add "<自定义域名>/*" baijiaxing
```

## 📡 API

Worker 同时提供 REST API，支持程序化调用。

### 编码：明文 → 暗号

```bash
curl -X POST https://<你的Worker域名>/api/convert \
  -H "Content-Type: application/json" \
  -d '{"text":"magnet:?xt=urn:btih:abc123","mode":"baijiaxing","direction":"encode"}'
```

### 解码：暗号 → 明文

```bash
curl -X POST https://<你的Worker域名>/api/convert \
  -H "Content-Type: application/json" \
  -d '{"text":"赵钱孙李","mode":"baijiaxing","direction":"decode"}'
```

### 参数说明

| 参数 | 必填 | 值 |
|------|------|----|
| `text` | ✅ | 待转换的文本 |
| `mode` | ❌ | `baijiaxing`（默认）/ `corevalues` / `buddha` |
| `direction` | ❌ | `encode`（默认）/ `decode` |

### 响应示例

```json
{
  "result": "magnet:?xt=urn:btih:abc123"
}
```

## 🗺️ 编码映射表

### 百家姓

```
数字: 赵=0 钱=1 孙=2 李=3 周=4 吴=5 郑=6 王=7 冯=8 陈=9
小写: 褚=a 卫=b 蒋=c 沈=d 韩=e 杨=f 朱=g 秦=h 尤=i 许=j
      何=k 吕=l 施=m 张=n 孔=o 曹=p 严=q 华=r 金=s 魏=t
      陶=u 姜=v 戚=w 谢=x 邹=y 喻=z
大写: 福=A 水=B 窦=C 章=D 云=E 苏=F 潘=G 葛=h 奚=I 范=J
      彭=K 郎=L 鲁=M 韦=N 昌=O 马=P 苗=Q 凤=R 花=S 方=T
      俞=U 任=V 袁=W 柳=X 唐=Y 罗=Z
符号: 薛=. 伍=- 余=_ 米=+ 贝== 姚=/ 孟=? 顾=# 尹=% 江=& 钟=* 竺=: 赖=|
```

### 核心价值观

用 `富强民主文明和谐自由平等公正法治爱国敬业诚信友善` 共 12 个词，每个字节拆为 3 组 base-12 数字（高→低）。

### 与佛论禅

1. 将明文 UTF-8 编码为字节
2. 每个字节与密钥 `SKUMOR@K2D4V8Z5` 对应位做 XOR
3. 将结果拆为高 6 位 / 低 6 位，从 36 个佛经字符中查表替换
4. 前缀 `佛曰：`

## ✨ 界面特性

- 📱 移动端适配
- 🌙 自动跟随系统深色模式 + 手动切换
- 📋 一键复制结果 / 粘贴剪贴板
- 🔄 双向转换，输入即转换
- 💡 自动识别 magnet / ed2k 链接格式

## 📄 License

MIT
