import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// নতুন কুইজ প্রশ্ন (অপশনসহ)
export async function POST(req: NextRequest) {
  try {
    const { tutorialId, questionBn, explanationBn, orderIndex, options } = await req.json()
    if (!tutorialId || !questionBn || !Array.isArray(options) || options.length < 2) {
      return NextResponse.json({ error: 'tutorialId, questionBn, এবং অন্তত ২টি option দরকার' }, { status: 400 })
    }
    if (!options.some((o: any) => o.isCorrect)) {
      return NextResponse.json({ error: 'অন্তত একটি সঠিক উত্তর সেট করুন' }, { status: 400 })
    }
    const q = await prisma.quizQuestion.create({
      data: {
        tutorialId,
        questionBn,
        explanationBn: explanationBn || null,
        orderIndex: orderIndex || 0,
        options: {
          create: options.map((o: any, i: number) => ({
            textBn: o.textBn,
            isCorrect: !!o.isCorrect,
            optionOrder: i,
          })),
        },
      },
      include: { options: true },
    })
    return NextResponse.json(q, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
