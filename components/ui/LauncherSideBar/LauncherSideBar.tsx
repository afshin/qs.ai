import { Fragment } from 'react';
import { Button } from '@/components/ui/@shadcn/button';
import { FileBoxIcon, FolderIcon } from 'lucide-react';
import Link from 'next/link';

interface Props {
  selected?: 'environment' | 'project' | 'data-provider' | 'home';
  className?: string[];
}

export const LauncherSideBar = (props: Props) => {
  const { selected } = props;
  return (
    <Fragment>
      {/* <Button
        className={`w-full border-0 py-0 ${selected === 'home' ? 'bg-accent' : 'bg-primary-foreground'}`}
        variant={'outline'}
      >
        <div className="w-full grid grid-cols-4">
          <Link href="/launcher/home" className="col-span-1 text-left">
            <HomeIcon className="h-5 w-5 ml-0 sm:ml-2 m-2" />{' '}
          </Link>
          <Link href="/launcher/home" className="col-span-3 text-left">
            <p className="m-2 invisible sm:visible">Home</p>
          </Link>
        </div>
      </Button> */}
      <Button
        className={`w-full border-0 py-0 rounded-none ${selected === 'project' ? 'bg-accent' : 'bg-primary-foreground'}`}
        variant={'outline'}
      >
        <div className="w-full h-full grid grid-cols-4">
          <Link href="/launcher/project" className="col-span-1 text-left">
            <FolderIcon className="h-5 w-5   ml-0 sm:ml-2  m-2" />{' '}
          </Link>
          <Link href="/launcher/project" className="col-span-3 text-left">
            <p className="m-2 invisible sm:visible">Projects</p>
          </Link>
        </div>
      </Button>
      <Button
        className={`w-full border-0 py-0 rounded-none ${selected === 'environment' ? 'bg-accent' : 'bg-primary-foreground'}`}
        variant={'outline'}
      >
        <div className="w-full h-full grid grid-cols-4">
          <Link href="/launcher/environment" className="col-span-1 text-left">
            <FileBoxIcon className="h-5 w-5   ml-0 sm:ml-2  m-2" />{' '}
          </Link>
          <Link href="/launcher/environment" className="col-span-3 text-left">
            <p className="m-2 invisible sm:visible">Environments</p>
          </Link>
        </div>
      </Button>
    </Fragment>
  );
};
