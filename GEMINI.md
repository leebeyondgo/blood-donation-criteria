# Project Overview: Blood Donation Criteria Search Service

This project is a web application designed to help users quickly and easily determine their eligibility for blood donation based on various criteria such as medications, diseases, regions, and vaccinations. It provides a user-friendly interface with search, filtering, and automatic date calculation functionalities.

## Technologies Used

*   **Frontend Framework**: React
*   **Build Tool**: Vite
*   **UI Library**: Material-UI (MUI)
*   **Styling**: Tailwind CSS, PostCSS
*   **Language**: JavaScript
*   **State Management**: React Context API (for theme management)
*   **Data Storage**: Local JSON files (`src/data/`)
*   **Analytics**: Firebase Analytics (initialized, but no other Firebase services are explicitly used in the provided code snippets)

## Building and Running

To set up and run the project locally, follow these steps:

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Run in Development Mode**:
    ```bash
    npm start
    ```
    This will start the development server, typically accessible at `http://localhost:5173/`.
3.  **Build for Production**:
    ```bash
    npm run build
    ```
    This command compiles the project into static files for deployment, located in the `dist` directory.
4.  **Run Tests**:
    ```bash
    npm test
    ```
    (Note: The `test` script in `package.json` currently points to `vite test`. You may need to configure a testing framework like Jest or Vitest if not already set up.)

## Development Conventions

*   **Component Structure**: The application uses React functional components and hooks.
*   **Styling**: Primarily uses Tailwind CSS for utility-first styling, complemented by Material-UI components. Custom CSS is defined in `src/index.css`.
*   **Theming**: Supports light and dark modes, managed via `src/contexts/ThemeContext.jsx` and applied using MUI's `ThemeProvider`.
*   **Data Handling**: Blood donation criteria data is stored in JSON files within `src/data/`. These files are loaded and processed in `src/App.jsx`.
*   **Code Quality**: ESLint is configured for code linting, as indicated by the `eslintConfig` in `package.json`.
*   **Performance Monitoring**: `reportWebVitals` is included, suggesting an intention for performance tracking.

## Project Structure

*   `public/`: Static assets, `index.html`.
*   `src/`: Main application source code.
    *   `App.jsx`: Main application component, handles search, filtering, and data processing.
    *   `index.jsx`: Entry point of the React application.
    *   `firebase.jsx`: Firebase initialization.
    *   `index.css`: Global CSS and Tailwind directives.
    *   `theme.jsx`: Material-UI theme definitions for light and dark modes.
    *   `components/`: Reusable React components (e.g., `Footer.jsx`, `Pagination.jsx`, `ResultItem.jsx`, `ResultList.jsx`).
    *   `contexts/`: React Context API providers (e.g., `ThemeContext.jsx`).
    *   `data/`: JSON files containing blood donation criteria data.
*   `tailwind.config.js`: Tailwind CSS configuration.
*   `postcss.config.js`: PostCSS configuration.
*   `vite.config.js`: Vite build configuration.
*   `package.json`: Project metadata, dependencies, and scripts.
*   `README.md`: Project description and high-level overview.
