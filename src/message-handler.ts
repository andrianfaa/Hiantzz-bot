import RsnChat from "rsnchat";
import { type Client, type Message } from "whatsapp-web.js";
import { Database } from "./database";
import { WhatsAppSticker } from "./features";
import { templateLoader } from "./utils";

const admin = "6285710245114";
const { db } = Database;

function sendError(message: Message) {
  message.react("❌");
  message.reply("Maaf, sepertinya ada yang error dengan fitur ini ૮(˶╥︿╥)ა");
}

function sendBannedMessage(message: Message) {
  message.react("❌");
  message.reply(
    "Maaf, kamu dilarang menggunakan bot ini. Jika kamu ingin melepas larangan ini, silahkan kontak admin bot, Terima kasih."
  );
}

class MessageHandler {
  message: Message;
  client: Client;

  command: string;
  text: string;

  rsnchat: RsnChat;

  /**
   * MessageHandler
   *
   * @param {Message} message Incoming message
   * @param {Client} client WhatsApp Web Client
   */
  constructor(message: Message, client: Client) {
    const rawMessage = message.body;
    const command = rawMessage.split("!")[0]?.trim() || "";
    const text = rawMessage.replace(`${command}!`, "").trim() || "";

    this.rsnchat = new RsnChat(process.env.RSNCHAT_API_KEY || "");

    this.message = message;
    this.client = client;

    this.command = command.toLowerCase();
    this.text = text;

    this.switchCommand();
  }

  private switchCommand() {
    switch (this.command) {
      case "bot":
        this.message.reply("Hah?");
        break;

      case "menu":
        this.showMenu();
        break;

      case "sticker":
        this.createSticker();
        break;

      // AI
      case "chatgpt":
        this.askGPT();
        break;

      case "openchat":
        this.askOpenChat();
        break;

      case "gemini":
        this.askGemini();
        break;

      case "llama":
        this.askLlaMa();
        break;

      // Special
      case "ban":
        this.banUser();
        break;

      case "unban":
        this.unbanUser();
        break;

      default:
        break;
    }
  }

  /**
   * Check if user has been banned or not
   * @returns {Promise<boolean>}
   */
  private async isBanned(): Promise<boolean> {
    const user = await this.message.getContact();
    const db = Database.db;
    const isBannedUser = await db.ban.isBanned(user.number);

    return isBannedUser;
  }

  /**
   * Show available menu
   */
  private async showMenu() {
    const isUserBanned = await this.isBanned();

    if (isUserBanned) {
      sendBannedMessage(this.message);
      return;
    }

    try {
      const menu = await templateLoader("menu");

      this.message.reply(menu);
    } catch (error) {
      console.error(error);
      sendError(this.message);
    }
  }

  /**
   * Create WhatsApp Sticker
   */
  private async createSticker() {
    const isUserBanned = await this.isBanned();

    this.message.react("⏳");

    if (isUserBanned) {
      sendBannedMessage(this.message);
      return;
    }

    try {
      const media = await WhatsAppSticker.getMedia(this.message);
      // const user = await this.message.getContact();

      this.client.sendMessage(this.message.from, media, {
        sendMediaAsSticker: true,
        stickerAuthor: "Hiantzz!",
        stickerName: "Sticker!",
        // mentions: [user.id.user],
      });

      const chat: any = await this.message.getChat();

      if (chat.isGroup) {
        const participants = chat.groupMetadata?.participants || [];
        const bot = participants.find(
          ({ id }: any) => id.user === "6285880232033"
        );

        if (bot.isAdmin) {
          this.message.delete(true);
        }
      } else {
        this.message.react("✅");
      }
    } catch (error) {
      console.error(error);

      this.message.react("❌");
      this.message.reply("Sepertinya kamu lupa mengupload gambarnya🧐");
      this.client.sendMessage(
        this.message.from,
        "Silahkan upload gambar yang ingin kamu jadikan stiker, kemudian beri caption \n\n*sticker!*"
      );
    }
  }

  /**
   * ChatGPT
   */
  private async askGPT() {
    const isUserBanned = await this.isBanned();

    if (isUserBanned) {
      sendBannedMessage(this.message);
      return;
    }

    if (!this.text) {
      let tutorial = await templateLoader("ask-ai");

      this.message.react("❌");
      this.message.reply(tutorial.replace(/_COMMAND_/gi, "chatgpt!"));
      return;
    }

    this.message.react("⏳");

    try {
      const response = await this.rsnchat.gpt(this.text);

      this.message.react("✅");
      this.message.reply(response.message);
    } catch {
      sendError(this.message);
    }
  }

