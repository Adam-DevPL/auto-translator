import { pl } from "./data/data";
import { Translator } from "./Translator/Translator";

const translator = new Translator();

(async () => {
  const data: string = await translator.getTranslation(pl.attention.subtitle, "ro");
  console.log(data);
})();
