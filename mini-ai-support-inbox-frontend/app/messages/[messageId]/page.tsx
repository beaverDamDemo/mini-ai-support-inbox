import { Suspense } from 'react';
import { MessageDetail } from '@/features/messages/components/message-detail';

export default function MessagePage({
  params,
}: PageProps<'/messages/[messageId]'>) {
  return (
    <Suspense
      fallback={
        <p className="py-8 text-sm text-[#65736b]" role="status">
          Loading message...
        </p>
      }
    >
      <MessagePageContent params={params} />
    </Suspense>
  );
}

async function MessagePageContent({
  params,
}: {
  params: Promise<{ messageId: string }>;
}) {
  const { messageId } = await params;

  return <MessageDetail messageId={messageId} />;
}
