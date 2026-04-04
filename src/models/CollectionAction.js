import mongoose from 'mongoose'

const ActionSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  type: { type: String, enum: ['call', 'email', 'visit'], required: true },
  note: { type: String },
  date: { type: Date, default: Date.now },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })

export default mongoose.model('CollectionAction', ActionSchema)
