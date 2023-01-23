import { AutoTranslatorDto } from "../dto/AutoTranslatorDto";

export type TranslatorResponse = {
  status: number;
  translation: AutoTranslatorDto;
};

export type TranslatorResponseError = {
  status: number;
  message: string;
}
