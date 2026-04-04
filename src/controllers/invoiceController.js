import Invoice from '../models/Invoice.js'
import { successResponse, errorResponse } from '../utils/responseHandler.js'

export const createInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.create(req.body)
    return successResponse(res, invoice, 'Invoice created')
  } catch (e) {
    return next(e)
  }
}

export const getInvoices = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query
    const filter = status ? { status } : {}
    const skip = (Number(page) - 1) * Number(limit)
    const invoices = await Invoice.find(filter).populate('client').skip(skip).limit(Number(limit))
    const total = await Invoice.countDocuments(filter)
    return successResponse(res, { total, page: Number(page), limit: Number(limit), data: invoices }, 'Invoices retrieved')
  } catch (e) {
    return next(e)
  }
}

export const updateInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!invoice) return errorResponse(res, 'Invoice not found', null, 404)
    return successResponse(res, invoice, 'Invoice updated')
  } catch (e) {
    return next(e)
  }
}

export default { createInvoice, getInvoices, updateInvoice }
