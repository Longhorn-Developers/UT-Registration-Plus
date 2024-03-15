# UT Registration Plus

We've all been there. 20 tabs of Rate My Professor, Catalyst, and the UT Course Catalog open and you still don't know what classes to take.
This extension tries to streamline most of the unnecessary steps and headaches of registering for classes at UT Austin.

- For each class on the UT Course Catalog it provides a "breakdown" popup, with quick and easy links to the RateMyProfessor and eCIS pages of the professor, as well as syllabi from when the professor taught the class in the past.

- Gets the course description and highlight the important information like prerequisites, restrictions, etc.

- Shows an aggregate graph of the grade distributions for when the professor taught the class in the past.

- Gives you the ability to "Save Courses" and view them in the extension popup. This lets you see any schedule conflicts, and makes copy-pasting the unique code much easier when you're actually registering.

- Highlights and crosses-out what courses on the UT Course Catalog would conflict with your currently saved courses, making selecting courses that fit with your schedule so much easier.

- Display's a weekly schedule based on your saved courses

- ... and much more!

## Toolchain

- React 18
- TypeScript
- Vite 5
- ESLint
- Prettier
- Storybook
- Semantic-Release
- Custom Messaging & Storage Wrappers

## Development: Getting Started

1. Clone this repo
2. This project uses `pnpm` to manage and patch dependencies. Run `pnpm install` to configure the repository for building/development
3. Using either of the methods listed below, the extension will build to the `dist/` directory.

### Development Builds

- Run `pnpm dev`

> [!NOTE]
> Injected content such as extension content on UT pages is not properly styled, and are missing class stylings. When developing for these pages, use `pnpm build -w` to build and watch for changes. This will ensure you are seeing an accurate representation of the extension.

### Production Builds

- Run `pnpm build`

## Development: Loading the Extension Manually

Open [chrome://extensions](chrome://extensions), ensure you have 'Developer Mode' enabled, and click 'Load unpacked'.

Navigate to the `dist/` folder, and click 'select' to import the extension.
