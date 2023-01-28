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
        const { error } = await res.json();
        throw new Error(error.message);
      }
      return (await res.json()) as ApiReponse;
    } catch (error) {
      throw new Error(
        error.message === "Invalid Value"
          ? "Bad Request"
          : "Internal server error"
      );
    }
  }

  static async postData(endpoint: string) {
    return this.request(`${this.url}${endpoint}`);
  }
}
