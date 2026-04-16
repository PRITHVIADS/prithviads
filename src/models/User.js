import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'client'], default: 'client' },
  companyName: { type: String, trim: true },
  phone: { type: String, trim: true },
  website: { type: String, trim: true },
  vertical: { type: String, enum: ['Travel', 'Education', 'E-commerce', 'Automobile', ''] },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
})

export default mongoose.models.User || mongoose.model('User', UserSchema)
