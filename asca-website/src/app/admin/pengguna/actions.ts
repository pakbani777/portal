'use server';

import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

export async function getUsers() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const users = await prisma.user.findMany({
    select: { id: true, username: true, name: true }
  });
  return users;
}

export async function addUser(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  const name = formData.get('name') as string;
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!name || !username || !password) {
    return { error: 'Semua kolom wajib diisi' };
  }
  
  if (password.length < 6) {
    return { error: 'Password minimal 6 karakter' };
  }

  try {
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return { error: 'Username sudah digunakan' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    await prisma.user.create({
      data: {
        name,
        username,
        password: hashedPassword
      }
    });
    
    revalidatePath('/admin/pengguna');
    return { success: true };
  } catch (e: any) {
    return { error: 'Gagal menambahkan admin' };
  }
}

export async function updatePassword(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  const id = formData.get('id') as string;
  const newPassword = formData.get('newPassword') as string;

  if (!id || !newPassword) {
    return { error: 'Semua kolom wajib diisi' };
  }

  if (newPassword.length < 6) {
    return { error: 'Password minimal 6 karakter' };
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword }
    });
    
    return { success: true };
  } catch (e: any) {
    return { error: 'Gagal memperbarui password' };
  }
}

export async function deleteUser(id: string) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  if (session.id === id) {
    return { error: 'Tidak dapat menghapus akun Anda sendiri saat sedang login' };
  }

  try {
    const count = await prisma.user.count();
    if (count <= 1) {
      return { error: 'Tidak dapat menghapus satu-satunya admin tersisa' };
    }

    await prisma.user.delete({ where: { id } });
    revalidatePath('/admin/pengguna');
    return { success: true };
  } catch (e) {
    return { error: 'Gagal menghapus admin' };
  }
}
