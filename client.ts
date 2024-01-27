import dotenv from "dotenv";
import qrcode from "qrcode-terminal";
import WAWebJS from "whatsapp-web.js";
import MessageHandler from "./src/message-handler";

dotenv.config();

(() => {
  const client = new WAWebJS.Client({
    puppeteer: {
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: "/usr/bin/google-chrome",
    },
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    authStrategy: new WAWebJS.LocalAuth(),
  });

  client.initialize();

  client.on("qr", (qr) => {
    qrcode.generate(qr, {
      small: true,
    });
  });

  client.on("ready", () => {
    console.info("\n\nClient is Ready!\n\n");
  });

  // Automatically reject incoming call
  client.on("call", (call) => {
    call.reject();
  });

  client.on("message", (message) => new MessageHandler(message, client));
})();
