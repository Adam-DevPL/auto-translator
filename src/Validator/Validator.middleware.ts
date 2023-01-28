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

    const validationError: TranslatorResponseError = {
      status: 400,
      message: "Bad request - invalid data",
    }
    next(validationError);
  };
}
