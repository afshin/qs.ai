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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/@shadcn/tabs';
import { Textarea } from '@/components/ui/@shadcn/textarea';
import { yaml } from '@codemirror/lang-yaml';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';

import { CodeEditor } from '@/components/ui/CodeEditor/CodeEditor';
import { sendRequest } from '@/utils/helpers';
import { useRouter } from 'next/navigation';
import { IEnvironmentData } from '@/utils/database/environment';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/@shadcn/select';

const BASE_KERNEL_ENV = `name: xeus-python-kernel
channels:
  - https://repo.mamba.pm/emscripten-forge
  - conda-forge
dependencies:
  - xeus-python`;

const BASE_BUILD_ENV = `name: build-env

channels:
  - conda-forge
  - conda-forge/label/jupyterlite_core_alpha

dependencies:
  - python=3.11
  - pip
  - jupyterlite-core >=0.3.0,<0.4.0
  - jupyterlite-xeus>=0.1.2,<0.2
  - jupyterlab >=4.0.5,<5
  - empack >=3.1.0`;

interface IProps {
  mode: 'new' | 'edit' | 'detail';
  open: boolean;
  setOpen: (arg: boolean) => void;
  cardProjectData?: IEnvironmentData;
}
export function NewProjectForm(props: IProps) {
  const { mode, open, setOpen, cardProjectData } = props;
  const [name, setName] = useState('');

  const [checkName, setCheckName] = useState(false);
  const [checkVersion, setCheckVersion] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [version, setVersion] = useState('');
  const [desc, setDesc] = useState('');
  const [kernelCode, setKernelCode] = useState(BASE_KERNEL_ENV);
  const [buildCode, setBuildCode] = useState(BASE_BUILD_ENV);
  const [lockCode, setLockCode] = useState('');

  const router = useRouter();
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
    if (mode === 'edit' && cardProjectData) {
      if (version.length === 0 || cardProjectData.allVersions?.[version]) {
        setCheckVersion(true);
        return;
      }
      setSubmitting(true);
      response = await sendRequest<{ success: boolean; value: string }>({
        url: `/api/v1/env/${cardProjectData.uid}`,
        method: 'PATCH',
        data: { name, version: version, desc, kernelCode, buildCode }
      });
    } else {
      setSubmitting(true);
      response = await sendRequest<{ success: boolean; value: string }>({
        url: '/api/v1/env',
        method: 'POST',
        data: { name, version: version, desc, kernelCode, buildCode }
      });
    }
    setSubmitting(false);
    if (response.success) {
      setName('');
      setVersion('');
      setDesc('');
      setKernelCode(BASE_KERNEL_ENV);
      setBuildCode(BASE_BUILD_ENV);
      setOpen(false);
      router.refresh();
    }
  }, [
    name,
    version,
    desc,
    kernelCode,
    buildCode,
    router,
    setOpen,
    mode,
    cardProjectData
  ]);
  const [selectedVersion, setSelectedVersion] = useState<string | undefined>();
  useEffect(() => {
    setSelectedVersion(cardProjectData?.content?.latest);
  }, [cardProjectData?.content?.latest]);
  useEffect(() => {
    if ((mode === 'edit' || mode === 'detail') && cardProjectData) {
      const { content, allVersions } = cardProjectData;
      if (content && allVersions) {
        const { latest, name, description } = content;
        const versionName =
          mode === 'edit' ? latest : selectedVersion ?? latest;
        const selectedProject = allVersions[versionName];

        setName(name);

        setVersion(latest);

        if (description !== undefined) {
          setDesc(description);
        }
        if (selectedProject?.definition?.kernelEnv !== undefined) {
          setKernelCode(selectedProject.definition.kernelEnv);
        }
        if (selectedProject?.definition?.buildEnv !== undefined) {
          setBuildCode(selectedProject.definition.buildEnv);
        }
        if (selectedProject?.lockfile !== undefined) {
          setLockCode(JSON.stringify(selectedProject.lockfile));
        }
      }
    }
  }, [open, mode, cardProjectData, selectedVersion]);

  const allVersionName = useMemo(() => {
    const allVersion = cardProjectData?.allVersions;
    if (!allVersion) {
      return [];
    } else {
      const sorted = Object.keys(allVersion);
      sorted.sort((a, b) => {
        const createdAtA = Date.parse(allVersion[a].created_at);
        const createdAtB = Date.parse(allVersion[b].created_at);
        return -createdAtA + createdAtB;
      });
      return sorted;
    }
  }, [cardProjectData?.allVersions]);

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <DrawerContent className="focus-visible:outline-none">
        <DrawerHeader>
          <DrawerTitle>
            {mode === 'new'
              ? 'Create New Environment'
              : mode === 'edit'
                ? 'Edit Environment'
                : 'Environment detail'}
          </DrawerTitle>
        </DrawerHeader>
        <div className="h-full p-4 space-y-4 overflow-auto">
          <div className="space-y-2">
            <Label>Environment name *</Label>
            <Input
              type="text"
              value={name}
              readOnly={mode === 'detail'}
              onChange={onNameChange}
              placeholder="Public display environment name"
              className={checkName && name.length === 0 ? 'border-red-500' : ''}
            />
          </div>
          <div className="space-y-2">
            <Label>
              {' '}
              {checkVersion ? `Version ${version} already exists!` : 'Version'}
            </Label>
            {mode !== 'detail' && (
              <Input
                type="text"
                value={version}
                onChange={(e) => {
                  setCheckVersion(false);
                  setVersion(e.target.value);
                }}
                placeholder="Environment version (default to 1.0.0)"
                className={checkVersion ? 'border-red-500' : ''}
              />
            )}
            {mode === 'detail' && (
              <Select
                value={selectedVersion}
                onValueChange={(value) => setSelectedVersion(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {allVersionName.map((it, idx) => (
                    <SelectItem value={it} key={idx}>
                      {it}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Description of your environment (Optional)"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              readOnly={mode === 'detail'}
            />
          </div>
          <Tabs defaultValue="kernel" className="w-full">
            <TabsList
              className={`grid w-full ${mode === 'detail' ? 'grid-cols-3' : 'grid-cols-2'}`}
            >
              <TabsTrigger value="kernel">Kernel environment</TabsTrigger>
              <TabsTrigger value="build">Build environment</TabsTrigger>
              {mode === 'detail' && (
                <TabsTrigger value="lock">Environment lock</TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="kernel">
              <CodeEditor
                code={kernelCode}
                setCode={setKernelCode}
                language={yaml()}
                readOnly={mode === 'detail'}
              />
            </TabsContent>
            <TabsContent value="build">
              <CodeEditor
                code={buildCode}
                setCode={setBuildCode}
                language={yaml()}
                readOnly={mode === 'detail'}
              />
            </TabsContent>
            {mode === 'detail' && (
              <TabsContent value="lock">
                <CodeEditor
                  code={lockCode}
                  setCode={() => {}}
                  language={yaml()}
                  readOnly={true}
                />
              </TabsContent>
            )}
          </Tabs>
        </div>
        <DrawerFooter className="flex-row-reverse">
          {mode !== 'detail' && (
            <Button
              className="bg-foreground"
              onClick={submit}
              loading={submitting}
            >
              Submit
            </Button>
          )}
          <DrawerClose asChild>
            <Button variant={'secondary'}>Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
