import mongoose from 'mongoose'

export const dbConnect = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/billingdb'
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
  await mongoose.connect(uri, options)
  console.log('Connected to MongoDB')
}
