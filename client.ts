import dotenv from "dotenv";
import qrcode from "qrcode-terminal";
import WAWebJS, { LocalAuth } from "whatsapp-web.js";
import MessageHandler from "./src/message-handler";

dotenv.config();

(() => {
  const client = new WAWebJS.Client({
    puppeteer: {
      // headless: "chrome",
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: "/usr/bin/google-chrome",
    },
    authStrategy: new LocalAuth(),
  });

  client.initialize();

  client.on("qr", (qr) => {
    qrcode.generate(qr, {
      small: true,
    });
  });

  client.on("ready", () => {
    console.info("Client is Ready!");

    client.sendMessage(
      `${process.env.DEVELOPER_NUMBER || ""}@c.us`,
      "Bot ready!"
    );
  });

  // Automatically reject incoming call
  client.on("call", (call) => {
    call.reject();
  });

  client.on("message", (message) => new MessageHandler(message, client));
})();
