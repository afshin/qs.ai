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
  ShareIcon,
  TrashIcon,
  SquareGanttChartIcon
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { FileBoxIcon } from 'lucide-react';

interface IProps {
  name?: string;
  latest?: string;
  description?: string;
  uid: string;
  public?: boolean;
  editHandler: () => void;
  detailHandler: () => void;
}
export function ProjectCard(props: IProps) {
  const { latest, description } = props;
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);

  const deleteEnv = useCallback(async () => {
    const response = await sendRequest<{ success: boolean; value: string }>({
      url: `/api/v1/env/${props.uid}`,
      method: 'DELETE'
    });
    if (response.success) {
      router.refresh();
    }
  }, [props.uid, router]);

  return (
    <>
      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              environment and remove your data from our servers.
            </DialogDescription>
            <DialogFooter>
              <Button variant={'secondary'} onClick={() => setConfirm(false)}>
                Cancel
              </Button>
              <Button variant={'destructive'} onClick={deleteEnv}>
                Delete
              </Button>
            </DialogFooter>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Card className="hover:drop-shadow-xl h-80 flex flex-col">
        <CardHeader>
          <div className="flex flex-row justify-between">
            <CardTitle className="text-xl">
              <div className="flex gap-2">
                <FileBoxIcon />
                <span className="leading-[100%]">{props.name}</span>
              </div>
            </CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger className="focus-visible:outline-none">
                <Ellipsis />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {!props.public && (
                  <>
                    <DropdownMenuItem>
                      <ShareIcon size={'1rem'} className="mr-3" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={props.editHandler}>
                      <EditIcon size={'1rem'} className="mr-3" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={props.detailHandler}>
                  <SquareGanttChartIcon size={'1rem'} className="mr-3" />
                  Detail
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {!props.public && (
                  <DropdownMenuItem onClick={() => setConfirm(true)}>
                    <TrashIcon size={'1rem'} className="mr-3" color="red" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardDescription>Latest version: {latest}</CardDescription>
        </CardHeader>
        <CardContent className="text-ellipsis grow overflow-auto">
          <p>{description}</p>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-foreground">
            <Link
              prefetch={false}
              href={
                process.env.NEXT_PUBLIC_JUPYTERLITE_URL
                  ? `${process.env.NEXT_PUBLIC_JUPYTERLITE_URL}/lab/index.html?id=${props.uid}`
                  : `/jupyterlite/lab/index.html?id=${props.uid}`
              }
              target="_blank"
            >
              <span>Create project</span>
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}