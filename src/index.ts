import { pl } from "./data/data";
import { Translator } from "./Translator/Translator";

const translator = new Translator();
translator
  .translate(pl.attention.ctaButton, "en")
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
