import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CalendarView from '../CalendarView';
import { MOOD_VALUES, MOOD_COLORS } from '../../types';
import type { DayEntries, MoodEntry } from '../../types';

// Mock props
const mockOnDateSelect = vi.fn();
const mockOnActiveStartDateChange = vi.fn();

const mockAllEntries: DayEntries = {
  '2024-07-15': [
    { id: '1', date: '2024-07-15', mood: MOOD_VALUES.HAPPY, tags: [], note: '', createdAt: Date.now() },
  ],
  '2024-07-20': [
    { id: '2', date: '2024-07-20', mood: MOOD_VALUES.SAD, tags: [], note: '', createdAt: Date.now() },
  ],
  '2024-08-01': [ // Different month
    { id: '3', date: '2024-08-01', mood: MOOD_VALUES.NEUTRAL, tags: [], note: '', createdAt: Date.now() },
  ]
};

const defaultProps = {
  allEntries: mockAllEntries,
  onDateSelect: mockOnDateSelect,
  activeStartDate: new Date(2024, 6, 1), // July 2024 (month is 0-indexed)
  onActiveStartDateChange: mockOnActiveStartDateChange,
  selectedDate: null,
};

describe('CalendarView Component', () => {
  beforeEach(() => {
    mockOnDateSelect.mockClear();
    mockOnActiveStartDateChange.mockClear();
  });

  it('renders the calendar and current month correctly', () => {
    render(<CalendarView {...defaultProps} />);
    expect(screen.getByText('July 2024')).toBeInTheDocument(); // react-calendar format
  });

  it('displays mood dots for days with entries', () => {
    render(<CalendarView {...defaultProps} />);
    // Check for day 15 (Happy)
    const day15Tile = screen.getByText('15').closest('.react-calendar__tile');
    expect(day15Tile).not.toBeNull();
    if (day15Tile) {
      const dot = day15Tile.querySelector('.mood-dot');
      expect(dot).toBeInTheDocument();
      expect(dot).toHaveStyle(`background-color: ${MOOD_COLORS[MOOD_VALUES.HAPPY]}`);
    }

    // Check for day 20 (Sad)
    const day20Tile = screen.getByText('20').closest('.react-calendar__tile');
    expect(day20Tile).not.toBeNull();
    if (day20Tile) {
      const dot = day20Tile.querySelector('.mood-dot');
      expect(dot).toBeInTheDocument();
      expect(dot).toHaveStyle(`background-color: ${MOOD_COLORS[MOOD_VALUES.SAD]}`);
    }
  });

  it('does not display mood dots for days without entries or in other months shown', () => {
    render(<CalendarView {...defaultProps} />);
    const day10Tile = screen.getByText('10').closest('.react-calendar__tile');
    expect(day10Tile).not.toBeNull();
    if (day10Tile) {
      expect(day10Tile.querySelector('.mood-dot')).not.toBeInTheDocument();
    }
  });

  it('calls onDateSelect when a day is clicked', async () => {
    render(<CalendarView {...defaultProps} />);
    const day15Button = screen.getByText('15'); // react-calendar tiles are buttons
    await userEvent.click(day15Button);
    expect(mockOnDateSelect).toHaveBeenCalledTimes(1);
    // The date object from react-calendar will have time set to locale's midnight.
    // We check year, month, and date.
    const selectedDateArg = mockOnDateSelect.mock.calls[0][0] as Date;
    expect(selectedDateArg.getFullYear()).toBe(2024);
    expect(selectedDateArg.getMonth()).toBe(6); // July
    expect(selectedDateArg.getDate()).toBe(15);
  });

  it('calls onActiveStartDateChange when navigating to previous month', async () => {
    render(<CalendarView {...defaultProps} />);
    // Use class selector for react-calendar's default prev button
    const prevButton = screen.getByText('‹'); // Or document.querySelector('.react-calendar__navigation__prev-button') if getByText fails
    expect(prevButton).toBeInTheDocument();
    await userEvent.click(prevButton);
    expect(mockOnActiveStartDateChange).toHaveBeenCalledTimes(1);
    const { activeStartDate: newActiveStartDate } = mockOnActiveStartDateChange.mock.calls[0][0];
    expect(newActiveStartDate.getFullYear()).toBe(2024);
    expect(newActiveStartDate.getMonth()).toBe(5); // June
  });

  it('calls onActiveStartDateChange when navigating to next month', async () => {
    render(<CalendarView {...defaultProps} />);
    // Use class selector for react-calendar's default next button
    const nextButton = screen.getByText('›'); // Or document.querySelector('.react-calendar__navigation__next-button') if getByText fails
    expect(nextButton).toBeInTheDocument();
    await userEvent.click(nextButton);
    expect(mockOnActiveStartDateChange).toHaveBeenCalledTimes(1);
    const { activeStartDate: newActiveStartDate } = mockOnActiveStartDateChange.mock.calls[0][0];
    expect(newActiveStartDate.getFullYear()).toBe(2024);
    expect(newActiveStartDate.getMonth()).toBe(7); // August
  });

   it('highlights the selected date if provided', () => {
    const selectedDate = new Date(2024, 6, 15); // July 15, 2024
    render(<CalendarView {...defaultProps} selectedDate={selectedDate} />);
    const day15Tile = screen.getByText('15').closest('.react-calendar__tile--active');
    expect(day15Tile).toBeInTheDocument();
  });
}); 