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

  readTranslation = async (translationName: string): Promise<string> =>
    fs.promises.readFile(path.join(this.pathToTranslations, translationName), {
      encoding: "utf8",
    });

  writeTranslation = async (
    textToSave: string,
    savedTranslationName: string
  ): Promise<void> =>
    fs.promises.writeFile(
      path.join(this.pathToTranslations, savedTranslationName),
      textToSave
    );
}
