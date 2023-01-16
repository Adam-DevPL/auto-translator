import { Request, Response, NextFunction } from "express";
import Joi from "joi";
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
      next();
    } else {
      const { details } = error;
      const message = details.map((i) => i.message).join(",");

      console.log("error", message);
      res.status(422).json({ error: message });
    }
  };
}
