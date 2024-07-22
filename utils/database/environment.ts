import { Database } from '@/types_db';
import { createClient, PostgrestError } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

export interface IEnvironmentContent {
  name: string;
  shortDesc?: string;
  description?: string;
  kernelEnv?: string;
  buildEnv?: string;
  dependencies: string[];
  lockfile: string;
}
export interface IEnvironmentData {
  content: IEnvironmentContent | null;
  created_at: string;
  uid: string;
  updated_at: string;
}

export async function readOne(
  userId: string,
  envID: string
): Promise<{
  data?: IEnvironmentData[];
  error?: PostgrestError | null;
  status: number;
}> {
  const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );
  const resourceRows = await supabaseAdmin
    .schema('public')
    .from('permission')
    .select('*')
    .eq('user_uid', userId)
    .eq('resource_uid', envID);
  const resourceIds = (resourceRows.data ?? [])
    .filter(
      (it) =>
        it.resource_type === 'environment' &&
        ['owner', 'viewer'].includes(it.role)
    )
    .map((d) => d.resource_uid);

  const env = await supabaseAdmin
    .schema('public')
    .from('environments')
    .select('*')
    .in('uid', resourceIds);

  if (env.error) {
    return { error: env.error, status: env.status };
  }

  return { data: env.data as any, error: env.error, status: env.status };
}

export async function readAllAuthorized(userId: string): Promise<{
  data?: IEnvironmentData[];
  error?: PostgrestError | null;
  status: number;
}> {
  const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );
  const resourceRows = await supabaseAdmin
    .schema('public')
    .from('permission')
    .select('*')
    .eq('user_uid', userId);
  const resourceIds = (resourceRows.data ?? [])
    .filter(
      (it) =>
        it.resource_type === 'environment' &&
        ['owner', 'viewer'].includes(it.role)
    )
    .map((d) => d.resource_uid);

  const env = await supabaseAdmin
    .schema('public')
    .from('environments')
    .select('*')
    .in('uid', resourceIds);
  if (env.error) {
    return { error: env.error, status: env.status };
  }
  const envMeta: any = env.data.map((it) => {
    if ((it?.content as any)?.lockfile) {
      (it.content as any).lockfile = '';
    }
    return it;
  });
  return { data: envMeta, error: env.error, status: env.status };
}

export async function createNew(
  userId: string,
  data: Record<string, string>
): Promise<{ success: boolean; value: string }> {
  const uid = randomUUID();
  const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );
  const newEnv: IEnvironmentContent = {
    name: data['name'],
    shortDesc: data['summary'],
    description: data['desc'],
    kernelEnv: data['kernelCode'],
    buildEnv: data['buildCode'],
    dependencies: [],
    lockfile: ''
  };
  try {
    await supabaseAdmin
      .schema('public')
      .from('environments')
      .insert({ content: newEnv as any, uid });
  } catch (err: any) {
    return { success: false, value: err.message };
  }
  try {
    await supabaseAdmin.schema('public').from('permission').insert({
      user_uid: userId,
      resource_uid: uid,
      role: 'owner',
      resource_type: 'environment'
    });
  } catch (err: any) {
    return { success: false, value: err.message };
  }
  return { success: true, value: uid };
}

export async function deleteOne(
  userId: string,
  envID: string
): Promise<{ success: boolean; value?: string }> {
  const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );
  const resourceRows = await supabaseAdmin
    .schema('public')
    .from('permission')
    .select('*')
    .eq('user_uid', userId)
    .eq('resource_uid', envID);

  const resourceIds = (resourceRows.data ?? [])
    .filter(
      (it) => it.resource_type === 'environment' && ['owner'].includes(it.role)
    )
    .map((d) => d.resource_uid);

  const deleteEnv = await supabaseAdmin
    .schema('public')
    .from('environments')
    .delete()
    .in('uid', resourceIds);
  if (deleteEnv.error) {
    return { value: deleteEnv.error.message, success: false };
  }
  const deletePermission = await supabaseAdmin
    .schema('public')
    .from('permission')
    .delete()
    .in('resource_uid', resourceIds);
  if (deletePermission.error) {
    return { value: deletePermission.error.message, success: false };
  }

  return { success: true };
}
