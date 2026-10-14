type MessageStatusPillProps = {
  approved: boolean;
  category: string | null;
};

export function MessageStatusPill({
  approved,
  category,
}: MessageStatusPillProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="rounded-full border border-border bg-canvas-subtle px-2.5 py-1 text-xs font-medium capitalize text-muted">
        {category || 'Unclassified'}
      </span>
      <span
        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
          approved
            ? 'border border-success-foreground/20 bg-success-background text-success-foreground'
            : 'border border-warning-foreground/20 bg-warning-background text-warning-foreground'
        }`}
      >
        {approved ? 'Approved' : 'Needs review'}
      </span>
    </div>
  );
}
