# My-Day App: Improvement & Refinement Plan

This document outlines potential improvements and refactoring tasks for the My-Day application, based on an analysis conducted on July 29, 2024.

## 1. UI Design Enhancements

*   **Task 1.1: Standardize Internal Card Spacing.**
    *   **Description:** Review and standardize vertical spacing *within* cards (Header, Daily Average Mood, Mood Display) for titles, content, and elements like the mood bar. Aim for consistency with existing `mb-2` for titles.
    *   **Files Affected:** `App.tsx`, `DailyAverageMood.tsx`, `MoodDisplay.tsx`.
*   **Task 1.2: (Optional) Refine Mood Bar Hover Interactivity.**
    *   **Description:** Consider a slightly more prominent hover effect (e.g., minor scale-up or brightness change) on the non-active blocks in the `DailyAverageMood` status bar to improve discoverability of their tooltips.
    *   **Files Affected:** `DailyAverageMood.tsx`.
*   **Task 1.3: Clarify Mood Dot Styling.**
    *   **Description:** Determine the definitive source of truth for calendar mood dot size and styling (Tailwind classes in `CalendarView.tsx` vs. `.mood-dot` in `App.css`). Ensure consistency and remove any overridden/unused CSS for `mood-dot` size if Tailwind classes are authoritative. Currently, `w-2 h-2` in `CalendarView.tsx` seems to be the active style for size.
    *   **Files Affected:** `CalendarView.tsx`, `App.css`.

## 2. UX (User Experience) Enhancements

*   **Task 2.1: Improve MoodForm Validation Feedback.**
    *   **Description:** Replace the `alert('Please select a mood.')` in `MoodForm` with an inline error message displayed within the form UI (e.g., text below the mood selection area). This requires adding a state to manage the error message.
    *   **Files Affected:** `MoodForm.tsx`.
*   **Task 2.2: (Future Consideration) Smoother Mobile Form Transitions.**
    *   **Description:** For a more polished mobile experience, consider a mini-router or advanced state management for animated transitions between the main app view and the full-page `MoodForm`. (Low priority for current scope).
    *   **Files Affected:** `App.tsx`, `MoodForm.tsx`.
*   **Task 2.3: Enhance Accessibility (A11y) - Ongoing.**
    *   **Description:** Continue to ensure sufficient color contrast across the application. Review semantic HTML usage (though current structure is good).
    *   **Files Affected:** All components, `App.css`.

## 3. Technical Implementation & Code Quality

*   **Task 3.1: Consolidate Average Mood Calculation Logic.**
    *   **Description:** Create a single utility function for `calculateAverageMoodValue`. The current functions in `App.tsx` (memoized `calculateAverageMoodValue`) and `CalendarView.tsx` (`calculateDailyAverageMood`) have slight differences in handling out-of-range averages. The version in `App.tsx` (defaulting to `MOOD_VALUES.NEUTRAL`) is more robust. Move this consolidated function to a new file like `src/utils/moodUtils.ts` or add to existing `src/utils/storage.ts` if appropriate.
    *   **Files Affected:** `App.tsx`, `CalendarView.tsx`, new `src/utils/moodUtils.ts` (or existing util).
*   **Task 3.2: Clean Up Code Comments & Unused Code.**
    *   **Description:** Remove commented-out code that is no longer needed (e.g., `toYYYYMMDD` in `CalendarView.tsx`). Review and ensure comments are relevant and helpful.
    *   **Files Affected:** Primarily `CalendarView.tsx`, review other files.
*   **Task 3.3: Implement Full Test Suite.**
    *   **Description:** Flesh out unit and integration tests as planned in `docs/development-tasks.md`.
        *   Unit test `storage.ts` functions.
        *   Unit test the consolidated average mood calculation utility.
        *   Integration/component tests for `MoodForm`, `MoodDisplay`, `CalendarView`.
    *   **Files Affected:** `src/__tests__`, `src/components/__tests__`, `src/utils/__tests__`.
*   **Task 3.4: (Optional) Create Custom Hook for Mobile Detection.**
    *   **Description:** Consider refactoring the `isMobile` state and resize listener logic in `App.tsx` into a custom hook (e.g., `useMediaQuery`) and place it in `src/hooks/`.
    *   **Files Affected:** `App.tsx`, new file in `src/hooks/`.

## 4. Future Features (From PRD / Development Tasks)

*   **Task 4.1: Implement Theme Toggle UI & Persistence.**
    *   **Description:** Add a UI element for users to manually toggle between light and dark modes. Persist this preference in `localStorage`. Ensure it defaults to system preference.
    *   **Files Affected:** `App.tsx`, new component for toggle, `localStorage` utilities. 