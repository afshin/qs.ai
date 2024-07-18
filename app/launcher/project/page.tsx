import { LauncherSideBar } from '@/components/ui/LauncherSideBar/LauncherSideBar';
import Project from '@/components/ui/Project/Project';
import { readAllAuthorized } from '@/utils/database/environment';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Fragment } from 'react';

export default async function ProjectPage() {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/signin');
  }
  const userId = user.id;
  const response = await readAllAuthorized(userId);

  return (
    <Fragment>
      <div className=" col-span-1 sm:col-span-2 bg-primary-foreground ">
        <LauncherSideBar selected="project" />
      </div>
      <Project environments={response.data ?? []} />
    </Fragment>
  );
}
