import React from 'react';
import type { MoodValue } from '../types';
import { MOOD_COLORS, MOOD_EMOJIS, MOOD_VALUES } from '../types';

interface AverageMoodGaugeProps {
  averageMood: MoodValue | null;
}

const getMoodText = (moodValue: MoodValue): string => {
  const moodKey = Object.keys(MOOD_VALUES).find(
    (key) => MOOD_VALUES[key as keyof typeof MOOD_VALUES] === moodValue
  );
  if (!moodKey) return 'Unknown';
  return moodKey
    .replace('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

const AverageMoodGauge: React.FC<AverageMoodGaugeProps> = ({ averageMood }) => {
  if (averageMood === null) {
    return (
      <p className="text-center text-sm text-yellow-400 dark:text-yellow-300 py-4">
        No mood data for this month.
      </p>
    );
  }

  const moodValue = averageMood;
  const emojiForMood = MOOD_EMOJIS[moodValue];
  const textForMood = getMoodText(moodValue);

  // Order of moods for the status bar (Very Sad to Very Happy)
  const moodBarOrder: MoodValue[] = [
    MOOD_VALUES.VERY_SAD,
    MOOD_VALUES.SAD,
    MOOD_VALUES.NEUTRAL,
    MOOD_VALUES.HAPPY,
    MOOD_VALUES.VERY_HAPPY,
  ];

  return (
    <div className="w-full flex flex-row items-center justify-start gap-x-3 py-2">
      {/* Emoji */}
      <span className="text-3xl">{emojiForMood}</span>

      {/* Mood Text and Score */}
      <p className="text-lg font-medium text-yellow-400 dark:text-yellow-300">
        Average: {textForMood} ({moodValue})
      </p>

      {/* Spacer to push mood bar to the right, if desired, or manage spacing with justify-between on parent */}
      {/* <div className="flex-grow"></div> */}

      {/* Mood Status Bar */}
      <div className="flex items-center gap-x-1 ml-auto"> {/* ml-auto to push it to the right */}
        {moodBarOrder.map((barMoodValue) => (
          <div
            key={barMoodValue}
            className={`w-5 h-5 rounded-sm transition-all duration-200 ease-in-out
                        ${moodValue === barMoodValue ? 'transform scale-125 opacity-100 ring-2 ring-offset-1 ring-offset-sky-700 dark:ring-offset-sky-800 ring-white dark:ring-gray-300' : 'opacity-60 hover:opacity-80'}
                        sm:w-4 sm:h-4 md:w-5 md:h-5`} // Responsive block size
            style={{ backgroundColor: MOOD_COLORS[barMoodValue] }}
            title={getMoodText(barMoodValue)} // Tooltip for accessibility
          ></div>
        ))}
      </div>
    </div>
  );
};

export default AverageMoodGauge; 