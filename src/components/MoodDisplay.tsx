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

  const sortedMoods = entries.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  return (
    <div className="space-y-2">
      <h3 className="text-xl font-semibold text-yellow-400 dark:text-yellow-300 mb-2 text-center">
        {formatDateForDisplay(selectedDate)}
      </h3>
      <ul className="space-y-3">
        {sortedMoods.map((mood) => (
          <li
            key={mood.id}
            className="relative p-3 sm:p-4 bg-sky-500 dark:bg-sky-600 rounded-lg shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <span className="text-5xl">{MOOD_EMOJIS[mood.mood]}</span>
                <div className="flex-grow">
                  <p className="text-xl font-semibold text-yellow-400 dark:text-yellow-300">
                    {getMoodText(mood.mood)}
                  </p>
                  {mood.note && (
                    <p className="text-base text-yellow-300 dark:text-yellow-200 mt-1 italic">
                      {mood.note}
                    </p>
                  )}
                </div>
              </div>
              <p className="absolute top-2 right-3 text-sm text-yellow-300 dark:text-yellow-200">
                Logged: {new Date(mood.createdAt).toLocaleTimeString()}
              </p>
            </div>

            {mood.tags && mood.tags.length > 0 && (
              <div className="mt-2 pt-2 border-t border-sky-400 dark:border-sky-600">
                <p className="text-sm text-yellow-300 dark:text-yellow-200 mb-1">Tags:</p>
                <div className="flex flex-wrap gap-1.5">
                  {mood.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-sm rounded-full bg-blue-600 text-sky-100 dark:bg-blue-700 dark:text-sky-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MoodDisplay; 