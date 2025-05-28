import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Text } from 'recharts';
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
    return <p className="text-center text-gray-500 dark:text-gray-400 py-4">Not enough data for this month's average mood.</p>;
  }

  const moodValue = averageMood; // This is 1-5
  const totalSegments = 5; // Our mood scale

  // Data for the gauge (semi-circle)
  // We create segments for the pie chart. One for each mood up to the average, then one for the remainder.
  const data = [
    { name: 'Mood Segment', value: moodValue, color: MOOD_COLORS[moodValue] },
    { name: 'Remainder', value: totalSegments - moodValue, color: '#e0e0e0' }, // Light gray for the rest
  ];

  const emojiForMood = MOOD_EMOJIS[moodValue];
  const textForMood = getMoodText(moodValue);

  // For a semi-circle gauge, we use startAngle and endAngle
  const startAngle = 180;
  const endAngle = 0;

  return (
    <div className="w-full h-48 md:h-56 flex flex-col items-center justify-center">
      <ResponsiveContainer width="70%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="100%" // Position the center at the bottom for a semi-circle
            startAngle={startAngle}
            endAngle={endAngle}
            innerRadius="60%" // Creates the doughnut hole
            outerRadius="100%"
            fill="#8884d8"
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          {/* Custom label for emoji in the center - Recharts positioning can be tricky */}
          {/* A simpler approach might be to overlay HTML text if this becomes too complex */}
        </PieChart>
      </ResponsiveContainer>
      <div className="text-center -mt-10 md:-mt-12 z-10">
        <span className="text-4xl md:text-5xl block">{emojiForMood}</span>
        <p className="text-md md:text-lg font-semibold text-gray-700 dark:text-gray-200">{textForMood}</p>
      </div>
    </div>
  );
};

export default AverageMoodGauge; 