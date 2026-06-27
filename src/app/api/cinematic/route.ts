import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { videoUrl, parcelInfo, agentInfo, musicUrl, voiceoverUrl, duration } = body;

    const CREATOMATE_API_KEY = process.env.CREATOMATE_API_KEY;
    if (!CREATOMATE_API_KEY) {
      return NextResponse.json({ error: 'Creatomate API key eksik' }, { status: 500 });
    }

    const elements: unknown[] = [
      {
        type: 'video',
        source: videoUrl,
        time: 0,
        duration: duration,
        color_overlay: 'rgba(255, 160, 50, 0.15)',
      },
      {
        type: 'shape',
        shape: 'rectangle',
        fill_color: '#000000',
        x: '0%',
        y: '0%',
        width: '100%',
        height: '8%',
        time: 0,
        duration: duration,
      },
      {
        type: 'shape',
        shape: 'rectangle',
        fill_color: '#000000',
        x: '0%',
        y: '92%',
        width: '100%',
        height: '8%',
        time: 0,
        duration: duration,
      },
      {
        type: 'composition',
        time: 2,
        duration: duration - 3,
        x: '2%',
        y: '83%',
        width: '35%',
        animations: [
          { time: 'start', duration: 1, type: 'fade', easing: 'ease-in-out' },
          { time: 'end', duration: 1, type: 'fade', easing: 'ease-in-out', reversed: true },
        ],
        elements: [
          {
            type: 'shape',
            shape: 'rectangle',
            fill_color: 'rgba(0,0,0,0.55)',
            border_radius: 8,
            width: '100%',
            height: '100%',
          },
          {
            type: 'text',
            text: parcelInfo?.alan ? `${parcelInfo.alan} m²` : '',
            font_family: 'Montserrat',
            font_weight: '700',
            font_size: '22 vmin',
            fill_color: '#FFFFFF',
            x: '5%',
            y: '20%',
          },
          {
            type: 'text',
            text: parcelInfo?.ilAdi ? `${parcelInfo.ilAdi} / ${parcelInfo.ilceAdi}` : '',
            font_family: 'Montserrat',
            font_weight: '400',
            font_size: '12 vmin',
            fill_color: '#CCCCCC',
            x: '5%',
            y: '55%',
          },
          {
            type: 'text',
            text: agentInfo?.phone || '',
            font_family: 'Montserrat',
            font_weight: '400',
            font_size: '11 vmin',
            fill_color: '#AAAAAA',
            x: '5%',
            y: '75%',
          },
        ],
      },
    ];

    if (voiceoverUrl) {
      elements.push({
        type: 'audio',
        source: voiceoverUrl,
        time: 0,
        duration: duration,
        audio_fade_out: 1.5,
      });
    }

    if (musicUrl) {
      elements.push({
        type: 'audio',
        source: musicUrl,
        time: 0,
        duration: duration,
        volume: '25%',
        audio_fade_out: 2,
      });
    }

    const response = await fetch('https://api.creatomate.com/v1/renders', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CREATOMATE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: {
          output_format: 'mp4',
          width: 1920,
          height: 1080,
          duration: duration,
          elements,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Creatomate error:', data);
      return NextResponse.json({ error: 'Video üretim hatası', detail: data }, { status: 500 });
    }

    return NextResponse.json({
      renderId: data[0]?.id,
      status: data[0]?.status,
    });
  } catch (error) {
    console.error('Cinematic route error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
