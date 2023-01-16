import { expect } from "chai";
import { TranslationCache } from "../TranslationCache.service";

describe("testing finding translation file, reading and writing file", () => {
  describe("testing finding file in path /translations", () => {
    it("should return true if file was found", async () => {
      //given
      const translationCache: TranslationCache = new TranslationCache();
      const translationFileName: string = "test.txt";

      //when
      const isSuccess: boolean = await translationCache.lookForTranslations(
        translationFileName
      );

      //then
      expect(isSuccess).to.be.true;
    });

    it("should return false if file not found", async () => {
      //given
      const translationCache: TranslationCache = new TranslationCache();
      const translationFileName: string = "bad-test.txt";
      const translationFileNameEmpty: string = "";
      const translationFileNameNull: string = null;

      //when
      const isSuccessNotFound: boolean =
        await translationCache.lookForTranslations(translationFileName);
      const isSuccessEmptyName: boolean =
        await translationCache.lookForTranslations(translationFileNameEmpty);
      const isSuccessNull: boolean = await translationCache.lookForTranslations(
        translationFileNameNull
      );

      //then
      expect(isSuccessNotFound).to.be.false;
      expect(isSuccessEmptyName).to.be.false;
      expect(isSuccessNull).to.be.false;
    });
  });

  describe("reading file", () => {
    it("successfully read a file and return translations", async () => {
      //given
      const translationCache: TranslationCache = new TranslationCache();
      const translationFileName: string = "test.txt";

      //when
      const translation: string = await translationCache.readTranslation(
        translationFileName
      );

      //then
      expect(translation).to.equal("Testowa translacja");
    });

    it("failed read a file and return error", async () => {
      //given
      const translationCache: TranslationCache = new TranslationCache();
      const translationFileName: string = "test12.txt";

      //when
      try {
        await translationCache.readTranslation(translationFileName);
      } catch (error) {
        //then
        expect(error).to.equal("File or directory not found");
      }
    });
  });

  describe("writing file", () => {
    it("successfully write a file with translation", async () => {
      //given
      const translationCache: TranslationCache = new TranslationCache();
      const fileName: string = "test-write.txt";
      const textToWrite: string = "testing writing file";

      //when
      await translationCache.writeTranslation(textToWrite, fileName);
      const redFile: string = await translationCache.readTranslation(fileName);

      //then
      expect(redFile).to.equal(textToWrite);
    });

    it("failed write a file with translation", async () => {
      //given
      const translationCache: TranslationCache = new TranslationCache();
      const fileName: string = "";
      const textToWrite: string = "testing writing file";

      //when
      try {
        await translationCache.writeTranslation(textToWrite, fileName);
      } catch (error) {
        //then
        expect(error).to.equal("Illegail operation on directory");
      }
    });
  });
});
