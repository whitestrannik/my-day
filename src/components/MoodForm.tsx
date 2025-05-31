import React, { useState, useEffect } from 'react';
import type { MoodValue, Tag, MoodEntry } from '../types';
import { MOOD_VALUES, MOOD_EMOJIS, TAGS } from '../types';

interface MoodFormProps {
  isOpen: boolean;
  onClose: () => void;
  // Pass the date for which the mood is being added, defaults to today
  selectedDateForEntry?: string; 
  onSave: (entryData: Omit<MoodEntry, 'id' | 'createdAt'>) => void;
  isMobile: boolean;
}

// Helper to get today's date in YYYY-MM-DD format
const getTodayDateString = () => new Date().toISOString().split('T')[0];

const MoodForm: React.FC<MoodFormProps> = ({
  isOpen,
  onClose,
  selectedDateForEntry,
  onSave,
  isMobile,
}) => {
  const [selectedMood, setSelectedMood] = useState<MoodValue | null>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [note, setNote] = useState('');
  // Initialize with selectedDateForEntry or default to today
  const [entryDate, setEntryDate] = useState<string>(selectedDateForEntry || getTodayDateString());

  // Reset form when it's opened or when the selectedDateForEntry changes
  useEffect(() => {
    if (isOpen) {
      setSelectedMood(null);
      setSelectedTags([]);
      setNote('');
      setEntryDate(selectedDateForEntry || getTodayDateString());
    }
  }, [isOpen, selectedDateForEntry]);

  const handleTagToggle = (tag: Tag) => {
    setSelectedTags(prevTags =>
      prevTags.includes(tag)
        ? prevTags.filter(t => t !== tag)
        : [...prevTags, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood) {
      alert('Please select a mood.'); // Simple validation for now
      return;
    }
    onSave({
      date: entryDate,
      mood: selectedMood,
      tags: selectedTags,
      note: note.slice(0, 120), // Enforce 120 char limit
    });
    onClose(); // Close form after save
  };

  const moodOptions = Object.values(MOOD_VALUES);

  // Modal vs Page rendering
  const containerClasses = isMobile
    ? 'fixed inset-0 bg-sky-700 dark:bg-sky-800 p-6 pt-12 flex flex-col z-50' // Full page on mobile - Updated BG
    : 'fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-70 flex items-center justify-center p-4 z-50'; // Modal overlay on desktop - slightly darker overlay
  
  const formClasses = isMobile
    ? 'w-full h-full flex flex-col overflow-y-auto' // Added overflow-y-auto for mobile
    : 'bg-sky-700 dark:bg-sky-800 p-6 rounded-2xl shadow-xl max-w-md w-full'; // Desktop form - Updated BG & rounded-2xl

  if (!isOpen && !isMobile) return null; // Desktop modal is hidden
  if (!isOpen && isMobile) return null; // If mobile is also controlled by isOpen and not a route

  return (
    <div className={containerClasses} onClick={!isMobile ? onClose : undefined}>
      <form 
        onSubmit={handleSubmit} 
        className={formClasses}
        onClick={!isMobile ? (e) => e.stopPropagation() : undefined} // Prevent closing modal by clicking form itself
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-yellow-400 dark:text-yellow-300">
            {isMobile ? 'Add new mood' : 'How was your day?'} {/* Updated mobile title slightly */}
          </h2>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-sky-200 hover:text-sky-100 dark:text-sky-300 dark:hover:text-sky-100 text-3xl font-light"
          >
            &times;
          </button>
        </div>

        {/* Date for entry */}
        <p className="text-sm text-sky-200 dark:text-sky-300 mb-4">
          Logging for: <span className="font-semibold text-sky-100 dark:text-sky-50">{new Date(entryDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </p>

        <div className="mb-6">
          <label className="block text-sky-100 dark:text-sky-50 mb-2 font-medium">How are you feeling?</label>
          <div className="flex justify-around items-center p-3 bg-sky-600 dark:bg-sky-700 rounded-lg">
            {moodOptions.map(moodValue => (
              <button
                key={moodValue}
                type="button"
                onClick={() => setSelectedMood(moodValue)}
                className={`p-2 rounded-lg text-3xl transition-transform duration-150 ease-in-out hover:scale-125 
                            ${selectedMood === moodValue ? 'transform scale-125 ring-2 ring-yellow-400 dark:ring-yellow-300' : 'opacity-70 hover:opacity-100'}`}
                title={Object.keys(MOOD_VALUES).find(key => MOOD_VALUES[key as keyof typeof MOOD_VALUES] === moodValue)?.replace('_',' ')}
              >
                {MOOD_EMOJIS[moodValue]}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sky-100 dark:text-sky-50 mb-2 font-medium">What's on your mind? (Optional)</label>
          <div className="flex flex-wrap gap-2">
            {TAGS.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors duration-150 ease-in-out font-medium 
                            ${selectedTags.includes(tag) 
                                ? 'bg-yellow-400 text-sky-800 ring-2 ring-yellow-500' 
                                : 'bg-sky-500 hover:bg-sky-400 text-sky-50 dark:bg-sky-600 dark:hover:bg-sky-500 dark:text-sky-100'}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="note" className="block text-sky-100 dark:text-sky-50 mb-2 font-medium">Add a note (Optional)</label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write a short note..."
            rows={3}
            maxLength={120}
            className="w-full p-3 border border-sky-500 dark:border-sky-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none bg-sky-600 dark:bg-sky-700 text-sky-50 dark:text-sky-50 placeholder-sky-300 dark:placeholder-sky-400 resize-none"
          ></textarea>
          <p className="text-xs text-right text-sky-300 dark:text-sky-400 mt-1">{note.length}/120</p>
        </div>

        <button 
          type="submit"
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-sky-800 font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out disabled:opacity-60 disabled:hover:bg-yellow-400"
          disabled={!selectedMood}
        >
          Save Entry
        </button>
      </form>
    </div>
  );
};

export default MoodForm; 