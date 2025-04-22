import '@/styles/globals.css';
import { Metadata, Viewport } from 'next';
import clsx from 'clsx';

import { Providers } from './providers';

import { siteConfig } from '@/config/site';
import { fontSans, paperlogy, pretendard } from '@/config/fonts';
import Navbar from '@/components/templates/navbar';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`, // 예: Rules | UNO GAME
  },
  description: siteConfig.description,
  keywords: ['UNO', '우노게임', '카드게임', '온라인 게임'],
  authors: [{ name: '박수관', url: 'https://github.com/Sugwan-p' }],
  creator: 'Sugwan-p',
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: 'https://uno-theta-plum.vercel.app/', // 배포 URL로 수정
    siteName: siteConfig.name,
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    creator: '@yourTwitterID',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          'min-h-screen bg-background font-pretendard antialiased',
          fontSans.variable,
          pretendard.variable,
          paperlogy.variable,
        )}
      >
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
          <Navbar />
          <main className="container mx-auto max-w-screen-2xl pt-16 px-6 flex-grow">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
