'use client';

import { Button } from '@/components/ui/@shadcn/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
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
import { ChangeEvent, useCallback, useState } from 'react';

import { CodeEditor } from '@/components/ui/CodeEditor/CodeEditor';
import { sendRequest } from '@/utils/helpers';
import { useRouter } from 'next/navigation';

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

export function NewProjectForm() {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState('');
  const [checkName, setCheckName] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [summary, setSummary] = useState('');
  const [desc, setDesc] = useState('');
  const [kernelCode, setKernelCode] = useState(BASE_KERNEL_ENV);
  const [buildCode, setBuildCode] = useState(BASE_BUILD_ENV);
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
    setSubmitting(true);
    const response = await sendRequest<{ success: boolean; value: string }>({
      url: '/api/v1/env',
      method: 'POST',
      data: { name, summary, desc, kernelCode, buildCode }
    });
    setSubmitting(false);
    if (response.success) {
      setName('');
      setSummary('');
      setDesc('');
      setKernelCode(BASE_KERNEL_ENV);
      setBuildCode(BASE_BUILD_ENV);
      setOpen(false);
      router.refresh();
    }
  }, [name, summary, desc, kernelCode, buildCode, router]);
  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="bg-foreground w-32"> Add new</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create New Project</DrawerTitle>
        </DrawerHeader>
        <div className="h-full p-4 space-y-4 overflow-auto">
          <div className="space-y-2">
            <Label>Project name *</Label>
            <Input
              type="text"
              value={name}
              onChange={onNameChange}
              placeholder="Public display project name"
              className={checkName && name.length === 0 ? 'border-red-500' : ''}
            />
          </div>
          <div className="space-y-2">
            <Label>Summary</Label>
            <Input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Short summary of your project (Optional)"
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Full description of your project (Optional)"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
          <Tabs defaultValue="kernel" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="kernel">Kernel environment</TabsTrigger>
              <TabsTrigger value="build">Build environment</TabsTrigger>
            </TabsList>
            <TabsContent value="kernel">
              <CodeEditor
                code={kernelCode}
                setCode={setKernelCode}
                language={yaml()}
              />
            </TabsContent>
            <TabsContent value="build">
              <CodeEditor
                code={buildCode}
                setCode={setBuildCode}
                language={yaml()}
              />
            </TabsContent>
          </Tabs>
        </div>
        <DrawerFooter className="flex-row-reverse">
          <Button
            className="bg-foreground"
            onClick={submit}
            loading={submitting}
          >
            Submit
          </Button>
          <DrawerClose asChild>
            <Button variant={'secondary'}>Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
