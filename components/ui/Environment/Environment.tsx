'use client';
import { IEnvironmentData } from '@/utils/database/environment';

import { NewProjectForm } from './NewEnvironmentForm';
import { ProjectCard } from './EnvironmentCard';
import { Button } from '@/components/ui/@shadcn/button';
import { useCallback, useState } from 'react';
import { PlusIcon } from 'lucide-react';
interface IProps {
  environments: { public: IEnvironmentData[]; private: IEnvironmentData[] };
}

export function Environment(props: IProps) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);

  const [cardProjectData, setCardProjectData] = useState<IEnvironmentData>();
  const editHandler = useCallback((data: IEnvironmentData) => {
    setCardProjectData(data);
    setOpenEdit(true);
  }, []);
  const detailHandler = useCallback((data: IEnvironmentData) => {
    setCardProjectData(data);
    setOpenDetail(true);
  }, []);

  return (
    <div className="col-span-9 sm:col-span-8 bg-accent px-16 pt-8 overflow-auto gap-8 flex flex-col">
      <div className="w-full flex justify-between border-b border-neutral-600">
        <h2 className=" scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0 text-left ">
          Default environments
        </h2>
        <NewProjectForm mode="new" open={openDrawer} setOpen={setOpenDrawer} />
        <NewProjectForm
          mode="edit"
          open={openEdit}
          setOpen={setOpenEdit}
          cardProjectData={cardProjectData}
        />
        <NewProjectForm
          mode="detail"
          open={openDetail}
          setOpen={setOpenDetail}
          cardProjectData={cardProjectData}
        />
      </div>
      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {props.environments.public.map((val, idx) => (
          <ProjectCard
            name={val.content?.name}
            latest={val.content?.latest}
            description={val.content?.description}
            uid={val.uid}
            key={val.uid}
            editHandler={() => editHandler(val)}
            detailHandler={() => detailHandler(val)}
            public={true}
          />
        ))}
      </div>
      <div className="w-full flex justify-between border-b border-neutral-600">
        <h1 className=" scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0 text-left">
          Custom environments
        </h1>
        <Button
          variant="outline"
          size="icon"
          className="bg-accent hover:bg-primary-foreground"
          onClick={() => setOpenDrawer(true)}
        >
          <PlusIcon />
        </Button>
      </div>
      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {props.environments.private.map((val, idx) => (
          <ProjectCard
            name={val.content?.name}
            latest={val.content?.latest}
            description={val.content?.description}
            uid={val.uid}
            key={val.uid}
            editHandler={() => editHandler(val)}
            detailHandler={() => detailHandler(val)}
          />
        ))}
      </div>
    </div>
  );
}
