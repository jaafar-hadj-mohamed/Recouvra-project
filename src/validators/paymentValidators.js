import Joi from 'joi'

export const paymentCreateSchema = Joi.object({
  invoice: Joi.string().required(),
  amount: Joi.number().positive().required(),
  date: Joi.date().optional(),
  method: Joi.string().valid('cash', 'card', 'bank').optional()
})
