import mongoose from 'mongoose';

const MONGO_URI = 'mongodb+srv://Amazon:Amazon@josephscluster.esvg4gs.mongodb.net/Amazon';

export async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI, {
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ DB connection error:', error.message);
    process.exit(1); // Stop the app if DB connection fails
  }
}
