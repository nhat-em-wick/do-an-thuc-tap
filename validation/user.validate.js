// register validation
const Joi = require('@hapi/joi');
const { date } = require('@hapi/joi');

const registerValidation =  (data) => {
    const schema= Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().email().max(25).min(6).required(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(data);
}

const updateUserValidation =  (data) => {
    const schema= Joi.object({
        name: Joi.string().min(6).required(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(data);
}

const loginValidation =  (data) => {
    const schema= Joi.object({
        email: Joi.string().max(25).min(6).required(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.updateUserValidation = updateUserValidation;
