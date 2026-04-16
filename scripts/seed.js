// scripts/seed.js
// Run with: node scripts/seed.js

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/prithviads'

// ─── Schemas (inline for seed script) ───────────────────────────────────────

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true },
  password: String,
  role: { type: String, enum: ['admin', 'client'], default: 'client' },
  companyName: String,
  phone: String,
  website: String,
  vertical: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date,
})

const DealSchema = new mongoose.Schema({
  clientId: mongoose.Schema.Types.ObjectId,
  clientName: String,
  brand: String,
  vertical: String,
  couponCode: String,
  discountType: String,
  discountValue: Number,
  targetUrl: String,
  description: String,
  applyOn: { type: String, default: 'checkout' },
  validFrom: Date,
  validTo: Date,
  maxRedemptions: { type: Number, default: 1000 },
  currentRedemptions: { type: Number, default: 0 },
  targetClicks: { type: Number, default: 5000 },
  currentClicks: { type: Number, default: 0 },
  status: { type: String, default: 'pending' },
  rejectionReason: String,
  approvedAt: Date,
  submittedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  minimumOrderValue: { type: Number, default: 0 },
  termsAndConditions: String,
  isAutoApply: { type: Boolean, default: true },
})

const User = mongoose.models.User || mongoose.model('User', UserSchema)
const Deal = mongoose.models.Deal || mongoose.model('Deal', DealSchema)

// ─── Seed Data ───────────────────────────────────────────────────────────────

const users = [
  {
    name: 'PrithviAds Admin',
    email: 'admin@prithviads.com',
    password: 'admin123',
    role: 'admin',
    companyName: 'PrithviAds',
    phone: '+91 98765 00001',
    website: 'prithviads.com',
  },
  {
    name: 'Rahul Sharma',
    email: 'client@makemytrip.com',
    password: 'client123',
    role: 'client',
    companyName: 'MakeMyTrip',
    phone: '+91 98765 43210',
    website: 'makemytrip.com',
    vertical: 'Travel',
  },
  {
    name: 'Priya Singh',
    email: 'client@unacademy.com',
    password: 'client123',
    role: 'client',
    companyName: 'Unacademy',
    phone: '+91 98765 43211',
    website: 'unacademy.com',
    vertical: 'Education',
  },
  {
    name: 'Amit Verma',
    email: 'client@myntra.com',
    password: 'client123',
    role: 'client',
    companyName: 'Myntra',
    phone: '+91 98765 43212',
    website: 'myntra.com',
    vertical: 'E-commerce',
  },
  {
    name: 'Sneha Patel',
    email: 'client@cars24.com',
    password: 'client123',
    role: 'client',
    companyName: 'Cars24',
    phone: '+91 98765 43213',
    website: 'cars24.com',
    vertical: 'Automobile',
  },
  {
    name: 'Vikram Nair',
    email: 'client@cleartrip.com',
    password: 'client123',
    role: 'client',
    companyName: 'Cleartrip',
    phone: '+91 98765 43214',
    website: 'cleartrip.com',
    vertical: 'Travel',
  },
]

