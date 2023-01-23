export class DataOperation {
  public static updateObject = async <T>(
    objectToUpdate: T,
    targetLanguage: string,
    callback: (text: string, targetLanguage: string) => Promise<string>
  ): Promise<T> => {
    const arr: unknown[] = Object.entries(objectToUpdate);
    return Object.fromEntries(
      await Promise.all(
        arr.map(async ([key, value]) => {
          if (!this.isObject(value) && typeof value === "string") {
            return [key, await callback(value, targetLanguage)];
          } else if (this.isObject(value)) {
            return [
              key,
              await this.updateObject(value, targetLanguage, callback),
            ];
          }
        })
      )
    );
  };

  private static isObject = (obj: unknown) => {
    return Object.prototype.toString.call(obj) === "[object Object]";
  };
}
