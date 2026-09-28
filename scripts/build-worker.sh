#!/usr/bin/env bash
set -euo pipefail

project_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
dist_root="$project_root/dist"

mkdir -p "$dist_root/server" "$dist_root/.openai"
node - "$project_root/worker/index.js" "$dist_root/index.html" "$project_root/assets/romantic.mpeg" "$dist_root/server/index.js" <<'NODE'
const fs = require("node:fs");
const [workerPath, pagePath, audioPath, outputPath] = process.argv.slice(2);
const worker = fs.readFileSync(workerPath, "utf8");
const page = fs.readFileSync(pagePath, "utf8");
const audioBase64 = fs.readFileSync(audioPath).toString("base64");
fs.writeFileSync(outputPath, worker
  .replace("__PAGE_HTML__", JSON.stringify(page))
  .replace("__AUDIO_BASE64__", JSON.stringify(audioBase64)));
NODE
cp "$project_root/.openai/hosting.json" "$dist_root/.openai/hosting.json"
echo "Built $dist_root/server/index.js"
