const apiBaseUrl = (
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'
).replace(/\/$/, '');

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has('content-type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers,
    cache: 'no-store',
  });

  if (!response.ok) {
    const responseBody = await response.text();
    throw new Error(responseBody || `Request failed (${response.status})`);
  }

  return (await response.json()) as T;
}