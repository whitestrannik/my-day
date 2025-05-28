import React from 'react';
import type { MoodEntry } from '../types';

interface MoodDisplayProps {
  selectedDate: string | null;
  entries: MoodEntry[];
}

const MoodDisplay: React.FC<MoodDisplayProps> = ({ selectedDate, entries }) => {
  if (!selectedDate) return <div>Select a date to see entries.</div>;
  if (entries.length === 0) return <div>No entries for {selectedDate}.</div>;

  return (
    <div>
      <h3>Entries for {selectedDate}</h3>
      {/* Placeholder for displaying list of entries */}
      <ul>
        {entries.map(entry => (
          <li key={entry.id}>Mood: {entry.mood}, Note: {entry.note}</li>
        ))}
      </ul>
    </div>
  );
};

export default MoodDisplay; 