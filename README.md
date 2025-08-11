## LEXY ADMIN Account

<span style="letter-spacing: 2px;">Project Overview of shop owner dashboard</span>

### Objective

The objective of the LEXY project is to build a scalable, maintainable, and high-performance enterprise-level web application for shop owners. The application will utilize the latest technologies including React, TypeScript, RTK Query for state management and data fetching, and Ant Design for UI components.

### Tech Stack

- **Frontend Framework:** React (latest version)
- **State Management & Data Fetching:** RTK Query (Redux Toolkit Query)
- **UI Component Library:** Ant Design
- **Bundler:** Vite
- **Language:** TypeScript (for type safety)
- **Testing:** Jest, React Testing Library
- **Linting & Formatting:** ESLint, Prettier
- **Version Control:** Git

### Architecture Overview

**Directory Structure**

The project follows a well-structured directory layout to maintain the codebase effectively:

```bash
src/
│
├── assets/         # Static assets like images, fonts, etc.
├── components/     # Reusable components
│   ├── Button/
│   ├── Modal/
│   └── ...
├── features/       # Feature-specific components and logic
│   ├── auth/
│   │   ├── Login.tsx
│   │   └── Signup.tsx
│   └── dashboard/
│       ├── Dashboard.tsx
│       └── ...
├── hooks/          # Custom hooks
│   └── useAuth.ts
├── services/       # API service definitions and RTK Query API slices
│   └── api.ts
├── store/          # Redux store setup
│   ├── rootReducer.ts
│   └── store.ts
├── styles/         # Global styles and theme
│   ├── variables.scss
│   └── global.scss
├── utils/          # Utility functions
│   └── helpers.ts
├── App.tsx         # Main App component
├── index.tsx       # Entry point
├── react-app-env.d.ts
└── setupTests.ts   # Jest setup file
```

- **assets:** Stores static assets like images and fonts.
- **components:** Contains reusable components.
- **features:** Contains feature-specific components and logic.
- **hooks:** Contains custom React hooks.
- **services:** Contains API service definitions and RTK Query API slices.
- **store:** Contains the Redux store setup and root reducer.
- **styles:** Contains global styles and theming.
- **utils:** Contains utility functions.
- **App.tsx:** Main App component.
- **index.tsx:** Entry point of the application.
- **react-app-env.d.ts:** TypeScript declaration file for React app.
- **setupTests.ts:** Jest setup file for configuring testing environment.

### Detailed Explanation

1. **src/assets:** Stores static assets like images and fonts.
2. **src/components:** Contains reusable components that can be used across different parts of the 1. application.
3. **src/features:** Contains feature-specific components and related logic. Each feature has its own folder.
4. **src/hooks:** Contains custom React hooks.
5. **src/pages:** Contains page-level components that represent different routes.
6. **src/services:** Contains API service definitions and RTK Query API slices.
7. **src/store:** Contains the Redux store setup and root reducer.
8. **src/styles:** Contains global styles and theming (using Ant Design's Less variables).
9. **src/utils:** Contains utility functions.
10. **vsrc/App.tsx:** The main App component where routes are defined.
11. **vsrc/index.tsx:** The entry point of the application.
12. **react-app-env.d.ts:** TypeScript declaration file for React app.
13. **setupTests.ts:** Jest setup file for configuring testing environment.

### Setup

1. Clone the repository.
2. Install dependencies: `bun install` or `yarn install`.
3. Start the development server: `bun run dev` or `yarn dev`.

### Testing

To run tests, use the following command: `bun test` or `yarn test`.

### Contributing

Contributions are welcome! Please follow the guidelines in the `CONTRIBUTING.md` file.

### License

This project is licensed under the `MIT License`.
# Lumi_glow_admin
