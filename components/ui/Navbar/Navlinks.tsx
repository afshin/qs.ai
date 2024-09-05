'use client';

import Logo from '@/components/icons/Logo';
import { Button } from '@/components/ui/@shadcn/button';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { getRedirectMethod } from '@/utils/auth-helpers/settings';
import { LayoutGridIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { UserMenu } from '../UserMenu';
import s from './Navbar.module.css';

interface NavlinksProps {
  user?: any;
}

export default function Navlinks({ user }: NavlinksProps) {
  const clientRouter = useRouter();
  const router = getRedirectMethod() === 'client' ? clientRouter : null;
  const [showMenu, setShowMenu] = useState(false);
  const catMenu = useRef<HTMLDivElement>(null);
  useEffect(() => {
    window.addEventListener('click', (e) => {
      if (showMenu && !catMenu.current?.contains(e.target as any)) {
        setShowMenu(false);
      }
    });
  });
  return (
    <nav className="dark:text-white">
      <div ref={catMenu} className="flex flex-wrap items-center  mx-auto p-4">
        <Link
          href="/"
          className={`${s.logo} flex-grow`}
          aria-label="Logo"
          onClick={() => setShowMenu(false)}
        >
          <Logo />
        </Link>

        <div className="flex md:order-2 space-x-3 md:space-x-2 rtl:space-x-reverse pl-2">
          {user && (
            <Button
              title="Launcher"
              onClick={() => {
                router?.push('/launcher');
              }}
              variant="outline"
              size="icon"
              className="rounded-full"
            >
              <LayoutGridIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
              <span className="sr-only">Launcher</span>
            </Button>
          )}
          <ThemeSwitcher />
          {user ? (
            <UserMenu user={user} />
          ) : (
            <Link href="/signin" className={s.link}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
