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
    return <p className="text-center text-slate-500 dark:text-slate-400 py-4">Select a day to see your entries.</p>;
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">{formatDateForDisplay(selectedDate)}</p>
        <p className="text-slate-500 dark:text-slate-400">No mood logged for this day.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-3 text-center">
        {formatDateForDisplay(selectedDate)}
      </h3>
      <ul className="space-y-4">
        {entries.map(entry => (
          <li 
            key={entry.id} 
            className="p-4 rounded-lg shadow-sm border-l-4 bg-white dark:bg-slate-800 transition-all duration-200 hover:shadow-md"
            style={{ borderColor: MOOD_COLORS[entry.mood] }}
          >
            <div className="flex items-start space-x-3">
              <span className="text-3xl">{MOOD_EMOJIS[entry.mood]}</span>
              <div className="flex-grow">
                <p className="font-semibold text-slate-800 dark:text-slate-100">{getMoodText(entry.mood)}</p>
                {entry.note && <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 whitespace-pre-wrap break-words">{entry.note}</p>}
                {entry.tags && entry.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {entry.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="px-2.5 py-0.5 text-xs font-medium bg-sky-100 text-sky-700 dark:bg-sky-700 dark:text-sky-100 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                 <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 text-right">
                  Logged at: {new Date(entry.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MoodDisplay; 