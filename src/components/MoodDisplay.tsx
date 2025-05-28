import React from 'react';
import type { MoodEntry, MoodValue } from '../types';
import { MOOD_EMOJIS, MOOD_COLORS, MOOD_VALUES } from '../types';

interface MoodDisplayProps {
  selectedDate: string | null;
  entries: MoodEntry[];
}

// Helper to get mood text from value (e.g., VERY_HAPPY -> "Very Happy")
const getMoodText = (moodValue: MoodValue): string => {
  const moodKey = Object.keys(MOOD_VALUES).find(key => MOOD_VALUES[key as keyof typeof MOOD_VALUES] === moodValue);
  if (!moodKey) return 'Unknown';
  // Convert VERY_HAPPY to "Very Happy"
  return moodKey.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

const MoodDisplay: React.FC<MoodDisplayProps> = ({ selectedDate, entries }) => {
  if (!selectedDate) {
    return <div className="text-center text-gray-500 dark:text-gray-400 py-4">Select a date to see entries.</div>;
  }

  const formattedDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric' 
  });

  if (entries.length === 0) {
    return <div className="text-center text-gray-500 dark:text-gray-400 py-4">No entries for {formattedDate}.</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3">
        Entries for {formattedDate}
      </h3>
      {entries.map(entry => (
        <div 
          key={entry.id} 
          className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-700 transition-all duration-150 ease-in-out"
          style={{ borderLeft: `5px solid ${MOOD_COLORS[entry.mood]}` }}
        >
          <div className="flex items-center mb-2">
            <span className="text-3xl mr-3">{MOOD_EMOJIS[entry.mood]}</span>
            <div>
              <p className="font-semibold text-lg text-gray-800 dark:text-gray-100">{getMoodText(entry.mood)}</p>
              {entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {entry.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          {entry.note && (
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap text-sm">
              {entry.note}
            </p>
          )}
           <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-right">
            Logged at: {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MoodDisplay; 