import connectDB from '@/lib/mongodb'
import Deal from '@/models/Deal'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

export async function GET(request, { params }) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    const decoded = verifyToken(token)
    if (!decoded) return Response.json({ error: 'Invalid token' }, { status: 401 })

    await connectDB()
    const deal = await Deal.findById(params.id).populate('clientId', 'name email companyName')
    if (!deal) return Response.json({ error: 'Deal not found' }, { status: 404 })

    if (decoded.role === 'client' && deal.clientId._id.toString() !== decoded.id) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    return Response.json({ deal })
  } catch (error) {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(request, { params }) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    const decoded = verifyToken(token)
    if (!decoded) return Response.json({ error: 'Invalid token' }, { status: 401 })

    await connectDB()
    const body = await request.json()
    const deal = await Deal.findById(params.id)
    if (!deal) return Response.json({ error: 'Deal not found' }, { status: 404 })

    // Admin can update status; client can only edit their own pending deals
    if (decoded.role === 'admin') {
      const { status, rejectionReason } = body
      if (status) {
        deal.status = status
        if (status === 'approved') {
          deal.approvedAt = new Date()
          deal.approvedBy = decoded.id
        }
        if (status === 'rejected' && rejectionReason) {
          deal.rejectionReason = rejectionReason
        }
      }
      // Admin can also update other fields
      const allowedFields = ['brand', 'description', 'maxRedemptions', 'targetClicks']
      allowedFields.forEach(f => { if (body[f] !== undefined) deal[f] = body[f] })
    } else {
      // Client can only edit their own pending deals
      if (deal.clientId.toString() !== decoded.id) {
        return Response.json({ error: 'Forbidden' }, { status: 403 })
      }
      if (deal.status !== 'pending') {
        return Response.json({ error: 'Can only edit pending deals' }, { status: 400 })
      }
      const editableFields = ['brand', 'couponCode', 'discountType', 'discountValue', 'targetUrl',
        'description', 'applyOn', 'validFrom', 'validTo', 'maxRedemptions', 'targetClicks',
        'minimumOrderValue', 'termsAndConditions', 'isAutoApply']
      editableFields.forEach(f => { if (body[f] !== undefined) deal[f] = body[f] })
    }

    await deal.save()
    return Response.json({ deal })
  } catch (error) {
    console.error('PATCH deal error:', error)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    const decoded = verifyToken(token)
    if (!decoded) return Response.json({ error: 'Invalid token' }, { status: 401 })

    await connectDB()
    const deal = await Deal.findById(params.id)
    if (!deal) return Response.json({ error: 'Deal not found' }, { status: 404 })

    if (decoded.role !== 'admin' && deal.clientId.toString() !== decoded.id) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    await deal.deleteOne()
    return Response.json({ message: 'Deal deleted' })
  } catch (error) {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
