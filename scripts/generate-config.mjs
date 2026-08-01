import { createHash } from "node:crypto";
import { writeFile } from "node:fs/promises";

const sourceUrl =
  "https://github.com/huami1314/WCABTestConfig/releases/download/v1.0.0/ABTestConfig.json";
const expectedSourceSha256 =
  "51d7ca5b23b0e3e61d7d1604ef08f41f2386ffa7837b8e020b4ad5d2915e0f78";

const xiaoweiFlags = {
  clicfg_enable_optimize_config: "1",
  clicfg_enable_xiaowei_biz: "1",
  clicfg_enable_xiaowei_msg: "1",
  clicfg_enable_optimize_config_flutter_chatbot: "1",
};

const response = await fetch(sourceUrl);
if (!response.ok) {
  throw new Error(`Failed to download source config: HTTP ${response.status}`);
}

const source = Buffer.from(await response.arrayBuffer());
const sourceSha256 = createHash("sha256").update(source).digest("hex");
if (sourceSha256 !== expectedSourceSha256) {
  throw new Error(
    `Source config changed: expected ${expectedSourceSha256}, got ${sourceSha256}`,
  );
}

const decoded = Buffer.from(source.toString("ascii").trim(), "base64").toString(
  "utf8",
);
const config = JSON.parse(decoded);
Object.assign(config, xiaoweiFlags);

const outputJson = `${JSON.stringify(config, null, 2)}\n`;
const output = Buffer.from(outputJson, "utf8").toString("base64");
const outputPath = new URL("../ABTestConfig.json", import.meta.url);
await writeFile(outputPath, output, "ascii");

const outputSha256 = createHash("sha256").update(output).digest("hex");
console.log(`Generated ${outputPath.pathname}`);
console.log(`Entries: ${Object.keys(config).length}`);
console.log(`SHA-256: ${outputSha256}`);

