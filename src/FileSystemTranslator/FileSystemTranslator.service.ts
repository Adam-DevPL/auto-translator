import fs from "fs";
import path from "path";
import { IFileSystemTranslator } from "./FileSystemTranslator.interface";

export class FileSystemTranslator implements IFileSystemTranslator {
  private readonly pathToTranslations = path.join(__dirname, "../translations");

  public readFile = async (fileName: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      let data = "";

      fs.createReadStream(
        path.join(this.pathToTranslations, `${fileName}.json`),
        "utf8"
      )
        .on("error", (error) => {
          reject(new Error("Can't read the file!"));
        })
        .on("data", (chunk) => (data += chunk))
        .on("end", () => resolve(data));
    });
  };

  public writeFile = async (
    fileName: string,
    textToSave: string
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(
        path.join(this.pathToTranslations, `${fileName}.json`)
      );
      writeStream.write(textToSave, "utf8");
      writeStream
        .on("error", (error) => {
          reject(new Error("Can't write a file"));
        })
        .on("finish", () => resolve("Successfully wrote all data"))
        .end();
    });
  };
}
