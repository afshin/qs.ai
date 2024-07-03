'use client';

import Link from 'next/link';
import { SignOut } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import Logo from '@/components/icons/Logo';
import { usePathname, useRouter } from 'next/navigation';
import { getRedirectMethod } from '@/utils/auth-helpers/settings';
import s from './Navbar.module.css';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';

interface NavlinksProps {
  user?: any;
}

export default function Navlinks({ user }: NavlinksProps) {
  const clientRouter = useRouter();
  const router = getRedirectMethod() === 'client' ? clientRouter : null;
  const pathName = usePathname();
  return (
    <div className="relative flex flex-row justify-between py-4 align-center md:py-4  dark:text-white">
      <div className="flex items-center flex-1">
        <Link href="/" className={s.logo} aria-label="Logo">
          <Logo />
        </Link>
        <nav className="ml-6 space-x-2 lg:block">
          <Link href="/pricing" className={s.link}>
            Pricing
          </Link>
          {user && (
            <Link href="/launcher/home" className={s.link}>
              <span>Launcher</span>
            </Link>
          )}
          {user && (
            <Link href="/account" className={s.link}>
              Account
            </Link>
          )}
        </nav>
      </div>
      <div className="flex justify-end items-center space-x-8">
        <ThemeSwitcher />
        {user ? (
          <form onSubmit={(e) => handleRequest(e, SignOut, router)}>
            <input type="hidden" name="pathName" value={pathName} />
            <button type="submit" className={s.link}>
              Sign out
            </button>
          </form>
        ) : (
          <Link href="/signin" className={s.link}>
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}
