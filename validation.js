const Joi = require("joi");

const validateRegister = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(6).required(),
    useremail: Joi.string().min(6).required().email(),
    userpassword: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

const validateLogin = (data) => {
  const schema = Joi.object({
    useremail: Joi.string().min(6).required().email(),
    userpassword: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

module.exports.validateRegister = validateRegister;

module.exports.validateLogin = validateLogin;
