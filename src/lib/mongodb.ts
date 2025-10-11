import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/heatexchanger'

let isConnected = false

export async function connectDB() {
  if (isConnected) {
    return true
  }

  try {
    await mongoose.connect(MONGODB_URI)
    isConnected = true
    console.log('MongoDB connected successfully')
    return true
  } catch (error) {
    console.error('MongoDB connection failed:', error)
    throw new Error('Database connection failed')
  }
}