import fs from "node:fs";
import path from "node:path";

/**
 * Template loader
 *
 * @param {string} templateName
 */
async function templateLoader(templateName: string) {
  try {
    const templatePath = path.resolve(process.cwd(), "src", "templates");
    const template = path.resolve(templatePath, `${templateName}.txt`);
    const content = fs.readFileSync(template, {
      encoding: "utf-8",
    });

    return content;
  } catch (error) {
    throw error;
  }
}

export default templateLoader;
