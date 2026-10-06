'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function saveSettings(formData: FormData) {
  const tabGroup = formData.get('tabGroup') as string;
  let group = 'GLOBAL';
  if (tabGroup === 'rqa') group = 'RQA';
  if (tabGroup === 'sdqu') group = 'SDQu';

  // Extract all keys except tabGroup
  for (const [key, value] of formData.entries()) {
    if (key === 'tabGroup') continue;
    
    // Upsert each setting
    await prisma.siteSetting.upsert({
      where: { key: key },
      update: { value: value.toString(), group: group },
      create: { key: key, value: value.toString(), group: group },
    });
  }

  // Revalidate frontend pages so they see the new settings
  revalidatePath('/');
  revalidatePath('/rumah-quran');
  revalidatePath('/sd-quran');
  revalidatePath('/pendaftaran/rumah-quran');
  revalidatePath('/pendaftaran/sd-quran');
}
