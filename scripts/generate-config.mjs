import { createHash } from "node:crypto";
import { writeFile } from "node:fs/promises";

const configSourceUrl =
  "https://github.com/huami1314/WCABTestConfig/releases/download/v1.0.0/ABTestConfig.json";
const expectedConfigSourceSha256 =
  "51d7ca5b23b0e3e61d7d1604ef08f41f2386ffa7837b8e020b4ad5d2915e0f78";
const descriptionSourceUrl =
  "https://github.com/huami1314/WCABTestConfig/releases/download/v1.0.0/ABTestConfigDesc.json";
const expectedDescriptionSourceSha256 =
  "c9b7a084a270911a3c90df0e3851d2f70da231dc56ab52b1328776e961cf5fc9";

const xiaoweiFlags = {
  clicfg_enable_optimize_config: "1",
  clicfg_enable_xiaowei_biz: "1",
  clicfg_enable_xiaowei_msg: "1",
  clicfg_enable_optimize_config_flutter_chatbot: "1",
};

const xiaoweiDescriptions = [
  {
    key: "clicfg_enable_optimize_config",
    value: "1",
    title: "小微半屏总入口",
    desc: "启用小微半屏入口的基础配置",
  },
  {
    key: "clicfg_enable_xiaowei_biz",
    value: "1",
    title: "文章摘录问小微",
    desc: "启用文章摘录场景中的「问小微」入口",
  },
  {
    key: "clicfg_enable_xiaowei_msg",
    value: "1",
    title: "消息气泡问小微",
    desc: "启用消息气泡场景中的「问小微」入口",
  },
  {
    key: "clicfg_enable_optimize_config_flutter_chatbot",
    value: "1",
    title: "新版小微 ChatBot",
    desc: "启用新版 Flutter ChatBot 配置",
  },
];

async function download(url, expectedSha256, label) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${label}: HTTP ${response.status}`);
  }

  const data = Buffer.from(await response.arrayBuffer());
  const sha256 = createHash("sha256").update(data).digest("hex");
  if (sha256 !== expectedSha256) {
    throw new Error(
      `${label} changed: expected ${expectedSha256}, got ${sha256}`,
    );
  }

  return data;
}

const source = await download(
  configSourceUrl,
  expectedConfigSourceSha256,
  "source config",
);
const descriptionSource = await download(
  descriptionSourceUrl,
  expectedDescriptionSourceSha256,
  "source descriptions",
);

const decoded = Buffer.from(source.toString("ascii").trim(), "base64").toString(
  "utf8",
);
const config = JSON.parse(decoded);
Object.assign(config, xiaoweiFlags);

const outputJson = `${JSON.stringify(config, null, 2)}\n`;
const output = Buffer.from(outputJson, "utf8").toString("base64");
const outputPath = new URL("../ABTestConfig.json", import.meta.url);
await writeFile(outputPath, output, "ascii");

const descriptions = JSON.parse(descriptionSource.toString("utf8"));
descriptions.items.push(...xiaoweiDescriptions);
const descriptionOutput = `${JSON.stringify(descriptions, null, 2)}\n`;
const descriptionOutputPath = new URL(
  "../ABTestConfigDesc.json",
  import.meta.url,
);
await writeFile(descriptionOutputPath, descriptionOutput, "utf8");

const outputSha256 = createHash("sha256").update(output).digest("hex");
console.log(`Generated ${outputPath.pathname}`);
console.log(`Entries: ${Object.keys(config).length}`);
console.log(`SHA-256: ${outputSha256}`);
console.log(`Generated ${descriptionOutputPath.pathname}`);
console.log(`Descriptions: ${descriptions.items.length}`);
