// scripts/copy-build.js
const fs = require("fs");
const path = require("path");
const fse = require("fs-extra");

const srcDir = path.join(__dirname, "../shruggbot-ui/build");
const destDir = path.join(__dirname, "../public");

(async () => {
  try {
    if (fs.existsSync(destDir)) {
      await fse.remove(destDir);
    }
    await fse.copy(srcDir, destDir);
    console.log("✅ Copied React build to /public");
  } catch (err) {
    console.error("❌ Failed to copy build:", err);
    process.exit(1);
  }
})();
