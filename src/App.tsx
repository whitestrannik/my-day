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
    <div className="min-h-screen flex flex-col items-center py-6 sm:py-10 px-4 transition-colors duration-300 bg-blue-50 dark:bg-slate-900">
      {/* Main content container - now matches page background, sections within become cards */}
      <div className="w-full max-w-md space-y-6">
        {/* Header - styling remains as is, part of the overall page flow */}
        <header className="flex justify-between items-center px-2 sm:px-0 pt-2 sm:pt-0 pb-4">
          <h1 className="text-4xl font-bold text-indigo-700 dark:text-indigo-300 tracking-tight">My day</h1>
          <button
            onClick={handleOpenMoodForm}
            className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2.5 px-5 text-sm rounded-lg shadow-sm hover:shadow-md transition-colors duration-150 ease-in-out"
          >
            Add mood
          </button>
        </header>

        <main className="space-y-5">
          {/* Average Mood Section - now a distinct card */}
          <section className="p-3 sm:p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-lg">
            <h2 className="text-base font-medium text-slate-600 dark:text-slate-400 mb-2 text-center">Average mood this month</h2>
            <AverageMoodGauge averageMood={averageMonthlyMood} />
          </section>

          {/* Calendar Section - now a distinct card */}
          <section className="p-3 sm:p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-lg">
            <CalendarView 
              allEntries={allEntries}
              onDateSelect={handleDateSelect}
              activeStartDate={activeStartDate}
              onActiveStartDateChange={({ activeStartDate: newDate }) => handleActiveStartDateChange(newDate)}
              selectedDate={selectedDate ? new Date(selectedDate + "T00:00:00") : null}
            />
          </section>

          {/* Selected Day Details Section - now a distinct card */}
          {selectedDate && (
            <section className="p-3 sm:p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-lg">
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
