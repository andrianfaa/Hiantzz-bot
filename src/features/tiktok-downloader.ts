import axios from "axios";

interface TikwmAPIResponse {
  code: number;
  msg: string;
  processed_time: number;
  data: {
    id: string;
    region: string;
    title: string;
    cover: string;
    origin_cover: string;
    duration: number;
    play: string;
    wmplay: string;
    size: number;
    wm_size: number;
    music: string;
    music_info: {
      id: string;
      title: string;
      play: string;
      cover: string;
      author: string;
      original: true;
      duration: number;
      album: string;
    };
    play_count: number;
    digg_count: number;
    comment_count: number;
    share_count: number;
    download_count: number;
    collect_count: number;
    create_time: number;
    anchors: any;
    anchors_extras: string;
    is_ad: boolean;
    commerce_info: {
      adv_promotable: boolean;
      auction_ad_invited: boolean;
      branded_content_type: number;
      with_comment_filter_words: boolean;
    };
    commercial_video_info: string;
    author: {
      id: string;
      unique_id: string;
      nickname: string;
      avatar: string;
    };
  };
}

interface TikTokDownloadReturnTypes {
  noWatermark: string;
  withWatermark: string;
  caption: string;
  music: TikwmAPIResponse["data"]["music_info"];
  author: TikwmAPIResponse["data"]["author"];
}

async function tiktokDownload(
  url: string
): Promise<TikTokDownloadReturnTypes | undefined> {
  try {
    const response = await axios.post<TikwmAPIResponse>(
      "https://www.tikwm.com/api",
      {},
      {
        params: {
          url,
        },
      }
    );

    if (response.status === 200) {
      const { data: tiktokData } = response.data;

      return {
        noWatermark: tiktokData.play,
        withWatermark: tiktokData.wmplay,
        music: tiktokData.music_info,
        author: tiktokData.author,
        caption: tiktokData.title,
      };
    }
  } catch (error) {
    throw error;
  }
}

export default tiktokDownload;
