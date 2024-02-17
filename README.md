# UT Registration Plus

## Built Using

-   React 18
-   TypeScript
-   Vite 5
-   ESLint
-   Prettier
-   Semantic-Release
-   Custom Messaging & Storage Wrappers

## Getting Started

1. Clone this repo
2. Run `pnpm install` to install and patch all the required dependencies

-   If you want to run the development build:

    -   Run `pnpm run dev`

-   If you want to build the extension for production:

    -   Run `pnpm build`

You may have to rename the `__uno.css.js` to `uno.css.js` in dist

Go to chrome://extensions, ensure you have "Developer Mode" enabled, and click 'Load unpacked'

Navigate to the 'dist' folder and click 'select' to import the extension
