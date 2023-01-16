import express, { Application, Request, Response } from "express";
import { FileSystemTranslator } from "./FileSystemTranslator/FileSystemTranslator.service";
import { TranslationCache } from "./TranslationCache/TranslationCache.service";
import { Translator } from "./Translator/Translator.service";
import { Validator } from "./Validator/Validator.middleware";

const app: Application = express();

const PORT: number = 3000;

const fileSystem: FileSystemTranslator = new FileSystemTranslator();
const translatoionCache: TranslationCache = new TranslationCache(fileSystem);
const translator: Translator = new Translator(translatoionCache);

app.use(express.json());
app.use(Validator.validateInputData);
app.use(translatoionCache.checkCacheForTranslation);
app.use("/translate", translator.getTranslation);

app.listen(PORT, (): void => {
  console.log("SERVER IS UP ON PORT:", PORT);
});
