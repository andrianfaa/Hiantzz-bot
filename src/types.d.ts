declare module "rsnchat" {
  export default class RsnChat {
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
    private headers;
    private generatePayload;
    /**
     * **GPT4**
     * @param {string} prompt GPT4 Prompt
     */
    gpt(prompt: string): Promise<any>;
    /**
     * **OpenChat**
     * @param {string} prompt  OpenChat Prompt
     */
    openChat(prompt: string): Promise<any>;
    /**
     * **Google Bard AI**
     * @param {string} prompt  Bard AI Prompt
     */
    bard(prompt: string): Promise<any>;
    /**
     * **Gemini**
     * @param {string} prompt  Gemini Prompt
     */
    gemini(prompt: string): Promise<any>;
    /**
     * **LlaMa**
     * @param {string} prompt  LlaMa Prompt
     */
    llama(prompt: string): Promise<any>;
    /**
     * **Dall-E**
     * @param prompt Dall-E Prompt
     */
    dallE(prompt: string): Promise<any>;
  }
}
