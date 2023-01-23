import { Response, Request, NextFunction } from "express";
import hash from "object-hash";
import { FileSystemTranslator } from "../FileSystemTranslator/FileSystemTranslator.service";
import { AutoTranslatorDto, RequestBody } from "../dto/AutoTranslatorDto";
import { TranslatorResponse } from "../Translator/TranslatorResponse.types";
import { ITranslatorCache } from "./TranslatorCache.types";
import { IFileSystemTranslator } from "../FileSystemTranslator/FileSystemTranslator.interface";

export class TranslationCache implements ITranslatorCache {
  private readonly fileSystem: IFileSystemTranslator;

  constructor(fileSystem: IFileSystemTranslator) {
    this.fileSystem = fileSystem;
  }

  public checkCacheForTranslation = async (
    request: RequestBody<AutoTranslatorDto>,
    response: Response,
    next: NextFunction
  ) => {
    try {
      if (response.locals.validationError) {
        throw new Error(response.locals.validationError);
      }
      const fileName: string = `${hash(request.body)}.json`;

      const translation: string = await this.readTranslation(fileName);

      const cacheResponse: TranslatorResponse = {
        status: 200,
        translation: JSON.parse(translation),
      };
      response.locals.cacheResponse = cacheResponse;
    } catch (error) {
      console.error(error);
    }
    next();
  };

  private readTranslation = async (
    translationName: string
  ): Promise<string> => {
    try {
      return await this.fileSystem.readFile(translationName);
    } catch (error) {
      throw new Error(error);
    }
  };
}
