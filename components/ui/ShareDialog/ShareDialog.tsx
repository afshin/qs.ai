import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle
} from '@/components/ui/@shadcn/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/@shadcn/select';
import { TagInput, Tag } from 'emblor';
import { Avatar, AvatarFallback } from '@/components/ui/@shadcn/avatar';
import { sendRequest } from '@/utils/helpers';
import { Button } from '@/components/ui/@shadcn/button';
import { useCallback, useEffect, useState } from 'react';
import { validateEmail } from '@/utils/helpers';
import { LoadingSpinner } from '../LoadingSpinner';
interface IProps {
  open: boolean;
  setOpen: (arg: boolean) => void;
  projectUID: string;
}
interface ISharedProject {
  email: string;
  role: string;
  pending?: boolean;
}

export function ShareDialog(props: IProps) {
  const { open, setOpen, projectUID } = props;
  const [tags, setTags] = useState<Tag[]>([]);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(1);
  const [role, setRole] = useState<'owner' | 'viewer'>('viewer');
  const [sharedData, setSharedData] = useState<ISharedProject[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const fetchData = useCallback(async () => {
    setFetching(true);
    const response = await sendRequest<{
      success: boolean;
      value?: string;
      data?: ISharedProject[];
    }>({
      url: `/api/v1/resource-sharing/${projectUID}`,
      method: 'GET'
    });
    if (response.success && response.data) {
      setSharedData(response.data);

      setFetching(false);
    } else {
      setErrorMessage('Error: ' + response.value ?? '');
      setFetching(false);
    }
  }, [projectUID]);

  const sendInvitation = useCallback(async () => {
    const emails = tags.map((it) => it.text);
    const response = await sendRequest<{ success: boolean; value: string }>({
      url: `/api/v1/resource-sharing/${projectUID}`,
      method: 'POST',
      data: { emails, role }
    });
    if (response.success) {
      await fetchData();
    }
  }, [tags, role, projectUID, fetchData]);

  useEffect(() => {
    if (open) {
      fetchData().catch(console.error);
    }
  }, [open, fetchData]);
  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (val) {
          setTags([]);
          setActiveTagIndex(null);
        }
        setOpen(val);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share project</DialogTitle>
          <DialogDescription>
            Project environment and storage space will be shared
          </DialogDescription>
        </DialogHeader>{' '}
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <TagInput
              placeholder="Enter emails"
              tags={tags}
              setTags={(newTags) => {
                setTags(newTags);
              }}
              activeTagIndex={activeTagIndex}
              setActiveTagIndex={setActiveTagIndex}
              styleClasses={{ inlineTagsContainer: 'min-h-10' }}
              addTagsOnBlur={true}
              validateTag={validateEmail}
            />

            <Select
              value={role}
              onValueChange={(e) => setRole(e as 'viewer' | 'owner')}
            >
              <SelectTrigger className="focus:[box-shadow:none]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={'viewer'}>Role: Viewer</SelectItem>
                <SelectItem value={'owner'}>Role: Owner</SelectItem>
              </SelectContent>
            </Select>
            <Button
              className="px-3 bg-foreground"
              onClick={sendInvitation}
              disabled={errorMessage.length > 0}
            >
              <span>Invite</span>
            </Button>
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <div className="flex flex-col pt-2 border-t-2 gap-1 grow relative min-h-16">
            {fetching && (
              <LoadingSpinner className="absolute top-[calc(50%-12px)] left-[calc(50%-12px)]" />
            )}

            {sharedData.map((it, idx) => (
              <div
                key={idx}
                className={`flex flex-row flex-1 gap-3 items-center transition-all ${fetching ? 'opacity-0' : 'opacity-100'}`}
              >
                <Avatar className="border border-input transition-colors">
                  <AvatarFallback className=" cursor-pointer bg-background hover:bg-accent">
                    {it.email.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="flex-1">{it.email}</span>
                <span>
                  {it.role} {it.pending ? '(pending)' : ''}
                </span>
              </div>
            ))}
            <span>{errorMessage}</span>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}