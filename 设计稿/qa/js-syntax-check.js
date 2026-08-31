const fs = await import("node:fs/promises");
const files = ["index.html", "hospitals.html", "care-plan.html", "cost-estimate.html", "tcm-wellness.html", "consultation.html"];
let failed = false;
for (const file of files) {
  const source = await fs.readFile(new URL(`../${file}`, import.meta.url), "utf8");
  const scripts = [...source.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map((match) => match[1]);
  for (let index = 0; index < scripts.length; index += 1) {
    try {
      new Function(scripts[index]);
      console.log(`PASS ${file} inline-script-${index + 1}`);
    } catch (error) {
      failed = true;
      console.error(`FAIL ${file} inline-script-${index + 1}: ${error.message}`);
    }
  }
}
if (failed) process.exitCode = 1;
