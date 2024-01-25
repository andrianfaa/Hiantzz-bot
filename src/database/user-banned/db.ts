import fs from "node:fs";
import path from "node:path";

async function check(dataPath: string, type: "dir" | "file") {
  if (type === "file") {
    if (!fs.existsSync(dataPath)) {
      fs.writeFileSync(dataPath, "", {
        encoding: "utf-8",
      });
    }
  } else {
    if (!fs.existsSync(dataPath)) {
      fs.mkdirSync(dataPath);
    }
  }
}

const data = path.resolve(process.cwd(), "data");
const bannedPath = path.resolve(data, "banned.txt");

async function checkAll() {
  check(data, "dir");
  check(bannedPath, "file");
}

export default {
  isBanned: async (number: string) => {
    await checkAll();

    if (fs.existsSync(bannedPath)) {
      const content = fs.readFileSync(bannedPath, {
        encoding: "utf-8",
      });

      return !!content.match(number);
    } else {
      throw new Error(`UserBanned error: \`${bannedPath}\` tidak ditemukan`);
    }
  },

  ban: async (number: string) => {
    await checkAll();

    if (fs.existsSync(bannedPath)) {
      const content = fs
        .readFileSync(bannedPath, {
          encoding: "utf-8",
        })
        .split(" ");

      content.push(number);

      fs.writeFileSync(bannedPath, content.join(" ").trim(), {
        encoding: "utf-8",
      });
    } else {
      console.error(`UserBanned error: \`${bannedPath}\` tidak ditemukan`);
    }
  },

  unban: async (number: string) => {
    await checkAll();

    if (fs.existsSync(bannedPath)) {
      let content = fs.readFileSync(bannedPath, {
        encoding: "utf-8",
      });

      content = content.replace(number, "");

      fs.writeFileSync(bannedPath, content.trim(), {
        encoding: "utf-8",
      });
    } else {
      console.error(`UserBanned error: \`${bannedPath}\` tidak ditemukan`);
    }
  },
};
