import { Translate } from "@google-cloud/translate/build/src/v2/index";
import { TranslationCache } from "../Cache/Cache";
require("dotenv").config();

export class Translator {
  readonly CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
  readonly translateConfig: Translate = new Translate({
    credentials: this.CREDENTIALS,
    projectId: this.CREDENTIALS.projectId,
  });
  readonly cache: TranslationCache = new TranslationCache();

  public async getTranslation(text: string, targetLanguage: string) {
    try {
      const detectedLanguage: string = await this.detectLanguage(text);
      const nameForTranslationName: string = `${text.length}${detectedLanguage}${targetLanguage}.txt`;
      const foundTranslation: boolean = await this.cache.lookForTranslations(
        nameForTranslationName
      );
      
      if (foundTranslation) {                
        return await this.cache.readTranslation(nameForTranslationName);;
      }

      console.log(foundTranslation);
      
      const translation: string = await this.translate(text, targetLanguage);
      await this.cache.writeTranslation(translation, nameForTranslationName);
      
      return "Successfully translate the text";
    } catch (error) {
      return error.message;
    }
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

  private async detectLanguage(textToTranslate: string) {
    try {
      const response = await this.translateConfig.detect(textToTranslate);
      return response[0].language;
    } catch (error) {
      throw new Error("Can't detect the language");
    }
  }
}
