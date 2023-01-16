export interface ITranslatorCache {
  checkIfTranslationExist: (translationName: string) => boolean;
  readTranslation: (translationId: string) => string;
  writeTranslation: (translationId: string, text: string) => string;
}