import { Database } from '@/types_db';
import {
  createClient,
  PostgrestError,
  SupabaseClient
} from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

interface IEnvironmentContent {
  name: string;
  description?: string;
  latest: string;
}

interface IEnvironmentDefinition {
  kernelEnv: string;
  buildEnv: string;
  dependencies: string[];
}
export interface IEnvironmentDetail {
  uid: string;
  created_at: string;
  version: string;
  definition: IEnvironmentDefinition;
  lockfile: string;
  environment_uid: string;
}

export interface IEnvironmentData {
  content: IEnvironmentContent | null;
  created_at: string;
  uid: string;
  updated_at: string;
  allVersions?: { [key: string]: IEnvironmentDetail };
}

export async function readOne(
  userId: string,
  envID: string,
  getVersion = false
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
  const envMeta: IEnvironmentData[] = env.data.map((it) => {
    return { ...it, content: { ...(it.content as any) } };
  });
  if (getVersion) {
    for (const element of envMeta) {
      const allVersionResponse = await readAllVersions(
        element.uid,
        supabaseAdmin
      );
      if (!allVersionResponse.error && allVersionResponse.data) {
        element.allVersions = allVersionResponse.data;
      }
    }
  }
  return { data: envMeta, error: env.error, status: env.status };
}

async function readEnvMetadata(
  envIds: string[],
  sbClient: SupabaseClient,
  getVersion: boolean
): Promise<{ data: IEnvironmentData[]; error: string | null }> {
  const env = await sbClient
    .schema('public')
    .from('environments')
    .select('*')
    .in('uid', envIds);
  if (env.error) {
    return { data: [], error: env.error.message };
  }
  const envMeta: IEnvironmentData[] = env.data.map((it) => {
    return { ...it, content: { ...(it.content as any) } };
  });
  if (getVersion) {
    for (const element of envMeta) {
      const allVersionResponse = await readAllVersions(element.uid, sbClient);
      if (!allVersionResponse.error && allVersionResponse.data) {
        element.allVersions = allVersionResponse.data;
      }
    }
  }
  return { data: envMeta, error: null };
}
export async function readAllAuthorized(
  userId: string,
  getVersion: boolean = false
): Promise<{
  data?: { public: IEnvironmentData[]; private: IEnvironmentData[] };
  error: string | null;
  status: number;
}> {
  const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  const publicEnvRows = await supabaseAdmin
    .schema('public')
    .from('resources')
    .select('*')
    .eq('resource_type', 'environment')
    .eq('public', true);
  const publicEnvs = (publicEnvRows.data ?? []).map((it) => it.uid);
  const publicEnvMeta = await readEnvMetadata(
    publicEnvs,
    supabaseAdmin,
    getVersion
  );

  const privateRows = await supabaseAdmin
    .schema('public')
    .from('permission')
    .select('*')
    .eq('user_uid', userId);
  const resourceIds = (privateRows.data ?? [])
    .filter(
      (it) =>
        !publicEnvs.includes(it.resource_uid) &&
        it.resource_type === 'environment' &&
        ['owner', 'viewer'].includes(it.role)
    )
    .map((d) => d.resource_uid);

  const privateEnvMeta = await readEnvMetadata(
    resourceIds,
    supabaseAdmin,
    getVersion
  );

  const error = publicEnvMeta.error ?? privateEnvMeta.error;
  const status = error ? 500 : 200;
  return {
    data: { private: privateEnvMeta.data, public: publicEnvMeta.data },
    error,
    status
  };
}

export async function readAllVersions(
  envId: string,
  sbClient?: SupabaseClient
): Promise<{
  data?: { [key: string]: IEnvironmentDetail };
  error?: PostgrestError | null;
  status: number;
}> {
  const supabaseAdmin =
    sbClient ||
    createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );
  const resourceRows = await supabaseAdmin
    .schema('public')
    .from('environment_lock')
    .select('*')
    .eq('environment_uid', envId);
  const allVersions: { [key: string]: IEnvironmentDetail } = {};
  if (resourceRows.data) {
    resourceRows.data.forEach((it) => {
      allVersions[it.version] = it as any;
    });
  }

  return {
    error: resourceRows.error,
    status: resourceRows.status,
    data: allVersions
  };
}

