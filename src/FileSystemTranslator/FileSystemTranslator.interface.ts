export interface IFileSystemTranslator {
  readFile: (fileName: string) => Promise<string>;
  writeFile: (fileName: string, textToSave: string) => Promise<string>;
}