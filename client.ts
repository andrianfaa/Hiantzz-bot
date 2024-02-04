import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import qrcode from "qrcode-terminal";
import WAWebJS, { LocalAuth } from "whatsapp-web.js";
import { ConnectDB } from "./src/database";
import MessageHandler from "./src/message-handler";

if (!fs.existsSync(path.resolve(process.cwd(), ".env"))) {
  throw new Error("ERROR: .env not found!");
}

dotenv.config();

(() => {
  const client = new WAWebJS.Client({
    puppeteer: {
      // headless: "chrome",
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: "/usr/bin/google-chrome-stable",
    },
    // webVersion: "2.2405.0",
    ffmpegPath: "/usr/bin/ffmpeg",
    authStrategy: new LocalAuth(),
  });

  // Init
  ConnectDB(process.env.MONGODB_URL || "");
  client.initialize();

  client.on("qr", (qr) => {
    qrcode.generate(qr, {
      small: true,
    });
  });

  client.on("ready", async () => {
    if (process.env.NODE_ENV !== "development") {
      const to = process.env.HIANTZZ_LOG_ID
        ? `${process.env.HIANTZZ_LOG_ID}@g.us`
        : `${process.env.HIANTZZ_DEVELOPER_ID}@c.us`;

      await client
        .sendMessage(to, "Bot online!")
        .then(() => {})
        .catch((error) => {
          console.error("Client error: ", error);
        });
    }

    console.info("Client is ready!");
  });

  // Automatically reject incoming call
  client.on("call", (call) => {
    call.reject();
  });

  client.on("message", (message) => new MessageHandler(message, client));
})();
