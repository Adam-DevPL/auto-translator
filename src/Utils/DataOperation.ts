export class DataOperation {
  
  public static getStringArray = (
    data: any,
    stringDivider: string
  ): string[] => {
    let stringArray: string[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (!this.isObject(value) && typeof value === "string") {
        stringArray.push(value.concat(stringDivider));
      } else if (this.isObject(value)) {
        const str: string[] = this.getStringArray(value, stringDivider);
        stringArray = stringArray.concat(str);
      }
    });
    return stringArray;
  };

  public static updateObject = <T>(objectToUpdate: T, str: string[]) => {
    return Object.fromEntries(
      Object.entries(objectToUpdate).map(([key, value], index) => {
        if (!this.isObject(value) && typeof value === "string") {
          if (value[0] === "/") {
            return [key, value];
          }
          return [key, str.shift()];
        } else if (this.isObject(value)) {
          const o = this.updateObject(value, str);
          return [key, o];
        }
      })
    );
  };

  private static isObject = (obj: unknown) => {
    return Object.prototype.toString.call(obj) === "[object Object]";
  };
}
