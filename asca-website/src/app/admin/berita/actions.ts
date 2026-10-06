'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') + '-' + Date.now();
}

export async function addPost(formData: FormData) {
  const title = formData.get('title') as string;
  const category = formData.get('category') as string;
  const content = formData.get('content') as string;
  const institution = formData.get('institution') as string;
  const imageUrl = formData.get('imageUrl') as string;

  await prisma.post.create({
    data: {
      title,
      slug: generateSlug(title),
      category,
      content,
      institution,
      imageUrl: imageUrl || null,
    }
  });

  revalidatePath('/admin/berita');
  revalidatePath('/');
  revalidatePath('/rumah-quran');
  revalidatePath('/sd-quran');
}

export async function deletePost(formData: FormData) {
  const id = formData.get('id') as string;

  await prisma.post.delete({
    where: { id }
  });

  revalidatePath('/admin/berita');
  revalidatePath('/');
  revalidatePath('/rumah-quran');
  revalidatePath('/sd-quran');
}