export async function createNew(
  userId: string,
  data: Record<string, string>
): Promise<{ success: boolean; value: string }> {
  const uid = randomUUID();
  const lockUid = randomUUID();
  const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );
  let version = data['version'];
  if (!version || version.length === 0) {
    version = '1.0.0';
  }
  const newEnv: IEnvironmentContent = {
    name: data['name'],
    description: data['desc'],
    latest: version
  };
  const lockfile = {}; // TODO
  const newEnvDef: IEnvironmentDefinition = {
    kernelEnv: data['kernelCode'],
    buildEnv: data['buildCode'],
    dependencies: []
  };

  try {
    const createResponse = await supabaseAdmin
      .schema('public')
      .from('environments')
      .insert({ content: newEnv as any, uid });
    if (createResponse.error) {
      return { success: false, value: createResponse.error.message };
    }
    const lockResponse = await supabaseAdmin
      .schema('public')
      .from('environment_lock')
      .insert({
        uid: lockUid,
        environment_uid: uid,
        version,
        definition: newEnvDef as any,
        lockfile
      });
    if (lockResponse.error) {
      return { success: false, value: lockResponse.error.message };
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
        resource_type: 'environment'
      });
    if (permissionResponse.error) {
      return { success: false, value: permissionResponse.error.message };
    }
  } catch (err: any) {
    return { success: false, value: err.message };
  }
  return { success: true, value: uid };
}

export async function createNewVersion(
  userId: string,
  envID: string,
  data: Record<string, string>
): Promise<{ success: boolean; value: string }> {
  const lockUid = randomUUID();
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
  if (resourceIds.length === 0) {
    return { success: false, value: 'Unauthorized' };
  }
  let version = data['version'];
  if (!version || version.length === 0) {
    return { success: false, value: 'Missing version' };
  }
  const allVersionResponse = await readAllVersions(envID, supabaseAdmin);
  const allVersionData = allVersionResponse.data ?? {};

  if (allVersionData[version]) {
    return { success: false, value: 'Requested version already exists' };
  }

  const newEnv: IEnvironmentContent = {
    name: data['name'],
    description: data['desc'],
    latest: version
  };
  const lockfile = {}; // TODO
  const newEnvDef: IEnvironmentDefinition = {
    kernelEnv: data['kernelCode'],
    buildEnv: data['buildCode'],
    dependencies: []
  };

  try {
    const current = new Date().toISOString();
    const response = await supabaseAdmin
      .schema('public')
      .from('environments')
      .update({ content: newEnv as any, updated_at: current })
      .eq('uid', envID);
    if (response.error) {
      return { success: false, value: response.error.message };
    }
    const lockResponse = await supabaseAdmin
      .schema('public')
      .from('environment_lock')
      .insert({
        uid: lockUid,
        environment_uid: envID,
        version,
        definition: newEnvDef as any,
        lockfile
      });
    if (lockResponse.error) {
      return { success: false, value: lockResponse.error.message };
    }
  } catch (err: any) {
    return { success: false, value: err.message };
  }

  return { success: true, value: envID };
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

export async function readOneVersion(
  userId: string,
  versionUid: string
): Promise<{
  data?: IEnvironmentData;
  error?: string | null;
  status: number;
}> {
  const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );
  const resourceRows = await supabaseAdmin
    .schema('public')
    .from('environment_lock')
    .select('*')
    .eq('uid', versionUid);
  if (resourceRows.error) {
    return { error: resourceRows.error.message, status: resourceRows.status };
  }
  if (resourceRows.data.length === 0) {
    return { error: 'Environment not found', status: 404 };
  }
  const envVersionData = resourceRows.data[0] as any as IEnvironmentDetail;
  const env = await supabaseAdmin
    .schema('public')
    .from('environments')
    .select('*')
    .eq('uid', envVersionData.environment_uid ?? '');

  if (env.error) {
    return { error: env.error.message, status: env.status };
  }
  if (env.data.length === 0) {
    return { error: 'Environment not found', status: 404 };
  }
  const envData = env.data[0] as IEnvironmentData;

  const envResourceRecord = await supabaseAdmin
    .schema('public')
    .from('resources')
    .select('public')
    .eq('uid', envData.uid);
  if (envResourceRecord.data?.length && envResourceRecord.data[0].public) {
    // Public project
  } else {
    const permissionRows = await supabaseAdmin
      .schema('public')
      .from('permission')
      .select('*')
      .eq('user_uid', userId)
      .eq('resource_uid', envData.uid);
    const resourceIds = (permissionRows.data ?? [])
      .filter(
        (it) =>
          it.resource_type === 'environment' &&
          ['owner', 'viewer'].includes(it.role)
      )
      .map((d) => d.resource_uid);
    if (resourceIds.length === 0) {
      return { error: 'Unauthorized', status: 401 };
    }
  }

  const response: IEnvironmentData = {
    ...envData,
    allVersions: { [envVersionData.version]: envVersionData }
  };

  return { data: response, error: env.error, status: env.status };
}
