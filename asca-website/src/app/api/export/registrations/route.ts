import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import * as xlsx from 'xlsx';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const inst = searchParams.get('inst');

  if (!inst || (inst !== 'RQA' && inst !== 'SDQu')) {
    return new NextResponse('Invalid institution', { status: 400 });
  }

  try {
    const registrations = await prisma.registration.findMany({
      where: { institution: inst },
      orderBy: { createdAt: 'desc' }
    });

    const dateFormatter = new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    const datetimeFormatter = new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const timestampFormatter = new Intl.DateTimeFormat('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

    // Formatting data for Excel
    const data = registrations.map((reg, index) => {
      const base = {
        'No': index + 1,
        'Tanggal Daftar': datetimeFormatter.format(reg.createdAt),
        'Nama Lengkap': reg.fullName,
        'Jenis Kelamin': reg.gender === 'L' ? 'Laki-laki' : 'Perempuan',
        'Tempat Lahir': reg.birthPlace,
        'Tanggal Lahir': dateFormatter.format(reg.birthDate),
        'WhatsApp': reg.whatsapp,
        'Status': reg.status,
      };

      if (inst === 'RQA') {
        return {
          ...base,
          'Alamat': reg.address,
          'Program': reg.program || '-'
        };
      } else {
        return {
          ...base,
          'Gelombang': reg.program || '-',
          'NISN': reg.nisn || '-',
          'Asal Sekolah': reg.prevSchool || '-',
          'Nama Orang Tua': reg.parentName || '-',
          'Pekerjaan Orang Tua': reg.parentJob || '-',
          'Alamat': reg.address
        };
      }
    });

    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, `Pendaftar ${inst}`);

    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Format timestamp for filename (e.g. 20261004_2030)
    const rawParts = timestampFormatter.formatToParts(new Date());
    const fp: any = {};
    rawParts.forEach(p => fp[p.type] = p.value);
    const fileTimestamp = `${fp.year}${fp.month}${fp.day}_${fp.hour}${fp.minute}`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="Data_Pendaftar_${inst}_${fileTimestamp}.xlsx"`,
      }
    });
  } catch (error) {
    console.error('Export error:', error);
    return new NextResponse('Error generating export', { status: 500 });
  }
}
