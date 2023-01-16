import { Request } from "express";

export type RequestBody<T> = Request<{}, {}, T>;

export interface AutoTranslatorDto {
  targetLanguage: string;
  toTranslate: ToTranslate;
}

export type ToTranslate = {
  attention: Attention;
  newsletter: Newsletter;
};

export type Attention = {
  title: string;
  subtitle: string;
  ctaButton: string;
};

export type Newsletter = {
  title: string;
  ctaButton: string;
  action: string;
};
