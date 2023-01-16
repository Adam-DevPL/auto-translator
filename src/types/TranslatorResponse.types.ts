export type TranslatorResponse =
  | {
      isError: true;
      errorMsg: string;
    }
  | {
      isError: false;
      targetLanguage: string;
      translation: string;
    };
