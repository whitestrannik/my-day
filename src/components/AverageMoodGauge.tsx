import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { MoodValue } from '../types';
import { MOOD_COLORS, MOOD_EMOJIS, MOOD_VALUES } from '../types';

interface AverageMoodGaugeProps {
  averageMood: MoodValue | null;
}

// Helper to get mood text from value (e.g., VERY_HAPPY -> "Very Happy")
const getMoodText = (moodValue: MoodValue): string => {
  const moodKey = Object.keys(MOOD_VALUES).find(key => MOOD_VALUES[key as keyof typeof MOOD_VALUES] === moodValue);
  if (!moodKey) return 'Unknown';
  return moodKey.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

const AverageMoodGauge: React.FC<AverageMoodGaugeProps> = ({ averageMood }) => {
  if (averageMood === null) {
    return <p className="text-center text-sm text-slate-400 dark:text-slate-500 py-4">No mood data for this month.</p>;
  }

  const moodValue = averageMood;
  const totalSegments = 5;

  const data = [
    { name: 'Mood Segment', value: moodValue, color: MOOD_COLORS[moodValue] },
    { name: 'Remainder', value: totalSegments - moodValue, color: 'rgba(200, 200, 200, 0.5)' },
  ];

  const emojiForMood = MOOD_EMOJIS[moodValue];
  const textForMood = getMoodText(moodValue);

  const startAngle = 180;
  const endAngle = 0;

  return (
    <div className="w-full h-36 sm:h-40 flex flex-col items-center justify-center relative">
      <ResponsiveContainer width="55%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="100%"
            startAngle={startAngle}
            endAngle={endAngle}
            innerRadius="60%"
            outerRadius="95%"
            fill="#8884d8"
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute bottom-[5%] sm:bottom-[8%] text-center z-10">
        <span className="text-3xl sm:text-4xl block">{emojiForMood}</span>
        <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
          {textForMood}
        </p>
      </div>
    </div>
  );
};

export default AverageMoodGauge; 