import Payment from '../models/Payment.js'
import Invoice from '../models/Invoice.js'
import { successResponse, errorResponse } from '../utils/responseHandler.js'

export const createPayment = async (req, res, next) => {
  try {
    const { invoice: invoiceId, amount } = req.body
    const payment = await Payment.create(req.body)
    // Update invoice payments and status
    const invoice = await Invoice.findById(invoiceId).populate('payments')
    if (!invoice) return errorResponse(res, 'Invoice not found', null, 404)
    // add payment reference
    invoice.payments = [...invoice.payments.map(p => p._id), payment._id]
    // compute total paid
    const paidSoFar = await Payment.aggregate([
      { $match: { invoice: invoice._id } },
      { $group: { _id: '$invoice', total: { $sum: '$amount' } } }
    ])
    const totalPaid = paidSoFar[0]?.total || 0
    if (totalPaid >= invoice.amount) {
      invoice.status = 'paid'
    } else if (totalPaid > 0) {
      invoice.status = 'partial'
    } else {
      invoice.status = 'unpaid'
    }
    await invoice.save()
    return successResponse(res, payment, 'Payment recorded')
  } catch (e) {
    return next(e)
  }
}

export default { createPayment }
