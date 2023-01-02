import { on } from "events";
import fs from "fs";
import path from "path";
import { text } from "stream/consumers";

export class TranslationCache {
  readonly pathToTranslations = path.join(__dirname, "../translations");

  public async lookForTranslations(translationName: string): Promise<boolean> {
    return await new Promise(async (resolve, reject) => {
      const data: string[] = await fs.promises.readdir(this.pathToTranslations);
      if (data.find((t) => t === translationName)) {
        resolve(true);
      }
      resolve(false);
    });
  }

  public async readTranslation(translationName: string): Promise<string> {
    let outcomeTranslation: string = "";
    return await new Promise<string>((resolve) => {
      fs.createReadStream(path.join(this.pathToTranslations, translationName))
        .on("data", (data) => {
          outcomeTranslation += data.toString();
        })
        .on("end", () => {
          resolve(outcomeTranslation);
        });
    });
  }

  public async writeTranslation(
    textToSave: string,
    savedTranslationName: string
  ): Promise<string> {
    return await new Promise<string>((resolve, reject) => {
      const file: fs.WriteStream = fs.createWriteStream(
        path.join(this.pathToTranslations, savedTranslationName)
      );
      file.write(textToSave);
      file.end();
      file.on("finish", () => {
        resolve("Successfully saved translation");
      });
      file.on("error", reject);
    });
  }
}
