import connectDB from '@/lib/mongodb'
import Deal from '@/models/Deal'
import Redemption from '@/models/Redemption'

// Public API used by the browser extension
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')

    if (!url) {
      return Response.json({ error: 'URL parameter required' }, { status: 400 })
    }

    await connectDB()

    // Normalize URL - strip protocol and www
    const normalized = url.toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .split('/')[0]
      .split('?')[0]

    const now = new Date()
    const deals = await Deal.find({
      targetUrl: { $regex: normalized, $options: 'i' },
      status: 'approved',
      validFrom: { $lte: now },
      validTo: { $gte: now },
      $expr: { $lt: ['$currentRedemptions', '$maxRedemptions'] }
    }).select('brand couponCode discountType discountValue description applyOn validTo isAutoApply vertical minimumOrderValue')
      .sort({ discountValue: -1 })
      .limit(5)

    return Response.json({ deals, url: normalized })
  } catch (error) {
    console.error('Extension GET error:', error)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}

// Track click/apply events from extension
export async function POST(request) {
  try {
    const body = await request.json()
    const { dealId, type, url, userAgent } = body

    if (!dealId || !type) {
      return Response.json({ error: 'dealId and type required' }, { status: 400 })
    }

    await connectDB()

    const deal = await Deal.findById(dealId)
    if (!deal) return Response.json({ error: 'Deal not found' }, { status: 404 })

    // Record the event
    await Redemption.create({
      dealId,
      couponCode: deal.couponCode,
      url,
      userAgent,
      type,
    })

    // Update counters
    if (type === 'click') {
      await Deal.findByIdAndUpdate(dealId, { $inc: { currentClicks: 1 } })
    } else if (type === 'redemption') {
      await Deal.findByIdAndUpdate(dealId, { $inc: { currentRedemptions: 1 } })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('Extension POST error:', error)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
