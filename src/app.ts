import express, { Application, Request, Response } from "express";
import { FileSystemTranslator } from "./FileSystemTranslator/FileSystemTranslator.service";
import { TranslationCache } from "./TranslationCache/TranslationCache.service";
import { Translator } from "./Translator/Translator.service";
import { Validator } from "./Validator/Validator.middleware";

class App {
  private app: Application;
  private PORT: number = Number(process.env.PORT);
  private fileSystem: FileSystemTranslator;
  private translatoionCache: TranslationCache;
  private translator: Translator;

  constructor() {
    this.app = express();
    this.loadConfig();
    this.loadDI();
    this.loadMiddlewares();
    this.loadRoutes();
    this.build();
  }

  private loadDI = (): void => {
    this.fileSystem = new FileSystemTranslator();
    this.translatoionCache = new TranslationCache(this.fileSystem);
    this.translator = new Translator(this.fileSystem);
  };

  private loadConfig = (): void => {
    this.app.use(express.json());
  };

  private loadMiddlewares = (): void => {
    this.app.use(Validator.validateInputData);
    this.app.use(this.translatoionCache.checkCacheForTranslation);
  };

  private loadRoutes = (): void => {
    this.app.use("/translate", this.translator.getTranslation);
  };

  private build = (): void => {
    this.app.listen(this.PORT, (): void => {
      console.log("SERVER IS UP ON PORT:", this.PORT);
    });
  };
}

export default new App();