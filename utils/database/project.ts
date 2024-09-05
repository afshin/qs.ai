import { Database } from '@/types_db';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import { IEnvironmentData, readOneVersion } from './environment';

interface IProjectContent {
  env?: IEnvironmentData;
}

export interface IProjectData {
  content: IProjectContent | null;
  created_at: string;
  uid: string;
  updated_at: string;
  name: string;
  description?: string;
  env_version: string;
}

export async function readOne(
  userId: string,
  projectID: string
): Promise<{
  data?: IProjectData[];
  error?: string | null;
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
    .eq('resource_uid', projectID);
  const resourceIds = (resourceRows.data ?? [])
    .filter(
      (it) =>
        it.resource_type === 'project' && ['owner', 'viewer'].includes(it.role)
    )
    .map((d) => d.resource_uid);

  const project = await supabaseAdmin
    .schema('public')
    .from('projects')
    .select('*')
    .in('uid', resourceIds);

  if (project.error) {
    return { error: project.error.message, status: project.status };
  }
  if (project.data.length > 0) {
    const projectData = project.data[0];
    const envId = projectData.env_version;
    const envDataResponse = await readOneVersion(userId, envId ?? '');
    console.log('im here', envDataResponse);
    const response = {
      ...projectData,
      content: { env: envDataResponse.data }
    } as IProjectData;
    return {
      data: [response],
      status: 200
    };
  }
  return {
    error: 'Project not found',
    status: 401
  };
}

export async function readAllAuthorized(userId: string): Promise<{
  data?: IProjectData[];
  error: string | null;
  status: number;
}> {
  const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  const privateRows = await supabaseAdmin
    .schema('public')
    .from('permission')
    .select('*')
    .eq('user_uid', userId)
    .eq('resource_type', 'project');

  if (privateRows.error) {
    return {
      data: [],
      error: privateRows.error.message,
      status: privateRows.status
    };
  }
  const resourceIds = (privateRows.data ?? []).map((d) => d.resource_uid);
  const projects = await supabaseAdmin
    .schema('public')
    .from('projects')
    .select('*')
    .in('uid', resourceIds);
  if (projects.error) {
    return {
      data: [],
      error: projects.error.message,
      status: projects.status
    };
  }
  return {
    data: projects.data as IProjectData[],
    error: null,
    status: 200
  };
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

  try {
    const createResponse = await supabaseAdmin
      .schema('public')
      .from('projects')
      .insert({
        uid,
        name: data['name'],
        description: data['desc'],
        env_version: data['environment']
      });
    if (createResponse.error) {
      return { success: false, value: createResponse.error.message };
    }
  } catch (err: any) {
    return { success: false, value: err.message };
  }
  try {
    const permissionResponse = await supabaseAdmin
      .schema('public')
      .from('permission')
      .insert({
        user_uid: userId,
        resource_uid: uid,
        role: 'owner',
        resource_type: 'project'
      });
    if (permissionResponse.error) {
      return { success: false, value: permissionResponse.error.message };
    }
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
      (it) => it.resource_type === 'project' && ['owner'].includes(it.role)
    )
    .map((d) => d.resource_uid);

  const deleteEnv = await supabaseAdmin
    .schema('public')
    .from('projects')
    .delete()
    .in('uid', resourceIds);
  if (deleteEnv.error) {
    return { value: deleteEnv.error.message, success: false };
  }

  return { success: true };
}

export async function updateExisting(
  userId: string,
  projectId: string,
  data: Record<string, string>
): Promise<{ success: boolean; value: string }> {
  const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  const resourceRows = await supabaseAdmin
    .schema('public')
    .from('permission')
    .select('*')
    .eq('user_uid', userId)
    .eq('resource_uid', projectId);
  if (resourceRows.error) {
    return { success: false, value: resourceRows.error.message };
  }
  const resourceIds = (resourceRows.data ?? [])
    .filter(
      (it) => it.resource_type === 'project' && ['owner'].includes(it.role)
    )
    .map((d) => d.resource_uid);

  if (resourceIds.length === 0) {
    return { success: false, value: 'Unauthorized' };
  }
  let name = data['name'];
  if (!name || name.length === 0) {
    return { success: false, value: 'Missing name' };
  }
  try {
    const current = new Date().toISOString();

    const updateResponse = await supabaseAdmin
      .schema('public')
      .from('projects')
      .update({
        name: data['name'],
        description: data['desc'],
        env_version: data['environment'],
        updated_at: current
      })
      .eq('uid', projectId);
    if (updateResponse.error) {
      return { success: false, value: updateResponse.error.message };
    }
  } catch (err: any) {
    return { success: false, value: err.message };
  }

  return { success: true, value: projectId };
}
