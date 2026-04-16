import mongoose from 'mongoose'

const DealSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  clientName: { type: String, required: true },
  brand: { type: String, required: true, trim: true },
  vertical: { type: String, required: true, enum: ['Travel', 'Education', 'E-commerce', 'Automobile'] },
  couponCode: { type: String, required: true, trim: true, uppercase: true },
  discountType: { type: String, required: true, enum: ['percent', 'flat', 'freeshipping'] },
  discountValue: { type: Number, required: true, min: 0 },
  targetUrl: { type: String, required: true, trim: true, lowercase: true },
  description: { type: String, trim: true },
  applyOn: { type: String, enum: ['checkout', 'cart', 'product', 'homepage'], default: 'checkout' },
  validFrom: { type: Date, required: true },
  validTo: { type: Date, required: true },
  maxRedemptions: { type: Number, default: 1000 },
  currentRedemptions: { type: Number, default: 0 },
  targetClicks: { type: Number, default: 5000 },
  currentClicks: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'paused', 'expired'], default: 'pending' },
  rejectionReason: { type: String },
  approvedAt: { type: Date },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  submittedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  minimumOrderValue: { type: Number, default: 0 },
  termsAndConditions: { type: String },
  isAutoApply: { type: Boolean, default: true },
})

DealSchema.pre('save', function (next) {
  this.updatedAt = new Date()
  next()
})

DealSchema.index({ targetUrl: 1, status: 1 })
DealSchema.index({ clientId: 1 })
DealSchema.index({ status: 1 })
DealSchema.index({ vertical: 1 })

export default mongoose.models.Deal || mongoose.model('Deal', DealSchema)
