const fs = await import("node:fs/promises");
const path = await import("node:path");
const { fileURLToPath } = await import("node:url");

const qaDir = path.dirname(fileURLToPath(import.meta.url));
const designDir = path.dirname(qaDir);
const files = ["index.html", "hospitals.html", "care-plan.html", "cost-estimate.html", "tcm-wellness.html", "consultation.html"];
const missing = [];

for (const file of files) {
  const source = await fs.readFile(path.join(designDir, file), "utf8");
  const links = [...source.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
  for (const link of links) {
    if (/^(?:https?:|mailto:|tel:|#)/.test(link)) continue;
    const target = path.resolve(designDir, link.split(/[?#]/)[0]);
    try { await fs.access(target); }
    catch { missing.push(`${file} -> ${link}`); }
  }
}

const css = await fs.readFile(path.join(designDir, "index.html"), "utf8");
const cssAssets = [...css.matchAll(/url\("([^"]+)"\)/g)].map((match) => match[1]);
for (const asset of cssAssets) {
  const target = path.resolve(designDir, asset);
  try { await fs.access(target); }
  catch { missing.push(`index.html CSS -> ${asset}`); }
}

if (missing.length) {
  console.error(missing.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`PASS ${files.length} pages: all local links and assets resolve`);
}
