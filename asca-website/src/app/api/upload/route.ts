import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'Tidak ada file yang diunggah' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Bersihkan nama file dari spasi dan karakter aneh
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-]/g, '_');
    
    // Buat nama file unik
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = safeName.replace(/\.[^/.]+$/, "") + '-' + uniqueSuffix + '.' + safeName.split('.').pop();
    
    // Tentukan direktori upload
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    
    // Pastikan folder uploads ada
    if (!existsSync(uploadDir)){
        mkdirSync(uploadDir, { recursive: true });
    }
    
    const path = join(uploadDir, filename);
    await writeFile(path, buffer);

    // Kembalikan URL publik
    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Gagal mengunggah gambar' }, { status: 500 });
  }
}
