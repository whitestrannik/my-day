import { useState, useEffect, useCallback } from 'react'
import './App.css'
import CalendarView from './components/CalendarView'
import MoodForm from './components/MoodForm'
import MoodDisplay from './components/MoodDisplay'
import AverageMoodGauge from './components/AverageMoodGauge'
import { getEntriesForDate as getEntriesForDateFromStorage, saveEntry as saveEntryToStorage, getAllEntriesAsList as getAllEntriesListFromStorage, generateId, getStoredEntries } from './utils/storage'
import type { MoodEntry, MoodValue, DayEntries } from './types'
import { MOOD_VALUES } from './types' // For calculating average
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [isMoodFormOpen, setIsMoodFormOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [entriesForSelectedDate, setEntriesForSelectedDate] = useState<MoodEntry[]>([])
  const [allEntries, setAllEntries] = useState<DayEntries>(() => getStoredEntries())
  const [averageMonthlyMood, setAverageMonthlyMood] = useState<MoodValue | null>(null)
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
    const dateToLoad = selectedDate || new Date().toISOString().split('T')[0];
    setEntriesForSelectedDate(getEntriesForDateFromStorage(dateToLoad));
  }, [selectedDate, allEntries]);

  useEffect(() => {
    const entriesInCurrentMonthView = getAllEntriesListFromStorage()
      .filter(entry => {
        const entryDate = new Date(entry.date + "T00:00:00");
        return entryDate.getFullYear() === activeStartDate.getFullYear() &&
               entryDate.getMonth() === activeStartDate.getMonth();
      });
    setAverageMonthlyMood(calculateAverageMoodValue(entriesInCurrentMonthView));
  }, [allEntries, activeStartDate, calculateAverageMoodValue]);

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
            <span className="ml-2 text-2xl">✨</span>
          </div>
          <button
            onClick={handleOpenMoodForm}
            className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 dark:text-blue-950 font-semibold py-2.5 px-5 text-lg rounded-lg shadow-sm hover:shadow-md transition-colors duration-150 ease-in-out"
          >
            Add mood
          </button>
        </header>

        <main className="space-y-5">
          {/* Average Mood Section - blue card */}
          <section className="p-3 sm:p-4 bg-sky-700 dark:bg-sky-800 rounded-2xl shadow-lg">
            <h2 className="text-lg font-medium text-sky-100 dark:text-sky-50 mb-2 text-center">Average mood this month</h2>
            <AverageMoodGauge averageMood={averageMonthlyMood} />
          </section>

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
