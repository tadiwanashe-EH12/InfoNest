// middleware/validateRequest.js
const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    const validation = schema.validate(req.body, { abortEarly: false });
    if (validation.error) {
      const messages = validation.error.details.map(d => d.message);
      return res.status(400).json({ error: messages });
    }
    next();
  };
};

module.exports = validate;

const Joi = require('joi');
const validate = require('../middleware/validateRequest');

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

router.post('/login', validate(loginSchema), login);
