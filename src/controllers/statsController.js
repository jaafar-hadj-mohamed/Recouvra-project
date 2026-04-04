import Invoice from '../models/Invoice.js'
import Client from '../models/Client.js'

export const getStats = async (req, res, next) => {
  try {
    const totalInvoices = await Invoice.countDocuments()
    const totalUnpaid = await Invoice.aggregate([ { $match: { status: 'unpaid' } }, { $group: { _id: null, total: { $sum: '$amount' } } } ])
    const totalUnpaidAmount = totalUnpaid[0]?.total || 0
    const totalPaid = await Invoice.aggregate([ { $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } } ])
    const totalCollectedAmount = totalPaid[0]?.total || 0
    const totalClients = await Client.countDocuments()
    res.json({ success: true, data: {
      totalInvoices,
      totalUnpaidAmount,
      totalCollectedAmount,
      totalClients
    }})
  } catch (e) {
    next(e)
  }
}

export default { getStats }
