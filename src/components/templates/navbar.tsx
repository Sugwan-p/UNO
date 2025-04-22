'use client';

import {
  Navbar as NavbarComponent,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
} from '@heroui/react';
import { useRouter } from 'next/navigation';

import { ThemeSwitch } from '@/components/atoms/ThemeSwitch';

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default function App() {
  const router = useRouter();

  return (
    <NavbarComponent isBordered maxWidth="2xl">
      <NavbarContent justify="start">
        <NavbarBrand className="cursor-pointer">
          <button
            className="hidden sm:block text-2xl font-bold text-mono-100 hover:text-main transition-colors"
            onClick={() => router.push('/')}
          >
            UNO GAME
          </button>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="gap-10" justify="end">
        <NavbarContent className="hidden sm:flex gap-6" justify="end">
          <NavbarItem>
            <Link color="foreground" href="test">
              게임 찾기
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="rules">
              규칙 설명
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="/">
              연습 하기
            </Link>
          </NavbarItem>
        </NavbarContent>
        <ThemeSwitch />
      </NavbarContent>
    </NavbarComponent>
  );
}
