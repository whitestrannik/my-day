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
    return <p className="text-center text-sm text-sky-100 dark:text-sky-50 py-4">No mood data for this month.</p>;
  }

  // Define the segments for the gauge based on all possible mood values
  const gaugeSegments = (
    Object.keys(MOOD_VALUES) as Array<keyof typeof MOOD_VALUES>
  ).map(key => ({
    name: getMoodText(MOOD_VALUES[key]), // Use the reinstated getMoodText
    value: 1, // Each segment takes an equal part of the arc
    color: MOOD_COLORS[MOOD_VALUES[key]],
  }));

  const moodValue = averageMood;
  const emojiForMood = MOOD_EMOJIS[moodValue];
  const textForMood = getMoodText(moodValue);

  const startAngle = 180;
  const endAngle = 0;
  // const totalGaugeValue = gaugeSegments.reduce((sum, seg) => sum + seg.value, 0); // Not strictly needed for angle calc if using MOOD_VALUES range

  // Calculate needle angle: 180-degree arc. Moods 1-5 (VERY_SAD to VERY_HAPPY).
  // Map moodValue (1-5) to an angle from 0 (leftmost part of arc) to 180 (rightmost part of arc).
  // The needle div rotates clockwise. 0deg is pointing up. Our gauge arc is a semi-circle downwards.
  // Left edge of arc = -90deg from vertical. Right edge = +90deg from vertical.
  // Total moods = 5 (VERY_SAD, SAD, NEUTRAL, HAPPY, VERY_HAPPY)
  // Number of intervals = 4
  // Angle per interval = 180 / 4 = 45 degrees.
  // Angle for mood: (moodValue - MOOD_VALUES.VERY_SAD) * 45 degrees.
  // This angle is from the leftmost point. For rotation from vertical (bottom pivot):
  // Leftmost (-90) corresponds to mood 1. Rightmost (+90) to mood 5.
  // angle_from_vertical = ((moodValue - MOOD_VALUES.VERY_SAD) / (MOOD_VALUES.VERY_HAPPY - MOOD_VALUES.VERY_SAD)) * 180 - 90;
  const normalizedMoodPosition = (moodValue - MOOD_VALUES.VERY_SAD) / (MOOD_VALUES.VERY_HAPPY - MOOD_VALUES.VERY_SAD);
  const needleRotation = normalizedMoodPosition * 180 - 90; // -90 for left, 0 for middle, +90 for right


  return (
    // Use flex row for gauge and text/emoji, allow wrap, center items
    <div className="w-full flex flex-row flex-wrap items-center justify-center text-center gap-x-4 gap-y-2 py-2">
      {/* Gauge container - fixed small size */}
      <div className="w-32 h-16 relative"> {/* Reduced width and height further */}
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={gaugeSegments}
              cx="50%"
              cy="100%"
              startAngle={startAngle}
              endAngle={endAngle}
              innerRadius="70%"
              outerRadius="100%"
              fill="#8884d8"
              paddingAngle={1}
              dataKey="value"
              stroke="none"
            >
              {gaugeSegments.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Needle */}
        <div 
          className="absolute left-1/2 w-0.5 h-[calc(50%-2px)] bg-sky-100 dark:bg-sky-50 origin-bottom transform -translate-x-1/2 rounded-full"
          style={{ transform: `rotate(${needleRotation}deg)`, bottom: '2px' }} // Adjusted needle for smaller gauge
        ></div>
      </div>
      {/* Emoji and Text - smaller text, less margin */}
      <div className="text-center"> 
        <span className="text-2xl sm:text-3xl block">{emojiForMood}</span>
        <p className="text-xs font-medium text-sky-100 dark:text-sky-50 mt-0">
          {textForMood}
        </p>
      </div>
    </div>
  );
};

export default AverageMoodGauge; 