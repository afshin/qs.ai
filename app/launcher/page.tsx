import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function LauncherPage() {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/signin');
  } else {
    return redirect('/launcher/project');
  }
}
