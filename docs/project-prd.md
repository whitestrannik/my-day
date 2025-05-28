PRD

PRD: My-day – Mood and Thoughts Tracker (Frontend-Only)
🧭 Project Goal
Build a frontend-only React + TypeScript app that enables users to log daily mood entries using a predefined survey. Entries are saved to localStorage and presented in a history view. The application must run fully in the browser, with no backend, and be deployed publicly using GitHub Pages.
This project is designed for learning and experimentation. Code should be clean but not overengineered. Ideal for testing workflows in Cursor AI, Git version control, and project decomposition.
🚫 Out of Scope
	• No user accounts or authentication.
	• No cloud storage or backend services.
	• No edit/delete of entries.
	• No data export functionality.
	• No push notifications or email reminders.
	• No custom tags/labels creation.

🎯 Features
	• Add Mood Entry
		○ Click "Add Mood" button to launch a modal or inline form.
		○ Answer a few predefined questions (see below).
		○ Save response → persisted to local storage.
	• Predefined Survey Questions
		○ Mood level: 5 fixed emojis (😞 Very Sad, 🙁 Sad, 😐 Neutral, 🙂 Happy, 😄 Very Happy).
		○ One-click predefined labels/tags for current feeling: ["calm", "anxious", "excited", "tired", "focused", "creative", "stressed", "energetic", "grateful", "motivated"].
		○ Optional text field for a short note (max 120 characters).
	• Local Storage Persistence
		○ Entries saved by date.
		○ No user login or external API.
	• Calendar View (Main Interface)
		○ A monthly calendar as the main application view.
		○ Each day shows a colored dot or emoji representing the mood.
		○ Clicking a day shows details for that entry.
	• Mood History
		○ List or timeline of past entries (e.g., most recent first).
	• Theme Toggle
		○ Light/Dark mode switch (defaults to system preference).

💻 Tech Stack (Professional Frontend Setup)
Layer	Tech
Language	TypeScript
UI Library	ReactJS (with Hooks and Function Components)
Styling	TailwindCSS + custom utility classes
State Management	React useState / useReducer (consider Zustand or Jotai later if needed)
Routing (optional)	React Router (if multiple views are added)
Persistence	Browser localStorage
Testing	Vitest / Jest + React Testing Library
Linting & Formatting	ESLint + Prettier + TypeScript strict mode
Build Tooling	Vite
Deployment	GitHub Pages
CI/CD (optional)	GitHub Actions for test & lint checks

🧩 Suggested Folder Structure
/my-day/
├── public/
│   └── index.html
├── src/
│   ├── assets/               # Static files like icons, images, emoji data
│   ├── components/           # Reusable UI components
│   │   ├── MoodForm.tsx
│   │   ├── MoodList.tsx
│   │   └── CalendarView.tsx
│   ├── features/             # Logical groupings of related components/state (future-proofing)
│   ├── hooks/                # Custom React hooks
│   ├── utils/                # Pure functions and localStorage helpers
│   │   └── storage.ts
│   ├── styles/               # Tailwind or custom CSS
│   │   └── index.css
│   ├── App.tsx               # Root component
│   └── main.tsx              # Entry point (used by Vite)
├── tests/                    # Test files
│   └── MoodForm.test.tsx
├── .eslintrc.cjs             # Linter config
├── .prettierrc               # Prettier config
├── tsconfig.json             # TypeScript config
├── tailwind.config.ts        # Tailwind config
├── vite.config.ts            # Vite config
└── package.json
/my-day/
  ├── index.html
  ├── style.css
  ├── script.tsx / App.tsx
  ├── /components/
  │     ├── MoodForm.tsx
  │     ├── MoodList.tsx
  │     └── CalendarView.tsx (optional)
  ├── /utils/
  │     └── storage.ts
  ├── /tests/
  │     └── MoodForm.test.tsx
  └── /assets/
        └── icons, emojis, etc.


📋 Example Survey Format (Data Schema)
{
  "date": "2025-05-25",
  "mood": "😊",
  "tags": ["calm", "grateful"],
  "note": "Nice weather today, felt focused.",
  "theme_preference": "system" // or "light"/"dark"
}

🛠️ Development Tasks
These tasks are modular and can be assigned to agents in Cursor AI or tracked manually for structured progress:
🔹 Project Setup
	• Initialize project with Vite + React + TypeScript
	• Install TailwindCSS and configure with PostCSS
	• Configure ESLint, Prettier, and TypeScript strict mode
	• Add basic file/folder structure
🔹 Core Features
	• Create MoodForm component with fixed emoji selection, predefined tag buttons, and note input (120 char limit)
	• Implement state management for form fields
	• Implement save-to-LocalStorage logic
	• Create Calendar component as the main view
	• Create MoodList component to show mood history in reverse chronological order
	• Design responsive UI using TailwindCSS
🔹 Storage & Data Handling
	• Create utility module for LocalStorage: save, read, clear by date
	• Define data schema and validation (in code)
🔹 Optional Features
	• Implement CalendarView with mood markers
	• Add click-to-expand detail view for entries
	• Add dark/light theme toggle with local preference
🔹 Testing
	• Set up Vitest or Jest
	• Write unit tests for utility functions
	• Write integration tests for form behavior and data persistence
🔹 Deployment
	• Configure Vite for GitHub Pages (base path config)
	• Set up GitHub repo and push code
	• Deploy via GitHub Pages
	• (Optional) Add GitHub Actions for lint/test workflows
