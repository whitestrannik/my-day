import React from 'react';
import Calendar from 'react-calendar';
import type { MoodEntry, DayEntries, MoodValue } from '../types/index';
import { MOOD_COLORS, MOOD_VALUES } from '../types/index';
import 'react-calendar/dist/Calendar.css';
import '../App.css'; // For custom calendar tile styling

// Helper function to format date to YYYY-MM-DD
// const toYYYYMMDD = (date: Date): string => date.toISOString().split('T')[0]; // Not used, can be removed

// Props expected by CalendarView from App.tsx
interface CalendarViewProps {
  allEntries: DayEntries;
  onDateSelect: (date: Date) => void;
  activeStartDate: Date;
  onActiveStartDateChange: (params: { action: string; activeStartDate: Date | null; value: any; view: string }) => void;
  selectedDate: Date | null;
}

// Function to calculate average mood for a single day
const calculateDailyAverageMood = (entries: MoodEntry[]): MoodValue | null => {
  if (!entries || entries.length === 0) return null;
  const sum = entries.reduce((acc, entry) => acc + entry.mood, 0);
  const avg = Math.round(sum / entries.length) as MoodValue;
  return Object.values(MOOD_VALUES).includes(avg) ? avg : null;
};

// Custom formatter for weekday labels (e.g., M, T, W)
const formatShortWeekday = (_locale: string | undefined, date: Date): string => {
  return new Intl.DateTimeFormat(_locale, { weekday: 'short' }).format(date).charAt(0).toUpperCase();
};

const CalendarView: React.FC<CalendarViewProps> = ({ 
  allEntries, 
  onDateSelect, 
  activeStartDate, 
  onActiveStartDateChange,
  selectedDate
}) => {
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      const dayEntries = allEntries[dateString];
      if (dayEntries && dayEntries.length > 0) {
        const avgMood = calculateDailyAverageMood(dayEntries);
        if (avgMood && MOOD_COLORS[avgMood]) {
          return (
            <div className="flex justify-center items-center h-full pt-1">
              <span 
                className="mood-dot w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: MOOD_COLORS[avgMood] }}
              ></span>
            </div>
          );
        }
      }
    }
    return null;
  };

  return (
    <div className="flex justify-center">
      <Calendar
        className="react-calendar mood-calendar bg-yellow-50 dark:bg-stone-800" // Added Tailwind BG class, dark:bg-stone-800 is a dark desaturated yellow-ish color
        onClickDay={onDateSelect}
        tileContent={tileContent}
        value={selectedDate}
        activeStartDate={activeStartDate}
        onActiveStartDateChange={onActiveStartDateChange} // Propagates the full params object
        formatShortWeekday={formatShortWeekday}
        showNeighboringMonth={false}
        prev2Label={null}
        next2Label={null}
        // Ensure navigation labels are accessible for styling and testing
        prevLabel={<span aria-label="Previous month">‹</span>} 
        nextLabel={<span aria-label="Next month">›</span>}
      />
    </div>
  );
};

export default CalendarView; 