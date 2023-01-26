import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { TranslatorResponse, TranslatorResponseError } from "../Translator/TranslatorResponse.types";
import { validatorSchema } from "./Validator.schema";

export class Validator {
  public static validateInputData = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { error } = validatorSchema.validate(req.body);
    const valid = error == null;

    if (valid) {
      return next();
    }
    const { details } = error;
    const message = details.map((i) => i.message).join(",");

    const validationError: TranslatorResponseError = {
      status: 400,
      message,
    }
    res.locals.validationError = validationError;
    next();
  };
}
