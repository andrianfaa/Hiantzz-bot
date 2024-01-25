import fs from "node:fs";
import path from "node:path";

const data = path.resolve(process.cwd(), "data", "data.txt");

export const db = {
  ban: {
    add: async (number: string) => {
      const content = fs
        .readFileSync(data, {
          encoding: "utf-8",
        })
        .split(" ");

      content.push(number);

      fs.writeFileSync(data, content.join(" ").trim(), {
        encoding: "utf-8",
      });
    },
    isBanned: async (number: string) => {
      const content = fs.readFileSync(data, {
        encoding: "utf-8",
      });

      return !!content.match(number);
    },
    remove: async (number: string) => {
      let content = fs.readFileSync(data, {
        encoding: "utf-8",
      });

      content = content.replace(number, "");

      fs.writeFileSync(data, content.trim(), {
        encoding: "utf-8",
      });
    },
  },
};
