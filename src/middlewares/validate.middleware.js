const { errorResponse } = require('../utils/response.utils');

/**
 * Joi validation middleware factory
 * @param {Object} schema - Joi schema object
 * @param {string} source - 'body' | 'query' | 'params'
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((d) => ({
        field: d.path.join('.'),
        message: d.message,
      }));
      return errorResponse(res, 'Validation failed', 422, errors);
    }

    req[source] = value; // replace with sanitized value
    next();
  };
};

module.exports = validate;
