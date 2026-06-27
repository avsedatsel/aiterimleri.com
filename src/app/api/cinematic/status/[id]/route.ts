import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await fetch(`https://api.creatomate.com/v1/renders/${id}`, {
      headers: {
        Authorization: `Bearer ${process.env.CREATOMATE_API_KEY}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Render sorgulanamadı' }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json({
      status: data.status,
      url: data.url,
      error: data.error,
    });
  } catch (error) {
    console.error('Status route error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
