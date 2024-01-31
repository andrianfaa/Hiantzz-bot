declare module "jarif-api" {
  function alldl(url: string): Promise<any>;
  function igvideo(url: string): Promise<any>;
}

declare module "simple-video-converter" {
  function single(config: any): (from: string, to: string) => void;
}
