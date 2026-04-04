import mongoose from 'mongoose'

const InvoiceSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['unpaid', 'partial', 'paid'], default: 'unpaid' },
  payments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }]
}, { timestamps: true })

export default mongoose.model('Invoice', InvoiceSchema)
