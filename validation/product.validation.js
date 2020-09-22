const Joi = require('@hapi/joi');
const productValidation =  (data) => {
    const schema= Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required(),
        image: Joi.string().required()
    });
    return schema.validate(data);
}
module.exports.productValidation = productValidation;