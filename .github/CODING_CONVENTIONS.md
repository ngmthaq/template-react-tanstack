# TypeScript Coding Conventions

> Version 1.2 — Team Standard

---

## Table of Contents

1. [Naming Conventions](#1-naming-conventions)
2. [Types & Interfaces](#2-types--interfaces)
3. [File & Module Structure](#3-file--module-structure)
4. [Error Handling](#4-error-handling)
5. [Async / Await Patterns](#5-async--await-patterns)
6. [Comments & Documentation](#6-comments--documentation)
7. [React — Components](#7-react--components)
8. [React — Props & Typing](#8-react--props--typing)
9. [React — Hooks](#9-react--hooks)
10. [React — State Management](#10-react--state-management)
11. [React — Error Boundaries & Async UI](#11-react--error-boundaries--async-ui)
12. [React — Atomic Design](#12-react--atomic-design)
13. [Styling — MUI & Emotion](#13-styling--mui--emotion)
14. [Data Fetching — TanStack Query](#14-data-fetching--tanstack-query)
15. [Routing — TanStack Router](#15-routing--tanstack-router)
16. [Forms — Formik & Yup](#16-forms--formik--yup)
17. [State — Jotai](#17-state--jotai)
18. [i18n — i18next](#18-i18n--i18next)
19. [Dates — dayjs](#19-dates--dayjs)
20. [HTTP — Axios](#20-http--axios)

---

## 1. Naming Conventions

### Variables & Functions

Use `camelCase` for variables, functions, and method names.

```ts
// ✅ Good
const userCount = 42;
function fetchUserById(id: string): Promise<User> { ... }

// ❌ Bad
const UserCount = 42;
function FetchUserById(id: string) { ... }
```

### Classes & Constructors

Use `PascalCase` for classes, enums, and type aliases.

```ts
// ✅ Good
class UserRepository { ... }
enum OrderStatus { Pending, Fulfilled, Cancelled }
type UserId = string;
```

### Constants

Use `UPPER_SNAKE_CASE` for module-level constants that represent fixed configuration values or magic values.

```ts
// ✅ Good
const MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_TIMEOUT_MS = 5000;
```

### Booleans

Prefix boolean variables with `is`, `has`, `can`, or `should` to make intent explicit.

```ts
// ✅ Good
const isLoading = false;
const hasPermission = true;
const canRetry = attempts < MAX_RETRY_ATTEMPTS;
```

### Files & Directories

Use `kebab-case` for non-component files and directories. React components follow the Atomic Design hierarchy (see section 12) and hooks use `camelCase` (see section 9).

```
src/
  services/
    user-service.ts
    auth-service.ts
  models/
    user.model.ts
  utils/
    date-formatter.ts
  hooks/
    useCurrentUser.ts
  components/
    atoms/
      Button/
        index.tsx
    molecules/
      SearchBar/
        index.tsx
    organisms/
      UserCard/
        index.tsx
    templates/
      DashboardLayout/
        index.tsx
    pages/
      HomePage/
        index.tsx
```

---

## 2. Types & Interfaces

### Prefer `interface` for object shapes, `type` for unions and computed types

```ts
// ✅ Interface for an object shape
interface User {
  id: string;
  name: string;
  email: string;
}

// ✅ Type for union / computed shapes
type Result<T> = { success: true; data: T } | { success: false; error: Error };
type UserId = string;
```

### Never use `any` — use `unknown` or narrow explicitly

```ts
// ❌ Bad
function parse(input: any): any { ... }

// ✅ Good
function parse(input: unknown): Record<string, unknown> {
  if (typeof input !== "object" || input === null) throw new TypeError("Invalid input");
  return input as Record<string, unknown>;
}
```

### Make nullability explicit

```ts
// ✅ Good — intent is visible in the signature
function findUser(id: string): User | null { ... }
function getConfig(): Config | undefined { ... }
```

### Use `readonly` for immutable data

```ts
interface Config {
  readonly apiUrl: string;
  readonly timeout: number;
}
```

### Avoid type assertions (`as`) except at boundaries

Reserve `as` for I/O boundaries (API responses, external data). Never use it to suppress type errors internally.

```ts
// ✅ Acceptable at I/O boundary
const user = response.data as User;

// ❌ Bad — suppressing a real type error
const count = getValue() as number;
```

### Generic naming

Use descriptive single-letter generics only for well-known patterns (`T`, `K`, `V`). For domain-specific generics, use full names.

```ts
// ✅ Good
function identity<T>(value: T): T { ... }
function mapRecord<TKey extends string, TValue>(record: Record<TKey, TValue>): TValue[] { ... }
```

---

## 3. File & Module Structure

### One primary export per file

Each file should have a single primary responsibility. Avoid files that export many unrelated things.

```
user.service.ts      → exports UserService
user.model.ts        → exports User interface + related types
user.repository.ts   → exports UserRepository
```

### Internal order within a file

Follow this order consistently:

```
1. Imports (external → internal → relative)
2. Constants
3. Types / Interfaces
4. Main export (class, function, or object)
5. Helper functions (unexported)
```

### Barrel files (`index.ts`)

Use barrel files to expose a clean public API for a module, but avoid re-exporting everything from deeply nested paths.

```ts
// services/index.ts
export { UserService } from "./user-service";
export { AuthService } from "./auth-service";
```

### Import ordering

Group imports in the following order, separated by a blank line:

```ts
// 1. React core
import { useState, useEffect } from "react";

// 2. Third-party — MUI & Emotion (keep together, tree-shaking sensitive)
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { css } from "@emotion/react";

// 3. Third-party — other libraries
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import dayjs from "dayjs";
import axios from "axios";

// 4. Internal absolute paths
import { userAtom } from "@/store/user";
import { logger } from "@/utils/logger";

// 5. Relative paths
import { UserCardSkeleton } from "./UserCardSkeleton";
```

> **MUI import style:** always import from the specific sub-path (`@mui/material/Button`) rather than the barrel (`@mui/material`). This is mandatory for optimal tree-shaking and build performance.

---

## 4. Error Handling

### Always handle errors explicitly — never swallow them

```ts
// ❌ Bad
try {
  await doSomething();
} catch (_) {}

// ✅ Good
try {
  await doSomething();
} catch (error) {
  logger.error("doSomething failed", { error });
  throw error;
}
```

### Use typed custom errors for domain failures

```ts
export class NotFoundError extends Error {
  constructor(resource: string, id: string) {
    super(`${resource} with id "${id}" was not found`);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly field?: string,
  ) {
    super(message);
    this.name = "ValidationError";
  }
}
```

### Use a `Result` type for expected failures (avoid exceptions for control flow)

```ts
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

async function fetchUser(id: string): Promise<Result<User>> {
  try {
    const user = await db.users.findById(id);
    if (!user) return { ok: false, error: new NotFoundError("User", id) };
    return { ok: true, value: user };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}
```

### Narrow `unknown` errors before use

```ts
// ✅ Good
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  logger.error("Operation failed", { message });
}
```

---

## 5. Async / Await Patterns

### Always use `async/await` over raw `.then()` chains

```ts
// ❌ Avoid
fetchUser(id)
  .then((user) => processUser(user))
  .then((result) => saveResult(result))
  .catch((err) => handleError(err));

// ✅ Prefer
try {
  const user = await fetchUser(id);
  const result = await processUser(user);
  await saveResult(result);
} catch (error) {
  handleError(error);
}
```

### Run independent async operations in parallel

```ts
// ❌ Sequential when not needed
const user = await fetchUser(id);
const settings = await fetchSettings(id);

// ✅ Parallel
const [user, settings] = await Promise.all([fetchUser(id), fetchSettings(id)]);
```

### Always type async function return values

```ts
// ✅ Good — intent is explicit
async function createUser(input: CreateUserInput): Promise<User> { ... }
```

### Avoid `Promise<void>` for fire-and-forget in critical paths

If a background operation can fail silently, log it explicitly:

```ts
// ✅ Good
void notifySlack(event).catch((err) =>
  logger.warn("Slack notification failed", { err }),
);
```

### Avoid floating promises

Use the `void` operator only for intentional fire-and-forget. Enable `@typescript-eslint/no-floating-promises` to catch accidental cases.

---

## 6. Comments & Documentation

### Use JSDoc for all exported functions, classes, and types

```ts
/**
 * Retrieves a user by their unique identifier.
 *
 * @param id - The UUID of the user.
 * @returns The user, or `null` if not found.
 * @throws {DatabaseError} If the database query fails.
 */
export async function findUserById(id: string): Promise<User | null> { ... }
```

### Explain _why_, not _what_

Code should be self-documenting for _what_ it does. Comments should explain intent, trade-offs, and non-obvious decisions.

```ts
// ❌ Redundant — the code already says this
// Increment counter
counter++;

// ✅ Useful — explains a non-obvious constraint
// We cap retries at 3 to stay within the external API's rate limit window (60 req/min).
const MAX_RETRIES = 3;
```

### Use `TODO` and `FIXME` tags consistently

```ts
// TODO(victor): Replace with streaming once the API supports it — ticket #142
// FIXME: This breaks if the locale is not set — needs defensive check
```

### Avoid commented-out code

Remove dead code instead of commenting it out. Version control preserves history.

### Mark non-obvious type narrowing with a short explanation

```ts
// The schema validation above guarantees `data.userId` is a non-empty string here.
const userId = data.userId as string;
```

---

## 7. React — Components

### Use function components exclusively

Class components are not permitted. Use function components with hooks for all new code.

```tsx
// ❌ Bad
class UserCard extends React.Component<Props> {
  render() {
    return <div>{this.props.name}</div>;
  }
}

// ✅ Good
function UserCard({ name }: UserCardProps) {
  return <div>{name}</div>;
}
```

### One component per file

Each component file exports exactly one primary component. Co-located sub-components are acceptable only when they are not reused outside the file and are kept small. Every component lives under its Atomic Design tier (see section 12).

```
components/
  atoms/
    Button/
      index.tsx              → exports Button
  molecules/
    SearchBar/
      index.tsx              → exports SearchBar
  organisms/
    UserCard/
      index.tsx              → exports UserCard
      UserCardAvatar/
        index.tsx            → exports UserCardAvatar (co-located, not reused elsewhere)
```

### Component file naming

Use `PascalCase` for the component directory — matching the component name exactly — with the implementation in `index.tsx`.

```
UserCard/
  index.tsx   →  export function UserCard

AuthForm/
  index.tsx   →  export function AuthForm
```

This keeps imports clean (`import { UserCard } from "@/components/UserCard"`) and makes co-located files (styles, tests, sub-components) easy to discover.

```
UserCard/
  index.tsx          → main component
  UserCard.test.tsx  → tests
  UserCard.module.css → styles (if using CSS Modules)
```

### Keep components focused

A component should do one thing. Extract logic into hooks, and presentational sub-trees into smaller components when a file exceeds ~150 lines or has more than one distinct concern.

### Prefer named exports over default exports

```tsx
// ❌ Avoid
export default function UserCard() { ... }

// ✅ Prefer
export function UserCard() { ... }
```

Default exports make refactoring and search harder. Use them only when a framework requires it (e.g. Next.js page files).

---

## 8. React — Props & Typing

### Always type props with an interface

```tsx
interface UserCardProps {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  onSelect?: (userId: string) => void;
}

export function UserCard({ userId, displayName, avatarUrl, onSelect }: UserCardProps) {
  ...
}
```

### Never use `React.FC` / `React.FunctionComponent`

It implicitly adds `children` to every component and obscures the return type.

```tsx
// ❌ Bad
const UserCard: React.FC<UserCardProps> = ({ name }) => <div>{name}</div>;

// ✅ Good
function UserCard({ name }: UserCardProps) {
  return <div>{name}</div>;
}
```

### Type `children` explicitly when needed

```tsx
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  title: string;
}
```

### Use `ComponentPropsWithoutRef` to extend native element props

```tsx
import type { ComponentPropsWithoutRef } from "react";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: "primary" | "secondary";
}

export function Button({ variant = "primary", ...rest }: ButtonProps) {
  return <button className={`btn btn--${variant}`} {...rest} />;
}
```

### Type event handlers precisely

```tsx
// ✅ Good — typed to the specific element
function SearchInput() {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { ... };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => { ... };
  ...
}
```

---

## 9. React — Hooks

### Name custom hooks with the `use` prefix, in `camelCase`

Hook files use `camelCase` matching the hook name exactly — no directory wrapper needed.

```
hooks/
  useCurrentUser.ts
  useLocalStorage.ts
  useDebounce.ts
```

```tsx
// ✅ Good
function useUserProfile(userId: string): UserProfile | null { ... }
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] { ... }
```

### Extract reusable logic into custom hooks, not utilities

If logic requires React primitives (`useState`, `useEffect`, `useRef`, etc.), it belongs in a hook, not a plain utility function.

### Declare exhaustive dependency arrays

Never suppress the `exhaustive-deps` ESLint rule without a documented reason. If a value doesn't need to be a dependency, memoize it or move it outside the component.

```tsx
// ❌ Bad
useEffect(() => {
  fetchData(userId);
}, []); // eslint-disable-line react-hooks/exhaustive-deps

// ✅ Good
useEffect(() => {
  fetchData(userId);
}, [userId]);
```

### Prefer `useCallback` and `useMemo` at API boundaries, not everywhere

Memoization adds complexity. Apply it when passing callbacks to memoized children or when computing expensive derived values — not as a default.

```tsx
// ✅ Good — passed to a memoized child
const handleSelect = useCallback((id: string) => {
  setSelectedId(id);
}, []);

// ❌ Premature — simple computation doesn't need memoization
const label = useMemo(() => `Hello, ${name}`, [name]);
```

### Clean up side effects in `useEffect`

Always return a cleanup function when the effect sets up subscriptions, timers, or event listeners.

```tsx
useEffect(() => {
  const subscription = eventBus.subscribe("update", handleUpdate);
  return () => subscription.unsubscribe();
}, [handleUpdate]);
```

### Keep `useEffect` for synchronization only

`useEffect` is for syncing React state with external systems. Do not use it to derive state from other state — compute it inline or with `useMemo` instead.

```tsx
// ❌ Bad — deriving state via effect causes an extra render
const [fullName, setFullName] = useState("");
useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);

// ✅ Good — derived inline
const fullName = `${firstName} ${lastName}`;
```

---

## 10. React — State Management

The project uses **Jotai** for global and cross-component state. The general rule is to pick the simplest mechanism that covers the need:

```
local useState  →  lifted useState  →  Jotai atom  →  TanStack Query (server state)
```

Server state (data that comes from an API) is always managed by TanStack Query, never by Jotai or `useState`. See section 14.

### Use `useState` for local UI state

Ephemeral state that does not leave a component — open/closed, hover, input drafts — stays in `useState`.

```tsx
const [isOpen, setIsOpen] = useState(false);
```

### Use Jotai atoms for shared client state

Atoms live in `src/store/`. One file per domain slice. Export atoms and derived atoms; never export raw `useAtom` wrappers unless they add logic.

```ts
// store/user.ts
import { atom } from "jotai";
import type { User } from "@/models/user.model";

export const currentUserAtom = atom<User | null>(null);
export const isAuthenticatedAtom = atom((get) => get(currentUserAtom) !== null);
```

```tsx
// consuming a Jotai atom
import { useAtom, useAtomValue } from "jotai";
import { currentUserAtom, isAuthenticatedAtom } from "@/store/user";

function NavBar() {
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  ...
}
```

### Atom naming conventions

| Pattern                     | Use                                                                          |
| --------------------------- | ---------------------------------------------------------------------------- |
| `xAtom`                     | Base writable atom                                                           |
| `xAtom` (read-only derived) | Derived via `atom(get => ...)` — same suffix, distinguish by type            |
| `atomWithStorage`           | Persistent atom via `jotai/utils` — use `localforage` as the storage backend |

### Persist atoms with `atomWithStorage` + localforage

Use `atomWithStorage` from `jotai/utils` for state that must survive page reloads.

```ts
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import localforage from "localforage";

const storage = createJSONStorage<Theme>(() => localforage as any);
export const themeAtom = atomWithStorage<Theme>("app-theme", "light", storage);
```

### Use `useReducer` for complex local state transitions

When a component has multi-step local state (e.g. a multi-page wizard), `useReducer` is clearer than multiple `useState` calls. This does not replace Jotai for shared state.

```tsx
type WizardState = { step: number; data: Partial<FormData> };
type WizardAction =
  | { type: "next"; payload: Partial<FormData> }
  | { type: "back" };

function reducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "next":
      return {
        step: state.step + 1,
        data: { ...state.data, ...action.payload },
      };
    case "back":
      return { ...state, step: state.step - 1 };
  }
}
```

### Never mutate state directly

```tsx
// ❌ Bad
state.items.push(newItem);

// ✅ Good
setState((prev) => ({ ...prev, items: [...prev.items, newItem] }));
```

### Use React Context only for dependency injection

Context is not a state management tool in this project — Jotai covers that. Use Context solely for injecting stable, non-reactive dependencies (e.g. a service instance, a theme provider required by MUI).

```tsx
// ✅ Acceptable: MUI ThemeProvider (required by the library)
<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

---

## 11. React — Error Boundaries & Async UI

### Wrap page-level and feature-level subtrees with an Error Boundary

React errors in render are unrecoverable without a boundary. Place them at meaningful granularity — not one global catch-all.

```tsx
import { ErrorBoundary } from "react-error-boundary";

function UserDashboard() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <UserProfile />
      <UserActivity />
    </ErrorBoundary>
  );
}
```

### Show explicit loading and error states for async data

Never leave the UI in an ambiguous state during data fetching. Use TanStack Query's `isPending` and `error` fields directly — do not mirror them into local state.

```tsx
function UserProfile({ userId }: { userId: string }) {
  const { data, isPending, error } = useUserProfile(userId); // custom hook wrapping useQuery

  if (isPending) return <Skeleton variant="rectangular" height={120} />;
  if (error) return <ErrorMessage error={error} />;

  return <ProfileCard user={data} />;
}
```

### Use `Suspense` for data-fetching only with a compatible library

Do not use `Suspense` for data fetching unless your data library explicitly supports it (e.g. TanStack Query with `suspense: true`, Relay). Using it otherwise leads to unhandled promise behavior.

### Type guard before rendering optional data

```tsx
// ❌ Bad — may render incorrectly if user is undefined
return <span>{user.name}</span>;

// ✅ Good
if (!user) return null;
return <span>{user.name}</span>;
```

---

## 12. React — Atomic Design

Atomic Design organizes components into five tiers by complexity and responsibility. Every component belongs to exactly one tier. The dependency rule is strict: a component may only import from its own tier or lower tiers — never upward.

```
atoms → molecules → organisms → templates → pages
```

---

### Atoms

The smallest, most primitive UI building blocks. Atoms have no dependencies on other components. They encapsulate a single HTML element or a tightly coupled pair (e.g. a label + input), accept all their behavior through props, and carry no business logic or data-fetching.

**Location:** `src/components/atoms/`

**Characteristics:**

- No imports from `molecules`, `organisms`, `templates`, or `pages`
- Fully controlled via props
- Highly reusable across any context
- Styled via props or a design token system — no hardcoded domain-specific colors or copy

**Examples:** `Button`, `Input`, `Icon`, `Badge`, `Spinner`, `Avatar`, `Label`

In this project, MUI components act as the implementation of atoms. Wrap them only when you need to enforce a prop contract or add a project-specific default — do not create a wrapper for every MUI component.

```tsx
// atoms/AppButton/index.tsx
// Wrap MUI Button only to enforce the project's variant vocabulary.
import MuiButton from "@mui/material/Button";
import type { ComponentPropsWithoutRef } from "react";

interface AppButtonProps extends ComponentPropsWithoutRef<typeof MuiButton> {
  variant?: "primary" | "secondary" | "ghost";
}

const variantMap = {
  primary: "contained",
  secondary: "outlined",
  ghost: "text",
} as const;

export function AppButton({ variant = "primary", ...rest }: AppButtonProps) {
  return <MuiButton variant={variantMap[variant]} {...rest} />;
}
```

When no project-specific constraint exists, import the MUI component directly — there is no requirement to wrap every atom.

---

### Molecules

Molecules combine two or more atoms into a functional unit that does one specific UI job. They may hold local UI state (open/closed, focused, etc.) but still contain no business logic or API calls.

**Location:** `src/components/molecules/`

**Characteristics:**

- Imports only from `atoms` (or other `molecules` for composition)
- Single, focused UI responsibility
- Props-driven; data comes from the parent
- Local UI state is acceptable; domain state is not

**Examples:** `SearchBar`, `FormField`, `Dropdown`, `Pagination`, `Toast`, `TabGroup`

```tsx
// molecules/SearchBar/index.tsx
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Paper from "@mui/material/Paper";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder,
}: SearchBarProps) {
  return (
    <Paper
      component="form"
      sx={{ display: "flex", alignItems: "center", px: 1 }}
    >
      <InputBase
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        sx={{ flex: 1 }}
      />
      <IconButton onClick={onSubmit} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
```

---

### Organisms

Organisms are self-contained UI sections that represent a recognizable part of the interface. They may connect to data (via hooks or context) and own meaningful local state. An organism maps to one domain concept.

**Location:** `src/components/organisms/`

**Characteristics:**

- Imports from `atoms` and `molecules`
- May consume custom hooks for data-fetching or domain logic
- Owns domain-relevant state when appropriate
- Not tied to a specific page layout

**Examples:** `UserCard`, `NavBar`, `ProductList`, `AuthForm`, `CommentThread`, `NotificationPanel`

```tsx
// organisms/UserCard/index.tsx
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import { useUserStatus } from "@/hooks/useUserStatus";

interface UserCardProps {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  onMessage: (userId: string) => void;
}

export function UserCard({
  userId,
  displayName,
  avatarUrl,
  onMessage,
}: UserCardProps) {
  const { data: status } = useUserStatus(userId); // useQuery-backed hook

  return (
    <Card>
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar src={avatarUrl} alt={displayName} />
        <span>{displayName}</span>
        <Chip
          label={status?.isOnline ? "Online" : "Offline"}
          color={status?.isOnline ? "success" : "default"}
          size="small"
        />
        <Button variant="outlined" onClick={() => onMessage(userId)}>
          Message
        </Button>
      </CardContent>
    </Card>
  );
}
```

---

### Templates

Templates define the page-level layout skeleton — slot structure, grid, spacing — without containing real data. They wire organisms into a consistent visual composition and act as the contract between layout and content.

**Location:** `src/components/templates/`

**Characteristics:**

- Imports from `atoms`, `molecules`, and `organisms`
- Accepts children or named slots — no hardcoded content
- No data-fetching; all data comes from the page layer
- Reusable across multiple pages that share the same layout

**Examples:** `DashboardLayout`, `AuthLayout`, `SettingsLayout`, `TwoColumnLayout`

```tsx
// templates/DashboardLayout/index.tsx
import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import { NavBar } from "@/components/organisms/NavBar";
import { Sidebar } from "@/components/organisms/Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
}

export function DashboardLayout({ children, sidebar }: DashboardLayoutProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <NavBar />
      <Box sx={{ display: "flex", flex: 1 }}>
        {sidebar && (
          <Box component="aside" sx={{ width: 240, flexShrink: 0 }}>
            {sidebar}
          </Box>
        )}
        <Box component="main" sx={{ flex: 1, p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
```

---

### Pages

Pages are the entry points for routes. They are the only tier allowed to fetch top-level data, coordinate multiple organisms, and pass real content into templates.

**Location:** `src/components/pages/`

**Characteristics:**

- Imports from any lower tier
- Owns top-level data-fetching (via hooks, loaders, or server components)
- Passes data down — never fetches inside organisms or below
- One page component per route

**Examples:** `HomePage`, `UserProfilePage`, `LoginPage`, `SettingsPage`

Pages in this project are registered as TanStack Router route components. Route params and search params are typed at the route definition level — never cast them manually inside the component.

```tsx
// routes/users/$userId.tsx  (TanStack Router file-based routing)
import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { UserCard } from "@/components/organisms/UserCard";
import { ActivityFeed } from "@/components/organisms/ActivityFeed";
import { useUserProfile } from "@/hooks/useUserProfile";
import Skeleton from "@mui/material/Skeleton";

export const Route = createFileRoute("/users/$userId")({
  component: UserProfilePage,
});

function UserProfilePage() {
  const { userId } = Route.useParams();
  const { data, isPending, error } = useUserProfile(userId);

  if (isPending) return <Skeleton variant="rectangular" height={200} />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <DashboardLayout>
      <UserCard
        userId={userId}
        displayName={data.displayName}
        onMessage={handleMessage}
      />
      <ActivityFeed userId={userId} />
    </DashboardLayout>
  );
}
```

---

### Tier reference summary

| Tier     | Location                | Imports from                | Data-fetching | State       |
| -------- | ----------------------- | --------------------------- | ------------- | ----------- |
| Atom     | `components/atoms/`     | —                           | ✗             | UI only     |
| Molecule | `components/molecules/` | atoms                       | ✗             | UI only     |
| Organism | `components/organisms/` | atoms, molecules            | Via hooks     | Domain OK   |
| Template | `components/templates/` | atoms, molecules, organisms | ✗             | Layout only |
| Page     | `components/pages/`     | any                         | ✅            | Top-level   |

### Placement decision rule

When deciding where a component belongs, apply these questions in order:

1. Does it map to a single HTML element or primitive? → **Atom**
2. Does it combine atoms into one focused UI unit with no domain data? → **Molecule**
3. Does it represent a recognizable domain section and may fetch data? → **Organism**
4. Does it define a page layout with slots and no real content? → **Template**
5. Is it a route entry point that owns top-level data? → **Page**

If a component spans two tiers, split it: extract the pure layout part into a lower tier and keep the data-aware shell at the higher tier.

---

## 13. Styling — MUI & Emotion

### Use the `sx` prop for one-off layout and spacing

The `sx` prop is the primary way to apply MUI's design tokens inline. Use it for spacing, sizing, display, and color — values that vary per usage context.

```tsx
// ✅ Good — one-off layout adjustment
<Box sx={{ display: "flex", gap: 2, mt: 3 }}>
```

### Use `styled()` for reusable styled components

When a visual variant is reused in two or more places, extract it into a `styled` component using `@mui/material/styles` (which delegates to Emotion under the hood).

```tsx
import { styled } from "@mui/material/styles";
import MuiChip from "@mui/material/Chip";

export const StatusChip = styled(MuiChip, {
  shouldForwardProp: (prop) => prop !== "isOnline",
})<{ isOnline: boolean }>(({ theme, isOnline }) => ({
  backgroundColor: isOnline
    ? theme.palette.success.light
    : theme.palette.grey[300],
  color: isOnline
    ? theme.palette.success.contrastText
    : theme.palette.text.secondary,
}));
```

### Never mix `sx`, `styled`, and raw Emotion `css` on the same component

Pick one styling strategy per component and be consistent. Mixing them makes theming and overrides unpredictable.

```tsx
// ❌ Bad — three styling systems on one element
<Box sx={{ mt: 2 }} css={css`padding: 8px`} style={{ color: "red" }} />

// ✅ Good — one system
<Box sx={{ mt: 2, p: 1, color: "error.main" }} />
```

### Use theme tokens, never hardcoded values

```tsx
// ❌ Bad
sx={{ color: "#d32f2f", fontSize: "14px", marginTop: "16px" }}

// ✅ Good
sx={{ color: "error.main", typography: "body2", mt: 2 }}
```

### Extend the theme in one place

All theme customizations (palette, typography, component overrides) live in `src/theme/index.ts`. Do not override MUI component styles ad hoc with `sx` across many files — add a `components` override to the theme instead.

```ts
// theme/index.ts
import { createTheme } from "@mui/material/styles";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/700.css";

export const theme = createTheme({
  typography: { fontFamily: "Roboto, sans-serif" },
  palette: {
    primary: { main: "#1976d2" },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { textTransform: "none" },
      },
    },
  },
});
```

### MUI X components (DataGrid, DatePicker, Charts, TreeView)

Use MUI X components at the **organism** tier or above — they are complex, data-connected components and should not appear at atom or molecule level.

```tsx
// ✅ Good — DataGrid lives in an organism
// organisms/UserTable/index.tsx
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
```

Always define column definitions (`GridColDef[]`) outside the component to prevent unnecessary re-renders.

```tsx
// ❌ Bad — recreated on every render
function UserTable() {
  const columns: GridColDef[] = [{ field: "name", headerName: "Name" }];
  ...
}

// ✅ Good — stable reference
const columns: GridColDef[] = [{ field: "name", headerName: "Name", flex: 1 }];

function UserTable() {
  const { data, isPending } = useUsers();
  return <DataGrid rows={data ?? []} columns={columns} loading={isPending} />;
}
```

---

## 14. Data Fetching — TanStack Query

### All server state lives in TanStack Query

Never store API response data in Jotai atoms or `useState`. TanStack Query owns the server cache.

### Wrap every `useQuery` / `useMutation` in a custom hook

Query hooks are never called directly in components. Each domain entity has its own hook file under `src/hooks/`.

```ts
// hooks/useUserProfile.ts
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/services/user-service";
import type { User } from "@/models/user.model";

export const userKeys = {
  all: ["users"] as const,
  detail: (id: string) => ["users", id] as const,
};

export function useUserProfile(userId: string) {
  return useQuery<User>({
    queryKey: userKeys.detail(userId),
    queryFn: () => userApi.getById(userId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
```

### Define query keys as constants

Centralise query key factories per domain in the same file as the hooks. This prevents key duplication and enables precise cache invalidation.

```ts
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  detail: (id: string) => [...userKeys.all, id] as const,
};
```

### Mutations invalidate related queries

Always invalidate or update the relevant query cache on mutation success. Never manually sync mutation results into Jotai.

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.update,
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      // Or set directly to avoid a refetch:
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);
    },
  });
}
```

### Use `isPending`, not `isLoading`

TanStack Query v5 replaced `isLoading` with `isPending` for queries without cached data. Always use `isPending`.

```tsx
// ❌ Bad (v4 pattern)
const { isLoading } = useQuery(...);

// ✅ Good (v5)
const { isPending } = useQuery(...);
```

### Set a global `staleTime` in the QueryClient

Avoid redundant refetches by configuring a sensible default in `src/main.tsx`.

```ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute default
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

---

## 15. Routing — TanStack Router

### Use file-based routing

Route files live under `src/routes/` and mirror the URL structure. TanStack Router generates a typed route tree from this directory.

```
src/routes/
  __root.tsx              → root layout
  index.tsx               → /
  users/
    index.tsx             → /users
    $userId.tsx           → /users/:userId
  settings/
    index.tsx             → /settings
```

### Always type params and search params at the route definition

Never cast `useParams()` or `useSearch()` return values. Define the shape at the route level.

```tsx
import { createFileRoute, z } from "@tanstack/react-router";

const userSearchSchema = z.object({
  tab: z.enum(["profile", "activity"]).optional().default("profile"),
});

export const Route = createFileRoute("/users/$userId")({
  validateSearch: userSearchSchema,
  component: UserProfilePage,
});

function UserProfilePage() {
  const { userId } = Route.useParams();        // string — typed
  const { tab } = Route.useSearch();           // "profile" | "activity" — typed
  ...
}
```

### Use route loaders for critical data

Prefetch data that is required to render a route using the `loader` option. This avoids loading states on initial render and works in conjunction with TanStack Query's `ensureQueryData`.

```tsx
export const Route = createFileRoute("/users/$userId")({
  loader: ({ context: { queryClient }, params: { userId } }) =>
    queryClient.ensureQueryData({
      queryKey: userKeys.detail(userId),
      queryFn: () => userApi.getById(userId),
    }),
  component: UserProfilePage,
});
```

### Navigate programmatically with `useNavigate`

```tsx
import { useNavigate } from "@tanstack/react-router";

function LoginForm() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate({ to: "/dashboard" });
  };
}
```

### Use `<Link>` for in-app navigation — never `<a>`

```tsx
import { Link } from "@tanstack/react-router";

// ✅ Good — fully typed href
<Link to="/users/$userId" params={{ userId: user.id }}>View Profile</Link>

// ❌ Bad — bypasses the router, loses type safety
<a href={`/users/${user.id}`}>View Profile</a>
```

---

## 16. Forms — Formik & Yup

### Use Formik for all form state management

Do not manage form state manually with `useState`. All forms use Formik.

### Define the validation schema with Yup separately from the component

```ts
// organisms/LoginForm/login-form.schema.ts
import * as yup from "yup";

export interface LoginFormValues {
  email: string;
  password: string;
}

export const loginFormSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Minimum 8 characters")
    .required("Password is required"),
});
```

### Use `useFormik` or `<Formik>` — not both patterns mixed

Pick one API per form and be consistent across the codebase. `useFormik` is preferred for functional components.

```tsx
// organisms/LoginForm/index.tsx
import { useFormik } from "formik";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { loginFormSchema, type LoginFormValues } from "./login-form.schema";

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void>;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const formik = useFormik<LoginFormValues>({
    initialValues: { email: "", password: "" },
    validationSchema: loginFormSchema,
    onSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit} noValidate>
      <TextField
        id="email"
        name="email"
        label="Email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
        fullWidth
      />
      <TextField
        id="password"
        name="password"
        type="password"
        label="Password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
        fullWidth
      />
      <Button type="submit" variant="contained" disabled={formik.isSubmitting}>
        Sign In
      </Button>
    </form>
  );
}
```

### Always use `noValidate` on `<form>` elements

Disable native browser validation; Yup is the source of truth for validation messages.

### Type `initialValues` explicitly

Always provide the generic to `useFormik<T>` so TypeScript catches missing or mistyped fields.

### Connect mutation submission errors to Formik

When a form submits to an API, surface server errors through `formik.setErrors` or `formik.setStatus`.

```ts
onSubmit: async (values, { setErrors, setSubmitting }) => {
  try {
    await loginMutation.mutateAsync(values);
  } catch (error) {
    setErrors({ email: "Invalid credentials" });
  } finally {
    setSubmitting(false);
  }
},
```

---

## 17. State — Jotai

See section 10 for the overall state management strategy. This section covers Jotai-specific rules.

### Atom file structure

All atoms live under `src/store/`, one file per domain slice. The file exports atoms and derived atoms — never hooks that wrap them (those go in `src/hooks/`).

```
src/store/
  user.ts        → currentUserAtom, isAuthenticatedAtom
  ui.ts          → sidebarOpenAtom, themeAtom
  filters.ts     → tableFiltersAtom
```

### Derived atoms replace selectors

Use read-only derived atoms instead of computing values inside components with `useMemo`.

```ts
// ✅ Good — derived atom
export const fullNameAtom = atom((get) => {
  const user = get(currentUserAtom);
  return user ? `${user.firstName} ${user.lastName}` : "";
});
```

```tsx
// consuming
const fullName = useAtomValue(fullNameAtom);
```

### Use `atomWithStorage` for persistence

Persist atoms with `atomWithStorage` from `jotai/utils`. Use `localforage` as the storage backend for async, IndexedDB-backed persistence.

```ts
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import localforage from "localforage";

const storage = createJSONStorage<string>(() => localforage as any);
export const preferredLanguageAtom = atomWithStorage("lang", "en", storage);
```

### Never call `useAtom` in the same file that defines the atom

Atoms are plain data — they have no knowledge of components. The `useAtom` call always lives in a component or a hook file.

### Avoid write-only atoms for side effects

Do not use atoms to trigger side effects. Use mutation hooks (TanStack Query) or event callbacks for that.

---

## 18. i18n — i18next

### All user-visible strings must go through `t()`

No hardcoded UI strings. Every label, placeholder, error message, and tooltip must use a translation key.

```tsx
// ❌ Bad
<Button>Save changes</Button>;

// ✅ Good
import { useTranslation } from "react-i18next";

const { t } = useTranslation();
<Button>{t("common.saveChanges")}</Button>;
```

### Namespace by domain, not by component

Group translation keys by feature domain, not by the name of the component that uses them.

```
locales/
  en/
    common.json      → shared: buttons, labels, errors
    users.json       → user domain: profile, permissions
    dashboard.json   → dashboard feature
```

### Use typed translation keys

Generate or maintain a type for translation key paths to catch missing keys at compile time. At minimum, pass the namespace explicitly to `useTranslation`.

```tsx
const { t } = useTranslation("users");
// t("profile.title") — scoped to users.json
```

### Never interpolate translated strings manually

Use i18next's interpolation syntax, not string concatenation.

```ts
// ❌ Bad
t("greeting") + " " + user.name;

// ✅ Good
t("greeting", { name: user.name });
// → "Hello, {{name}}!" in the translation file
```

### Format dates and numbers through i18next or dayjs

Do not use raw `Date` methods for display. See section 19 for date formatting rules.

---

## 19. Dates — dayjs

### Use `dayjs` for all date handling — never the native `Date` API directly

The native `Date` API is inconsistent and timezone-unaware. Use `dayjs` for all parsing, formatting, comparison, and manipulation.

```ts
// ❌ Bad
new Date(isoString).toLocaleDateString("en-US");

// ✅ Good
import dayjs from "dayjs";
dayjs(isoString).format("MMM D, YYYY");
```

### Use MUI DatePicker with the dayjs adapter

```tsx
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type { Dayjs } from "dayjs";

function DateField() {
  const [value, setValue] = useState<Dayjs | null>(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker value={value} onChange={setValue} label="Pick a date" />
    </LocalizationProvider>
  );
}
```

Wrap `<LocalizationProvider>` once at the app root, not per component.

### Store dates as ISO 8601 strings in state and API payloads

Convert to `dayjs` only at display time, and back to ISO string when sending to the API.

```ts
// In state / API
const isoDate: string = "2026-05-03T10:00:00.000Z";

// For display
dayjs(isoDate).format("DD/MM/YYYY HH:mm");

// For API submission
dayjs(pickedDate).toISOString();
```

### Import dayjs plugins explicitly

Load only the plugins you need. Import them once in `src/lib/dayjs.ts` and re-export the configured instance.

```ts
// lib/dayjs.ts
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

export default dayjs;
```

```ts
// consuming
import dayjs from "@/lib/dayjs";
```

---

## 20. HTTP — Axios

### Create a single Axios instance per API base URL

Never call `axios.get(...)` directly. All HTTP calls go through a configured instance.

```ts
// services/http-client.ts
import axios from "axios";

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});
```

### Attach auth tokens via a request interceptor

```ts
httpClient.interceptors.request.use((config) => {
  const token = getAccessToken(); // from Jotai or secure storage
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### Handle auth errors via a response interceptor

```ts
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await refreshToken();
      return httpClient(error.config); // retry original request
    }
    return Promise.reject(error);
  },
);
```

### Wrap Axios calls in typed service functions

Components and TanStack Query hooks never call `httpClient` directly. All API calls go through service functions that return typed data.

```ts
// services/user-service.ts
import { httpClient } from "./http-client";
import type { User } from "@/models/user.model";

export const userApi = {
  getById: async (id: string): Promise<User> => {
    const { data } = await httpClient.get<User>(`/users/${id}`);
    return data;
  },

  update: async (id: string, payload: Partial<User>): Promise<User> => {
    const { data } = await httpClient.patch<User>(`/users/${id}`, payload);
    return data;
  },
};
```

### Type the generic in Axios calls

Always pass the expected response type to `httpClient.get<T>()`, `.post<T>()`, etc. This propagates the type through the `data` field without requiring an `as` assertion.

```ts
// ✅ Good
const { data } = await httpClient.get<User[]>("/users");

// ❌ Bad — requires a cast later
const { data } = await httpClient.get("/users");
const users = data as User[];
```

---

_Last updated: 2026-05 | Maintainer: Team_
