# Development Tasks for My-Day App

This list tracks the implementation progress of the My-Day mood and thoughts tracker.

## Phase 1: Core Structure & Setup (Mostly Done)

- [x] Initialize project with Vite + React + TypeScript
- [x] Install TailwindCSS and configure with PostCSS
- [x] Configure ESLint, Prettier, and TypeScript strict mode
- [x] Add basic file/folder structure (`components`, `hooks`, `utils`, `types`)
- [x] Define core types (`MoodValue`, `MoodEntry`, `Tag`, etc.) in `src/types/index.ts`
- [x] Implement localStorage utility functions (`saveEntry`, `getStoredEntries`, etc.) in `src/utils/storage.ts`
- [x] Install Recharts for mood gauge
- [x] Create placeholder components (`CalendarView`, `MoodForm`, `MoodDisplay`, `AverageMoodGauge`)
- [x] Set up main `App.tsx` with basic layout, state management, and component integration
- [x] Clean up default Vite template files and styles
- [x] Initial Git commit of the project structure

## Phase 2: Core Feature Implementation

### 2.1 MoodForm Component (`src/components/MoodForm.tsx`)
- [ ] Implement UI for MoodForm based on mockup (emoji selection, tag buttons, note input).
- [ ] Add state management for form fields within MoodForm.
- [ ] Implement character limit (120 chars) for the note input.
- [ ] Style MoodForm using TailwindCSS.
- [ ] Implement responsive behavior:
    - [ ] Modal dialog on desktop.
    - [ ] Full page/view on mobile (this might require routing or advanced conditional rendering in `App.tsx`).
- [ ] Ensure `onSave` callback prop is correctly called with validated form data.
- [ ] Ensure `onClose` callback is correctly handled.

### 2.2 CalendarView Component (`src/components/CalendarView.tsx`)
- [x] Choose and integrate a calendar library (e.g., `react-calendar`) or build custom grid.
- [x] Display the days of the current month.
- [x] Allow navigation to previous/next months.
- [x] Fetch all mood entries (`allEntries` from `App.tsx` context or props).
- [x] For each day with entries:
    - [x] Calculate the average mood for the day.
    - [x] Display a color highlight on the day cell based on the calculated average mood (using `MOOD_COLORS`).
- [x] Handle click events on calendar days to call `onDateSelect` prop from `App.tsx`.
- [x] Style CalendarView using TailwindCSS (and custom CSS for `react-calendar` specifics).

### 2.3 MoodDisplay Component (`src/components/MoodDisplay.tsx`)
- [ ] Receive `selectedDate` and `entries` (for that date) as props.
- [ ] If no date is selected, show an appropriate message.
- [ ] If a date is selected but has no entries, show an appropriate message.
- [ ] If entries exist for the selected date:
    - [ ] Display the selected date clearly.
    - [ ] List each `MoodEntry` for the selected date.
    - [ ] For each entry, display: mood emoji, mood text (e.g., "Happy"), selected tags, and the note.
    - [ ] Use `MOOD_EMOJIS` and `MOOD_COLORS` for consistent display.
- [ ] Style MoodDisplay using TailwindCSS, ensuring it fits the layout from the mockup.

### 2.4 AverageMoodGauge Component (`src/components/AverageMoodGauge.tsx`)
- [ ] Receive `averageMonthlyMood` (calculated in `App.tsx`) as a prop.
- [ ] If no mood data, display an appropriate message.
- [ ] Use Recharts (or chosen library) to implement a gauge/meter visual.
    - [ ] The gauge should visually represent the `averageMonthlyMood`.
    - [ ] Use `MOOD_COLORS` to color parts of the gauge or the indicator.
- [ ] Style the gauge container using TailwindCSS.

### 2.5 App Component Enhancements (`src/App.tsx`)
- [ ] Refine responsive logic for `MoodForm` (modal vs. page).
    - [ ] Consider using a simple routing solution if `MoodForm` becomes a full page on mobile (e.g., `react-router-dom` or manual state-based routing).
- [ ] Ensure `calculateAverageMood` correctly updates when entries change for the current month.
- [ ] Pass necessary props (entries, handlers) down to child components correctly.

## Phase 3: Styling & Polish

- [ ] Review and refine TailwindCSS styling across all components for consistency and responsiveness.
- [ ] Ensure UI matches the provided mockup as closely as possible.
- [ ] Test on different screen sizes (desktop, tablet, mobile).

## Phase 4: Optional Features (If time permits / As per PRD)

### 4.1 Theme Toggle (Light/Dark Mode)
- [ ] Add a UI element (e.g., a button or switch) for toggling the theme.
- [ ] Implement logic to switch CSS classes on the `body` or root element (e.g., `dark` class).
- [ ] Use Tailwind's dark mode variants (e.g., `dark:bg-gray-800`).
- [ ] Persist theme preference in `localStorage`.
- [ ] Ensure the app defaults to system preference for theme as per PRD.

## Phase 5: Testing & Deployment

### 5.1 Testing (Vitest / React Testing Library)
- [ ] Set up Vitest configuration if not fully done by default Vite template.
- [ ] Write unit tests for utility functions in `src/utils/storage.ts`.
- [ ] Write unit tests for `calculateAverageMood` logic in `App.tsx`.
- [ ] Write basic integration/component tests for `MoodForm` (e.g., input changes, save callback).
- [ ] Write basic integration/component tests for `CalendarView` (e.g., date selection).

### 5.2 Deployment (GitHub Pages)
- [ ] Configure Vite's `base` path in `vite.config.ts` for GitHub Pages deployment.
- [ ] Create a GitHub repository for the project (if not already done).
- [ ] Push all code to the GitHub repository.
- [ ] Set up GitHub Pages to deploy from the `main` (or `gh-pages`) branch.
- [ ] (Optional) Set up GitHub Actions for CI (linting, testing) on push/PR. 