import connectDB from '@/lib/mongodb'
import Deal from '@/models/Deal'
import User from '@/models/User'
import Redemption from '@/models/Redemption'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

export async function GET(request) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    const decoded = verifyToken(token)
    if (!decoded) return Response.json({ error: 'Invalid token' }, { status: 401 })

    await connectDB()

    let dealQuery = {}
    if (decoded.role === 'client') {
      dealQuery.clientId = decoded.id
    }

    const [deals, totalClients, recentRedemptions] = await Promise.all([
      Deal.find(dealQuery),
      decoded.role === 'admin' ? User.countDocuments({ role: 'client' }) : 0,
      Redemption.find(
        decoded.role === 'admin' ? {} : { dealId: { $in: (await Deal.find({ clientId: decoded.id }).select('_id')).map(d => d._id) } }
      ).sort({ createdAt: -1 }).limit(20).populate('dealId', 'brand couponCode'),
    ])

    const stats = {
      totalDeals: deals.length,
      pendingDeals: deals.filter(d => d.status === 'pending').length,
      approvedDeals: deals.filter(d => d.status === 'approved').length,
      rejectedDeals: deals.filter(d => d.status === 'rejected').length,
      totalClicks: deals.reduce((a, d) => a + d.currentClicks, 0),
      totalRedemptions: deals.reduce((a, d) => a + d.currentRedemptions, 0),
      totalClients,
    }

    // Vertical breakdown
    const verticals = ['Travel', 'Education', 'E-commerce', 'Automobile']
    const verticalStats = verticals.map(v => {
      const vDeals = deals.filter(d => d.vertical === v)
      return {
        vertical: v,
        deals: vDeals.length,
        clicks: vDeals.reduce((a, d) => a + d.currentClicks, 0),
        redemptions: vDeals.reduce((a, d) => a + d.currentRedemptions, 0),
        approved: vDeals.filter(d => d.status === 'approved').length,
      }
    })

    // Top performing deals
    const topDeals = [...deals]
      .sort((a, b) => b.currentClicks - a.currentClicks)
      .slice(0, 5)
      .map(d => ({
        id: d._id,
        brand: d.brand,
        couponCode: d.couponCode,
        vertical: d.vertical,
        clicks: d.currentClicks,
        redemptions: d.currentRedemptions,
        status: d.status,
      }))

    return Response.json({ stats, verticalStats, topDeals, recentRedemptions })
  } catch (error) {
    console.error('Analytics error:', error)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
