import { type Client, type Message } from "whatsapp-web.js";
import { userBanned } from "../database";

class BaseMessageHandler {
  public client: Client;
  public message: Message;

  public command: string;
  public text: string;

  constructor(message: Message, client: Client) {
    const rawMessage = message.body;
    const command = rawMessage.split("!")[0]?.trim() || "";
    const text = rawMessage.replace(`${command}!`, "").trim() || "";

    this.command = command.toLowerCase();
    this.text = text;

    this.client = client;
    this.message = message;

    // console.log({ message });

    this.sendSeen();
  }

  private async sendSeen() {
    const chat = await this.message.getChat();

    chat.sendSeen();
  }

  /**
   * Check if user has been banned or not
   * @returns {Promise<boolean>}
   */
  async isBanned(): Promise<boolean> {
    const user = await this.message.getContact();
    const isUserBanned = await userBanned.isBanned(user.number);

    return isUserBanned;
  }

  sendBannedMessage() {
    this.message.react("❌");
    this.message.reply(
      "Maaf, kamu dilarang menggunakan bot ini. Jika kamu ingin melepas larangan ini, silahkan kontak admin bot, Terima kasih."
    );
  }

  sendErrorMessage(error?: any) {
    if (error) {
      let message = error?.message || "Bot error";

      message.replace(/RsnChat|AxiosError:/gi, "");

      if (process.env.HIANTZZ_LOG_ID) {
        this.client.sendMessage(
          `${process.env.HIANTZZ_LOG_ID || ""}@g.us`,
          message.trim()
        );
      }
    }

    this.message.react("❌");
    this.message.reply(
      "Maaf, sepertinya ada yang error dengan fitur ini ૮(˶╥︿╥)ა"
    );
  }
}

export default BaseMessageHandler;
