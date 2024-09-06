import { Database } from '@/types_db';
import { createClient } from '@supabase/supabase-js';

export async function shareProject({
  userId,
  projectId,
  role,
  emails
}: {
  userId: string;
  projectId: string;
  role: 'owner' | 'viewer';
  emails: string[];
}): Promise<{ success: boolean; value: string }> {
  const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );
  if (!['viewer', 'owner'].includes(role)) {
    role = 'viewer';
  }
  const permission = await supabaseAdmin
    .from('permission')
    .select('role')
    .eq('resource_uid', projectId)
    .eq('user_uid', userId)
    .eq('resource_type', 'project')
    .eq('role', 'owner');
  if (!permission.data?.length) {
    return { success: false, value: 'Unauthorized' };
  }
  const invitedIds: string[] = [];
  const noAccounts: string[] = [];

  const checkPromises = emails.map(async (email) => ({
    email,
    promise: await supabaseAdmin.from('users').select('id').eq('email', email)
  }));
  const checkResult = await Promise.all(checkPromises);
  checkResult.forEach((it) => {
    if (!it.promise.error && it.promise.data.length) {
      invitedIds.push(it.promise.data[0].id);
    } else {
      noAccounts.push(it.email);
    }
  });
  const permissionRows = invitedIds.map((uid) => ({
    user_uid: uid,
    resource_uid: projectId,
    resource_type: 'project' as any,
    role
  }));
  const response = await supabaseAdmin
    .from('permission')
    .upsert(permissionRows);
  const pendingRows = noAccounts.map((email) => ({
    email,
    resource_uid: projectId,
    resource_type: 'project' as any,
    role
  }));

  const pendingResponse = await supabaseAdmin
    .from('pending_invitation')
    .upsert(pendingRows);

  return {
    success: !response.error && !pendingResponse.error,
    value: `${response.error?.message} - ${pendingResponse.error?.message}`
  };
}

export async function readOne({
  userId,
  resourceUID
}: {
  userId: string;
  resourceUID: string;
}): Promise<{
  success: boolean;
  value?: string;
  data?: { email: string; role: string; pending?: boolean }[];
}> {
  const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  const { data, error } = await supabaseAdmin
    .from('permission')
    .select('*')
    .eq('resource_uid', resourceUID);
  if (error || !data?.length) {
    return { success: false, value: 'Resource does not exist' };
  }
  const userRole = data.filter(
    (it) => it.user_uid === userId && it.role === 'owner'
  );
  if (!userRole.length) {
    return { success: false, value: 'Unauthorized' };
  }
  let sharedUsers: { email: string; role: string; pending?: boolean }[] = [];
  for (const it of data) {
    const email = await supabaseAdmin
      .from('users')
      .select('email')
      .eq('id', it.user_uid);
    if (!email.error && email.data[0]?.email) {
      sharedUsers.push({ email: email.data[0].email, role: it.role });
    }
  }

  const pending = await supabaseAdmin
    .from('pending_invitation')
    .select('email,role')
    .eq('resource_uid', resourceUID);
  if (!pending.error) {
    sharedUsers = [
      ...sharedUsers,
      ...pending.data.map((it) => ({ ...it, pending: true }))
    ];
  }

  return { success: true, data: sharedUsers };
}
