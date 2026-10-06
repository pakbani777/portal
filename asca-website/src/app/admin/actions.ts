'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { encrypt } from '@/lib/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function login(prevState: any, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { error: 'Username dan Password wajib diisi' };
  }

  // Hardcoded check for initial setup or test admin if DB is empty
  let user = await prisma.user.findUnique({ where: { username } });

  // Auto-seed an admin if no users exist at all
  if (!user) {
    const userCount = await prisma.user.count();
    if (userCount === 0 && username === 'admin' && password === 'admin123') {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      user = await prisma.user.create({
        data: {
          username: 'admin',
          name: 'Administrator',
          password: hashedPassword,
        }
      });
    } else {
      return { error: 'Username atau Password salah' };
    }
  } else {
    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return { error: 'Username atau Password salah' };
    }
  }

  // Set session
  const sessionData = { id: user.id, username: user.username, name: user.name };
  const encryptedSession = await encrypt(sessionData);
  
  const cookieStore = await cookies();
  cookieStore.set('session', encryptedSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  });

  redirect('/admin');
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  redirect('/admin/login');
}

import { revalidatePath } from 'next/cache';

export async function updateRegistrationStatus(id: string, status: string, path: string) {
  try {
    await prisma.registration.update({
      where: { id },
      data: { status }
    });
    revalidatePath(path);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Gagal memperbarui status' };
  }
}
