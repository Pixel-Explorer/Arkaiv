import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    supabaseId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    name: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
