'use client';

import { Avatar, AvatarFallback } from '@/components/ui/@shadcn/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/@shadcn/dropdown-menu';
import { handleRequest } from '@/utils/auth-helpers/client';
import { SignOut } from '@/utils/auth-helpers/server';
import { useRouter } from 'next/navigation';
import * as React from 'react';

export function UserMenu({ user }: { user: any }) {
  const clientRouter = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="border border-input transition-colors">
          <AvatarFallback className=" cursor-pointer bg-background hover:bg-accent">
            {user.email.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            clientRouter.push('/account');
          }}
        >
          Account
        </DropdownMenuItem>
        <DropdownMenuItem>
          <form onSubmit={(e) => handleRequest(e, SignOut, clientRouter)}>
            <input type="hidden" name="pathName" value={''} />
            <button type="submit">Sign out</button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
