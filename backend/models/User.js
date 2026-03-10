import mongoose, { Document, Schema } from 'mongoose';


const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, default: 'Admin' },
  resetToken: { type: String },
  resetTokenExpiry: { type: Number }
});


export default mongoose.model('User', userSchema);