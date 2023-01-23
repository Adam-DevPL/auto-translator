import { Response } from "express";
import hash from "object-hash";
import {
  AutoTranslatorDto,
  RequestBody,
  ToTranslate,
} from "../dto/AutoTranslatorDto";
require("dotenv").config();

import {
  TranslatorResponse,
  TranslatorResponseError,
} from "./TranslatorResponse.types";
import { ApiReponse, FetchDataApi } from "../Utils/FetchDataApi";
import { DataOperation } from "../Utils/DataOperation";
import { IFileSystemTranslator } from "../FileSystemTranslator/FileSystemTranslator.interface";

export class Translator {
  private readonly fileSystemTranslator: IFileSystemTranslator;

  constructor(fileSystemTranslator: IFileSystemTranslator) {
    this.fileSystemTranslator = fileSystemTranslator;
  }

  public getTranslation = async (
    req: RequestBody<AutoTranslatorDto>,
    res: Response
  ) => {
    const cacheResponse: TranslatorResponse = res.locals.cacheResponse;
    try {
      if (cacheResponse) {
        return res.status(200).send(cacheResponse);
      }

      const { targetLanguage, toTranslate }: AutoTranslatorDto = {
        ...req.body,
      };

      const translation: ToTranslate = await DataOperation.updateObject(
        toTranslate,
        targetLanguage,
        this.translate
      );

      const translationToWrite: AutoTranslatorDto = {
        targetLanguage: req.body.targetLanguage,
        toTranslate: translation,
      };

      await this.fileSystemTranslator.writeFile(
        hash(req.body),
        JSON.stringify(translationToWrite)
      );

      const translatorResponse: TranslatorResponse = {
        status: 200,
        translation: {
          targetLanguage,
          toTranslate: translation,
        },
      };

      res.status(200).send(translatorResponse);
    } catch (error) {
      const translatorError: TranslatorResponseError = {
        status: 500,
        message: error.message,
      };
      res.status(500).send(translatorError);
    }
  };

  private translate = async (
    text: string,
    targetLanguage: string
  ): Promise<string> => {
    try {
      const endpoint: string = `&q=${text}&target=${targetLanguage}`;

      const response: ApiReponse = await FetchDataApi.postData(endpoint);

      if (response === undefined) {
        throw new Error("No data get from API!");
      }

      const {
        data: {
          translations: [{ translatedText }],
        },
      } = response;

      return translatedText;
    } catch (error) {
      throw new Error(error.message);
    }
  };
}
