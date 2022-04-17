import { Schema, model } from 'mongoose';

const modelSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  imgSrc: {
    type: String,
    default:
      'https://res.cloudinary.com/dg2m1u3bf/image/upload/v1626185923/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953_d6lcu3.jpg',
  },
});

export default model('Categories', modelSchema);
