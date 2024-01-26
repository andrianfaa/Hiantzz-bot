import axios from "axios";
import { randomUUID } from "crypto";
import * as Downloader from "nayan-media-downloader";
import fs from "node:fs";
import https from "node:https";
import path from "node:path";
import { Client, MessageMedia, type Message } from "whatsapp-web.js";
import BaseMessageHandler from "./base-message-handler";
import { templateLoader } from "../utils";

class SocialMediaDownloaderMessageHandler extends BaseMessageHandler {
  constructor(message: Message, client: Client) {
    super(message, client);
  }

  private async getInstagramContent(thumbnail: string, url: string) {
    try {
      const response = await axios.get(url);
      const downloadPath = path.resolve(process.cwd(), "downloads");
      const filename =
        (response.headers["content-disposition"] as string)?.match(
          /filename=(.*)/gi
        )?.[0] || "";
      const extension = path.extname(filename);

      if (!fs.existsSync(downloadPath)) {
        fs.mkdirSync(downloadPath);
      }

      if (extension !== ".mp4") {
        let tutorial = await templateLoader("social-media");

        this.message.react("❌");
        this.message.reply(
          tutorial
            .replace(/_COMMAND_/gi, "ig!")
            .replace(
              /_URL_/gi,
              "https://www.instagram.com/reel/CzLzuUuJf5V/?igsh=eThxd2x0N2Z0cGkx"
            )
        );
        return;
      }

      const newFileName = `hiantzz.cloud-${randomUUID() + extension}`;
      const file = fs.createWriteStream(
        path.resolve(downloadPath, newFileName)
      );

      https.get(url, (response) => {
        response.pipe(file);

        file.on("finish", async () => {
          const thumbnailAsMedia = await MessageMedia.fromUrl(thumbnail, {
            unsafeMime: true,
            filename: "thumnnail.png",
          });
          const media = MessageMedia.fromFilePath(file.path as string);

          this.message
            .reply(thumbnailAsMedia)
            .then((res) => {
              res.reply(media, undefined, {
                sendMediaAsDocument: true,
              });
            })
            .finally(() => {
              // delete downloaded file
              fs.unlinkSync(file.path);
              this.message.react("✅");
            });
        });
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async reelsDownloader() {
    if (!this.text) {
      let tutorial = await templateLoader("social-media");

      this.message.react("❌");
      this.message.reply(
        tutorial
          .replace(/_COMMAND_/gi, "ig!")
          .replace(
            /_URL_/gi,
            "https://www.instagram.com/reel/CzLzuUuJf5V/?igsh=eThxd2x0N2Z0cGkx"
          )
      );
      return;
    } else if (
      this.text.match("facebook.com") &&
      !this.text.match("instagram.com/reel/")
    ) {
      this.message.react("❌");
      this.message.reply(
        "Maaf, fitur ini khusus untuk mendownload konten instagram saja."
      );
      return;
    }

    this.message.react("⏳");

    try {
      const response = await Downloader.ndown(this.text);

      if (Array.isArray(response.data)) {
        const data = response.data;

        data.forEach(async ({ thumbnail, url }) => {
          this.getInstagramContent(thumbnail, url);
        });
        return;
      }

      this.sendErrorMessage();
    } catch (error) {
      this.sendErrorMessage(error);
    }
  }

  async tiktokDownloader() {
    this.message.react("✅");
    this.message.reply("Fitur ini sedang dalam pengembangan");
  }
}

export default SocialMediaDownloaderMessageHandler;
