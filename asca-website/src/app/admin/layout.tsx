import { getSession } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const metadata = {
  title: 'Admin Dashboard | ASCA',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1c] flex flex-col md:flex-row text-slate-900 dark:text-slate-100">
      {session && <AdminSidebar session={session} />}

      {/* Main Content */}
      <main className={`flex-1 flex flex-col min-w-0 min-h-screen ${session ? 'md:ml-64' : ''}`}>
        <div className={`flex-1 overflow-y-auto ${session ? 'p-4 sm:p-6 lg:p-8' : ''}`}>
          {children}
        </div>
      </main>
    </div>
  );
}
