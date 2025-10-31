# UT Registration Plus TypeScript/React Style Guide

## Table of Contents

1. [File Organization](#file-organization)
2. [TypeScript Conventions](#typescript-conventions)
3. [React Components](#react-components)
4. [Styling](#styling)
5. [Imports](#imports)
6. [Naming Conventions](#naming-conventions)
7. [Functions](#functions)
8. [Type Definitions](#type-definitions)
9. [Comments and Documentation](#comments-and-documentation)
10. [Chrome Extension Patterns](#chrome-extension-patterns)

## File Organization

### Directory Structure

```
src/
├── pages/           # Chrome extension pages (popup, options, background)
├── views/           # Shared UI components and hooks
│   ├── components/  # React components
│   ├── hooks/       # Custom React hooks
│   ├── lib/         # Utility libraries
│   ├── styles/      # SCSS modules
│   └── contexts/    # React contexts
├── shared/          # Shared utilities, types, and storage
│   ├── types/       # TypeScript type definitions
│   ├── storage/     # Chrome storage wrappers
│   ├── messages/    # Message passing definitions
│   └── util/        # Utility functions
└── assets/          # Static assets
```

### File Naming

- React components: `PascalCase.tsx`
- TypeScript modules: `camelCase.ts`
- SCSS modules: `PascalCase.module.scss`
- Type definitions: `PascalCase.ts`
- Utilities: `camelCase.ts`

```typescript
// Good
src / views / components / common / Button.tsx;
src / views / hooks / useSchedules.ts;
src / shared / types / Course.ts;
src / views / lib / getSiteSupport.ts;

// Bad
src / views / components / common / button.tsx;
src / views / hooks / UseSchedules.ts;
```

## TypeScript Conventions

### Strict Mode

Use strict TypeScript configuration:

```json
{
    "compilerOptions": {
        "strict": true,
        "noUncheckedIndexedAccess": true,
        "noFallthroughCasesInSwitch": true
    }
}
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
