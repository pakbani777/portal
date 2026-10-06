import { getUsers } from './actions';
import { getSession } from '@/lib/auth';
import UserManagement from '@/components/admin/UserManagement';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Pengaturan Admin | Admin ASCA',
};

export default async function PenggunaPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  const users = await getUsers();

  return (
    <div className="max-w-6xl mx-auto">
      <UserManagement users={users} currentUser={session} />
    </div>
  );
}
