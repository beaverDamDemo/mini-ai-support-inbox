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
      <span className="rounded-full bg-[#edf1ee] px-2.5 py-1 text-xs font-medium capitalize text-[#4d5d53]">
        {category || 'Unclassified'}
      </span>
      <span
        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
          approved
            ? 'bg-[#e4f2e9] text-[#245a44]'
            : 'bg-[#fff2d8] text-[#805d1a]'
        }`}
      >
        {approved ? 'Approved' : 'Needs review'}
      </span>
    </div>
  );
}
