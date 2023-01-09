import fs from "fs";
import path from "path";

export class TranslationCache {
  readonly pathToTranslations = path.join(__dirname, "../translations");

  lookForTranslations = async (translationName: string): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
      const data: string[] = await fs.promises.readdir(this.pathToTranslations);
      if (data.find((t) => t === translationName)) {
        resolve(true);
      }
      resolve(false);
    });
  };

  readTranslation = async (translationName: string): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        const translation: string = await fs.promises.readFile(
          path.join(this.pathToTranslations, translationName),
          {
            encoding: "utf8",
          }
        );
        resolve(translation);
      } catch (error) {
        reject("File or directory not found");
      }
    });
  };

  writeTranslation = async (
    textToSave: string,
    savedTranslationName: string
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        fs.promises.writeFile(
          path.join(this.pathToTranslations, savedTranslationName),
          textToSave
        );
        resolve();
      } catch (error) {
        reject("Illegail operation on directory");
      }
    });
  };
}
