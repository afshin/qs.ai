import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Fragment } from 'react';
import { Skeleton } from '@/components/ui/@shadcn/skeleton';
import { LauncherSideBar } from '@/components/ui/LauncherSideBar/LauncherSideBar';

async function LauncherHome() {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/signin');
  }

  return (
    <Fragment>
      <div className="col-span-1 bg-primary-foreground ">
        <LauncherSideBar selected="home" />
      </div>
      <div className="col-span-4 bg-accent px-16 pt-16 overflow">
        <div className="w-full grid grid-cols-4">
          <h1 className=" scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 col-span-3 text-left">
            Home
          </h1>
        </div>

        <Skeleton />
      </div>
    </Fragment>
  );
}

export default LauncherHome;
