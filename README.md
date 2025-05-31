# My Day - Mood and Thoughts Tracker

My Day is a simple, frontend-only React application designed for logging daily moods and brief thoughts. It utilizes browser `localStorage` for data persistence, making it a completely client-side application. The project emphasizes a clean, responsive UI built with Tailwind CSS and TypeScript.

This application was developed as an exercise in using modern frontend technologies and iterative development practices.

**Live Demo:** [https://whitestrannik.github.io/my-day/](https://whitestrannik.github.io/my-day/) (Once deployed as per instructions below)

## 🌟 Features

*   **Daily Mood Logging:**
    *   Select from 5 predefined mood levels (😞 Very Sad to 😄 Very Happy).
    *   Attach predefined tags (e.g., "calm", "anxious", "focused") to entries.
    *   Add a short optional note (max 120 characters).
*   **Calendar View:**
    *   Main interface displaying a monthly calendar.
    *   Days with entries are marked with a colored dot representing the average mood for that day.
    *   Click on a day to view logged entries.
*   **Mood Display:**
    *   Shows detailed entries for a selected date, including mood emoji, tags, and note.
    *   Displays the average mood for the selected day with a visual status bar.
*   **Responsive Design:**
    *   Adapts to different screen sizes, with the mood entry form appearing as a modal on desktop and a full-page view on mobile.
*   **Local Storage Persistence:**
    *   All data is saved directly in the user's browser. No backend or user accounts are required.
*   **Dark Mode:**
    *   Supports system preference for dark mode, with a consistent sky blue and yellow theme.

## 💻 Tech Stack

*   **Language:** TypeScript
*   **UI Library:** React (v19) with Hooks and Function Components
*   **Styling:** Tailwind CSS (v4) with custom CSS for specific components (like `react-calendar`)
*   **State Management:** React `useState` & `useEffect`
*   **Calendar:** `react-calendar`
*   **Persistence:** Browser `localStorage`
*   **Build Tooling:** Vite
*   **Linting & Formatting:** ESLint, Prettier (configured for TypeScript and React)
*   **Testing:** Vitest & React Testing Library (setup in progress)
*   **Deployment:** GitHub Pages

## 🛠️ Getting Started

### Prerequisites

*   Node.js (v18.x or newer recommended)
*   npm (usually comes with Node.js)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/whitestrannik/my-day.git
    cd my-day
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Development Server

To start the Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

This will typically open the application at `http://localhost:5173` (or the next available port).

### Building for Production

To create a production build of the application:

```bash
npm run build
```

The build artifacts will be located in the `dist/` directory.

### Running Linters

To check for linting issues:

```bash
npm run lint
```

### Running Tests

(Test suite is currently under development)
To run tests with Vitest:

```bash
npm run test
```

To run tests with the Vitest UI:
```bash
npm run test:ui
```

## 🚀 Deployment to GitHub Pages

This project is configured for deployment to GitHub Pages.

1.  **Ensure your local `main` branch is up-to-date and all changes are committed.**
2.  **Run the deployment script:**
    ```bash
    npm run deploy
    ```
    This script will:
    *   Build the application (`npm run build`).
    *   Push the contents of the `dist` folder to the `gh-pages` branch on your GitHub repository.

3.  **Configure GitHub Repository Settings:**
    *   Go to your GitHub repository settings: `https://github.com/whitestrannik/my-day/settings/pages`
    *   Under "Build and deployment", for the "Source" option, select "**Deploy from a branch**".
    *   Under "Branch", select the `gh-pages` branch and ensure the folder is set to `/ (root)`.
    *   Click "Save".

    Your application should then be available at `https://whitestrannik.github.io/my-day/`.

## 📄 Project Documentation

Further details about the project can be found in the `docs/` directory:
*   `docs/project-prd.md`: Project Requirements Document.
*   `docs/development-tasks.md`: Detailed breakdown of development tasks and progress.
*   `docs/improvements-plan.md`: Plan for future improvements and refactoring.

## 🤝 Contributing

This project is primarily for learning and experimentation. However, suggestions or contributions that align with the project goals are welcome. Please open an issue to discuss potential changes.
