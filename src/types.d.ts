declare module "rsnchat" {
  export default class RsnChat {
    /**
     * RsnChat API Key
     */
    apiKey: string;

    /**
     * **RsnChat**
     *
     * Discord : https://discord.gg/r5QWdKfQxr
     *
     * Join discord server and create account with /new slash command and get your apikey with /key slash command for free!
     *
     * @param {string} apiKey RsnChat API Key
     */
    constructor(apiKey: string);

    /**
     * **GPT4**
     *
     * @param {string} prompt GPT4 Prompt
     * @example
     * ```js
     * const RsnChat = require('rsnchat');
     *
     * const rsnchat = new RsnChat("chatgpt_××××××××××××××××××××××");
     *
     * rsnchat.gpt("Hello, what is your name?")
     *  .then(response => {
     *    console.log(response.message);
     *  });
     * ```
     */
    gpt(prompt: string): Promise<any>;

    /**
     * **OpenChat**
     *
     * @param {string} prompt  OpenChat Prompt
     * @example
     * ```js
     * const RsnChat = require('rsnchat');
     *
     * const rsnchat = new RsnChat("chatgpt_××××××××××××××××××××××");
     *
     * rsnchat.openchat("Hello, what is your name?")
     *  .then(response => {
     *    console.log(response.message);
     *  });
     * ```
     */
    openchat(prompt: string): Promise<any>;

    /**
     * **Google Bard AI**
     *
     * @param {string} prompt  Bard AI Prompt
     * @example
     * ```js
     * const RsnChat = require('rsnchat');
     *
     * const rsnchat = new RsnChat("chatgpt_××××××××××××××××××××××");
     *
     * rsnchat.bard("Hello, what is your name?")
     *  .then(response => {
     *    console.log(response.message);
     *  });
     * ```
     */
    bard(prompt: string): Promise<any>;

    /**
     * **Gemini**
     *
     * @param {string} prompt  Gemini Prompt
     * @example
     * ```js
     * const RsnChat = require('rsnchat');
     *
     * const rsnchat = new RsnChat("chatgpt_××××××××××××××××××××××");
     *
     * rsnchat.gemini("Hello, what is your name?")
     *  .then(response => {
     *    console.log(response.message);
     *  });
     * ```
     */
    gemini(prompt: string): Promise<any>;

    /**
     * **LlaMa**
     *
     * @param {string} prompt  LlaMa Prompt
     * @example
     * ```js
     * const RsnChat = require('rsnchat');
     *
     * const rsnchat = new RsnChat("chatgpt_××××××××××××××××××××××");
     *
     * rsnchat.llama("Hello, what is your name?")
     *  .then(response => {
     *    console.log(response.message);
     *  });
     * ```
     */
    llama(prompt: string): Promise<any>;

    /**
     * **Mixtral**
     *
     * @param {string} prompt  LlaMa Prompt
     * @example
     * ```js
     * const RsnChat = require('rsnchat');
     *
     * const rsnchat = new RsnChat("chatgpt_××××××××××××××××××××××");
     *
     * rsnchat.mixtral("Hello, what is your name?")
     *  .then(response => {
     *    console.log(response.message);
     *  });
     * ```
     */
    mixtral(prompt: string): Promise<any>;
    codellama(prompt: string): Promise<any>;
    prodia(
      prompt: string,
      negative_prompt: string,
      model: string
    ): Promise<any>;

    /**
     * **Kandinsky**
     *
     * @param {string} prompt  Kandinsky Prompt
     * @param {string} negative_prompt Kandinsky negative prompt
     * @example
     * ```js
     * const RsnChat = require('rsnchat');
     *
     * const rsnchat = new RsnChat('chatgpt_××××××××××××××××××××××');
     *
     * const prompt = "beautiful girl";
     * const negative_prompt = "blury, bad quality";
     *
     * rsnchat.kandinsky(prompt, negative_prompt)
     *  .then(response => {
     *    console.log(response);
     *  });
     * ```
     */
    kandinsky(prompt: string, negative_prompt: string): Promise<any>;

    /**
     * **AbsoluteBeauty**
     *
     * @param {string} prompt  AbsoluteBeauty Prompt
     * @param {string} negative_prompt AbsoluteBeauty negative prompt
     * @example
     * ```js
     * const RsnChat = require('rsnchat');
     *
     * const rsnchat = new RsnChat('chatgpt_××××××××××××××××××××××');
     *
     * const prompt = "beautiful girl";
     * const negative_prompt = "blury, bad quality";
     *
     * rsnchat.absolutebeauty(prompt, negative_prompt)
     *  .then(response => {
     *    console.log(response);
     *  });
     * ```
     */
    absolutebeauty(prompt: string, negative_prompt: string): Promise<any>;

    /**
     * **Sdxl**
     *
     * @param {string} prompt  Sdxl Prompt
     * @param {string} negative_prompt Sdxl negative prompt
     * @example
     * ```js
     * const RsnChat = require('rsnchat');
     *
     * const rsnchat = new RsnChat('chatgpt_××××××××××××××××××××××');
     *
     * const prompt = "beautiful girl";
     * const negative_prompt = "blury, bad quality";
     *
     * rsnchat.sdxl(prompt, negative_prompt)
     *  .then(response => {
     *    console.log(response);
     *  });
     * ```
     */
    sdxl(prompt: string, negative_prompt: string): Promise<any>;

    /**
     * **DALL-E**
     *
     * @param {string} prompt DALL-E prompt
     * @example
     * ```js
     * const RsnChat = require('rsnchat');
     *
     * const rsnchat = new RsnChat('chatgpt_××××××××××××××××××××××');
     *
     * const prompt = "beautiful girl";
     *
     * rsnchat.dalle(prompt)
     *  .then(response => {
     *    console.log(response);
     *  });
     * ```
     */
    dalle(prompt: string): Promise<any>;

    /**
     * **AI Icon**
     *
     * @param {string} prompt AI Icon prompt
     * @example
     * ```js
     * const RsnChat = require('rsnchat');
     *
     * const rsnchat = new RsnChat('chatgpt_××××××××××××××××××××××');
     *
     * const prompt = "beautiful girl";
     *
     * rsnchat.icon(prompt)
     *  .then(response => {
     *    console.log(response);
     *  });
     * ```
     */
    icon(prompt: string): Promise<any>;
  }
}
