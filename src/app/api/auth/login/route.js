import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { comparePassword, generateToken } from '@/lib/auth'

export async function POST(request) {
  try {
    await connectDB()
    const { email, password } = await request.json()

    if (!email || !password) {
      return Response.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const isValid = await comparePassword(password, user.password)
    if (!isValid) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    if (!user.isActive) {
      return Response.json({ error: 'Account is deactivated. Contact PADS support.' }, { status: 403 })
    }

    await User.findByIdAndUpdate(user._id, { lastLogin: new Date() })

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
    })
  } catch (error) {
    console.error('Login error:', error)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
