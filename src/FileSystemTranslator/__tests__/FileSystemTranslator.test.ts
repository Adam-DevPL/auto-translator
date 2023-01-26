import { assert, expect } from "chai";
import { IFileSystemTranslator } from "../FileSystemTranslator.interface";
import { FileSystemTranslator } from "../FileSystemTranslator.service";

describe("File system - reading and writing file", () => {
  describe("reading file", () => {
    it("successfully read a file", async () => {
      //given
      const fileSystem: IFileSystemTranslator = new FileSystemTranslator();
      const fileName: string = "testRead";
      const expectedResult = {
        test: "test",
      };

      //when
      const result = JSON.parse(await fileSystem.readFile(fileName));

      //then
      assert.deepEqual(result, expectedResult);
    });

    it("failed read a file", async () => {
      //given
      const fileSystem: IFileSystemTranslator = new FileSystemTranslator();
      const fileNameNotExisting: string = "";

      //then
      await fileSystem.readFile(fileNameNotExisting).catch((error) => {
        assert.equal(error.message, "Can't read the file!");
      });
    });
  });

  describe("writing file", () => {
    it("successfully writen file", async () => {
      //given
      const fileSystem: IFileSystemTranslator = new FileSystemTranslator();
      const fileName: string = "testWrite";
      const contentToWrite = {
        test: "Test of writing",
      };
      const expectResponse: string = "Successfully wrote all data";

      //when
      const response: string = await fileSystem.writeFile(
        fileName,
        JSON.stringify(contentToWrite)
      );
      const readFile = JSON.parse(await fileSystem.readFile(fileName));

      //then
      assert.equal(response, expectResponse);
      assert.deepEqual(readFile, contentToWrite);
    });

    it("failed to write file", async () => {
      //given
      const fileSystem: IFileSystemTranslator = new FileSystemTranslator();
      const expectErrorMsg: string = "Can't write a file";

      //then
      await fileSystem
        .writeFile("", "")
        .catch((error) => assert(error.message, expectErrorMsg));
    });
  });
});
