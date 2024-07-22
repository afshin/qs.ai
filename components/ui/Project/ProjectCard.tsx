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
import { EditIcon, ShareIcon, TrashIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

interface IProps {
  name?: string;
  shortDesc?: string;
  description?: string;
  uid: string;
}
export function ProjectCard(props: IProps) {
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
        {/* <DialogTrigger>Open</DialogTrigger> */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              project and remove your data from our servers.
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
            <CardTitle>{props.name}</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger className="focus-visible:outline-none">
                <Ellipsis />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <ShareIcon size={'1rem'} className="mr-3" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
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
          <CardDescription>{props.shortDesc}</CardDescription>
        </CardHeader>
        <CardContent className="text-ellipsis grow overflow-auto">
          <p>{props.description}</p>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-foreground">
            <Link
              href={
                process.env.NEXT_PUBLIC_JUPYTERLITE_URL
                  ? `${process.env.NEXT_PUBLIC_JUPYTERLITE_URL}/lab/index.html?id=${props.uid}`
                  : `/jupyterlite/lab/index.html?id=${props.uid}`
              }
              target="_blank"
            >
              <span>Start project</span>
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
