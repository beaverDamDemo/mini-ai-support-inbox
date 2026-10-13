'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    fetch('http://localhost:3000/hello')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Hello route returned ${response.status}`);
        }
        return response.json();
      })
      .then((data) => console.log('Backend /hello response:', data))
      .catch((error: unknown) =>
        console.error('Failed to fetch backend /hello route:', error),
      );
  }, []);

  return (
    <main className="flex flex-1 items-center justify-center px-6">
      <h1 className="text-center text-3xl font-semibold text-black dark:text-zinc-50">
        Mini AI Support Inbox
      </h1>
    </main>
  );
}
