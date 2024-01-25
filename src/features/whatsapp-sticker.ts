import { type Message } from "whatsapp-web.js";

class WhatsappSticker {
  /**
   * getMedia()
   *
   * @description functions to obtain media regarding messages sent or messages quoted
   * @param message
   */
  public static async getMedia(message: Message) {
    if (message.hasMedia) {
      const media = await message.downloadMedia();

      return media;
    } else if (message.hasQuotedMsg) {
      const quotedMessage = await message.getQuotedMessage();

      if (quotedMessage.hasMedia) {
        const media = await quotedMessage.downloadMedia();

        return media;
      } else {
        throw new Error("WhatsAppSticker error: Message has no media!");
      }
    } else {
      throw new Error("WhatsAppSticker error: Message has no media!");
    }
  }
}

export default WhatsappSticker;
