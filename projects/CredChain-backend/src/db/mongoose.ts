import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/credchain'
  try {
    await mongoose.connect(mongoURI)
    console.log(`✅ MongoDB connected to ${mongoURI}`)
  } catch (err) {
    console.error('❌ MongoDB connection failed', err)
    process.exit(1)
  }
}