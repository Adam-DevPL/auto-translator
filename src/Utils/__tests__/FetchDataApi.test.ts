import { assert } from "chai";
import { ApiReponse, FetchDataApi } from "../FetchDataApi";

describe("fetch api to retrive data", () => {
  it("successfully fetches data", async () => {
    //given
    const targetLanguage: string = "en";
    const text: string = "Testujemy fetch";
    const textToTranslate: string = `&q=${text}&target=${targetLanguage}`;
    const expectedTranslation: string = "We test the fetch";

    //when
    const response: ApiReponse = await FetchDataApi.postData(textToTranslate);
    const {
      data: {
        translations: [{ translatedText }],
      },
    } = response;

    //then
    assert.equal(translatedText, expectedTranslation);
  });

  it("failed to fetch data", async () => {
    //given
    const targetLanguage: string = "";
    const text: string = "Teścik";
    const textToTranslate: string = `&q=${text}&target=${targetLanguage}`;

    //given
    await FetchDataApi.postData(textToTranslate).catch((error) => {
      assert.equal(error.message, "Bad Request");
    });
  });
});
