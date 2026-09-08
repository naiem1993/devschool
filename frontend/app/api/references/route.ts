import { NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/references`)
    if (!response.ok) {
      return NextResponse.json(
        { error: `Backend error: ${response.statusText}` },
        { status: response.status }
      )
    }
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching references:', error)
    return NextResponse.json(
      { error: 'Failed to fetch references' },
      { status: 500 }
    )
  }
}
