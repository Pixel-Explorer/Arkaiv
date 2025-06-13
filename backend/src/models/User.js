import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    supabaseId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    name: { type: String },
    history: [
      {
        text: String,
        createdAt: { type: Date, default: Date.now },
        imageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
