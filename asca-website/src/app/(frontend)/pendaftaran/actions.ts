'use server';

import prisma from '@/lib/prisma';

export async function submitRegistrationRQA(prevState: any, formData: FormData) {
  try {
    await prisma.registration.create({
      data: {
        institution: 'RQA',
        fullName: formData.get('fullName') as string,
        gender: formData.get('gender') as string,
        birthPlace: formData.get('birthPlace') as string,
        birthDate: new Date(formData.get('birthDate') as string),
        address: formData.get('address') as string,
        whatsapp: formData.get('whatsapp') as string,
        program: formData.get('program') as string,
      }
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Gagal mengirim data. Silakan coba lagi.' };
  }
}

export async function submitRegistrationSDQu(prevState: any, formData: FormData) {
  try {
    await prisma.registration.create({
      data: {
        institution: 'SDQu',
        fullName: formData.get('fullName') as string,
        nisn: formData.get('nisn') as string,
        gender: formData.get('gender') as string,
        birthPlace: formData.get('birthPlace') as string,
        birthDate: new Date(formData.get('birthDate') as string),
        prevSchool: formData.get('prevSchool') as string,
        parentName: formData.get('parentName') as string,
        parentJob: formData.get('parentJob') as string,
        whatsapp: formData.get('whatsapp') as string,
        address: '-', // Add if missing in form, or update schema
      }
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Gagal mengirim data. Silakan coba lagi.' };
  }
}
