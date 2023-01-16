require("dotenv").config();

interface FetchInit {
  method: string;
  headers?: HeadersInit;
}

export type FetchResp =
  | {
      isSuccess: true;
      data: any;
    }
  | {
      isSuccess: false;
      errorMsg: string;
    };

export class FetchDataApi {
  private static readonly GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  private static readonly url = `https://translation.googleapis.com/language/translate/v2?key=${this.GOOGLE_API_KEY}`;

  private static async request(url: string): Promise<FetchResp> {
    let errorMsg = "";
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
      const data = await res.json();
      return { isSuccess: true, data } as FetchResp;
    } catch ({ message }) {
      if (message === "unknown") {
        errorMsg = "";
      } else {
        errorMsg = `${message}`;
      }
      return { isSuccess: false, errorMsg } as FetchResp;
    }
  }

  static async postData(endpoint: string) {
    return this.request(`${this.url}${endpoint}`);
  }
}
