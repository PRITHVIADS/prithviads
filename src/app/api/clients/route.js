import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Deal from '@/models/Deal'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

export async function GET(request) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    await connectDB()
    const clients = await User.find({ role: 'client' }).select('-password').sort({ createdAt: -1 })

    // Attach deal counts
    const clientsWithStats = await Promise.all(clients.map(async (client) => {
      const deals = await Deal.find({ clientId: client._id })
      return {
        ...client.toObject(),
        dealStats: {
          total: deals.length,
          pending: deals.filter(d => d.status === 'pending').length,
          approved: deals.filter(d => d.status === 'approved').length,
          rejected: deals.filter(d => d.status === 'rejected').length,
          totalClicks: deals.reduce((a, d) => a + d.currentClicks, 0),
          totalRedemptions: deals.reduce((a, d) => a + d.currentRedemptions, 0),
        }
      }
    }))

    return Response.json({ clients: clientsWithStats })
  } catch (error) {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}

// Toggle client active status
export async function PATCH(request) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    await connectDB()
    const { clientId, isActive } = await request.json()
    const client = await User.findByIdAndUpdate(clientId, { isActive }, { new: true }).select('-password')
    return Response.json({ client })
  } catch (error) {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
