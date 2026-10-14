import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mini AI Support Inbox',
  description: 'Review and manage customer messages.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-screen bg-background font-sans text-foreground">
        <header className="border-b border-border bg-surface">
          <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-5">
            <Link className="flex items-center gap-3 font-semibold" href="/">
              <span className="flex size-8 items-center justify-center rounded-md bg-accent text-sm font-bold text-white">
                M
              </span>
              <span>Mini AI Support Inbox</span>
            </Link>
            <nav
              aria-label="Main navigation"
              className="flex items-center gap-2"
            >
              <Link
                className="gh-button gh-button-primary"
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
