import mongoose from 'mongoose'

declare global {
    var mongoose: { conn: any; promise: any } | undefined
}

if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable')
}

let cached = global.mongoose || { conn: null, promise: null }

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false
        }

        cached.promise = mongoose.connect(process.env.MONGODB_URI!, opts)
    }

    try {
        cached.conn = await cached.promise
        console.log('MongoDB connected successfully!')
        return cached.conn
    } catch (e) {
        cached.promise = null
        console.error('Error connecting to MongoDB:', e)
        throw e
    }
}

export default connectDB 