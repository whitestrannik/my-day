export const MOOD_VALUES = {
  VERY_SAD: 1, // 😞
  SAD: 2, // 🙁
  NEUTRAL: 3, // 😐
  HAPPY: 4, // 🙂
  VERY_HAPPY: 5, // 😄
} as const;

export type MoodValue = (typeof MOOD_VALUES)[keyof typeof MOOD_VALUES];

export const MOOD_EMOJIS: Record<MoodValue, string> = {
  [MOOD_VALUES.VERY_SAD]: '😞',
  [MOOD_VALUES.SAD]: '🙁',
  [MOOD_VALUES.NEUTRAL]: '😐',
  [MOOD_VALUES.HAPPY]: '🙂',
  [MOOD_VALUES.VERY_HAPPY]: '😄',
};

export const MOOD_COLORS: Record<MoodValue, string> = {
  [MOOD_VALUES.VERY_SAD]: '#FF6B6B', // Red
  [MOOD_VALUES.SAD]: '#FFA07A', // Light Salmon (Orange-ish)
  [MOOD_VALUES.NEUTRAL]: '#FFD700', // Gold (Yellow)
  [MOOD_VALUES.HAPPY]: '#90EE90', // Light Green
  [MOOD_VALUES.VERY_HAPPY]: '#32CD32', // Lime Green (Bright Green)
};

export const TAGS = [
  'calm',
  'anxious',
  'excited',
  'tired',
  'focused',
  'creative',
  'stressed',
  'energetic',
  'grateful',
  'motivated',
] as const;

export type Tag = (typeof TAGS)[number];

export interface MoodEntry {
  id: string; // Unique ID for each entry, e.g., timestamp or UUID
  date: string; // YYYY-MM-DD format
  mood: MoodValue;
  tags: Tag[];
  note: string; // Max 120 characters
  createdAt: number; // Timestamp for sorting entries on the same day if needed
}

export interface DayEntries {
  [date: string]: MoodEntry[];
} 