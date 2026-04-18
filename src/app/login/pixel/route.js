import connectDB from '@/lib/mongodb'
import Deal from '@/models/Deal'
import Redemption from '@/models/Redemption'

// 1x1 transparent GIF pixel
const PIXEL = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64'
)

const pixelResponse = () => new Response(PIXEL, {
  headers: {
    'Content-Type': 'image/gif',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Access-Control-Allow-Origin': '*',
  }
})

// ─── GET — Image pixel (client puts on thank you page) ───────────────────────
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const dealId = searchParams.get('dealId')
    const event = searchParams.get('event') || 'purchase'
    const value = searchParams.get('value') || '0'
    const orderId = searchParams.get('orderId') || ''
    const coupon = searchParams.get('coupon') || ''

    if (!dealId) return pixelResponse()

    await connectDB()

    const deal = await Deal.findById(dealId)
    if (!deal) return pixelResponse()

    // Record the confirmed conversion
    await Redemption.create({
      dealId,
      couponCode: coupon || deal.couponCode,
      type: 'confirmed_purchase',
      orderValue: parseFloat(value) || 0,
      orderId,
      url: request.headers.get('referer') || '',
      userAgent: request.headers.get('user-agent') || '',
      createdAt: new Date(),
    })

    // Increment confirmed redemptions
    await Deal.findByIdAndUpdate(dealId, {
      $inc: { currentRedemptions: 1 }
    })

    return pixelResponse()
  } catch (error) {
    console.error('Pixel GET error:', error)
    return pixelResponse() // Always return pixel, never fail visibly
  }
}

// ─── POST — Server-to-server postback (more reliable) ───────────────────────
export async function POST(request) {
  try {
    const body = await request.json()
    const { dealId, event, value, orderId, coupon, clientSecret } = body

    if (!dealId) {
      return Response.json({ error: 'dealId required' }, { status: 400 })
    }

    await connectDB()

    const deal = await Deal.findById(dealId)
    if (!deal) {
      return Response.json({ error: 'Deal not found' }, { status: 404 })
    }

    // Record conversion
    await Redemption.create({
      dealId,
      couponCode: coupon || deal.couponCode,
      type: 'confirmed_purchase',
      orderValue: parseFloat(value) || 0,
      orderId: orderId || '',
      url: request.headers.get('referer') || '',
      userAgent: request.headers.get('user-agent') || '',
      createdAt: new Date(),
    })

    await Deal.findByIdAndUpdate(dealId, {
      $inc: { currentRedemptions: 1 }
    })

    return Response.json({
      success: true,
      message: 'Conversion recorded',
      dealId,
      event: event || 'purchase',
    })
  } catch (error) {
    console.error('Pixel POST error:', error)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}

// ─── OPTIONS — CORS preflight ────────────────────────────────────────────────
export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}