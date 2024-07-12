import { Button } from '@/components/ui/@shadcn/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/@shadcn/card';
import { LauncherSideBar } from '@/components/ui/LauncherSideBar/LauncherSideBar';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
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
  const projectData = [
    {
      title: 'Default project',
      description: 'Default JupyterLite deployment',
      detail:
        'Default JupyterLite deployment proposed by QS.AI. It contains the popular Python scientific libraries like Numpy, Scipy,... as well as vizualization tools.'
    },
    {
      title: 'My project',
      description: 'A custom deployment',
      detail:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    },
    {
      title: 'Shared project ',
      description: 'A shared deployment for xxx project',
      detail:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    },
    {
      title: 'My private project 2',
      description: 'A custom deployment',
      detail:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }
  ];
  return (
    <Fragment>
      <div className=" col-span-1 sm:col-span-2 bg-primary-foreground ">
        <LauncherSideBar selected="project" />
      </div>
      <div className="col-span-9 sm:col-span-8 bg-accent px-16 pt-16 overflow-auto">
        <div className="w-full flex justify-between">
          <h1 className=" scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-left">
            My projects
          </h1>
          <Button className="bg-foreground w-32"> Add new</Button>
        </div>
        <div className="pt-16 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projectData.map((val, idx) => (
            <Card className="hover:drop-shadow-xl h-80 flex flex-col" key={idx}>
              <CardHeader>
                <CardTitle>{val.title}</CardTitle>
                <CardDescription>{val.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-ellipsis grow overflow-auto">
                <p>{val.detail}</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-foreground">
                  <Link
                    href={
                      process.env.NEXT_PUBLIC_JUPYTERLITE_URL ??
                      '/jupyterlite/lab/index.html'
                    }
                    target="_blank"
                  >
                    <span>Start project</span>
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Fragment>
  );
}
