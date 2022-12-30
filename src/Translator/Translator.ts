import { Translate } from "@google-cloud/translate/build/src/v2/index";
require('dotenv').config()


export class Translator {
  readonly CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
  readonly translateConfig: Translate = new Translate({
    credentials: this.CREDENTIALS,
    projectId: this.CREDENTIALS.projectId,
  });

  constructor() {
  }

  public async translate(
    text: string,
    targetLanguage: string
  ): Promise<string> {
    try {
      const [response] = await this.translateConfig.translate(
        text,
        targetLanguage
      );
      return response;
    } catch (error) {
      console.log(error);
      return "";
    }
  }
}
