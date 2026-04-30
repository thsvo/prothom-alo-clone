import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const image = formData.get('image');

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Convert file to base64 for imgbb
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');

    const imgbbFormData = new URLSearchParams();
    imgbbFormData.append('image', base64Image);

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
      imgbbFormData
    );

    return NextResponse.json({
      url: response.data.data.url,
      thumb: response.data.data.thumb.url,
      delete_url: response.data.data.delete_url
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
