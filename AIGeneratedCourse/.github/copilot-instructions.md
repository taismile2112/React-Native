<!-- .github/copilot-instructions.md - guidance for AI coding agents working on this repo -->

# Copilot / AI Agent Instructions (concise)

Purpose: Quickly orient an AI coding agent to the project's architecture, conventions, and common developer workflows so suggestions and code edits are accurate and low-friction.

- Project type: Expo React Native app using `expo-router` (file-based routing). Main app code lives in the `app/` directory.
- Entry: `package.json` sets `main: "expo-router/entry"` and scripts like `start`, `android`, `ios` (use `npm run start` or `npx expo start`).

Big picture:
- UI and routes: `app/` contains route components (file-based routing). `app/_layout.tsx` is the root layout: it loads fonts and provides the `UserDetailContext` for the whole app.
- Auth & onboarding: `app/index.jsx` handles `onAuthStateChanged` (Firebase Auth) — it fetches the Firestore `users` doc and sets the context, then navigates to `/(tabs)/home`.
- Feature modules: courses, flashcards, quizzes, practice, etc. live under `app/` (e.g. `courseView/`, `flashcards/`, `quiz/`). Components live in `components/` grouped by feature.

Key files / locations to reference when making changes:
- Routing & layout: `app/_layout.tsx`, `app/index.jsx`
- Auth screens: `app/auth/signIn.jsx`, `app/auth/signUp.jsx`
- Firebase integration: `config/firebaseConfig.jsx` (read/write auth & Firestore)
- AI integration: `config/AIModel.jsx` (uses `@google/genai`; expects `GEMINI_API_KEY` via Expo config extras)
- Styling/constants: `constant/Colors.jsx`, `constant/Option.jsx` (imageAssets)
- Global context: `context/UserDetailContext.jsx` (simple createContext used throughout)
- Reusable UI: `components/Shared/*` (e.g. `Button.jsx`), `components/Home/*` for lists and progress components

Important conventions & patterns (do not violate):
- File-based routing: create files under `app/` to add routes; dynamic params use `[param]` directories. Example navigation: `router.push({ pathname: '/courseView/'+item?.docId, params: { courseParams: JSON.stringify(item) } })` (see `components/Home/CourseList.jsx`).
- Context usage: `UserDetailContext` is provided in `app/_layout.tsx` and consumed via `useContext` (e.g. `app/index.jsx`). Use `setUserDetail` to update current user state.
- Fonts: fonts are loaded in `app/_layout.tsx` (`outfit`, `outfit-bold`) — components expect those fontFamily values.
- Environment/API keys: `config/AIModel.jsx` reads `GEMINI_API_KEY` with `Constants.expoConfig?.extra?.GEMINI_API_KEY`. Set keys in `app.json` / Expo config or CI secrets; do not hard-code secrets.
- AI SDK/JSON parsing: `config/AIModel.jsx` sets `generationConfig.responseMimeType: 'application/json'` and expects `response.outputText()` to be JSON — agents should preserve this parsing behavior and handle fallback when JSON.parse fails (current code returns `{ error: true, raw }`).
- Images/constants: image lookup uses index keys from `constant/Option.jsx` (see `components/Home/CourseList.jsx` referencing `imageAssets[item.banner_image]`). Keep image keys consistent.
- Absolute import alias: `@/*` is configured in `tsconfig.json` (maps to project root). Use `@/context/UserDetailContext` etc. where appropriate.

Developer workflows & commands (Windows / PowerShell):
- Install deps: `npm install`
- Start dev server: `npm run start`  OR `npx expo start`
- Quick platform open: `npm run android` / `npm run ios` / `npm run web`
- Reset starter project: `npm run reset-project` (see `scripts/reset-project.js`)
- Lint: `npm run lint` (uses `expo lint`)

Integration points & external services:
- Firebase: `firebase` package used for Auth and Firestore. Check `config/firebaseConfig.jsx` before editing DB calls.
- Google GenAI: `@google/genai` used in `config/AIModel.jsx` with model `gemini-2.0-flash` — follow the existing pattern for model calls and JSON parsing.
- Expo-specific: `expo-router`, `expo-constants`, and `expo-font` are core; changes to routing or app config may require restarting Metro/Expo.

Editing guidance & safe-edit checklist for PRs:
- Preserve font names (`outfit`, `outfit-bold`) and context provider usage in `app/_layout.tsx` unless intentionally refactoring across all files.
- When changing auth behavior, update `app/index.jsx` and ensure `setUserDetail` is called with Firestore data structure expected elsewhere.
- For AI changes, do not change `responseMimeType` without checking `config/AIModel.jsx` parsing and callers that expect an object.
- When adding new routes, respect file-based routing conventions and test navigation with `router.push(...)` and `router.navigate(...)` as used in the codebase.

If anything is unclear or you want me to expand a section (examples, config locations, or add common PR checklists), tell me which area to expand and I will iterate.
