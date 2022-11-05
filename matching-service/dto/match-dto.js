const Joi = require("joi");
const { DIFFICULTY } = require("../const/constants");

exports.matchDto = Joi.object({
  difficulty: Joi.string()
    .valid(...Object.values(DIFFICULTY))
    .error(new Error("Invalid/missing difficulty"))
    .required(),
  type: Joi.string(),
});
