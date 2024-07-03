import { Metadata } from 'next';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import { Toaster } from '@/components/ui/Toasts/toaster';
import { PropsWithChildren, Suspense } from 'react';
import { getURL } from '@/utils/helpers';
import { Inter as FontSans } from 'next/font/google';
import { ThemeProvider } from 'next-themes';

import 'styles/main.css';
import { cn } from '@/utils/cn';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
});

const meta = {
  title: 'QS.AI',
  description: 'Brought to you by QuantStack',
  cardImage: '/og.png',
  robots: 'follow, index',
  favicon: '/favicon.ico',
  url: getURL()
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: meta.title,
    description: meta.description,
    referrer: 'origin-when-cross-origin',
    keywords: [],
    authors: [{ name: 'QuantStack', url: 'https://quantstack.net/' }],
    creator: 'QuantStack',
    publisher: 'QuantStack',
    robots: meta.robots,
    icons: { icon: meta.favicon },
    metadataBase: new URL(meta.url),
    openGraph: {
      url: meta.url,
      title: meta.title,
      description: meta.description,
      images: [meta.cardImage],
      type: 'website',
      siteName: meta.title
    }
  };
}

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" data-theme="dark">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main
            id="skip"
            className="min-h-[calc(100dvh-5rem)] md:min-h[calc(100dvh-5rem)]"
          >
            {children}
          </main>
          <Footer />
          <Suspense>
            <Toaster />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
