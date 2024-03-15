# UT Registration Plus

## Built Using

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
2. Run `pnpm install` to install and patch all the required dependencies

- If you want to run the development build:

  - Run `pnpm dev`

    > [!NOTE]
    > Injected content such as extension content on UT pages is not properly styled, and are missing class stylings. When developing for these pages, use `pnpm build -w` to build and watch for changes. This will ensure you are seeing an accurate representation of the extension.

- If you want to build the extension for production:

  - Run `pnpm build`

The extension will build to the `dist/` directory.

## Development: Loading the Extension Manually

Open [chrome://extensions](chrome://extensions), ensure you have 'Developer Mode' enabled, and click 'Load unpacked'.

Navigate to the `dist/` folder, and click 'select' to import the extension.
