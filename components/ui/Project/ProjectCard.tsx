'use client';

import { Ellipsis } from '@/components/icons/Ellipsis';
import { Button } from '@/components/ui/@shadcn/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/@shadcn/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/@shadcn/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/@shadcn/dropdown-menu';
import { sendRequest } from '@/utils/helpers';
import {
  EditIcon,
  FolderIcon,
  ShareIcon,
  TrashIcon,
  SquareArrowOutUpRight
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { ShareDialog } from '../ShareDialog';

interface IProps {
  name?: string;
  description?: string;
  uid: string;
  envUID: string;
  envDetail: { name: string; version: string };
  editHandler: () => void;
  detailHandler: () => void;
}
export function ProjectCard(props: IProps) {
  const { description } = props;
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [openShare, setOpenShare] = useState(false);

  const deleteProj = useCallback(async () => {
    const response = await sendRequest<{ success: boolean; value: string }>({
      url: `/api/v1/project/${props.uid}`,
      method: 'DELETE'
    });
    if (response.success) {
      router.refresh();
    }
  }, [props.uid, router]);
  const shareHandler = useCallback(async () => {
    setOpenShare(true);
  }, []);

  return (
    <>
      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              project and remove your data from our servers.
            </DialogDescription>
            <DialogFooter>
              <Button variant={'secondary'} onClick={() => setConfirm(false)}>
                Cancel
              </Button>
              <Button variant={'destructive'} onClick={deleteProj}>
                Yes, delete project
              </Button>
            </DialogFooter>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <ShareDialog
        open={openShare}
        setOpen={setOpenShare}
        resourceUID={props.uid}
        title="Share project"
        description="Projects environments and storage spaces will be shared"
      />
      <Card className="hover:drop-shadow-xl h-80 flex flex-col">
        <CardHeader>
          <div className="flex flex-row justify-between">
            <CardTitle className="text-xl">
              <div className="flex gap-2">
                <FolderIcon />
                <span className="leading-[100%]">{props.name}</span>
              </div>
            </CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger className="focus-visible:outline-none">
                <Ellipsis />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={shareHandler}>
                  <ShareIcon size={'1rem'} className="mr-3" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={props.editHandler}>
                  <EditIcon size={'1rem'} className="mr-3" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => setConfirm(true)}>
                  <TrashIcon size={'1rem'} className="mr-3" color="red" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardDescription>
            {props.envDetail.name} {props.envDetail.version}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-ellipsis grow overflow-auto">
          <p>{description}</p>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-foreground">
            <Link
              prefetch={false}
              href={`/project/${props.uid}`}
              target="_blank"
            >
              <span>
                <SquareArrowOutUpRight
                  size={'1rem'}
                  className="mr-2 inline-flex"
                />
                Open project
              </span>
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
