import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this post.'],
  },
  slug: {
    type: String,
    required: [true, 'Please provide a slug for this post.'],
    unique: true,
  },
  content: {
    type: String,
    required: [true, 'Please provide content for this post.'],
  },
  excerpt: String,
  featuredImage: {
    type: String,
    default: '',
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please select a category.'],
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
  order: {
    type: Number,
    default: 99, // Lower is higher priority. 1 is for center news.
  },
  section: {
    type: String,
    enum: ['standard', 'top', 'sorbosesh', 'live'],
    default: 'standard',
  },
  author: {
    type: String,
    default: 'Admin',
  },
}, { timestamps: true });

export default mongoose.models.Post || mongoose.model('Post', PostSchema);
