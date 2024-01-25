import qrcode from "qrcode-terminal";
import WAWebJS from "whatsapp-web.js";
import MessageHandler from "./src/message-handler";
import dotenv from "dotenv";

dotenv.config();

(() => {
  const client = new WAWebJS.Client({});

  client.initialize();

  client.on("qr", (qr) => {
    qrcode.generate(qr, {
      small: true,
    });
  });

  client.on("ready", () => {
    console.info("Client is Ready!");
  });

  // Automatically reject incoming call
  client.on("call", (call) => {
    call.reject();
  });

  client.on("message", (message) => new MessageHandler(message, client));
})();
