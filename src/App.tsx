import { useState, useEffect } from 'react'
import './App.css'
import CalendarView from './components/CalendarView'
import MoodForm from './components/MoodForm'
import MoodDisplay from './components/MoodDisplay'
import AverageMoodGauge from './components/AverageMoodGauge'
import { getEntriesForDate, saveEntry, getAllEntriesAsList, generateId, getStoredEntries } from './utils/storage'
import type { MoodEntry, MoodValue, DayEntries } from './types'
import { MOOD_VALUES } from './types' // For calculating average

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [isMoodFormOpen, setIsMoodFormOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [entriesForSelectedDate, setEntriesForSelectedDate] = useState<MoodEntry[]>([])
  const [allEntries, setAllEntries] = useState<DayEntries>(() => getStoredEntries())
  const [averageMonthlyMood, setAverageMonthlyMood] = useState<MoodValue | null>(null)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Load all entries on mount and calculate initial average mood
  useEffect(() => {
    const currentEntriesMap = getStoredEntries()
    setAllEntries(currentEntriesMap)
    // Convert DayEntries map to MoodEntry[] list for calculation
    const currentEntriesList = Object.values(currentEntriesMap).flat()
    calculateAverageMood(currentEntriesList, new Date().getMonth() + 1, new Date().getFullYear())
  }, [])

  const calculateAverageMood = (currentEntries: MoodEntry[], month: number, year: number) => {
    const relevantEntries = currentEntries.filter(entry => {
      const entryDate = new Date(entry.date)
      return entryDate.getMonth() + 1 === month && entryDate.getFullYear() === year
    })
    if (relevantEntries.length === 0) {
      setAverageMonthlyMood(null)
      return
    }
    const sum = relevantEntries.reduce((acc, curr) => acc + curr.mood, 0)
    const avg = Math.round(sum / relevantEntries.length) as MoodValue
    // Ensure avg is a valid MoodValue key
    if (Object.values(MOOD_VALUES).includes(avg)) {
      setAverageMonthlyMood(avg)
    } else {
      setAverageMonthlyMood(MOOD_VALUES.NEUTRAL) // Default if calculation is off
    }
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setEntriesForSelectedDate(getEntriesForDate(date))
  }

  const handleOpenMoodForm = () => {
    // If on mobile, this might navigate. For now, just toggle state.
    setIsMoodFormOpen(true)
  }

  const handleCloseMoodForm = () => {
    setIsMoodFormOpen(false)
  }

  const handleSaveMoodEntry = (formData: Omit<MoodEntry, 'id' | 'createdAt'>) => {
    const newEntry: MoodEntry = {
      ...formData,
      id: generateId(),
      createdAt: Date.now()
    }
    saveEntry(newEntry)
    const updatedAllEntriesMap = getStoredEntries()
    setAllEntries(updatedAllEntriesMap)

    if (selectedDate === newEntry.date) {
      setEntriesForSelectedDate(updatedAllEntriesMap[newEntry.date] || [])
    }
    
    const updatedAllEntriesList = Object.values(updatedAllEntriesMap).flat()
    calculateAverageMood(updatedAllEntriesList, new Date(newEntry.date).getMonth() + 1, new Date(newEntry.date).getFullYear())
    setIsMoodFormOpen(false) // Close modal/form
  }

  return (
    <div className="app-container p-4 max-w-4xl mx-auto font-sans">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My day</h1>
        <button 
          onClick={handleOpenMoodForm} 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow hover:shadow-lg transition-all duration-150 ease-in-out"
        >
          Add mood
        </button>
      </header>

      <section className="average-mood-section mb-6 p-4 border rounded-lg shadow bg-white dark:bg-gray-800">
        <h2 className="text-xl mb-2 text-gray-700 dark:text-gray-300">Average mood this month</h2>
        <AverageMoodGauge averageMood={averageMonthlyMood} />
      </section>

      <section className="calendar-section mb-6 bg-white dark:bg-gray-800 p-4 border rounded-lg shadow">
        {/* CalendarView will be implemented here */}
        <CalendarView /> 
      </section>

      <section className="selected-day-mood-display p-4 border rounded-lg shadow bg-white dark:bg-gray-800 min-h-[100px]">
        <MoodDisplay selectedDate={selectedDate} entries={entriesForSelectedDate} />
      </section>

      <MoodForm 
        isOpen={isMoodFormOpen} 
        onClose={handleCloseMoodForm} 
        onSave={handleSaveMoodEntry} 
        isMobile={isMobile} 
      />
    </div>
  )
}

export default App
