import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for this category.'],
    unique: true,
  },
  slug: {
    type: String,
    required: [true, 'Please provide a slug for this category.'],
    unique: true,
  },
  description: String,
  order: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
