// import jarifapi from "jarif-api";
import { randomBytes } from "crypto";
import ffmpeg from "fluent-ffmpeg";
import https from "https";
import { getReelInfo } from "insta-dl";
import fs from "node:fs";
import path from "node:path";
import { Client, MessageMedia, type Message } from "whatsapp-web.js";
import { TikTokDownload } from "../features";
import { templateLoader } from "../utils";
import BaseMessageHandler from "./base-message-handler";

const downloadPath = path.resolve(process.cwd(), "downloads");

class SocialMediaDownloaderMessageHandler extends BaseMessageHandler {
  constructor(message: Message, client: Client) {
    super(message, client);
  }

  /**
   * Instagram reels downloader
   */
  async reelsDownloader() {
    if (!this.text) {
      let tutorial = await templateLoader("social-media");

      this.message.react("❌");
      this.message.reply(
        tutorial
          .replace(/_COMMAND_/gi, "reels!")
          .replace(
            /_URL_/gi,
            "https://www.instagram.com/reel/CzLzuUuJf5V/?igsh=eThxd2x0N2Z0cGkx"
          )
      );
      return;
      // }
    } else if (!this.text.match("instagram.com/reel")) {
      const datalist = await getReelInfo(this.text);

      console.log({ datalist });

      this.message.react("❌");
      this.message.reply(
        "Maaf, fitur ini khusus untuk mendownload reels instagram saja."
      );
      return;
    }

    this.message.react("⏳");

    try {
      this.getInstagramContent(this.text);
    } catch (error) {
      this.sendErrorMessage(error);
    }
  }

  /**
   * TikTok downloader
   */
  async tiktokDownloader() {
    if (!this.text) {
      let tutorial = await templateLoader("social-media");

      this.message.react("❌");
      this.message.reply(
        tutorial
          .replace(/_COMMAND_/gi, "tiktok!")
          .replace(/_URL_/gi, "https://vt.tiktok.com/ZSFe6HKsm/")
      );
      return;
    } else if (!this.text.match("tiktok.com")) {
      this.message.react("❌");
      this.message.reply(
        "Maaf, fitur ini khusus untuk mendownload tiktok saja."
      );
      return;
    }

    this.message.react("⏳");

    try {
      await this.getTiktokContent(this.text);
    } catch (error) {
      this.sendErrorMessage(error);
    }
  }

  /**
   * Check downloads path
   */
  private checkDownloadPath() {
    if (!fs.existsSync(downloadPath)) {
      fs.mkdirSync(downloadPath);
    }
  }

  /**
   * *getInstagramContent*
   * @param {string} url instagram reels url
   */
  private async getInstagramContent(url: string) {
    try {
      // const responseUrl = await jarifapi.igvideo(url);
      // const downloadUrl =
      //   responseUrl.match(/https:\/\/(.*)"/gi)?.[0]?.replace(/"/gi, "") || "";
      const downloadUrl = await getReelInfo(url);

      if (downloadUrl) {
        this.checkDownloadPath();

        const name = `hiantzz.cloud-${randomBytes(8).toString("hex")}`,
          convertedName = `${name}-converted`;
        const file = fs.createWriteStream(
          path.resolve(downloadPath, `${name}.mp4`)
        );

        await Promise.all([
          https.get(downloadUrl, (response) => {
            response.pipe(file);
          }),
          file.on("finish", async () => {
            ffmpeg(file.path as string)
              // .videoCodec("libx264")
              .save(path.resolve(downloadPath, `${convertedName}.mp4`))
              .on("end", () => {
                fs.unlinkSync(file.path as string);

                const media = MessageMedia.fromFilePath(
                  path.resolve(downloadPath, `${convertedName}.mp4`)
                );

                this.message
                  .reply(media, this.message.from, {
                    sendMediaAsDocument: false,
                  })
                  .then(() => {
                    this.message.react("✅");
                  })
                  .finally(() => {
                    fs.unlinkSync(
                      path.resolve(downloadPath, `${convertedName}.mp4`)
                    );
                  });
              });
          }),
        ]);

        // https.get(downloadUrl, (response) => {
        //   response.pipe(file);

        //   file.on("finish", async () => {
        //     ffmpeg(file.path as string)
        //       // .videoCodec("libx264")
        //       .save(path.resolve(downloadPath, `${convertedName}.mp4`))
        //       .on("end", () => {
        //         fs.unlinkSync(file.path as string);

        //         const media = MessageMedia.fromFilePath(
        //           path.resolve(downloadPath, `${convertedName}.mp4`)
        //         );

        //         this.message
        //           .reply(media, this.message.from, {
        //             sendMediaAsDocument: false,
        //           })
        //           .then(() => {
        //             this.message.react("✅");
        //           })
        //           .finally(() => {
        //             fs.unlinkSync(
        //               path.resolve(downloadPath, `${convertedName}.mp4`)
        //             );
        //           });
        //       });
        //   });
        // });
      } else {
        this.sendErrorMessage();
      }
    } catch (error) {
      console.error("Reels Downloader Error: ", error);
    }
  }

  /**
   * *getTiktokContent*
   * @param {string} url TikTok video url
   */
  private async getTiktokContent(url: string) {
    try {
      const tiktok = await TikTokDownload(url);
      const media = await MessageMedia.fromUrl(tiktok?.noWatermark || "", {
        unsafeMime: true,
      });

      this.message
        .reply(media, this.message.from, {
          sendMediaAsDocument: false,
          caption: `${tiktok?.author.nickname}\n\n${tiktok?.caption}\n\n${tiktok?.music.title} - ${tiktok?.music.author}`,
        })
        .finally(() => {
          this.message.react("✅");
        });
    } catch (error) {
      console.error(error);
    }
  }
}

export default SocialMediaDownloaderMessageHandler;
