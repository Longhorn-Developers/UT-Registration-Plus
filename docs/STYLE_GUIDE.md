# TypeScript/React Style Guide

## Table of Contents

1. [File Naming](#file-naming)
2. [TypeScript](#typescript)
3. [Naming Conventions](#naming-conventions)
4. [Imports](#imports)
5. [Types](#types)
6. [Functions](#functions)
7. [React](#react)
8. [Comments and Documentation](#comments-and-documentation)
9. [Styling](#styling)

## File Naming

Use `PascalCase` for React component files and `camelCase` for all other TypeScript files:

```typescript
// Good
components / Button.tsx;
hooks / useSchedules.ts;
types / Course.ts;
lib / getSiteSupport.ts;
utils / formatDate.ts;

// Bad
components / button.tsx;
hooks / UseSchedules.ts;
types / course.ts;
```

## TypeScript Conventions

## TypeScript

### Strict Mode

Enable strict TypeScript checking:

```json
{
    "compilerOptions": {
        "strict": true,
        "noUncheckedIndexedAccess": true,
        "noFallthroughCasesInSwitch": true
    }
}
```

### Type Annotations

Prefer explicit return types for exported functions:

```typescript
// Good
export function getCourseById(id: number): Course | undefined {
    return courses.find(c => c.id === id);
}

// Acceptable for simple cases
export function getCourseById(id: number) {
    return courses.find(c => c.id === id);
}
```

### Type Imports

Use `type` keyword for type-only imports:

```typescript
// Good
import type { Course } from './types/Course';
import type { UserSchedule } from './types/UserSchedule';

// Bad
import { Course } from './types/Course';
```

### No `any`

Never use `any`. Use `unknown` for truly unknown types:

```typescript
// Good
function parseData(data: unknown): Course {
    if (typeof data === 'object' && data !== null) {
        return data as Course;
    }
    throw new Error('Invalid data');
}

// Bad
function parseData(data: any): Course {
    return data;
}
```

### Enums

Avoid enums. Use const objects with `as const`:

```typescript
// Good
export const Status = {
    OPEN: 'OPEN',
    CLOSED: 'CLOSED',
    WAITLISTED: 'WAITLISTED',
} as const;

export type StatusType = (typeof Status)[keyof typeof Status];

// Bad
enum Status {
    OPEN = 'OPEN',
    CLOSED = 'CLOSED',
}
```

### `null` vs `undefined`

Prefer `undefined` for optional values. Use `null` for explicit absence:

```typescript
// Good
function findCourse(id: number): Course | undefined {
    return courses.find(c => c.id === id);
}

interface Props {
    description?: string; // undefined if not provided
}

// Use null for explicit "no value" state
let selectedCourse: Course | null = null;
```

## Naming Conventions

### General Rules

- `camelCase` for variables, functions, methods, parameters
- `PascalCase` for classes, interfaces, types, React components
- `UPPER_SNAKE_CASE` for global constants
- Avoid abbreviations unless widely understood

### Variables and Functions

```typescript
// Good
const courseList = [];
const activeSchedule = schedules[0];
function getCourseById(id: number) {}
async function fetchCourses() {}

// Bad
const CourseList = [];
const active_schedule = schedules[0];
function GetCourseById(id: number) {}
```

### Constants

```typescript
// Good
const MAX_COURSES = 10;
const API_URL = 'https://api.example.com';
const CACHE_TTL = 3600;

// Bad
const maxCourses = 10;
const apiUrl = 'https://api.example.com';
```

### Types and Interfaces

```typescript
// Good
interface UserSchedule {}
type StatusType = 'OPEN' | 'CLOSED';
class Course {}

// Bad
interface userSchedule {}
type status_type = 'OPEN' | 'CLOSED';
class course {}
```

### Private Fields

Prefix private fields with `#` or use TypeScript's `private`:

```typescript
// Good
class Course {
    #internalId: string;
    private metadata: object;

    public get id(): string {
        return this.#internalId;
    }
}
```

## Imports

### Import Order

Organize imports in this order:

1. External libraries
2. Internal absolute imports
3. Relative imports

```typescript
// Good
import { useState, useEffect } from 'react';
import clsx from 'clsx';

import { Course } from '@shared/types/Course';
import { Button } from '@views/components/Button';

import styles from './Component.module.scss';
import { helper } from './helper';

// Bad - mixed order
import styles from './Component.module.scss';
import { useState } from 'react';
import { Course } from '@shared/types/Course';
```

### Module vs Destructured Imports

Use destructured imports for specific exports:

```typescript
// Good
import { useState, useEffect } from 'react';
import { getCourseById, formatCourseName } from './utils';

// Use default imports when appropriate
import React from 'react';
import clsx from 'clsx';

// Avoid
import * as React from 'react';
```

### Side-Effect Imports

Place side-effect imports at the top:

```typescript
// Good
import 'uno.css';
import './global.scss';

import React from 'react';
import { Button } from './components/Button';
```

## Types

### Type vs Interface

Use `interface` for object shapes that may be extended. Use `type` for unions, intersections, and utility types:

```typescript
// Good - Interface for object shapes
interface Course {
    id: number;
    name: string;
}

interface AdvancedCourse extends Course {
    prerequisites: string[];
}

// Good - Type for unions and utilities
type Status = 'OPEN' | 'CLOSED' | 'WAITLISTED';
type CourseOrSchedule = Course | Schedule;
type PartialCourse = Partial<Course>;
```

### Optional vs `undefined`

Use optional properties instead of explicit `undefined`:

```typescript
// Good
interface Props {
    name: string;
    description?: string;
}

// Bad
interface Props {
    name: string;
    description: string | undefined;
}
```

### Array Types

Use `T[]` for simple arrays, `Array<T>` for complex types:

```typescript
// Good
const numbers: number[] = [1, 2, 3];
const courses: Course[] = [];

// Use Array<T> for readability with complex types
const callbacks: Array<(data: unknown) => void> = [];
const tuples: Array<[string, number]> = [];
```

### Type Assertions

Avoid type assertions. Use type guards instead:

```typescript
// Good
function isCourse(obj: unknown): obj is Course {
    return typeof obj === 'object' && obj !== null && 'id' in obj && 'name' in obj;
}

if (isCourse(data)) {
    console.log(data.name);
}

// Bad
const course = data as Course;
console.log(course.name);
```

### Generic Types

Use descriptive names for generic type parameters:

```typescript
// Good
function useState<TState>(initial: TState): [TState, (value: TState) => void] {}
function map<TInput, TOutput>(items: TInput[], fn: (item: TInput) => TOutput): TOutput[] {}

// Acceptable for simple cases
function identity<T>(value: T): T {}

// Bad
function map<A, B>(items: A[], fn: (item: A) => B): B[] {}
```

## Functions

### Function Declarations

Use function declarations for top-level functions:

```typescript
// Good
export function getCourseById(id: number): Course | undefined {
    return courses.find(c => c.id === id);
}

// Bad
export const getCourseById = (id: number): Course | undefined => {
    return courses.find(c => c.id === id);
};
```

### Arrow Functions

Use arrow functions for callbacks and short functions:

```typescript
// Good
const doubled = numbers.map(n => n * 2);
const filtered = courses.filter(c => c.status === 'OPEN');

const handleClick = useCallback((event: MouseEvent) => {
    console.log('Clicked');
}, []);

// Use function declarations for named functions
function processData(data: string) {
    return data.trim();
}
```

### Async/Await

Prefer async/await over promise chains:

```typescript
// Good
async function fetchCourse(id: number): Promise<Course> {
    const response = await fetch(`/api/courses/${id}`);
    const data = await response.json();
    return data;
}

// Bad
function fetchCourse(id: number): Promise<Course> {
    return fetch(`/api/courses/${id}`)
        .then(response => response.json())
        .then(data => data);
}
```

### Default Parameters

Use default parameters instead of checking for undefined:

```typescript
// Good
function greet(name: string, greeting: string = 'Hello'): string {
    return `${greeting}, ${name}!`;
}

// Bad
function greet(name: string, greeting?: string): string {
    const finalGreeting = greeting || 'Hello';
    return `${finalGreeting}, ${name}!`;
}
```

### Rest Parameters

Place rest parameters last:

```typescript
// Good
function sum(initial: number, ...numbers: number[]): number {
    return initial + numbers.reduce((a, b) => a + b, 0);
}

// Bad
function sum(...numbers: number[], initial: number): number {
    return initial + numbers.reduce((a, b) => a + b, 0);
}
```

## React

### Function Components

Always use function components:

```typescript
// Good
export default function Button({
    variant = 'filled',
    children
}: Props): JSX.Element {
    return <button className={variant}>{children}</button>;
}

// Bad
const Button: React.FC<Props> = ({ variant, children }) => {
    return <button className={variant}>{children}</button>;
};
```

### Props

Define props with interfaces:

```typescript
// Good
interface ButtonProps {
    variant?: 'filled' | 'outline';
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
}

export function Button({
    variant = 'filled',
    onClick,
    disabled,
    children
}: React.PropsWithChildren<ButtonProps>): JSX.Element {
    return <button onClick={onClick} disabled={disabled}>{children}</button>;
}
```

### Hooks

Custom hooks must start with `use`:

```typescript
// Good
export function useWindowSize() {
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const handleResize = () => {
            setSize({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return size;
}
```

### Event Handlers

Prefix event handlers with `handle`:

```typescript
// Good
const handleClick = () => {};
const handleSubmit = (event: FormEvent) => {};
const handleChange = (value: string) => {};

// Bad
const onClick = () => {};
const submit = () => {};
const changed = () => {};
```

### JSX

Use self-closing tags when there are no children:

```typescript
// Good
<Button variant="filled" />
<Input type="text" value={name} />

// Bad
<Button variant="filled"></Button>
```

Use fragments instead of div wrappers when possible:

```typescript
// Good
<>
    <Header />
    <Main />
</>

// Bad
<div>
    <Header />
    <Main />
</div>
```

## Comments and Documentation

### JSDoc

Document all exported functions, classes, and complex types:

```typescript
/**
 * Calculates the total credit hours for a schedule.
 *
 * @param courses - The list of courses in the schedule
 * @returns The total number of credit hours
 */
export function calculateTotalHours(courses: Course[]): number {
    return courses.reduce((total, course) => total + course.creditHours, 0);
}
```

```typescript
/**
 * Represents a university course.
 */
export interface Course {
    /** Unique identifier for the course */
    id: number;
    /** Full course name including department */
    name: string;
    /** Number of credit hours */
    creditHours: number;
}
```

### Inline Comments

Use inline comments sparingly for complex logic:

```typescript
// Good - Explains non-obvious behavior
// Remove duplicate courses based on unique ID
const uniqueCourses = courses.filter((course, index, arr) => arr.findIndex(c => c.id === course.id) === index);

// Bad - Obvious comment
// Add 1 to count
count = count + 1;
```

### TODO/FIXME

Format action comments consistently:

```typescript
// TODO: Implement pagination
// FIXME: Handle edge case when array is empty
// NOTE: This workaround is needed for Safari compatibility
```

## Styling

### CSS Modules

Use CSS/SCSS modules for component styles:

```typescript
// Component.tsx
import styles from './Component.module.scss';

export function Component() {
    return <div className={styles.container}>Content</div>;
}
```

```scss
// Component.module.scss
.container {
    padding: 1rem;
    background: white;
}
```

### Modern SCSS

Use `@use` instead of `@import`:

```scss
// Good
@use 'colors.module.scss';

.text {
    color: colors.$primary;
}

// Bad
@import 'colors.module.scss';
```

### Conditional Classes

Use `clsx` for conditional classes:

```typescript
import clsx from 'clsx';

<button
    className={clsx(
        'btn',
        {
            'btn-primary': variant === 'filled',
            'btn-secondary': variant === 'outline',
            'btn-disabled': disabled,
        },
        className
    )}
>
```

### Inline Styles

Avoid inline styles unless dynamic values are needed:

```typescript
// Good - Dynamic color
<div style={{ backgroundColor: color }} />

// Bad - Static styles
<div style={{ padding: '1rem', margin: '0.5rem' }} />

// Use CSS classes instead
<div className={styles.container} />
```

### Type Imports

Always use `type` imports for type-only imports:

```typescript
// Good
import type { Course } from '@shared/types/Course';
import type { UserSchedule } from '@shared/types/UserSchedule';

// Bad
import { Course } from '@shared/types/Course';
```

### Enums vs. Const Objects

Use const objects with `as const` instead of enums:

```typescript
// Good
export const Status = {
    OPEN: 'OPEN',
    CLOSED: 'CLOSED',
    WAITLISTED: 'WAITLISTED',
    CANCELLED: 'CANCELLED',
} as const;

export type StatusType = (typeof Status)[keyof typeof Status];

// Bad
enum Status {
    OPEN = 'OPEN',
    CLOSED = 'CLOSED',
}
```

### Type vs. Interface

Use `interface` for object shapes that may be extended, `type` for unions, intersections, and utility types:

```typescript
// Good - Interface for extendable object shapes
export interface DialogInfo {
    title: ReactNode;
    description?: ReactNode;
    buttons?: ReactNode;
}

// Good - Type for unions and derived types
export type StatusType = (typeof Status)[keyof typeof Status];
export type SiteSupportType = (typeof SiteSupport)[keyof typeof SiteSupport];

// Good - Type for complex compositions
export type TextProps<TTag extends ElementType = 'span'> =
    NonNullable<PropsOf<TTag>['className']> extends string ? AsProps<TTag, { variant?: Variant }> : never;
```

### Avoid `any`

Never use `any`. Use `unknown` or proper types:

```typescript
// Good
async function importSchedule(scheduleData: unknown): Promise<void> {
    if (!isValidSchedule(scheduleData)) {
        throw new Error('Invalid schedule data');
    }
    // ...
}

function isValidSchedule(data: unknown): data is Serialized<UserSchedule> {
    return typeof data === 'object' && data !== null;
}

// Bad
async function importSchedule(scheduleData: any): Promise<void> {
    // ...
}
```

## React Components

### Function Components

Always use function components with TypeScript:

```typescript
// Good
export default function Button({
    variant = 'filled',
    size = 'regular',
    color,
    children,
}: React.PropsWithChildren<Props>): JSX.Element {
    return <button>{children}</button>;
}

// Bad
const Button = (props) => {
    return <button>{props.children}</button>;
};
```

### Props Definition

Define props interfaces clearly with JSDoc comments:

```typescript
interface Props {
    /** The variant style of the button */
    variant?: 'filled' | 'outline' | 'minimal';
    /** The size of the button */
    size?: 'regular' | 'small' | 'mini';
    /** The theme color for the button */
    color: ThemeColor;
    /** Additional CSS classes */
    className?: string;
    /** Click handler */
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
```

### Component Structure

```typescript
import type { Icon } from '@phosphor-icons/react';
import type { ThemeColor } from '@shared/types/ThemeColors';
import clsx from 'clsx';
import React from 'react';

interface Props {
    color: ThemeColor;
    variant?: 'filled' | 'outline';
}

/**
 * A reusable button component that follows the design system.
 *
 * @param props - The button props
 * @returns The rendered button component
 */
export function Button({
    variant = 'filled',
    color,
    children
}: React.PropsWithChildren<Props>): JSX.Element {
    return (
        <button className={clsx('btn', { 'btn-filled': variant === 'filled' })}>
            {children}
        </button>
    );
}
```

### Hooks

Custom hooks must start with `use` and follow React hooks rules:

```typescript
// Good
export default function useSchedules(): [active: UserSchedule, schedules: UserSchedule[]] {
    const [schedules, setSchedules] = useState<UserSchedule[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [activeSchedule, setActiveSchedule] = useState<UserSchedule>(errorSchedule);

    useEffect(() => {
        const l1 = UserScheduleStore.listen('schedules', newValue => {
            setSchedules(newValue);
        });
        return () => UserScheduleStore.removeListener(l1);
    }, []);

    return [activeSchedule, schedules];
}
```

### Event Handlers

Prefix event handlers with `handle`:

```typescript
// Good
const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    // ...
};

const handleImportClick = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // ...
};

// Bad
const onClick = () => {
    /* ... */
};
const importClick = () => {
    /* ... */
};
```

## Styling

### SCSS Modules

Use SCSS modules with the modern `@use` syntax:

```scss
// Good - colors.module.scss
$burnt_orange: #bf5700;
$charcoal: #333f48;

:export {
    burnt_orange: $burnt_orange;
    charcoal: $charcoal;
}
```

```scss
// Good - Component.module.scss
@use 'src/views/styles/colors.module.scss';
@use 'src/views/styles/fonts.module.scss';

.text {
    color: colors.$burnt_orange;
    font-size: fonts.$medium_size;
}

// Bad
@import 'src/views/styles/colors.module.scss';
```

### TypeScript Definitions for SCSS

Create `.d.ts` files for SCSS modules:

```typescript
// colors.module.scss.d.ts
export interface ISassColors {
    burnt_orange: string;
    charcoal: string;
    white: string;
}

export type Color = keyof ISassColors;

declare const colors: ISassColors;
export default colors;
```

### UnoCSS Utility Classes

Use UnoCSS for utility classes alongside SCSS modules:

```tsx
// Good - Combining UnoCSS with component classes
<div className={clsx(styles.card, 'flex flex-col gap-4 p-6')}>
    <Text variant='h2' className='text-ut-burntorange'>
        Title
    </Text>
</div>
```

### clsx for Conditional Classes

Use `clsx` for conditional className logic:

```typescript
import clsx from 'clsx';

// Good
<button
    className={clsx(
        'btn',
        {
            'bg-opacity-100 shadow-md': variant === 'filled',
            'bg-opacity-0 border-current': variant === 'outline',
            'h-10 px-5': size === 'regular',
            'h-6 px-2': size === 'mini',
        },
        className
    )}
>
```

## Imports

### Import Order

Use automatic import sorting with `simple-import-sort`:

```typescript
// 1. External libraries
import { CalendarDots, Trash } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { useCallback, useEffect, useState } from 'react';

// 2. Internal path aliases (alphabetically)
import { background } from '@shared/messages';
import { DevStore } from '@shared/storage/DevStore';
import type { Course } from '@shared/types/Course';
import { Button } from '@views/components/common/Button';
import Text from '@views/components/common/Text/Text';
import useSchedules from '@views/hooks/useSchedules';

// 3. Relative imports
import styles from './Component.module.scss';
```

### Path Aliases

Use path aliases defined in `tsconfig.json`:

```typescript
// Good
import { Course } from '@shared/types/Course';
import { Button } from '@views/components/common/Button';
import useSchedules from '@views/hooks/useSchedules';

// Bad
import { Course } from '../../../shared/types/Course';
import { Button } from '../../components/common/Button';
```

### Export Patterns

Prefer named exports for utilities, default exports for components:

```typescript
// Good - Components
export default function Button(props: Props): JSX.Element {
    return <button />;
}

// Good - Utilities and types
export const Status = { /* ... */ } as const;
export type StatusType = (typeof Status)[keyof typeof Status];

// Good - Hooks
export default function useSchedules(): [UserSchedule, UserSchedule[]] {
    // ...
}
```

## Naming Conventions

### Variables and Functions

Use `camelCase` for variables and functions:

```typescript
// Good
const activeSchedule = schedules[0];
const getCourseColors = (course: Course) => {
    /* ... */
};
async function addCourse(scheduleId: string, course: Course) {
    /* ... */
}

// Bad
const ActiveSchedule = schedules[0];
const get_course_colors = () => {
    /* ... */
};
```

### Constants

Use `UPPER_SNAKE_CASE` for true constants:

```typescript
// Good
const MILLISECOND = 1;
const SECOND = 1000 * MILLISECOND;
const CACHE_TTL = 1 * 60 * 60 * 1000;
const REPO_OWNER = 'Longhorn-Developers';

// Bad
const millisecond = 1;
const cacheTtl = 3600000;
```

### Types and Interfaces

Use `PascalCase` for types and interfaces:

```typescript
// Good
interface UserSchedule {
    /* ... */
}
type StatusType = 'OPEN' | 'CLOSED';
type ThemeColor = 'ut-burntorange' | 'ut-blue';

// Bad
interface userSchedule {
    /* ... */
}
type status_type = 'OPEN' | 'CLOSED';
```

### React Components

Use `PascalCase` for component names:

```typescript
// Good
export default function CourseBlock({ course }: Props): JSX.Element {
    /* ... */
}
export function Button({ children }: Props): JSX.Element {
    /* ... */
}

// Bad
export default function courseBlock() {
    /* ... */
}
export const button = () => {
    /* ... */
};
```

## Functions

### Function Declarations

Use function declarations for top-level functions:

```typescript
// Good
export default function getSiteSupport(url: string): SiteSupportType | null {
    if (url.includes('utdirect.utexas.edu/apps/registrar/course_schedule')) {
        return SiteSupport.COURSE_CATALOG_LIST;
    }
    return null;
}

// Bad
export default const getSiteSupport = (url: string) => {
    // ...
};
```

### Arrow Functions

Use arrow functions for callbacks and function expressions:

```typescript
// Good
const handleClick = useCallback(() => {
    console.log('Clicked');
}, []);

useEffect(() => {
    const listener = UserScheduleStore.listen('schedules', newValue => {
        setSchedules(newValue);
    });
    return () => UserScheduleStore.removeListener(listener);
}, []);

// Good - Array methods
const courseNames = courses.map(course => course.courseName);
const openCourses = courses.filter(course => course.status === Status.OPEN);
```

### Async/Await

Prefer async/await over promise chains:

```typescript
// Good
export default async function importSchedule(scheduleData: unknown): Promise<void> {
    if (!isValidSchedule(scheduleData)) {
        throw new Error('Invalid schedule data');
    }

    const schedule = new UserSchedule(scheduleData);
    await createSchedule(schedule.name);

    for (const course of schedule.courses) {
        await addCourse(schedule.id, new Course(course), true);
    }
}

// Bad
export default function importSchedule(scheduleData: unknown): Promise<void> {
    return validateSchedule(scheduleData)
        .then(schedule => createSchedule(schedule.name))
        .then(() => /* ... */);
}
```

## Type Definitions

### Utility Types

Leverage TypeScript utility types:

```typescript
// Good
type PartialCourse = Partial<Course>;
type ReadonlyCourse = Readonly<Course>;
type CourseKeys = keyof Course;
type CourseValues = Course[keyof Course];

// Extract type from const object
export const SiteSupport = {
    COURSE_CATALOG_LIST: 'COURSE_CATALOG_LIST',
    MY_UT: 'MY_UT',
} as const;

export type SiteSupportType = (typeof SiteSupport)[keyof typeof SiteSupport];
```

### Generic Types

Use descriptive generic type parameters:

```typescript
// Good
export function useDebounce<T extends unknown[]>(
    func: DebouncedCallback<T>,
    delay: number = 1000
): DebouncedCallback<T> {
    // ...
}

function Text<TTag extends ElementType = 'span'>({ as, variant, ...rest }: TextProps<TTag>): JSX.Element {
    // ...
}

// Bad
export function useDebounce<T>(func: T, delay: number): T {
    // ...
}
```

### Type Guards

Use type guards for runtime type checking:

```typescript
// Good
function isValidSchedule(data: unknown): data is Serialized<UserSchedule> {
    return typeof data === 'object' && data !== null && 'courses' in data && 'name' in data;
}

function isValidHexColor(color: string): color is HexColor {
    return /^#[0-9A-F]{6}$/i.test(color);
}
```

## Comments and Documentation

### JSDoc Comments

Use JSDoc for all exported functions, types, and components:

```typescript
/**
 * Adds a course to a user's schedule.
 *
 * @param scheduleId - The id of the schedule to add the course to
 * @param course - The course to add
 * @param hasColor - If the course block already has colors manually set
 * @returns A promise that resolves to void
 * @throws An error if the schedule is not found
 */
export default async function addCourse(scheduleId: string, course: Course, hasColor = false): Promise<void> {
    // ...
}
```

```typescript
/**
 * Custom hook that manages user schedules.
 *
 * @returns A tuple containing the active schedule and an array of all schedules
 */
export default function useSchedules(): [active: UserSchedule, schedules: UserSchedule[]] {
    // ...
}
```

### Inline Comments

Use inline comments sparingly and only for complex logic:

```typescript
// Good - Explaining non-obvious logic
// Remove the next button so that we don't load the same page twice
removePaginationButtons(document);

// Bad - Obvious comment
// Set the schedules
setSchedules(newSchedules);
```

### TODO Comments

Format TODO comments consistently:

```typescript
// TODO: Implement auto-registration feature
// FIXME: Handle edge case when course has no schedule
// NOTE: This is a temporary workaround for Chrome extension API limitation
```

## Chrome Extension Patterns

### Message Passing

Use type-safe message passing with `chrome-extension-toolkit`:

```typescript
// Define messages
export interface UserScheduleMessages {
    addCourse: (data: { scheduleId: string; course: Course }) => void;
    removeSchedule: (data: { scheduleId: string }) => string | undefined;
}

// Create messenger
export const background = createMessenger<BACKGROUND_MESSAGES>('background');

// Use in components
const result = await background.addCourse({ scheduleId, course });
```

### Storage Wrappers

Use typed storage wrappers:

```typescript
import { UserScheduleStore } from '@shared/storage/UserScheduleStore';

// Listen to changes
const listener = UserScheduleStore.listen('schedules', newValue => {
    setSchedules(newValue);
});

// Clean up
return () => UserScheduleStore.removeListener(listener);
```

### Content Script Injection

Follow the site support pattern:

```typescript
export const SiteSupport = {
    COURSE_CATALOG_LIST: 'COURSE_CATALOG_LIST',
    COURSE_CATALOG_DETAILS: 'COURSE_CATALOG_DETAILS',
    MY_UT: 'MY_UT',
} as const;

export type SiteSupportType = (typeof SiteSupport)[keyof typeof SiteSupport];

export default function getSiteSupport(url: string): SiteSupportType | null {
    if (url.includes('utdirect.utexas.edu/apps/registrar/course_schedule')) {
        return SiteSupport.COURSE_CATALOG_LIST;
    }
    return null;
}
```

### Extension Root Wrapper

Wrap all injected UI with `ExtensionRoot`:

```tsx
import ExtensionRoot from '@views/components/common/ExtensionRoot/ExtensionRoot';

export default function InjectedButton(): JSX.Element | null {
    return (
        <ExtensionRoot>
            <Button variant='filled' color='ut-burntorange'>
                Add Course
            </Button>
        </ExtensionRoot>
    );
}
```
