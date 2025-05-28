import React from 'react';
import Calendar from 'react-calendar';
import type { CalendarProps } from 'react-calendar'; // Keep CalendarProps if needed for other configurations
import type { DayEntries, MoodValue } from '../types';
import { MOOD_COLORS, MOOD_VALUES } from '../types';
import 'react-calendar/dist/Calendar.css';
import '../App.css'; // For custom calendar tile styling

// Helper function to format date to YYYY-MM-DD
const toYYYYMMDD = (date: Date): string => date.toISOString().split('T')[0];

// Props expected by CalendarView from App.tsx
interface CalendarViewProps {
  allEntries: DayEntries;
  onDateSelect: (date: Date) => void; // App.tsx expects a single Date
  selectedDate: Date | null;
  activeStartDate: Date;
  onActiveStartDateChange: (params: { activeStartDate: Date | null; view?: string; action?: string }) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  allEntries,
  onDateSelect,
  selectedDate,
  activeStartDate,
  onActiveStartDateChange,
}) => {
  // Function to calculate average mood for a day and return its color
  const getDayMoodColor = (date: Date): string | undefined => {
    const dateString = toYYYYMMDD(date);
    const dayEntries = allEntries[dateString];
    if (!dayEntries || dayEntries.length === 0) return undefined;
    const sum = dayEntries.reduce((acc, entry) => acc + entry.mood, 0);
    const avgMoodValue = Math.round(sum / dayEntries.length) as MoodValue;
    return Object.values(MOOD_VALUES).includes(avgMoodValue) ? MOOD_COLORS[avgMoodValue] : undefined;
  };

  // Custom tile content or class based on mood
  const tileContent = ({ date, view }: { date: Date; view: string }): React.ReactNode => {
    if (view === 'month') {
      const color = getDayMoodColor(date);
      if (color) {
        return (
          <div
            className="mood-dot"
            style={{ backgroundColor: color }}
          ></div>
        );
      }
    }
    return null;
  };

  // react-calendar's onChange for single date selection passes a Date object.
  // The full type is `(value: Value, event: React.MouseEvent<HTMLButtonElement>) => void`
  // where Value is `Date | [Date, Date] | null` if selectRange can be true.
  // For default single date selection, value is effectively `Date`.
  const handleCalendarChange = (value: any, event: React.MouseEvent<HTMLButtonElement>) => {
    if (value instanceof Date) {
      onDateSelect(value);
    }
    // Not expecting ranges or null for single date selection click, but good to be aware.
  };

  return (
    <Calendar
      onChange={handleCalendarChange}
      value={selectedDate}
      activeStartDate={activeStartDate}
      onActiveStartDateChange={onActiveStartDateChange}
      tileContent={tileContent}
      className="mood-calendar"
    />
  );
};

export default CalendarView; 