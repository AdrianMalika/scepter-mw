import { redirect } from 'next/navigation';
import AdminDashboard from './AdminDashboard';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const supabase = await createClient();

  if (!supabase) {
    redirect('/admin/login');
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/admin/login');
  }

  return <AdminDashboard email={user.email || 'Authenticated user'} />;
}
