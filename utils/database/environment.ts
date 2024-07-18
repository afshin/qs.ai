import { Database } from '@/types_db';
import { createClient, PostgrestError } from '@supabase/supabase-js';

export interface IEnvironmentData {
  content: {
    name: string;
    shortDesc?: string;
    description?: string;
    dependencies: string[];
    lockfile: string;
  } | null;
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
