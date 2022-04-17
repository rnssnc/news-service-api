import { Schema, model } from 'mongoose';

const modelSchema = new Schema({
  source: {
    id: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
  },
  author: {
    type: String,
    required: false,
  },
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: false,
  },
  urlToImage: {
    type: String,
    default:
      'https://res.cloudinary.com/dg2m1u3bf/image/upload/v1626185923/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953_d6lcu3.jpg',
  },
  publishedAt: {
    type: String,
    required: false,
  },
  url: {
    type: String,
  },
  category: {
    type: String,
    default: 'general',
  },
});

export default model('Articles', modelSchema);
