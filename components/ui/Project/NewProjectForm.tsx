'use client';
import { Button } from '@/components/ui/@shadcn/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/@shadcn/drawer';
import { Input } from '@/components/ui/@shadcn/input';
import { Label } from '@/components/ui/@shadcn/label';
import { Textarea } from '@/components/ui/@shadcn/textarea';
import {
  IEnvironmentData,
  IEnvironmentDetail
} from '@/utils/database/environment';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/@shadcn/select';
import { sendRequest } from '@/utils/helpers';
import { useRouter } from 'next/navigation';
import { IProjectData } from '@/utils/database/project';
interface IProps {
  mode: 'new' | 'edit' | 'detail';
  open: boolean;
  setOpen: (arg: boolean) => void;
  cardProjectData?: Partial<IProjectData>;
  allEnvs: IEnvironmentData[];
}

function createVersionItems(allVersions?: {
  [key: string]: IEnvironmentDetail;
}): { value: string; label: string }[] {
  if (!allVersions) {
    return [];
  }
  const sorted = Object.keys(allVersions);
  sorted.sort((a, b) => {
    const createdAtA = Date.parse(allVersions[a].created_at);
    const createdAtB = Date.parse(allVersions[b].created_at);
    return -createdAtA + createdAtB;
  });

  const allVersionItems: { label: string; value: string }[] = [];
  sorted.forEach((v) => {
    allVersionItems.push({ label: v, value: allVersions[v].uid });
  });
  return allVersionItems;
}

export const envDetailFromVersion = (
  versionUID: string,
  allEnvs: IEnvironmentData[]
) => {
  let version = '';
  let name = '';
  let envUID = '';
  for (const it of allEnvs) {
    if (it.allVersions) {
      for (const versionKey in it.allVersions) {
        if (it.allVersions[versionKey].uid === versionUID) {
          version = versionKey;
          name = it.content?.name ?? '';
          envUID = it.uid;
          break;
        }
      }
    }
  }
  return { name, version, envUID };
};
export function NewProjectForm(props: IProps) {
  const { mode, open, setOpen, cardProjectData, allEnvs } = props;
  const [name, setName] = useState('');
  const [checkName, setCheckName] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedEnv, setSelectedEnv] = useState<string | undefined>(undefined);
  const [allAvailableVersion, setAllAvailableVersion] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedEnvVersion, setSelectedEnvVersion] = useState<
    string | undefined
  >(undefined);

  const router = useRouter();
  useEffect(() => {}, [allEnvs]);

  const onSelectedEnvChange = useCallback(
    (value: string) => {
      const selectedList = allEnvs.filter((it) => it.uid === value);
      if (selectedList.length > 0) {
        const allVersions = selectedList[0]?.allVersions;
        const versionItems = createVersionItems(allVersions);
        setAllAvailableVersion(versionItems);
        setSelectedEnvVersion(versionItems[0].value);
        setSelectedEnv(value);
      }
    },
    [allEnvs]
  );
  const [desc, setDesc] = useState('');

  const onNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setCheckName(false);
    setName(newVal);
  }, []);
  const submit = useCallback(async () => {
    if (name.length === 0) {
      setCheckName(true);
      return;
    }
    let response: { success: boolean; value: string } = {
      success: false,
      value: ''
    };
    if (mode === 'edit') {
      setSubmitting(true);
      response = await sendRequest<{ success: boolean; value: string }>({
        url: `/api/v1/project/${cardProjectData?.uid}`,
        method: 'PATCH',
        data: { name, desc, environment: selectedEnvVersion }
      });
    } else if (mode === 'new') {
      setSubmitting(true);
      response = await sendRequest<{ success: boolean; value: string }>({
        url: '/api/v1/project',
        method: 'POST',
        data: { name, desc, environment: selectedEnvVersion }
      });
    }
    setSubmitting(false);
    if (response.success) {
      setName('');

      setDesc('');
      setOpen(false);
      router.refresh();
    }
  }, [
    name,
    mode,
    desc,
    selectedEnvVersion,
    router,
    setOpen,
    cardProjectData?.uid
  ]);

  useEffect(() => {
    if (cardProjectData) {
      const { name, description, env_version } = cardProjectData;
      setName(name ?? '');
      if (env_version) {
        const detail = envDetailFromVersion(env_version, allEnvs);
        onSelectedEnvChange(detail.envUID);
        setSelectedEnvVersion(cardProjectData.env_version);
      }
      if (description !== undefined) {
        setDesc(description);
      }
    } else {
      setName('');
      setDesc('');
      const firstEnv = allEnvs[0];
      if (firstEnv.allVersions) {
        const versionItems = createVersionItems(firstEnv.allVersions);
        setAllAvailableVersion(versionItems);
        setSelectedEnvVersion(versionItems[0].value);
      }
      if (firstEnv?.uid) {
        setSelectedEnv(firstEnv.uid);
      }
    }
  }, [open, mode, cardProjectData, allEnvs, onSelectedEnvChange]);

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <DrawerContent className="focus-visible:outline-none">
        <DrawerHeader>
          <DrawerTitle>
            {mode === 'new'
              ? 'Create New Project'
              : mode === 'edit'
                ? 'Edit Project'
                : 'Project Detail'}
          </DrawerTitle>
        </DrawerHeader>
        <div className="h-full p-4 space-y-4 overflow-auto">
          <div className="space-y-2">
            <Label>Project name *</Label>
            <Input
              type="text"
              value={name}
              readOnly={mode === 'detail'}
              onChange={onNameChange}
              placeholder="Public display project name"
              className={checkName && name.length === 0 ? 'border-red-500' : ''}
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Description of your project (Optional)"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              readOnly={mode === 'detail'}
              rows={5}
            />
          </div>
          <div className="space-y-2">
            <Label>Environment</Label>
            <Select value={selectedEnv} onValueChange={onSelectedEnvChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {props.allEnvs.map((it, idx) => (
                  <SelectItem value={it.uid ?? ''} key={idx}>
                    {it.content?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Environment version</Label>
            <Select
              value={selectedEnvVersion}
              onValueChange={(value) => setSelectedEnvVersion(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {allAvailableVersion.map((it, idx) => (
                  <SelectItem value={it.value} key={idx}>
                    {it.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DrawerFooter className="flex-row justify-between">
          <DrawerClose asChild>
            <Button variant={'secondary'}>Cancel</Button>
          </DrawerClose>
          {mode !== 'detail' && (
            <Button
              className="bg-foreground"
              onClick={submit}
              loading={submitting}
            >
              Submit
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
