export type Message = {
  id: number;
  customerMessage: string;
  category: string | null;
  generatedReply: string | null;
  approved: boolean;
  createdAt: string;
};

export type CreateMessageInput = {
  customerMessage: string;
};