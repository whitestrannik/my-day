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
    ? 'fixed inset-0 bg-sky-50 dark:bg-slate-900 p-6 pt-12 flex flex-col z-50' // Full page on mobile
    : 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'; // Modal overlay on desktop
  
  const formClasses = isMobile
    ? 'w-full h-full flex flex-col'
    : 'bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl max-w-md w-full';

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
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-sky-100">
            {isMobile ? 'Add mood' : 'How was your day?'}
          </h2>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
          >
            &times;
          </button>
        </div>

        {/* Date for entry - could be a date picker if we want to log for other days from here */}
        {/* For now, it defaults to selectedDateForEntry or today */}
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Logging for: <span className="font-semibold">{new Date(entryDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </p>

        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">How are you feeling?</label>
          <div className="flex justify-around items-center p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
            {moodOptions.map(moodValue => (
              <button
                key={moodValue}
                type="button"
                onClick={() => setSelectedMood(moodValue)}
                className={`p-2 rounded-lg text-3xl transition-transform duration-150 ease-in-out hover:scale-125 
                            ${selectedMood === moodValue ? 'transform scale-125 ring-2 ring-sky-500' : ''}`}
                title={Object.keys(MOOD_VALUES).find(key => MOOD_VALUES[key as keyof typeof MOOD_VALUES] === moodValue)?.replace('_',' ')}
              >
                {MOOD_EMOJIS[moodValue]}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">What's on your mind? (Optional)</label>
          <div className="flex flex-wrap gap-2">
            {TAGS.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors duration-150 ease-in-out 
                            ${selectedTags.includes(tag) 
                                ? 'bg-sky-500 text-white' 
                                : 'bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-200'}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="note" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Add a note (Optional)</label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write a short note..."
            rows={3}
            maxLength={120}
            className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none bg-white dark:bg-slate-700 dark:text-slate-100 resize-none"
          ></textarea>
          <p className="text-xs text-right text-gray-500 dark:text-gray-400 mt-1">{note.length}/120</p>
        </div>

        <button 
          type="submit"
          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out disabled:opacity-50"
          disabled={!selectedMood}
        >
          Save Entry
        </button>
      </form>
    </div>
  );
};

export default MoodForm; 