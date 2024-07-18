'use client';

import { Button } from '@/components/ui/@shadcn/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/@shadcn/card';
import { IEnvironmentData } from '@/utils/database/environment';

import Link from 'next/link';

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
        <Button className="bg-foreground w-32"> Add new</Button>
      </div>
      <div className="pt-16 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {props.environments.map((val, idx) => (
          <Card className="hover:drop-shadow-xl h-80 flex flex-col" key={idx}>
            <CardHeader>
              <CardTitle>{val.content?.name}</CardTitle>
              <CardDescription>{val.content?.shortDesc}</CardDescription>
            </CardHeader>
            <CardContent className="text-ellipsis grow overflow-auto">
              <p>{val.content?.description}</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-foreground">
                <Link
                  href={
                    process.env.NEXT_PUBLIC_JUPYTERLITE_URL
                      ? `${process.env.NEXT_PUBLIC_JUPYTERLITE_URL}/lab/index.html?id=${val.uid}`
                      : `/jupyterlite/lab/index.html?id=${val.uid}`
                  }
                  target="_blank"
                >
                  <span>Start project</span>
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
