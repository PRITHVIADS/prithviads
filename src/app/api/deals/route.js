import connectDB from '@/lib/mongodb'
import Deal from '@/models/Deal'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

export async function GET(request) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    const decoded = verifyToken(token)
    if (!decoded) return Response.json({ error: 'Invalid token' }, { status: 401 })

    await connectDB()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const vertical = searchParams.get('vertical')

    let query = {}

    if (decoded.role === 'client') {
      query.clientId = decoded.id
    }
    if (status && status !== 'all') query.status = status
    if (vertical && vertical !== 'all') query.vertical = vertical

    const deals = await Deal.find(query)
      .sort({ submittedAt: -1 })
      .populate('clientId', 'name email companyName')

    return Response.json({ deals })
  } catch (error) {
    console.error('GET deals error:', error)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    const decoded = verifyToken(token)
    if (!decoded) return Response.json({ error: 'Invalid token' }, { status: 401 })

    await connectDB()
    const body = await request.json()

    const {
      brand, vertical, couponCode, discountType, discountValue,
      targetUrl, description, applyOn, validFrom, validTo,
      maxRedemptions, targetClicks, minimumOrderValue, termsAndConditions, isAutoApply
    } = body

    if (!brand || !vertical || !couponCode || !discountType || !discountValue || !targetUrl || !validFrom || !validTo) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const deal = await Deal.create({
      clientId: decoded.id,
      clientName: decoded.companyName || decoded.name,
      brand,
      vertical,
      couponCode: couponCode.toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      targetUrl: targetUrl.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, ''),
      description,
      applyOn: applyOn || 'checkout',
      validFrom: new Date(validFrom),
      validTo: new Date(validTo),
      maxRedemptions: Number(maxRedemptions) || 1000,
      targetClicks: Number(targetClicks) || 5000,
      minimumOrderValue: Number(minimumOrderValue) || 0,
      termsAndConditions,
      isAutoApply: isAutoApply !== false,
      status: 'pending',
    })

    return Response.json({ deal }, { status: 201 })
  } catch (error) {
    console.error('POST deal error:', error)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
