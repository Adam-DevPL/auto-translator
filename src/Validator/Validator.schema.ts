import Joi from "joi";

export const validatorSchema = Joi.object({
  targetLanguage: Joi.string().length(2).required(),
  toTranslate: Joi.object({
    attention: Joi.object({
      title: Joi.string().min(1).required(),
      subtitle: Joi.string().min(1).required(),
      ctaButton: Joi.string().min(1).required(),
    }).required(),
    newsletter: Joi.object({
      title: Joi.string().min(1).required(),
      ctaButton: Joi.string().min(1).required(),
      action: Joi.string().min(1).required(),
    }).required(),
  }).required(),
});
