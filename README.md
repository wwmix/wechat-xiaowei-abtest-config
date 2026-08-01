# WeChat Xiaowei ABTest Config

这是一份面向微信 iOS `8.0.76`（构建号 `8.0.76.17`）的 WCCC 配置，在
[WCABTestConfig v1.0.0](https://github.com/huami1314/WCABTestConfig/releases/tag/v1.0.0)
公开配置基础上增加小微及语音输入相关灰度开关。

灰度配置版本日期：`2026-08-01`

## 新增配置

| 配置键 | 值 | 用途 |
| --- | --- | --- |
| `clicfg_enable_optimize_config` | `1` | 启用小微半屏总入口 |
| `clicfg_enable_xiaowei_biz` | `1` | 启用文章摘录“问小微” |
| `clicfg_enable_xiaowei_msg` | `1` | 启用消息气泡“问小微” |
| `clicfg_enable_optimize_config_flutter_chatbot` | `1` | 启用新版 Flutter ChatBot 配置 |
| `clicfg_chat_voice_trans_newstyle` | `1` | 启用长按输入框说话转文字的 VoiceTrans V2 新界面 |
| `clicfg_input_translating_open` | `1` | 保持输入文字翻译功能开启 |

## 配置地址

```text
https://raw.githubusercontent.com/wwmix/wechat-xiaowei-abtest-config/main/ABTestConfig.json
```

`ABTestConfig.json` 保持 WCCC 使用的格式：文件内容是完整 JSON 的 Base64 编码，
并非可直接阅读的普通 JSON。

WCCC 保存地址后可能会自动把文件名改为 `ABTestConfig_New.json`，这是正常行为。
仓库已经同时提供该 AES 加密版本，内容与上面的 Base64 配置一致。

仓库同时提供 `ABTestConfigDesc.json`。WCCC 同步主配置时会自动请求这个配套的
功能描述文件，因此三个文件需要位于同一目录并保持当前文件名。

## 重新生成

需要 Node.js 18 或更高版本：

```bash
node scripts/generate-config.mjs
```

生成脚本会同时生成主配置和功能描述文件，并固定校验两个上游文件的 SHA-256，
避免上游文件变化时静默生成不同内容。

## 说明

- 该配置只解除客户端灰度入口，不保证微信服务器为所有账号开放小微服务。
- 语音转文字的润色按钮由微信识别服务返回，仍可能受账号灰度限制。
- 微信在 iPad 上会额外关闭 `enableMiniTaskPageChat`，本配置主要用于 iPhone。
- 未修改 ChatBot 用户名、账号列表以及 WeClaw 相关配置。