async function seed() {
  console.log('🌱 Connecting to MongoDB...')
  await mongoose.connect(MONGODB_URI)
  console.log('✅ Connected!\n')

  // Clear existing data
  await User.deleteMany({})
  await Deal.deleteMany({})
  console.log('🗑️  Cleared existing data\n')

  // Create users
  const createdUsers = []
  for (const u of users) {
    const hashed = await bcrypt.hash(u.password, 12)
    const user = await User.create({ ...u, password: hashed })
    createdUsers.push(user)
    console.log(`👤 Created ${u.role}: ${u.email}`)
  }

  const clientMap = {}
  createdUsers.filter(u => u.role === 'client').forEach(u => {
    clientMap[u.companyName] = u
  })

  console.log('\n🏷️  Creating deals...')

  const deals = [
    {
      client: 'MakeMyTrip',
      data: {
        brand: 'MakeMyTrip',
        vertical: 'Travel',
        couponCode: 'MMT200',
        discountType: 'flat',
        discountValue: 200,
        targetUrl: 'makemytrip.com',
        description: 'Flat ₹200 off on domestic flight bookings above ₹3000',
        applyOn: 'checkout',
        validFrom: new Date('2025-03-01'),
        validTo: new Date('2025-12-31'),
        maxRedemptions: 5000,
        currentRedemptions: 1243,
        targetClicks: 10000,
        currentClicks: 3821,
        status: 'approved',
        minimumOrderValue: 3000,
        termsAndConditions: 'Valid on domestic flights only. Cannot be clubbed with other offers.',
        isAutoApply: true,
        approvedAt: new Date('2025-03-02'),
        submittedAt: new Date('2025-03-01'),
      },
    },
    {
      client: 'MakeMyTrip',
      data: {
        brand: 'MakeMyTrip',
        vertical: 'Travel',
        couponCode: 'MMTHOTEL15',
        discountType: 'percent',
        discountValue: 15,
        targetUrl: 'makemytrip.com',
        description: '15% off on hotel bookings above ₹5000',
        applyOn: 'checkout',
        validFrom: new Date('2025-04-01'),
        validTo: new Date('2025-09-30'),
        maxRedemptions: 2000,
        currentRedemptions: 345,
        targetClicks: 8000,
        currentClicks: 1200,
        status: 'approved',
        minimumOrderValue: 5000,
        isAutoApply: true,
        approvedAt: new Date('2025-04-02'),
        submittedAt: new Date('2025-04-01'),
      },
    },
    {
      client: 'Cleartrip',
      data: {
        brand: 'Cleartrip',
        vertical: 'Travel',
        couponCode: 'CT15INT',
        discountType: 'percent',
        discountValue: 15,
        targetUrl: 'cleartrip.com',
        description: '15% off on international hotel bookings',
        applyOn: 'checkout',
        validFrom: new Date('2025-05-01'),
        validTo: new Date('2025-08-31'),
        maxRedemptions: 3000,
        currentRedemptions: 0,
        targetClicks: 8000,
        currentClicks: 0,
        status: 'pending',
        isAutoApply: true,
        submittedAt: new Date('2025-04-14'),
      },
    },
    {
      client: 'Unacademy',
      data: {
        brand: 'Unacademy',
        vertical: 'Education',
        couponCode: 'UNA50',
        discountType: 'percent',
        discountValue: 50,
        targetUrl: 'unacademy.com',
        description: '50% off on all UPSC Foundation courses',
        applyOn: 'product',
        validFrom: new Date('2025-04-05'),
        validTo: new Date('2025-06-30'),
        maxRedemptions: 2000,
        currentRedemptions: 567,
        targetClicks: 5000,
        currentClicks: 1204,
        status: 'pending',
        isAutoApply: true,
        submittedAt: new Date('2025-04-02'),
      },
    },
    {
      client: 'Myntra',
      data: {
        brand: 'Myntra',
        vertical: 'E-commerce',
        couponCode: 'STYLE30',
        discountType: 'percent',
        discountValue: 30,
        targetUrl: 'myntra.com',
        description: '30% off on ethnic wear collection above ₹1000',
        applyOn: 'checkout',
        validFrom: new Date('2025-03-20'),
        validTo: new Date('2025-12-31'),
        maxRedemptions: 10000,
        currentRedemptions: 8921,
        targetClicks: 25000,
        currentClicks: 22100,
        status: 'approved',
        minimumOrderValue: 1000,
        isAutoApply: true,
        approvedAt: new Date('2025-03-21'),
        submittedAt: new Date('2025-03-20'),
      },
    },
    {
      client: 'Myntra',
      data: {
        brand: 'Myntra',
        vertical: 'E-commerce',
        couponCode: 'MNTRAFS',
        discountType: 'freeshipping',
        discountValue: 0,
        targetUrl: 'myntra.com',
        description: 'Free shipping on orders above ₹499',
        applyOn: 'cart',
        validFrom: new Date('2025-04-01'),
        validTo: new Date('2025-07-31'),
        maxRedemptions: 20000,
        currentRedemptions: 3400,
        targetClicks: 40000,
        currentClicks: 12000,
        status: 'approved',
        minimumOrderValue: 499,
        isAutoApply: true,
        approvedAt: new Date('2025-04-02'),
        submittedAt: new Date('2025-04-01'),
      },
    },
    {
      client: 'Cars24',
      data: {
        brand: 'Cars24',
        vertical: 'Automobile',
        couponCode: 'CAR5K',
        discountType: 'flat',
        discountValue: 5000,
        targetUrl: 'cars24.com',
        description: '₹5000 off on used car purchase above ₹3 Lakhs',
        applyOn: 'checkout',
        validFrom: new Date('2025-04-10'),
        validTo: new Date('2025-07-10'),
        maxRedemptions: 500,
        currentRedemptions: 12,
        targetClicks: 2000,
        currentClicks: 345,
        status: 'rejected',
        rejectionReason: 'Missing ROI targets. Please resubmit with conversion goals and brand verification documents.',
        minimumOrderValue: 300000,
        submittedAt: new Date('2025-04-08'),
      },
    },
  ]

  for (const { client, data } of deals) {
    const clientUser = clientMap[client]
    await Deal.create({
      ...data,
      clientId: clientUser._id,
      clientName: clientUser.companyName,
    })
    console.log(`  ✅ ${data.brand} — ${data.couponCode} (${data.status})`)
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('✨ Seed complete! You can now login with:\n')
  console.log('  🔑 ADMIN')
  console.log('     Email:    admin@prithviads.com')
  console.log('     Password: admin123\n')
  console.log('  🏢 CLIENT (any of these)')
  console.log('     Email:    client@makemytrip.com')
  console.log('     Email:    client@myntra.com')
  console.log('     Email:    client@unacademy.com')
  console.log('     Password: client123 (all clients)')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  await mongoose.disconnect()
  process.exit(0)
}

seed().catch(err => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
