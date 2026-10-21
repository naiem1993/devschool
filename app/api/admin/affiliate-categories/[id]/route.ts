import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { updateAffiliateCategorySchema, validateBody } from '@/lib/validators'
import { requireAdmin, getAdminId } from '@/lib/auth'
import { verifyPinToken } from '@/lib/pin'
import { serverError } from '@/lib/api-error'

export const runtime = 'nodejs'

/** PUT /api/admin/affiliate-categories/[id] */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin(req)
  if (denied) return denied

  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const { data, error } = validateBody(updateAffiliateCategorySchema, body)
  if (error) return NextResponse.json({ error }, { status: 400 })

  try {
    const d = data!
    const updated = await prisma.affiliateCategory.update({
      where: { id },
      data: {
        ...(d.slug !== undefined && { slug: d.slug }),
        ...(d.nameBn !== undefined && { nameBn: d.nameBn }),
        ...(d.nameEn !== undefined && { nameEn: d.nameEn || null }),
        ...(d.icon !== undefined && { icon: d.icon || '📦' }),
        ...(d.description !== undefined && { description: d.description || null }),
        ...(d.sortOrder !== undefined && { sortOrder: d.sortOrder }),
        ...(d.isActive !== undefined && { isActive: d.isActive }),
      },
    })
    return NextResponse.json(updated)
  } catch (e: unknown) {
    return serverError(e, 'affiliate-categories-update')
  }
}

/** DELETE /api/admin/affiliate-categories/[id] — PIN-protected */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin(req)
  if (denied) return denied
  const adminId = await getAdminId(req)
  if (!adminId) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

  const pinToken = req.headers.get('x-pin-token') || undefined
  if (!(await verifyPinToken(pinToken, adminId))) {
    return NextResponse.json({ error: 'PIN_REQUIRED' }, { status: 403 })
  }

  const { id } = await params
  try {
    const cat = await prisma.affiliateCategory.findUnique({ where: { id }, select: { slug: true } })
    if (cat) {
      // এই slug ব্যবহার করা link আছে কিনা দেখি — থাকলে delete আটকাই
      const used = await prisma.affiliateLink.count({ where: { category: cat.slug } })
      if (used > 0) {
        return NextResponse.json(
          { error: `এই ক্যাটাগরিতে ${used}টি link আছে — আগে সেগুলো সরান বা অন্য ক্যাটাগরিতে নিন` },
          { status: 400 }
        )
      }
    }
    await prisma.affiliateCategory.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    return serverError(e, 'affiliate-categories-delete')
  }
}
