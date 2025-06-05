import mongoose from 'mongoose';

const ledgerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  imageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
  tokens: Number,
}, { timestamps: true });

export default mongoose.model('TokenLedger', ledgerSchema);
