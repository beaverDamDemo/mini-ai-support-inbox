import type { ReactNode } from 'react';

type PageHeadingProps = {
  title: string;
  action?: ReactNode;
};

export function PageHeading({ title, action }: PageHeadingProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <h1 className="text-2xl font-semibold tracking-tight text-[#202a24]">
        {title}
      </h1>
      {action}
    </div>
  );
}
