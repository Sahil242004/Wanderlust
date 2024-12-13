const joi = require("joi");

module.exports = joi.object({
  listing: joi
    .object({
      title: joi.string().required(),
      description: joi.string().required(),
      price: joi.number().required(),
      location: joi.string().required(),
      country: joi.string().required().min(500),
      image: joi.string().allow("", null),
    })
    .required(),
});
