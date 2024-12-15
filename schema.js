const joi = require("joi");

module.exports = joi.object({
  listing: joi
    .object({
      title: joi.string().required(),
      description: joi.string().required(),
      price: joi.number().required().min(500),
      location: joi.string().required(),
      country: joi.string().required(),
      image: joi
        .object({
          filename: joi.string().optional(),
          url: joi.string().uri({ allowRelative: true }).allow("", null),
        })
        .optional(),
    })
    .required(),
});
