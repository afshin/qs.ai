'use client';
import { IEnvironmentData } from '@/utils/database/environment';

import { NewProjectForm } from './NewProjectForm';
import { ProjectCard } from './ProjectCard';

interface IProps {
  environments: IEnvironmentData[];
}
export default function Project(props: IProps) {
  return (
    <div className="col-span-9 sm:col-span-8 bg-accent px-16 pt-16 overflow-auto">
      <div className="w-full flex justify-between">
        <h1 className=" scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-left">
          My projects
        </h1>
        <NewProjectForm />
      </div>
      <div className="pt-16 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {props.environments.map((val, idx) => (
          <ProjectCard
            name={val.content?.name}
            shortDesc={val.content?.shortDesc}
            description={val.content?.description}
            uid={val.uid}
            key={val.uid}
          />
        ))}
      </div>
    </div>
  );
}
