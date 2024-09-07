const Joi = require("joi");


const userValidation = Joi.object({
    role: Joi.string()
    .valid("admin", "manager", "user"),
    email: Joi.string().email().lowercase().required(),
    userName: Joi.string().required(),
    password: Joi.string().required().min(3).max(50),

})
const loginValidation = Joi.object({
    role: Joi.string()
    .valid("admin", "manager", "user"),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().required().min(3).max(50),

})


module.exports = {
    userValidation,
    loginValidation
}
