import React from 'react';
import type { MoodValue } from '../types'; // Assuming MoodValue is defined in types

interface AverageMoodGaugeProps {
  averageMood: MoodValue | null; // Or number if we pass the raw average
}

const AverageMoodGauge: React.FC<AverageMoodGaugeProps> = ({ averageMood }) => {
  if (averageMood === null) return <div>No mood data for this month.</div>;
  
  // Placeholder for Recharts gauge implementation
  return <div>Average Mood Gauge Placeholder (Mood: {averageMood})</div>;
};

export default AverageMoodGauge; 