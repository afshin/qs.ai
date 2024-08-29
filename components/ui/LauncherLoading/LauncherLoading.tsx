import { Button } from '@/components/ui/@shadcn/button';
import { PlusIcon } from 'lucide-react';
import { LauncherSideBar } from '@/components/ui/LauncherSideBar/LauncherSideBar';
import { Fragment } from 'react';
import { Skeleton } from '@/components/ui/@shadcn/skeleton';

export function LauncherLoading(props: {
  defaultName?: string;
  customName?: string;
}) {
  return (
    <Fragment>
      <div className=" col-span-1 sm:col-span-2 bg-primary-foreground ">
        <LauncherSideBar selected="environment" />
      </div>
      <div className="col-span-9 sm:col-span-8 bg-accent px-16 pt-8 overflow-auto gap-8 flex flex-col">
        {props.defaultName && (
          <>
            <div className="w-full flex justify-between border-b border-neutral-600">
              <h2 className=" scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0 text-left ">
                {props.defaultName}
              </h2>
            </div>
            <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              <Skeleton />
            </div>
          </>
        )}
        {props.customName && (
          <>
            <div className="w-full flex justify-between border-b border-neutral-600">
              <h1 className=" scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0 text-left">
                {props.customName}
              </h1>
              <Button
                variant="outline"
                size="icon"
                className="bg-accent hover:bg-primary-foreground"
              >
                <PlusIcon />
              </Button>
            </div>
            <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              <Skeleton />
            </div>
          </>
        )}
      </div>
    </Fragment>
  );
}
