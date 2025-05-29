import { describe, it, expect } from 'vitest';
import type { MoodEntry, MoodValue } from '../types'; // Assuming types are in ../types
import { MOOD_VALUES } from '../types';

// This is the function we want to test. 
// In a real scenario, if this function is inside App.tsx and not exported,
// you might test it indirectly via component props/state changes, or refactor it into a testable utility.
// For this example, we assume we can call it directly.
const calculateAverageMood = (currentEntries: MoodEntry[], month: number, year: number): MoodValue | null => {
  const relevantEntries = currentEntries.filter(entry => {
    const entryDate = new Date(entry.date + 'T00:00:00'); // Ensure date parsing is consistent
    return entryDate.getMonth() + 1 === month && entryDate.getFullYear() === year;
  });
  if (relevantEntries.length === 0) {
    return null;
  }
  const sum = relevantEntries.reduce((acc, curr) => acc + curr.mood, 0);
  const avg = Math.round(sum / relevantEntries.length) as MoodValue;
  
  if (Object.values(MOOD_VALUES).includes(avg)) {
    return avg;
  } else {
    // This case should ideally not be hit if inputs are valid MoodValues
    // but as a fallback for safety, though null might be better if avg is out of expected range.
    return MOOD_VALUES.NEUTRAL; 
  }
};

describe('calculateAverageMood', () => {
  const createEntry = (date: string, mood: MoodValue, idSuffix: string = ''): MoodEntry => ({
    id: `test-id-${idSuffix}`,
    date,
    mood,
    tags: [],
    note: '',
    createdAt: new Date(date).getTime(),
  });

  it('should return null if no entries for the month', () => {
    const entries: MoodEntry[] = [createEntry('2024-06-15', MOOD_VALUES.HAPPY)];
    expect(calculateAverageMood(entries, 7, 2024)).toBeNull();
  });

  it('should calculate average for a single entry', () => {
    const entries: MoodEntry[] = [createEntry('2024-07-15', MOOD_VALUES.HAPPY)];
    expect(calculateAverageMood(entries, 7, 2024)).toBe(MOOD_VALUES.HAPPY);
  });

  it('should calculate average for multiple entries (whole number result)', () => {
    const entries: MoodEntry[] = [
      createEntry('2024-07-10', MOOD_VALUES.VERY_HAPPY), // 5
      createEntry('2024-07-12', MOOD_VALUES.NEUTRAL),    // 3
    ];
    expect(calculateAverageMood(entries, 7, 2024)).toBe(MOOD_VALUES.HAPPY); // (5+3)/2 = 4
  });

  it('should round fractional averages correctly (e.g., 3.5 rounds to 4)', () => {
    const entries: MoodEntry[] = [
      createEntry('2024-07-10', MOOD_VALUES.HAPPY),      // 4
      createEntry('2024-07-11', MOOD_VALUES.NEUTRAL),    // 3
    ];
    // (4+3)/2 = 3.5, rounds to 4 (HAPPY)
    expect(calculateAverageMood(entries, 7, 2024)).toBe(MOOD_VALUES.HAPPY);
  });

  it('should round fractional averages correctly (e.g., 3.4 rounds to 3)', () => {
    const entries: MoodEntry[] = [
      createEntry('2024-07-10', MOOD_VALUES.NEUTRAL),    // 3
      createEntry('2024-07-11', MOOD_VALUES.NEUTRAL),    // 3
      createEntry('2024-07-12', MOOD_VALUES.HAPPY)       // 4
    ];
     // (3+3+4)/3 = 3.33, rounds to 3 (NEUTRAL)
    expect(calculateAverageMood(entries, 7, 2024)).toBe(MOOD_VALUES.NEUTRAL);
  });

  it('should only consider entries from the specified month and year', () => {
    const entries: MoodEntry[] = [
      createEntry('2024-07-05', MOOD_VALUES.VERY_HAPPY), // 5 (target month)
      createEntry('2024-06-20', MOOD_VALUES.SAD),        // (wrong month)
      createEntry('2023-07-10', MOOD_VALUES.SAD),        // (wrong year)
      createEntry('2024-07-25', MOOD_VALUES.HAPPY),      // 4 (target month)
    ];
    // (5+4)/2 = 4.5, rounds to 5 (VERY_HAPPY)
    expect(calculateAverageMood(entries, 7, 2024)).toBe(MOOD_VALUES.VERY_HAPPY);
  });

   it('should handle an empty array of entries', () => {
    const entries: MoodEntry[] = [];
    expect(calculateAverageMood(entries, 7, 2024)).toBeNull();
  });
}); 