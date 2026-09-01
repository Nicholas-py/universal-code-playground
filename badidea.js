import fs from "node:fs";
import path from "node:path";

const candidates = [
  "dist/server/wrangler.json",
];

for (const relativePath of candidates) {
  const file = path.resolve(relativePath);

  if (!fs.existsSync(file)) {
    continue;
  }

  const config = JSON.parse(fs.readFileSync(file, "utf8"));

  if (!config.assets) {
    console.warn(`No assets config found in ${relativePath}`);
    continue;
  }

  // The generated config is relative to its own directory.
  // dist/server/wrangler.json -> .output/public
  config.assets.directory = "../../.output/public";

  fs.writeFileSync(
    file,
    JSON.stringify(config, null, 2) + "\n",
    "utf8",
  );

  console.log(
    `Fixed ${relativePath}: assets.directory = ${config.assets.directory}`,
  );
}