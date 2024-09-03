import { SupabaseClient, Session, createClient } from '@supabase/supabase-js';
import { Database } from '@/types_db';
const BUCKET_NAME = 'qsai';
export async function createUserStorage(options: {
  session: Session | null;
  supabase: SupabaseClient;
}): Promise<void> {
  const { session, supabase } = options;

  const userId = session?.user.id;
  const authorization = session?.access_token;
  if (userId && authorization) {
    const filePath = `${userId}/.emptyFolderPlaceholder`;
    const checkPath = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/${BUCKET_NAME}/${filePath}`;
    const response = await fetch(checkPath, {
      method: 'HEAD',
      headers: {
        authorization: authorization
      }
    });
    const status = await response.status;
    if (status === 400) {
      supabase.storage.from(BUCKET_NAME).upload(filePath, new Blob([]), {
        cacheControl: '3600',
        upsert: false
      });
    }
  }
}

export async function createProjectStorage(options: {
  projectId: string;
}): Promise<{ success: boolean; value: string }> {
  const { projectId } = options;
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );
  const filePath = `project/${projectId}/.emptyFolderPlaceholder`;

  const response = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, new Blob([]), {
      cacheControl: '3600',
      upsert: false
    });

  if (response.error) {
    return { success: false, value: response.error.message };
  }
  return { success: true, value: filePath };
}

export async function deleteProjectStorage(options: {
  projectId: string;
}): Promise<{ success: boolean; value: string }> {
  const { projectId } = options;
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );
  const { data: list, error } = await supabase.storage
    .from(BUCKET_NAME)
    .list(`project/${projectId}`);
  if (error) {
    return { success: false, value: error.message };
  }
  const filesToRemove = list.map((x) => `project/${projectId}/${x.name}`);

  const response = await supabase.storage
    .from(BUCKET_NAME)
    .remove(filesToRemove);
  if (response.error) {
    return { success: false, value: response.error.message };
  }
  return { success: true, value: '' };
}
