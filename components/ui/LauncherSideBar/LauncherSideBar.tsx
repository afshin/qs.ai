import { Fragment } from 'react';
import { Button } from '@/components/ui/@shadcn/button';
import { HomeIcon, FolderIcon, LucideDatabase } from 'lucide-react';
import Link from 'next/link';

interface Props {
  selected?: 'home' | 'project' | 'data-provider';
  className?: string[];
}

export const LauncherSideBar = (props: Props) => {
  const { selected } = props;
  return (
    <Fragment>
      <Button
        className={`w-full border-0 py-0 ${selected === 'home' ? 'bg-accent' : 'bg-primary-foreground'}`}
        variant={'outline'}
      >
        <div className="w-full grid grid-cols-4">
          <HomeIcon className="h-5 w-5  ml-2 m-2" />{' '}
          <Link href="/launcher/home" className="col-span-3 text-left">
            <p className="m-2">Home</p>
          </Link>
        </div>
      </Button>
      <Button
        className={`w-full border-0 py-0 ${selected === 'project' ? 'bg-accent' : 'bg-primary-foreground'}`}
        variant={'outline'}
      >
        <div className="w-full h-full grid grid-cols-4">
          <FolderIcon className="h-5 w-5  ml-2 m-2" />{' '}
          <Link href="/launcher/project" className="col-span-3 text-left">
            <p className="m-2">Project</p>
          </Link>
        </div>
      </Button>
      <Button
        className={`w-full border-0 py-0 ${selected === 'data-provider' ? 'bg-accent' : 'bg-primary-foreground'}`}
        variant={'outline'}
      >
        <div className="w-full h-full grid grid-cols-4">
          <LucideDatabase className="h-5 w-5  ml-2 m-2" />{' '}
          <Link href="/launcher/data-provider" className="col-span-3 text-left">
            <p className="m-2">Data provider</p>
          </Link>
        </div>
      </Button>
    </Fragment>
  );
};
