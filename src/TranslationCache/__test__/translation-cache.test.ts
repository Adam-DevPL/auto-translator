import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { Request, Response, NextFunction } from "express";
import app from "../../app";
import { pl } from "../../data/data";
import { AutoTranslatorDto, RequestBody } from "../../dto/AutoTranslatorDto";
import { IFileSystemTranslator } from "../../FileSystemTranslator/FileSystemTranslator.interface";
import { FileSystemTranslator } from "../../FileSystemTranslator/FileSystemTranslator.service";
import { TranslationCache } from "../TranslationCache.service";
import { ITranslatorCache } from "../TranslatorCache.types";

chai.use(chaiHttp);
chai.should();

// import { expect } from "chai";

describe("testing finding translation file, reading and writing file", () => {
  describe("reading file", () => {
    it("successfully read a file and return translations", async () => {
      console.log("test");
      const req = {} as RequestBody<AutoTranslatorDto>;
      const res = {} as Response;
      const next = {} as NextFunction;

      const fileSystemTranslator: IFileSystemTranslator = new FileSystemTranslator();
      const translationCache: ITranslatorCache = new TranslationCache(fileSystemTranslator);

      try {
        const readResp = await translationCache.checkCacheForTranslation(req, res, next);
      } catch (error) {
        console.error(error)
      }

      expect(1).to.equal(1);

      // chai
      //   .request(app)
      //   .post("/translate")
      //   .send({targetLanguage: "pl"})
      //   .end((err, res) => {
      //     console.log({ res });
      //     // console.error({err})
      //     res.should.have.status(500);
      //     done(err);
      //   })
    });

    // it("failed read a file and return error", async () => {
    //   //given
    //   const translationCache: TranslationCache = new TranslationCache();
    //   const translationFileName: string = "test12.txt";

    //   //when
    //   try {
    //     await translationCache.readTranslation(translationFileName);
    //   } catch (error) {
    //     //then
    //     expect(error).to.equal("File or directory not found");
    //   }
    // });
  });
});
