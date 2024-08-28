'use client';
import { IEnvironmentData } from '@/utils/database/environment';

import { envDetailFromVersion, NewProjectForm } from './NewProjectForm';
import { ProjectCard } from './ProjectCard';
import { Button } from '@/components/ui/@shadcn/button';
import { useCallback, useMemo, useState } from 'react';
import { PlusIcon } from 'lucide-react';
import { IProjectData } from '@/utils/database/project';
interface IProps {
  environments: { public: IEnvironmentData[]; private: IEnvironmentData[] };
  projects: IProjectData[];
}

export function Project(props: IProps) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);

  const [cardProjectData, setCardProjectData] = useState<IProjectData>();
  const editHandler = useCallback((data: IProjectData) => {
    setCardProjectData(data);
    setOpenEdit(true);
  }, []);
  const detailHandler = useCallback((data: IProjectData) => {
    setCardProjectData(data);
    setOpenDetail(true);
  }, []);
  const allEnvs = useMemo(
    () => [...props.environments.private, ...props.environments.public],
    [props.environments]
  );

  return (
    <div className="col-span-9 sm:col-span-8 bg-accent px-16 pt-8 overflow-auto gap-8 flex flex-col">
      <div className="w-full flex justify-between border-b border-neutral-600">
        <h2 className=" scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0 text-left ">
          My projects
        </h2>
        <Button
          variant="outline"
          size="icon"
          className="bg-accent hover:bg-primary-foreground"
          onClick={() => setOpenDrawer(true)}
        >
          <PlusIcon />
        </Button>
        <NewProjectForm
          mode="new"
          open={openDrawer}
          setOpen={setOpenDrawer}
          allEnvs={allEnvs}
        />
        <NewProjectForm
          mode="edit"
          open={openEdit}
          setOpen={setOpenEdit}
          cardProjectData={cardProjectData}
          allEnvs={allEnvs}
        />
        <NewProjectForm
          mode="detail"
          open={openDetail}
          setOpen={setOpenDetail}
          cardProjectData={cardProjectData}
          allEnvs={allEnvs}
        />
      </div>
      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {props.projects.map((val, idx) => (
          <ProjectCard
            name={val.name}
            description={val.description}
            envUID={val.env_version}
            envDetail={envDetailFromVersion(val.env_version, allEnvs)}
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
