require("dotenv").config();

interface FetchInit {
  method: string;
  headers?: HeadersInit;
}

export type ApiReponse = {
  data: {
    translations: translation[];
  };
};

type translation = {
  translatedText: string;
  detectedSourceLanguage: string;
};

export class FetchDataApi {
  private static readonly GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  private static readonly url = `https://translation.googleapis.com/language/translate/v2?key=${this.GOOGLE_API_KEY}`;

  private static async request(url: string): Promise<ApiReponse> {
    let init: FetchInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await fetch(url, init);
      if (res.status !== 200) {
        throw new Error(res.statusText);
      }
      return (await res.json()) as ApiReponse;
    } catch ({ message }) {
      throw new Error(message);
    }
  }

  static async postData(endpoint: string) {
    return this.request(`${this.url}${endpoint}`);
  }
}
