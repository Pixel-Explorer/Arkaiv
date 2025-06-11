import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  tokens: { type: Number, default: 0 },
  badges: { type: [String], default: [] },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
