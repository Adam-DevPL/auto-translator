import { readdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { IFileSystemTranslator } from "./FileSystemTranslator.interface";

export class FileSystemTranslator implements IFileSystemTranslator {
  private readonly pathToTranslations = path.join(__dirname, "../translations");

  public findFile = async (fileName: string): Promise<boolean> => {
    const files: string[] = await readdir(this.pathToTranslations);
    return files.find((file) => file === fileName) ? true : false;
  };

  public readFile = (fileName: string): Promise<string> =>
    readFile(path.join(this.pathToTranslations, fileName), {
      encoding: "utf8",
    });

  public writeFile = (fileName: string, textToSave: string): Promise<void> =>
    writeFile(
      path.join(this.pathToTranslations, `${fileName}.json`),
      textToSave,
      { encoding: "utf8" }
    );
}
