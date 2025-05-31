import { useState, useEffect, useCallback } from 'react'
import './App.css'
import CalendarView from './components/CalendarView'
import MoodForm from './components/MoodForm'
import MoodDisplay from './components/MoodDisplay'
import DailyAverageMood from './components/DailyAverageMood'
import { getEntriesForDate as getEntriesForDateFromStorage, saveEntry as saveEntryToStorage, generateId, getStoredEntries } from './utils/storage'
import type { MoodEntry, MoodValue, DayEntries } from './types'
import { MOOD_VALUES } from './types' // For calculating average
import 'react-calendar/dist/Calendar.css'

// Helper to get today's date in YYYY-MM-DD format
const getTodayDateString = () => new Date().toISOString().split('T')[0];

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [isMoodFormOpen, setIsMoodFormOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(() => getTodayDateString()); // Initialize with today's date
  const [entriesForSelectedDate, setEntriesForSelectedDate] = useState<MoodEntry[]>([])
  const [allEntries, setAllEntries] = useState<DayEntries>(() => getStoredEntries())
  const [averageMoodForSelectedDate, setAverageMoodForSelectedDate] = useState<MoodValue | null>(null)
  const [activeStartDate, setActiveStartDate] = useState(new Date())

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const calculateAverageMoodValue = useCallback((entries: MoodEntry[]): MoodValue | null => {
    if (!entries || entries.length === 0) return null;
    const totalMoodValue = entries.reduce((sum, entry) => sum + entry.mood, 0);
    const avg = Math.round(totalMoodValue / entries.length);
    if (Object.values(MOOD_VALUES).includes(avg as MoodValue)) {
      return avg as MoodValue;
    }
    return MOOD_VALUES.NEUTRAL; // Default if calculation is off range
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const entries = getEntriesForDateFromStorage(selectedDate) || [];
      setEntriesForSelectedDate(entries);
      setAverageMoodForSelectedDate(calculateAverageMoodValue(entries));
    } else {
      setEntriesForSelectedDate([]);
      setAverageMoodForSelectedDate(null);
    }
  }, [selectedDate, allEntries, calculateAverageMoodValue]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date.toISOString().split('T')[0])
  }

  const handleOpenMoodForm = () => {
    setIsMoodFormOpen(true)
  }

  const handleCloseMoodForm = () => {
    setIsMoodFormOpen(false)
  }

  const handleSaveMoodEntry = (entryData: Omit<MoodEntry, 'id' | 'createdAt'>) => {
    const newEntry: MoodEntry = {
      ...entryData,
      id: generateId(),
      createdAt: Date.now(),
    };
    saveEntryToStorage(newEntry);
    setAllEntries(getStoredEntries());
    handleCloseMoodForm();
  }

  const handleActiveStartDateChange = (newActiveStartDateFromCalendar: Date | null) => {
    if (newActiveStartDateFromCalendar) {
      setActiveStartDate(newActiveStartDateFromCalendar);
    }
  }

  // Conditional rendering for mobile: Full page MoodForm or main app content
  if (isMobile && isMoodFormOpen) {
    return (
      <MoodForm
        isOpen={isMoodFormOpen}
        onClose={handleCloseMoodForm}
        onSave={handleSaveMoodEntry}
        isMobile={isMobile}
        selectedDateForEntry={selectedDate || undefined}
      />
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-6 sm:py-10 px-4 transition-colors duration-300 bg-slate-800 dark:bg-slate-950">
      {/* Main content container - sections within become blue cards */}
      <div className="w-full max-w-md space-y-6">
        {/* Header - now a blue card with yellow elements */}
        <header className="flex justify-between items-center p-3 sm:p-4 bg-sky-700 dark:bg-sky-800 rounded-2xl shadow-lg">
          <div className="flex items-center">
            <h1 className="text-4xl font-bold text-yellow-400 dark:text-yellow-300 tracking-tight m-0">My day</h1>
            <span className="ml-2 text-2xl animate-gentle-bounce">✨</span>
          </div>
          <button
            onClick={handleOpenMoodForm}
            className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 dark:text-blue-950 font-semibold py-2.5 px-5 text-lg rounded-lg shadow-sm hover:shadow-md transition-colors duration-150 ease-in-out"
          >
            Add mood
          </button>
        </header>

        <main className="space-y-5">
          {/* Daily Average Mood Section - show if a date is selected */}
          {selectedDate && (
            <section className="p-3 sm:p-4 bg-sky-700 dark:bg-sky-800 rounded-2xl shadow-lg">
              <h2 className="text-xl font-semibold text-yellow-400 dark:text-yellow-300 mb-2 text-center">
                Average mood for this day
              </h2>
              <DailyAverageMood dailyAverageMood={averageMoodForSelectedDate} />
            </section>
          )}

          {/* Calendar Section - back to blue card, calendar component inside will be yellow */}
          <section className="p-3 sm:p-4 bg-sky-700 dark:bg-sky-800 rounded-2xl shadow-lg">
            <CalendarView 
              allEntries={allEntries}
              onDateSelect={handleDateSelect}
              activeStartDate={activeStartDate}
              onActiveStartDateChange={({ activeStartDate: newDate }) => handleActiveStartDateChange(newDate)}
              selectedDate={selectedDate ? new Date(selectedDate + "T00:00:00") : null}
            />
          </section>

          {/* Selected Day Details Section - blue card */}
          {selectedDate && (
            <section className="p-3 sm:p-4 bg-sky-700 dark:bg-sky-800 rounded-2xl shadow-lg">
              <MoodDisplay 
                selectedDate={selectedDate} 
                entries={entriesForSelectedDate} 
              />
            </section>
          )}
        </main>
      </div>

      {/* MoodForm modal for desktop */}
      {!isMobile && (
        <MoodForm
          isOpen={isMoodFormOpen}
          onClose={handleCloseMoodForm}
          onSave={handleSaveMoodEntry}
          isMobile={isMobile}
          selectedDateForEntry={selectedDate || undefined}
        />
      )}
    </div>
  )
}

export default App
