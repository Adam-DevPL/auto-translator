import chai, { assert } from "chai";
import chaiHttp from "chai-http";
import { Hash } from "crypto";
import { Request, Response, NextFunction } from "express";
import { after } from "mocha";
import hash from "object-hash";

import app from "../../app";
import { FileSystemTranslator } from "../../FileSystemTranslator/FileSystemTranslator.service";

chai.use(chaiHttp);
chai.should();

describe("main module Translator", () => {
  after(() => {
    chai.request(app).close();
  });
  describe("validation error Bad Request", () => {
    it("it will return error status 400 and 'Bad request - invald data' message", async () => {
      //given
      const incopleteData = {
        targetLanguage: "en",
      };

      const fullDataWithIncorrectTargetLanguage = {
        targetLanguage: "xx",
        toTranslate: {
          attention: {
            title: "Dobrze, że jesteś, sprawdź to zadanie",
            subtitle: "Pomoże Ci ogarnąć jak zmieniać język w apkach reacta",
            ctaButton: "Dowiedź się więcej",
          },
          newsletter: {
            title: "Bądź na bieżąco",
            ctaButton: "Idź do repo ->",
            action: "/new-subscriber?lang=pl",
          },
        },
      };

      //then
      await chai
        .request(app)
        .post("/translate")
        .send(incopleteData)
        .then((res) => {
          res.should.have.status(400);
          res.body.should.have
            .property("message")
            .equal("Bad request - invalid data");
        });

      await chai
        .request(app)
        .post("/translate")
        .send(fullDataWithIncorrectTargetLanguage)
        .then((res) => {
          res.should.have.status(400);
          res.body.should.have.property("message").equal("Bad Request");
        });
    });
  });

  describe("translation", () => {
    it("sending data to translate there should be a file saved", async () => {
      //given
      const fileSystemTranslator = new FileSystemTranslator();
      const enterData = {
        targetLanguage: "en",
        toTranslate: {
          attention: {
            title: "Dobrze, że jesteś, sprawdź to zadanie",
            subtitle: "Pomoże Ci ogarnąć jak zmieniać język w apkach reacta",
            ctaButton: "Dowiedź się więcej",
          },
          newsletter: {
            title: "Bądź na bieżąco",
            ctaButton: "Idź do repo ->",
            action: "/new-subscriber?lang=pl",
          },
        },
      };
      const expectedNameFile: string = hash(enterData);

      //when
      await chai
        .request(app)
        .post("/translate")
        .send(enterData)
        .then(async (res) => {
          res.should.have.status(200);
          const { translation } = res.body;
          const expected = JSON.parse(
            await fileSystemTranslator.readFile(expectedNameFile)
          );
          assert.deepEqual(translation, expected);
        });
    });
  });
});
