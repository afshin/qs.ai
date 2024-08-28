'use client';

import Link from 'next/link';
import { SignOut } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import Logo from '@/components/icons/Logo';
import { usePathname, useRouter } from 'next/navigation';
import { getRedirectMethod } from '@/utils/auth-helpers/settings';
import s from './Navbar.module.css';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { useState, useEffect, useRef } from 'react';

interface NavlinksProps {
  user?: any;
}

export default function Navlinks({ user }: NavlinksProps) {
  const clientRouter = useRouter();
  const router = getRedirectMethod() === 'client' ? clientRouter : null;
  const pathName = usePathname();
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
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse pl-2">
          <ThemeSwitcher />

          <button
            onClick={() => setShowMenu(!showMenu)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-cta"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          className={`items-center justify-between ${!showMenu ? 'hidden' : 'visible'}  w-full md:flex md:w-auto md:order-1`}
        >
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4  md:space-x-4 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 bg-background border rounded-lg md:drop-shadow-none drop-shadow-md">
            <li>
              {user && (
                <Link
                  href="/launcher/environment"
                  className={s.link}
                  onClick={() => setShowMenu(false)}
                >
                  <span>Launcher</span>
                </Link>
              )}
            </li>
            <li>
              {user && (
                <Link
                  href="/account"
                  className={s.link}
                  onClick={() => setShowMenu(false)}
                >
                  Account
                </Link>
              )}
            </li>
            <li>
              {user ? (
                <form
                  onSubmit={(e) => handleRequest(e, SignOut, router)}
                  className={s.link}
                >
                  <input type="hidden" name="pathName" value={pathName} />
                  <button type="submit" onClick={() => setShowMenu(false)}>
                    Sign out
                  </button>
                </form>
              ) : (
                <Link href="/signin" className={s.link}>
                  Sign In
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
