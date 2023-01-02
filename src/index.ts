import { TranslationCache } from "./Cache/Cache";
import { pl } from "./data/data";
import { Translator } from "./Translator/Translator";

const translator = new Translator();
// translator
//   .translate(pl.attention.ctaButton, "en")
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

const cache = new TranslationCache();
(async () => {
  const data: string = await translator.getTranslation(pl.attention.subtitle, "ro");
  console.log(data);
})();
