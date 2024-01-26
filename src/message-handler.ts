import { type Client, type Message } from "whatsapp-web.js";
import { userBanned } from "./database";
import { WhatsAppSticker } from "./features";
import { AIMessageHandler, BaseMessageHandler } from "./handler";
import SocialMediaDownloaderMessageHandler from "./handler/social-media-message-handler";
import { templateLoader } from "./utils";

class MessageHandler extends BaseMessageHandler {
  ai: AIMessageHandler;
  socialMediaDownloader: SocialMediaDownloaderMessageHandler;

  /**
   * MessageHandler
   *
   * @param {Message} message Incoming message
   * @param {Client} client WhatsApp Web Client
   */
  constructor(message: Message, client: Client) {
    super(message, client);

    this.ai = new AIMessageHandler(message, client);
    this.socialMediaDownloader = new SocialMediaDownloaderMessageHandler(
      message,
      client
    );

    this.switchCommand();
  }

  private switchCommand() {
    switch (this.command) {
      case "bot":
        return this.message.reply("Hah?");

      case "menu":
        return this.showMenu();

      case "sticker":
        return this.createSticker();

      // AI
      case "chatgpt":
        return this.ai.askGPT();

      case "bard":
        return this.ai.askBard();

      case "openchat":
        return this.ai.askOpenChat();

      case "gemini":
        return this.ai.askGemini();

      case "llama":
        return this.ai.askLlaMa();

      case "prodia":
        return this.ai.askProdia();

      // Social Media Downloader
      case "ig":
        return this.socialMediaDownloader.instagramDownloader();

      case "tiktok":
        return this.socialMediaDownloader.tiktokDownloader();

      // Special
      case "ban":
        return this.banUser();

      case "unban":
        return this.unbanUser();

      default:
        break;
    }
  }

  /**
   * Show available menu
   */
  private async showMenu() {
    const isUserBanned = await this.isBanned();

    if (isUserBanned) {
      this.sendBannedMessage();
      return;
    }

    try {
      const menu = await templateLoader("menu");

      this.message.reply(menu);
    } catch (error) {
      this.sendErrorMessage(error);
    }
  }

  /**
   * Create WhatsApp Sticker
   */
  private async createSticker() {
    const isUserBanned = await this.isBanned();

    if (isUserBanned) {
      this.sendBannedMessage();
      return;
    }

    this.message.react("⏳");

    try {
      const media = await WhatsAppSticker.getMedia(this.message);

      this.message
        .reply(media, undefined, {
          sendMediaAsSticker: true,
          stickerAuthor: "Hiantzz!",
          stickerName: "Sticker!",
        })
        .finally(async () => {
          const chat: any = await this.message.getChat();

          if (chat.isGroup) {
            const participants = chat.groupMetadata?.participants || [];
            const bot = participants.find(
              ({ id }: any) => id.user === (process.env.BOT_NUMBER || "")
            );

            if (bot.isAdmin) {
              this.message.delete(true);
            }
          } else {
            this.message.react("✅");
          }
        });
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
   * Ban user
   */
  private async banUser() {
    this.message.react("⏳");

    const userContact = await this.message.getContact();
    const isDeveloper =
      (process.env.DEVELOPER_NUMBER || "") === userContact.number;

    if (!isDeveloper) {
      this.message.react("❌");
      this.message.reply("Fitur ini hanya digunakan khusus untuk Developer");
      return;
    }

    const mentionedUser = await this.message.getMentions();

    if (mentionedUser.length === 0 && this.message.hasQuotedMsg) {
      const quotedMessage = await this.message.getQuotedMessage();
      const contact = await quotedMessage.getContact();

      if (
        contact.isMe ||
        contact.number === (process.env.DEVELOPER_NUMBER || "")
      ) {
        this.message.react("❌");
        this.message.reply("Bot atau Developer tidak dapat di ban!");

        return;
      } else {
        const isBanned = await userBanned.isBanned(contact.number);
        // Ban user
        if (!isBanned) await userBanned.ban(contact.number);
      }

      this.message.react("✅");
    } else if (mentionedUser.length > 0) {
      mentionedUser.forEach(async (user) => {
        if (user.isMe || user.number === (process.env.DEVELOPER_NUMBER || "")) {
          this.message.react("❌");
          this.message.reply("Bot atau Developer tidak dapat di ban!");

          return;
        } else {
          const isBanned = await userBanned.isBanned(user.number);
          // Ban user
          if (!isBanned) await userBanned.ban(user.number);
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
    const isDeveloper =
      (process.env.DEVELOPER_NUMBER || "") === userContact.number;

    if (!isDeveloper) {
      this.message.react("❌");
      this.message.reply("Fitur ini hanya digunakan khusus untuk Developer");
      return;
    }

    const mentionedUser = await this.message.getMentions();

    if (mentionedUser.length === 0 && this.message.hasQuotedMsg) {
      const quotedMessage = await this.message.getQuotedMessage();
      const contact = await quotedMessage.getContact();

      if (
        contact.isMe ||
        contact.number === (process.env.DEVELOPER_NUMBER || "")
      ) {
        this.message.react("❌");
        this.message.reply("Bot atau Developer tidak dapat di unban!");
      } else {
        const isBanned = await userBanned.isBanned(contact.number);

        if (isBanned) {
          // Unban user
          await userBanned.unban(contact.number);

          this.message.react("✅");
        } else {
          console.log("user not banned");
        }
      }
    } else if (mentionedUser.length > 0) {
      mentionedUser.forEach(async (user) => {
        if (user.isMe || user.number === (process.env.DEVELOPER_NUMBER || "")) {
          this.message.react("❌");
          this.message.reply("Bot atau Developer tidak dapat di unban!");

          return;
        } else {
          const isBanned = await userBanned.isBanned(user.number);

          if (isBanned) {
            // Unban user
            await userBanned.unban(user.number);
          } else {
            console.log("user is not banned");
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
