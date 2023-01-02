import { on } from "events";
import fs from "fs";
import path from "path";
import { text } from "stream/consumers";

export class TranslationCache {
  readonly pathToTranslations = path.join(__dirname, "../translations");
  readonly;

  public test() {
    console.log(this.pathToTranslations);
  }

  public async lookForTranslations(translationName: string): Promise<boolean> {
    return await new Promise(async (resolve, reject) => {
      const data = await fs.promises.readdir(this.pathToTranslations);
      if (data.find((t) => t === translationName)) {
        resolve(true);
      }
      resolve(false);
    });
  }

  public async readTranslation(translationName: string): Promise<string> {
    let outcomeTranslation: string = "";
    return await new Promise((resolve) => {
      fs.createReadStream(path.join(this.pathToTranslations, translationName))
        .on("data", (data) => {
          outcomeTranslation += data.toString();
        })
        .on("end", () => {
          resolve(outcomeTranslation);
        });
    });
  }

  public async writeTranslation(textToSave: string, savedTranslationName: string) {
    return await new Promise<boolean>((resolve, reject) => {
      const file = fs.createWriteStream(
        path.join(this.pathToTranslations, savedTranslationName)
      );
      file.write(textToSave);
      file.end();
      file.on("finish", () => {
        resolve(true);
      });
      file.on("error", reject);
    });
  }
}
