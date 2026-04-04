import mongoose from 'mongoose'

const PaymentSchema = new mongoose.Schema({
  invoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  method: { type: String, enum: ['cash', 'card', 'bank'], default: 'cash' }
}, { timestamps: true })

export default mongoose.model('Payment', PaymentSchema)
