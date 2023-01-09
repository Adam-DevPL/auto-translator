import { Router, Request, Response } from "express";
import { Translator } from "../Translator/Translator";
import { TranslatorResponse } from "../Translator/types/Translator.types";
import { ITranslator } from "./types/translator.types";

export const translatorRouter: Router = Router();

translatorRouter.post("/", async (req: Request, res: Response) => {
  const translator: Translator = new Translator();

  const parameters: ITranslator = req.body;

  const transtaltion: TranslatorResponse = await translator.getTranslation(
    parameters.text,
    parameters.lang
  );  

  res.send(transtaltion);
});