  /**
   * OpenChat
   */
  private async askOpenChat() {
    const isUserBanned = await this.isBanned();

    if (isUserBanned) {
      sendBannedMessage(this.message);
      return;
    }

    if (!this.text) {
      let tutorial = await templateLoader("ask-ai");

      this.message.react("❌");
      this.message.reply(tutorial.replace(/_COMMAND_/gi, "openchat!"));
      return;
    }

    this.message.react("⏳");

    try {
      const response = await this.rsnchat.openChat(this.text);

      this.message.react("✅");
      this.message.reply(response.message);
    } catch {
      sendError(this.message);
    }
  }

  /**
   * Gemini
   */
  private async askGemini() {
    const isUserBanned = await this.isBanned();

    if (isUserBanned) {
      sendBannedMessage(this.message);
      return;
    }

    if (!this.text) {
      let tutorial = await templateLoader("ask-ai");

      this.message.react("❌");
      this.message.reply(tutorial.replace(/_COMMAND_/gi, "openchat!"));
      return;
    }

    this.message.react("⏳");

    try {
      const response = await this.rsnchat.gemini(this.text);

      this.message.react("✅");
      this.message.reply(response.message);
    } catch {
      sendError(this.message);
    }
  }

  /**
   * LlaMa
   */
  private async askLlaMa() {
    const isUserBanned = await this.isBanned();

    if (isUserBanned) {
      sendBannedMessage(this.message);
      return;
    }

    if (!this.text) {
      let tutorial = await templateLoader("ask-ai");

      this.message.react("❌");
      this.message.reply(tutorial.replace(/_COMMAND_/gi, "openchat!"));
      return;
    }

    this.message.react("⏳");

    try {
      const response = await this.rsnchat.llama(this.text);

      this.message.react("✅");
      this.message.reply(response.message);
    } catch {
      sendError(this.message);
    }
  }

  /**
   * Ban user
   */
  private async banUser() {
    this.message.react("⏳");

    const userContact = await this.message.getContact();
    const isAdmin = admin === userContact.number;

    if (!isAdmin) {
      this.message.react("❌");
      this.message.reply("Fitur ini hanya digunakan khusus untuk admin");
      return;
    }

    const { db } = Database;
    const mentionedUser = await this.message.getMentions();

    if (mentionedUser.length === 0 && this.message.hasQuotedMsg) {
      const quotedMessage = await this.message.getQuotedMessage();
      const contact = await quotedMessage.getContact();

      if (contact.isMe || contact.number === admin) {
        this.message.react("❌");
        this.message.reply("Bot atau developer tidak dapat di ban!");

        return;
      } else {
        const isBanned = await db.ban.isBanned(contact.number);
        // Ban user
        if (!isBanned) await db.ban.add(contact.number);
      }

      this.message.react("✅");
    } else if (mentionedUser.length > 0) {
      mentionedUser.forEach(async (user) => {
        if (user.isMe || user.number === admin) {
          this.message.react("❌");
          this.message.reply("Bot atau developer tidak dapat di ban!");

          return;
        } else {
          const isBanned = await db.ban.isBanned(user.number);
          // Ban user
          if (!isBanned) await db.ban.add(user.number);
        }
      });

      this.message.react("✅");
    } else {
      this.message.react("❌");
    }
  }

  /**
   * Unban user
   */
  private async unbanUser() {
    this.message.react("⏳");

    const userContact = await this.message.getContact();
    const isAdmin = admin === userContact.number;

    if (!isAdmin) {
      this.message.react("❌");
      this.message.reply("Fitur ini hanya digunakan khusus untuk admin");
      return;
    }

    const mentionedUser = await this.message.getMentions();

    if (mentionedUser.length === 0 && this.message.hasQuotedMsg) {
      const quotedMessage = await this.message.getQuotedMessage();
      const contact = await quotedMessage.getContact();

      if (contact.isMe || contact.number === admin) {
        this.message.react("❌");
        this.message.reply("Bot atau developer tidak dapat di unban!");
      } else {
        const isBanned = await db.ban.isBanned(contact.number);

        if (isBanned) {
          // Unban user
          await db.ban.remove(contact.number);

          this.message.react("✅");
        } else {
          console.log("user not banned");
        }
      }
    } else if (mentionedUser.length > 0) {
      mentionedUser.forEach(async (user) => {
        if (user.isMe || user.number === admin) {
          this.message.react("❌");
          this.message.reply("Bot atau developer tidak dapat di unban!");

          return;
        } else {
          const isBanned = await db.ban.isBanned(user.number);

          if (isBanned) {
            // Unban user
            await db.ban.remove(user.number);
          } else {
            console.log("user not banned");
          }
        }
      });

      this.message.react("✅");
    } else {
      this.message.react("❌");
    }
  }
}

export default MessageHandler;
