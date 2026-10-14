import type { ReactNode } from 'react';

type PageHeadingProps = {
  title: string;
  action?: ReactNode;
};

export function PageHeading({ title, action }: PageHeadingProps) {
  return (
    <div className="page-heading">
      <h1 className="text-2xl font-semibold leading-tight text-foreground">
        {title}
      </h1>
      {action}
    </div>
  );
}
