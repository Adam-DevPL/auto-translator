import { Request, Response } from "express";
import hash from "object-hash";
import { AutoTranslatorDto, RequestBody } from "../dto/AutoTranslatorDto";
require("dotenv").config();

import { TranslationCache } from "../TranslationCache/TranslationCache.service";
import { TranslatorResponse } from "../types/TranslatorResponse.types";
import { FetchDataApi, FetchResp } from "../Utils/FetchDataApi";
import { DataOperation } from "../Utils/DataOperation";

export class Translator {
  private readonly translationCache: TranslationCache;
  private stringDivider: string = " /--/";

  constructor(translationCache: TranslationCache) {
    this.translationCache = translationCache;
  }

  public getTranslation = async (
    req: RequestBody<AutoTranslatorDto>,
    res: Response
  ) => {
    try {
      let response: AutoTranslatorDto = { ...req.body };
      const str = DataOperation.getStringArray(response, this.stringDivider);

      const translation: string = await this.translate(
        str,
        req.body.targetLanguage
      );

      const stringArrayWithoutDivider: string[] = translation
        .split(this.stringDivider.concat(","))
        .map((ele, index, array) => {
          if (index === array.length - 1) {
            return ele.replace(this.stringDivider, "");
          }
          return ele;
        });

      const afterTranslation = DataOperation.updateObject(
        response,
        stringArrayWithoutDivider
      );

      await this.translationCache.writeTranslation(
        JSON.stringify(afterTranslation),
        hash(req.body)
      );

      const translatorResponse: TranslatorResponse = {
        isError: false,
        targetLanguage: req.body.targetLanguage,
        translation: afterTranslation,
      };

      res.status(200).send(translatorResponse);
    } catch (error) {
      const errorResponse: TranslatorResponse = {
        isError: true,
        errorMsg: error.message,
      };
      res.status(404).send(errorResponse);
    }
  };

  public translate = async (
    text: string[],
    targetLanguage: string
  ): Promise<string> => {
    try {
      const endpoint: string = `&q=${text}&target=${targetLanguage}`;

      const response: FetchResp = await FetchDataApi.postData(endpoint);

      if (response.isSuccess === false) {
        throw new Error(response.errorMsg);
      }

      const {
        data: {
          translations: [{ translatedText }],
        },
      } = response.data;

      return translatedText;
    } catch (error) {
      throw new Error(error.message);
    }
  };
}
