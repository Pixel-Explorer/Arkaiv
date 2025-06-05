import mongoose from 'mongoose';

const hashtagSchema = new mongoose.Schema({
  tag: { type: String, unique: true },
  weight: Number,
}, { timestamps: true });

export default mongoose.model('Hashtag', hashtagSchema);
