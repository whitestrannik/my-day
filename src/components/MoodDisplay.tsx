import React from 'react';
import type { MoodEntry, MoodValue } from '../types';
import { MOOD_EMOJIS, MOOD_VALUES } from '../types'; // MOOD_COLORS no longer needed here

interface MoodDisplayProps {
  selectedDate: string; // YYYY-MM-DD
  entries: MoodEntry[];
}

// Helper to get mood text (no longer used in render, but could be for tooltips or future features)
const getMoodText = (moodValue: MoodValue): string => {
  const moodKey = Object.keys(MOOD_VALUES).find(key => MOOD_VALUES[key as keyof typeof MOOD_VALUES] === moodValue);
  if (!moodKey) return 'Unknown';
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
      <h3 className="text-xl font-semibold text-yellow-400 dark:text-yellow-300 mb-3 text-center">
        {formatDateForDisplay(selectedDate)}
      </h3>
      <ul className="space-y-2.5"> {/* Reduced space between list items */}
        {sortedMoods.map((mood) => (
          <li
            key={mood.id}
            // Changed to items-start for better alignment with multi-line notes
            className="p-2.5 bg-sky-600 dark:bg-sky-700 rounded-lg shadow-md flex items-start gap-x-3"
          >
            {/* Mood Emoji - Medium Size */}
            <span className="text-3xl pt-0.5">{MOOD_EMOJIS[mood.mood]}</span> {/* Added small top padding to emoji for better visual alignment with top of text */}

            {/* Center Content: Note (if exists) and Tags */}
            <div className="flex-grow min-w-0"> {/* min-w-0 for proper behavior with flexbox */}
              {mood.note && (
                // Removed truncate class to allow wrapping, and removed JS truncate call
                <p className="text-sm text-sky-100 dark:text-sky-50 mb-1 break-words">
                  {mood.note}
                </p>
              )}
              {mood.tags && mood.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 items-center">
                  {mood.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs rounded-full bg-sky-400 dark:bg-sky-500 text-sky-50 dark:text-sky-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {/* If no note and no tags, perhaps a placeholder or ensure vertical alignment is maintained */}
              {!mood.note && (!mood.tags || mood.tags.length === 0) && (
                <div className="h-5"></div> /* Placeholder to maintain height if no note/tags for alignment */
              )}
            </div>

            {/* Logged Time - Small, on the right */}
            <p className="text-xs text-sky-200 dark:text-sky-300 whitespace-nowrap pt-1"> {/* Added small top padding for better visual alignment */}
              {new Date(mood.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MoodDisplay; 