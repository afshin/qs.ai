import { LauncherSideBar } from '@/components/ui/LauncherSideBar/LauncherSideBar';
import { Project } from '@/components/ui/Project';
import { readAllAuthorized as readAllAuthorizedEnv } from '@/utils/database/environment';
import { readAllAuthorized as readAllAuthorizedProj } from '@/utils/database/project';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Fragment } from 'react';
export default async function LauncherPage() {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/signin');
  }
  const response = await readAllAuthorizedEnv(user.id, true);
  const responseData = response.data ?? { public: [], private: [] };
  const allProjectResponse = await readAllAuthorizedProj(user.id, true);
  const allProjectData = allProjectResponse.data ?? [];
  return (
    <Fragment>
      <div className=" col-span-1 sm:col-span-2 bg-primary-foreground ">
        <LauncherSideBar selected="project" />
      </div>
      <Project environments={responseData} projects={allProjectData} />
    </Fragment>
  );
}
