import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { getUser } from '@/lib/api'

function generatePixelId() {
  return 'PV-' + Math.random().toString(36).slice(2, 8).toUpperCase()
}

export async function GET(request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })

    let user = await User.findById(userId)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    if (!user.pixelId) {
      user.pixelId = generatePixelId()
      await user.save()
    }

    return NextResponse.json({ pixelId: user.pixelId })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
