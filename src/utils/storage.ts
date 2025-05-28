import type { DayEntries, MoodEntry } from '../types';

const STORAGE_KEY = 'myDayMoodEntries';

export const getStoredEntries = (): DayEntries => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error reading from localStorage', error);
    return {};
  }
};

export const saveEntry = (entry: MoodEntry): void => {
  try {
    const allEntries = getStoredEntries();
    const entriesForDate = allEntries[entry.date] || [];
    // Add new entry and sort by createdAt to keep them in order if multiple on same day
    const updatedEntriesForDate = [...entriesForDate, entry].sort(
      (a, b) => a.createdAt - b.createdAt
    );
    const updatedAllEntries = {
      ...allEntries,
      [entry.date]: updatedEntriesForDate,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAllEntries));
  } catch (error) {
    console.error('Error saving to localStorage', error);
    // Potentially notify the user or handle error more gracefully
  }
};

// Function to get entries for a specific date
export const getEntriesForDate = (date: string): MoodEntry[] => {
  const allEntries = getStoredEntries();
  return allEntries[date] || [];
};

// Function to get all entries, potentially for a history view or calculations
export const getAllEntriesAsList = (): MoodEntry[] => {
  const allEntries = getStoredEntries();
  return Object.values(allEntries).flat().sort((a,b) => b.createdAt - a.createdAt); // Most recent first
};


// Utility to generate a simple unique ID (e.g., based on timestamp)
// For a more robust solution, a UUID library could be used.
export const generateId = (): string => {
  return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}; 