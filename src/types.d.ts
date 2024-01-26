declare module "nayan-media-downloader" {
  type Response = {
    developer: string;
    devfb: string;
    devwp: string;
    status: boolean;
    msg?: string;
    data?: any;
  };

  function ndown(url: string): Promise<Response>;
}
