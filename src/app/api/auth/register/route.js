import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { hashPassword, generateToken } from '@/lib/auth'

export async function POST(request) {
  try {
    await connectDB()
    const body = await request.json()
    const { name, email, password, companyName, phone, website, vertical } = body

    if (!name || !email || !password || !companyName) {
      return Response.json({ error: 'Name, email, password and company name are required' }, { status: 400 })
    }

    if (password.length < 6) {
      return Response.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      return Response.json({ error: 'Email already registered' }, { status: 409 })
    }

    const hashed = await hashPassword(password)
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      role: 'client',
      companyName,
      phone,
      website,
      vertical,
    })

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      companyName: user.companyName,
    })

    return Response.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
        vertical: user.vertical,
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Register error:', error)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
