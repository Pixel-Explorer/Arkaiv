import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ev: Number,
  storagePath: String,
}, { timestamps: true });

export default mongoose.model('Image', imageSchema);
