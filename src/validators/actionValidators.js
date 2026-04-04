import Joi from 'joi'

export const actionCreateSchema = Joi.object({
  client: Joi.string().required(),
  type: Joi.string().valid('call', 'email', 'visit').required(),
  note: Joi.string().optional(),
  date: Joi.date().optional(),
  agent: Joi.string().optional()
})
