import { NextFunction, Response } from "express";
import { AutoTranslatorDto, RequestBody } from "../dto/AutoTranslatorDto";
import { TranslatorResponse } from "../Translator/TranslatorResponse.types";

export interface ITranslatorCache {
  checkCacheForTranslation: (
    request: RequestBody<AutoTranslatorDto>,
    response: Response,
    next: NextFunction
  ) => Promise<void>;
}

export type TranslatorCacheResponse = {
    statusCode: number;
    message: TranslatorResponse;
}
