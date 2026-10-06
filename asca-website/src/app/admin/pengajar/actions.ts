'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function addTeacher(formData: FormData) {
  const name = formData.get('name') as string;
  const role = formData.get('role') as string;
  const institution = formData.get('institution') as string;
  const imageUrl = formData.get('imageUrl') as string;

  await prisma.teacher.create({
    data: {
      name,
      role,
      institution,
      imageUrl: imageUrl || null,
    }
  });

  revalidatePath('/admin/pengajar');
  revalidatePath('/');
  revalidatePath('/rumah-quran');
  revalidatePath('/sd-quran');
}

export async function deleteTeacher(formData: FormData) {
  const id = formData.get('id') as string;

  await prisma.teacher.delete({
    where: { id }
  });

  revalidatePath('/admin/pengajar');
  revalidatePath('/');
  revalidatePath('/rumah-quran');
  revalidatePath('/sd-quran');
}
