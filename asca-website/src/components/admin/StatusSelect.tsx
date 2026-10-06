'use client';

import { useState } from 'react';
import { updateRegistrationStatus } from '@/app/admin/actions';
import { toast } from 'sonner';

export default function StatusSelect({ id, currentStatus, path }: { id: string, currentStatus: string, path: string }) {
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setLoading(true);
    const result = await updateRegistrationStatus(id, newStatus, path);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success('Status berhasil diperbarui');
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'DITERIMA': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'DITOLAK': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'PENDING': default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500';
    }
  };

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={loading}
      className={`px-2.5 py-1 text-xs font-bold rounded-full appearance-none cursor-pointer outline-none ${getStatusColor(currentStatus)} ${loading ? 'opacity-50' : ''}`}
    >
      <option value="PENDING">PENDING</option>
      <option value="DITERIMA">DITERIMA</option>
      <option value="DITOLAK">DITOLAK</option>
    </select>
  );
}
