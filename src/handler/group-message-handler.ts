import { type Message, type Client } from "whatsapp-web.js";
import BaseMessageHandler from "./base-message-handler";

class GroupMessageHandler extends BaseMessageHandler {
  constructor(message: Message, client: Client) {
    super(message, client);
  }

  async hiddenTag() {
    const isUserBanned = await this.isBanned();

    if (isUserBanned) {
      this.sendBannedMessage();
      return;
    }

    try {
      const chat: any = await this.message.getChat();
      const senderContact = await this.message.getContact();

      if (chat.isGroup) {
        const participants = chat.groupMetadata?.participants || [];
        const bot = participants.find(
          ({ id }: any) => id.user === (process.env.HIANTZZ_BOT_ID || "")
        );
        const sender = participants.find(
          ({ id }: any) => id.user === senderContact.number
        );

        if (sender.isAdmin) {
          this.client.sendMessage(this.message.from, this.text || "", {
            mentions: participants.map((user: any) => user.id._serialized),
          });

          if (bot.isAdmin) {
            this.message.delete(true);
          }
        } else {
          this.sendErrorMessage(
            "Maaf, fitur ini khusus untuk admin grup saja."
          );
        }
      } else {
        this.sendErrorMessage(
          "Hidden tag hanya dapat dilakukan didalam grup saja, dan pastikan untuk menjadikan Bot sebagai Admin"
        );
      }
    } catch (error) {
      this.sendErrorMessage(error);
    }
  }

  async deleteMessage() {
    const isUserBanned = await this.isBanned();

    if (isUserBanned) {
      this.sendBannedMessage();
      return;
    }

    try {
      const chat: any = await this.message.getChat();
      const senderContact = await this.message.getContact();

      if (chat.isGroup) {
        const participants = chat.groupMetadata?.participants || [];
        const bot = participants.find(
          ({ id }: any) => id.user === (process.env.HIANTZZ_BOT_ID || "")
        );
        const sender = participants.find(
          ({ id }: any) => id.user === senderContact.number
        );

        if (sender.isAdmin) {
          if (bot.isAdmin) {
            if (this.message.hasQuotedMsg) {
              const quotedMessage = await this.message.getQuotedMessage();

              quotedMessage.delete(true);
            }
          } else {
            this.message.reply(
              "Aku tidak dapat melakukan ini dikarenakan aku bukan Admin."
            );
          }
        } else {
          this.sendErrorMessage(
            "Maaf, fitur ini khusus untuk admin grup saja."
          );
        }
      } else {
        this.sendErrorMessage(
          "Menghapus pesan hanya dapat dilakukan didalam grup saja, dan pastikan untuk menjadikan Bot sebagai Admin"
        );
      }
    } catch (error) {
      this.sendErrorMessage(error);
    }
  }
}

export default GroupMessageHandler;
