import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Mini AI Support Inbox',
  description: 'Review and manage customer messages.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-[#f3f6f4] text-[#202a24]">
        <header className="border-b border-[#dce5df] bg-white">
          <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-5">
            <Link className="flex items-center gap-3 font-semibold" href="/">
              <span className="flex size-8 items-center justify-center rounded-md bg-[#245a44] text-sm text-white">
                M
              </span>
              <span>Mini AI Support Inbox</span>
            </Link>
            <nav
              aria-label="Main navigation"
              className="flex items-center gap-2"
            >
              <Link
                className="rounded-md px-3 py-2 text-sm text-[#4d5d53] hover:bg-[#f1f5f2]"
                href="/"
              >
                Inbox
              </Link>
              <Link
                className="rounded-md bg-[#245a44] px-3 py-2 text-sm font-medium text-white hover:bg-[#194832]"
                href="/messages/new"
              >
                New message
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
