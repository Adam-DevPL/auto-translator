export interface IFileSystemTranslator {
  findFile: (fileName: string) => Promise<boolean>;
  readFile: (fileName: string) => Promise<string>;
  writeFile: (fileName: string, textToSave: string) => Promise<void>;
}