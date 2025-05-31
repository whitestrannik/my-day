import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { 
  saveEntry, 
  getStoredEntries, 
  getEntriesForDate, 
  getAllEntriesAsList, 
  generateId 
} from '../storage';
import type { MoodEntry } from '../../types';
import { MOOD_VALUES } from '../../types';

describe('Storage Utilities', () => {
  beforeEach(() => {
    // Clear localStorage before each test to ensure isolation
    localStorage.clear();
    // Spy on console.error to check for errors during localStorage operations
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.error spy
    vi.restoreAllMocks();
  });

  describe('generateId', () => {
    it('should generate a string ID', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });

    it('should generate different IDs on subsequent calls', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });
  });

  describe('saveEntry and getStoredEntries/getEntriesForDate/getAllEntriesAsList', () => {
    const entry1: MoodEntry = {
      id: generateId(),
      date: '2024-07-30',
      mood: MOOD_VALUES.HAPPY,
      tags: ['grateful'],
      note: 'A good day!',
      createdAt: Date.now(),
    };
    const entry2: MoodEntry = {
      id: generateId(),
      date: '2024-07-30',
      mood: MOOD_VALUES.SAD,
      tags: ['tired'],
      note: 'A tiring day',
      createdAt: Date.now() + 1000, // Ensure different timestamp
    };
    const entry3: MoodEntry = {
      id: generateId(),
      date: '2024-07-31',
      mood: MOOD_VALUES.NEUTRAL,
      tags: [],
      note: '',
      createdAt: Date.now() + 2000,
    };

    it('should save an entry and retrieve it correctly', () => {
      saveEntry(entry1);
      const stored = getStoredEntries();
      expect(stored['2024-07-30']).toBeDefined();
      expect(stored['2024-07-30'].length).toBe(1);
      expect(stored['2024-07-30'][0]).toEqual(entry1);
      expect(console.error).not.toHaveBeenCalled();
    });

    it('should retrieve entries for a specific date', () => {
      saveEntry(entry1);
      saveEntry(entry3); // Entry for a different date
      const entries = getEntriesForDate('2024-07-30');
      expect(entries.length).toBe(1);
      expect(entries[0]).toEqual(entry1);
    });

    it('should return an empty array if no entries for a specific date', () => {
      const entries = getEntriesForDate('2024-08-01');
      expect(entries.length).toBe(0);
    });

    it('should save multiple entries for the same date and sort them by createdAt', () => {
      // Save in reverse order of creation to test sorting
      const laterEntrySameDate = { ...entry2, createdAt: Date.now() + 500 };
      const earlierEntrySameDate = { ...entry1, createdAt: Date.now() };

      saveEntry(laterEntrySameDate);
      saveEntry(earlierEntrySameDate);
      
      const entries = getEntriesForDate('2024-07-30');
      expect(entries.length).toBe(2);
      expect(entries[0]).toEqual(earlierEntrySameDate); // Earlier one should be first
      expect(entries[1]).toEqual(laterEntrySameDate); // Later one should be second
    });

    it('should get all entries as a flat list, sorted by most recent first', () => {
      saveEntry(entry1); // Earlier
      saveEntry(entry3); // Later
      saveEntry(entry2); // Middle, but same date as entry1

      const allList = getAllEntriesAsList();
      expect(allList.length).toBe(3);
      // entry3 is latest overall, then entry2, then entry1 by createdAt
      expect(allList[0]).toEqual(entry3);
      expect(allList[1]).toEqual(entry2);
      expect(allList[2]).toEqual(entry1);
    });

    it('should handle errors during localStorage.getItem in getStoredEntries gracefully', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementationOnce(() => {
        throw new Error('Simulated localStorage.getItem error');
      });
      const entries = getStoredEntries();
      expect(entries).toEqual({});
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle errors during localStorage.setItem in saveEntry gracefully', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
        throw new Error('Simulated localStorage.setItem error');
      });
      saveEntry(entry1);
      // Check that console.error was called
      expect(console.error).toHaveBeenCalled();
      // Also check that subsequent get still works (or returns empty if setItem failed before any write)
      // This depends on whether the error happens before or after data is potentially corrupted
      // For this test, we just check that an error was logged.
    });
  });
}); 