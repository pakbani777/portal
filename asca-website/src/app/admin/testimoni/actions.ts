'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function addTestimonial(formData: FormData) {
  const parentName = formData.get('parentName') as string;
  const studentName = formData.get('studentName') as string;
  const institution = formData.get('institution') as string;
  const content = formData.get('content') as string;

  await prisma.testimonial.create({
    data: {
      parentName,
      studentName,
      institution,
      content,
    }
  });

  revalidatePath('/admin/testimoni');
  revalidatePath('/');
  revalidatePath('/rumah-quran');
  revalidatePath('/sd-quran');
}

export async function deleteTestimonial(formData: FormData) {
  const id = formData.get('id') as string;

  await prisma.testimonial.delete({
    where: { id }
  });

  revalidatePath('/admin/testimoni');
  revalidatePath('/');
  revalidatePath('/rumah-quran');
  revalidatePath('/sd-quran');
}
