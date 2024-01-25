import RsnChat from "rsnchat";
import { MessageMedia, type Client, type Message } from "whatsapp-web.js";
import { prodiaModels } from "../constants";
import { templateLoader } from "../utils";
import DefaultMessageHandler from "./base-message-handler";

class AIMessageHandler extends DefaultMessageHandler {
  rsnchat: RsnChat;

  constructor(message: Message, client: Client) {
    super(message, client);

    this.rsnchat = new RsnChat(process.env.RSNCHAT_API_KEY || "");
  }

  /**
   * GPT4
   */
  async askGPT() {
    const isUserBanned = await this.isBanned();

    if (isUserBanned) {
      this.sendBannedMessage();
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
    } catch (error) {
      this.sendErrorMessage(error);
    }
  }

  /**
   * OpenChat
   */
  async askOpenChat() {
    const isUserBanned = await this.isBanned();

    if (isUserBanned) {
      this.sendBannedMessage();
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
      const response = await this.rsnchat.openchat(this.text);

      this.message.react("✅");
      this.message.reply(response.message);
    } catch (error) {
      this.sendErrorMessage(error);
    }
  }

  /**
   * Gemini
   */
  async askGemini() {
    const isUserBanned = await this.isBanned();

    if (isUserBanned) {
      this.sendBannedMessage();
      return;
    }

    if (!this.text) {
      let tutorial = await templateLoader("ask-ai");

      this.message.react("❌");
      this.message.reply(tutorial.replace(/_COMMAND_/gi, "gemini!"));
      return;
    }

    this.message.react("⏳");

    try {
      const response = await this.rsnchat.gemini(this.text);

      this.message.react("✅");
      this.message.reply(response.message);
    } catch (error) {
      this.sendErrorMessage(error);
    }
  }

  /**
   * LlaMa
   */
  async askLlaMa() {
    const isUserBanned = await this.isBanned();

    if (isUserBanned) {
      this.sendBannedMessage();
      return;
    }

    if (!this.text) {
      let tutorial = await templateLoader("ask-ai");

      this.message.react("❌");
      this.message.reply(tutorial.replace(/_COMMAND_/gi, "llama!"));
      return;
    }

    this.message.react("⏳");

    try {
      const response = await this.rsnchat.llama(this.text);

      this.message.react("✅");
      this.message.reply(response.message);
    } catch (error) {
      this.sendErrorMessage(error);
    }
  }

  /**
   * Google Bard AI
   */
  async askBard() {
    const isUserBanned = await this.isBanned();

    if (isUserBanned) {
      this.sendBannedMessage();
      return;
    }

    if (!this.text) {
      let tutorial = await templateLoader("ask-ai");

      this.message.react("❌");
      this.message.reply(tutorial.replace(/_COMMAND_/gi, "bard!"));
      return;
    }

    this.message.react("⏳");

    try {
      const response = await this.rsnchat.bard(this.text);

      this.message.react("✅");
      this.message.reply(response.message);
    } catch (error) {
      this.sendErrorMessage(error);
    }
  }

  /**
   * Prodia
   */
  async askProdia() {
    const isUserBanned = await this.isBanned();

    if (isUserBanned) {
      this.sendBannedMessage();
      return;
    }

    if (!this.text) {
      let tutorial = await templateLoader("ask-prodia");

      this.message.react("❌");
      this.message.reply(tutorial);
      return;
    }

    let [
      prompt = "",
      negativePrompt = "",
      model = "absolutereality_v181.safetensors [3d9d4d2b]",
    ] = this.text.split("|");

    if (!prompt || !negativePrompt) {
      this.message.react("❌");
      this.message.reply(
        "prompt dan negative prompt diperlukan! silahkan pisahkan dengan tanda *|*"
      );
      return;
    }

    if (
      !model ||
      prodiaModels.findIndex((models) => models === model.trim()) === -1
    ) {
      this.message.react("❌");
      this.message.reply(
        "Model tidak ditemukan! pastikan model yang kamu ketik sesuai dengan model yang ada."
      );
      return;
    }

    this.message.react("⏳");

    try {
      let response = await this.rsnchat.prodia(
        prompt.trim(),
        negativePrompt.trim(),
        model.trim()
      );

      const media = new MessageMedia(
        "image/png",
        response.base64?.replace(/data:image\/png;base64,/gi, "")
      );

      this.message.react("✅");
      this.message.reply(media, this.message.from, {
        caption: `*Prompt*: ${prompt.trim()}\n*Negative prompt*: ${negativePrompt.trim()}\n\n*Model*: ${model.trim()}`,
      });
    } catch (error) {
      this.sendErrorMessage(error);
    }
  }
}

export default AIMessageHandler;
