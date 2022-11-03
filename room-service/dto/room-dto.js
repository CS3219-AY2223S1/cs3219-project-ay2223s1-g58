const Joi = require("joi");
const { DIFFICULTY } = require("../const/constants");

exports.createRoomDto = Joi.object({
  roomId: Joi.string().required(),
  userId1: Joi.string().required(),
  userId2: Joi.string().required(),
  difficulty: Joi.string()
    .valid(...Object.values(DIFFICULTY))
    .error(new Error("Invalid/missing difficulty")),
  types: Joi.string()
});
