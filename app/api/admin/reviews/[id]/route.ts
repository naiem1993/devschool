import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { reviewModerationSchema, validateBody } from '@/lib/validators'
import { requireAdmin, getAdminId } from '@/lib/auth'
import { verifyPinToken } from '@/lib/pin'

/** Approve / unapprove — homepage-এ সাথে সাথে reflect করাতে revalidate। */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(req)
  if (denied) return denied

  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const { data, error } = validateBody(reviewModerationSchema, body)
  if (error || !data) return NextResponse.json({ error: error || 'Invalid data' }, { status: 400 })

  try {
    const review = await prisma.review.update({ where: { id }, data: { status: data.status } })
    revalidatePath('/')
    revalidatePath('/admin/reviews')
    return NextResponse.json(review)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

/** DELETE — PIN-protected, DB থেকে permanently মুছে যায়। */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(req)
  if (denied) return denied
  const adminId = await getAdminId(req)
  if (!adminId) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

  const token = req.headers.get('x-pin-token') || undefined
  if (!(await verifyPinToken(token, adminId))) {
    return NextResponse.json({ error: 'PIN_REQUIRED' }, { status: 403 })
  }

  const { id } = await params
  try {
    await prisma.review.delete({ where: { id } })
    revalidatePath('/')
    revalidatePath('/admin/reviews')
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
