import { TranslationCache } from "../TranslationCache/TranslationCache";
import { TranslatorResponse } from "./types/Translator.types";

require("dotenv").config();

export class Translator {
  readonly GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  readonly cache: TranslationCache = new TranslationCache();

  getTranslation = async (
    text: string,
    targetLanguage: string
  ): Promise<TranslatorResponse> => {
    try {
      const detectedLanguage: string = await this.detectLanguage(text);
      const nameForTranslationName: string = `${text.length}${detectedLanguage}${targetLanguage}.txt`;
      const foundTranslation: boolean = await this.cache.lookForTranslations(
        nameForTranslationName
      );

      if (foundTranslation) {
        const translation: string = await this.cache.readTranslation(
          nameForTranslationName
        );
        return {
          targetLanguage,
          translation,
        };
      }

      const translation: string = await this.translate(
        text,
        detectedLanguage,
        targetLanguage
      );

      await this.cache.writeTranslation(translation, nameForTranslationName);

      return {
        targetLanguage,
        translation,
      };
    } catch (error) {
      console.log(error);
      return { targetLanguage, error };
    }
  };

  translate = async (
    text: string,
    sourceLanguage: string,
    targetLanguage: string
  ): Promise<string> => {
    try {
      const linkToFetch: string = `https://translation.googleapis.com/language/translate/v2?key=${this.GOOGLE_API_KEY}&source=${sourceLanguage}&target=${targetLanguage}&q=${text}`;

      const response = await fetch(linkToFetch, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
      });

      if (response.status === 400) {
        throw new Error("Something goes wrong... Can't translate the text");
      }

      const { data } = await response.json();

      return new Promise((res) => res(data.translations[0].translatedText));
    } catch (error) {
      throw new Error(error.message);
    }
  };

  detectLanguage = async (textToTranslate: string): Promise<string> => {
    try {
      const linkToFetch = `https://translation.googleapis.com/language/translate/v2/detect?key=${this.GOOGLE_API_KEY}&q=${textToTranslate}`;

      const response = await fetch(linkToFetch, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
      });

      const { data } = await response.json();

      if (
        data.detections.length > 1 ||
        data.detections[0][0].confidence < 0.9
      ) {
        throw new Error("Can't detect the language.");
      }

      return new Promise((resolve) => resolve(data.detections[0][0].language));
    } catch (error) {
      throw new Error(error);
    }
  };
}
