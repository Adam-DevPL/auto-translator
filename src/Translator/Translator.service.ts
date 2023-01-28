import { NextFunction, Response } from "express";
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
import { IFileSystemTranslator } from "../FileSystemTranslator/FileSystemTranslator.interface";
import { CustomError } from "../Utils/errors";

export class Translator {
  private readonly fileSystemTranslator: IFileSystemTranslator;

  constructor(fileSystemTranslator: IFileSystemTranslator) {
    this.fileSystemTranslator = fileSystemTranslator;
  }

  public getTranslation = async (
    req: RequestBody<AutoTranslatorDto>,
    res: Response,
    next: NextFunction
  ) => {
    const cacheResponse: TranslatorResponse = res.locals.cacheResponse || null;
    try {
      if (cacheResponse) {
        return res.status(200).send(cacheResponse);
      }

      const { targetLanguage, toTranslate }: AutoTranslatorDto = {
        ...req.body,
      };

      const translation: ToTranslate = await this.updateObject(
        toTranslate,
        targetLanguage
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
        status: error.message === "Bad Request" ? 400 : 500,
        message: error.message,
      };
      next(translatorError);
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

  private updateObject = async <T>(
    objectToUpdate: T,
    targetLanguage: string
  ): Promise<T> => {
    const arr: unknown[] = Object.entries(objectToUpdate);
    return Object.fromEntries(
      await Promise.all(
        arr.map(async ([key, value]) => {
          if (!this.isObject(value) && typeof value === "string") {
            return [key, await this.translate(value, targetLanguage)];
          } else if (this.isObject(value)) {
            return [key, await this.updateObject(value, targetLanguage)];
          }
        })
      )
    );
  };

  private isObject = (obj: unknown) => {
    return Object.prototype.toString.call(obj) === "[object Object]";
  };
}
