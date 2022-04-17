import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  login: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export default model('Users', userSchema);
// const Category: Mongoose.Model<any> = Mongoose.model('Categories', modelSchema);

// export default Category;
