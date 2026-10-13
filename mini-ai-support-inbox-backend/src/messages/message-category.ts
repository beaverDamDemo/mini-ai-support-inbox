export const MESSAGE_CATEGORIES = [
  'inquiry',
  'complaint',
  'compliment',
  'other',
] as const;

export type MessageCategory = (typeof MESSAGE_CATEGORIES)[number];