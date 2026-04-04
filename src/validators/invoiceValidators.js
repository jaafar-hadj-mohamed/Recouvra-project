import Joi from 'joi'

export const invoiceCreateSchema = Joi.object({
  client: Joi.string().required(),
  amount: Joi.number().positive().required(),
  dueDate: Joi.date().required(),
  status: Joi.string().valid('unpaid', 'partial', 'paid').default('unpaid')
})
