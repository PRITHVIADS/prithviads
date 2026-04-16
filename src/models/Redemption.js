import mongoose from 'mongoose'

const RedemptionSchema = new mongoose.Schema({
  dealId: { type: mongoose.Schema.Types.ObjectId, ref: 'Deal', required: true },
  couponCode: { type: String, required: true },
  url: { type: String },
  userAgent: { type: String },
  ipAddress: { type: String },
  type: { type: String, enum: ['click', 'apply', 'redemption'], default: 'click' },
  createdAt: { type: Date, default: Date.now },
})

RedemptionSchema.index({ dealId: 1 })
RedemptionSchema.index({ createdAt: -1 })

export default mongoose.models.Redemption || mongoose.model('Redemption', RedemptionSchema)
