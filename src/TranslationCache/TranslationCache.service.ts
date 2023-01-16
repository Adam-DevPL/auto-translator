import { Response, Request, NextFunction } from "express";
import hash from "object-hash";
import { FileSystemTranslator } from "../FileSystemTranslator/FileSystemTranslator.service";
import { AutoTranslatorDto, RequestBody } from "../dto/AutoTranslatorDto";
import { TranslatorResponse } from "../types/TranslatorResponse.types";

export class TranslationCache {
  private readonly fileSystem: FileSystemTranslator;

  constructor(fileSystem: FileSystemTranslator) {
    this.fileSystem = fileSystem;
  }

  public checkCacheForTranslation = async (
    request: RequestBody<AutoTranslatorDto>,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const targetLanguage: string = request.body.targetLanguage;
      const fileName: string = `${hash(request.body)}.json`;
      const isFileFound: boolean = await this.lookForTranslations(fileName);

      if (!isFileFound) {
        next();
      } else {
        const translation: string = await this.readTranslation(fileName);
        const cacheResponse: TranslatorResponse = {
          isError: false,
          targetLanguage,
          translation: JSON.parse(translation),
        };
        response.status(200).send(cacheResponse);
      }
    } catch (error) {
      const cacheResponse: TranslatorResponse = {
        isError: true,
        errorMsg: error.message,
      };
      response.status(404).send(cacheResponse);
    }
  };

  private lookForTranslations = async (
    translationName: string
  ): Promise<boolean> => {
    try {
      return await this.fileSystem.findFile(translationName);
    } catch (error) {
      throw new Error("Something goes wrong with looking for file");
    }
  };

  private readTranslation = async (
    translationName: string
  ): Promise<string> => {
    try {
      return await this.fileSystem.readFile(translationName);
    } catch (error) {
      throw new Error("Something goes wrong with reading the file");
    }
  };

  public writeTranslation = async (
    textToSave: string,
    savedTranslationName: string
  ): Promise<void> => {
    try {
      this.fileSystem.writeFile(savedTranslationName, textToSave);
    } catch (error) {
      throw new Error("Something goes wrong with saving the file");
    }
  };
}
