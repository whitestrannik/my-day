import React from 'react';
import type { MoodEntry, MoodValue } from '../types';
import { MOOD_EMOJIS, MOOD_COLORS, MOOD_VALUES } from '../types';

interface MoodDisplayProps {
  selectedDate: string; // YYYY-MM-DD
  entries: MoodEntry[];
}

// Helper to get mood text from value (e.g., VERY_HAPPY -> "Very Happy")
const getMoodText = (moodValue: MoodValue): string => {
  const moodKey = Object.keys(MOOD_VALUES).find(key => MOOD_VALUES[key as keyof typeof MOOD_VALUES] === moodValue);
  if (!moodKey) return 'Unknown';
  // Convert VERY_HAPPY to "Very Happy"
  return moodKey.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

const formatDateForDisplay = (dateString: string): string => {
  const date = new Date(dateString + 'T00:00:00'); // Ensure correct date parsing
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (date.getTime() === today.getTime()) {
    return `Today, ${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`;
  }
  return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

const MoodDisplay: React.FC<MoodDisplayProps> = ({ selectedDate, entries }) => {
  if (!selectedDate) {
    return <p className="text-center text-sky-100 dark:text-sky-50 py-4">Select a day to see your entries.</p>;
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="font-semibold text-sky-50 dark:text-sky-100 mb-1">{formatDateForDisplay(selectedDate)}</p>
        <p className="text-sky-100 dark:text-sky-200">No mood logged for this day.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-sky-50 dark:text-sky-100 mb-2 text-center">
        {formatDateForDisplay(selectedDate)}
      </h3>
      <ul className="space-y-3">
        {entries.map(entry => (
          <li 
            key={entry.id} 
            className="p-3 rounded-lg shadow-sm border-l-4 transition-all duration-200 hover:shadow-md bg-yellow-100 dark:bg-yellow-700"
            style={{ borderColor: MOOD_COLORS[entry.mood] }}
          >
            <div className="flex items-start space-x-2.5">
              <span className="text-5xl">{MOOD_EMOJIS[entry.mood]}</span>
              <div className="flex-grow relative">
                <p className="absolute top-0 right-0 text-xs text-blue-500 dark:text-blue-400 pt-0.5 pr-0.5">
                  {new Date(entry.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                </p>
                <p className="font-semibold text-blue-800 dark:text-blue-200 text-lg mr-16">{getMoodText(entry.mood)}</p>
                {entry.note && <p className="text-sm text-blue-700 dark:text-blue-300 whitespace-pre-wrap break-words mt-1">{entry.note}</p>}
                {entry.tags && entry.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {entry.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="px-2.5 py-1 text-sm font-medium bg-blue-600 text-yellow-300 dark:bg-blue-700 dark:text-yellow-200 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MoodDisplay; 