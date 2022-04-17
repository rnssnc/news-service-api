import { Schema, model } from 'mongoose';

const wordSchema = new Schema({
  word: {
    type: String,
    required: true,
  },
  translation: {
    type: String,
    required: true,
  },
  imgSrc: {
    type: String,
    default:
      'https://res.cloudinary.com/dg2m1u3bf/image/upload/v1626185923/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953_d6lcu3.jpg',
  },
  audioSrc: {
    type: String,
  },
  category: {
    type: String,
    ref: 'Categories',
    required: true,
  },
});

export default model('Words', wordSchema);
