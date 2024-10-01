# UT Registration Plus

![Chrome Web Store](https://img.shields.io/chrome-web-store/v/hboadpjkoaieogjimneceaahlppnipaa)
![Downloads](https://img.shields.io/chrome-web-store/d/hboadpjkoaieogjimneceaahlppnipaa)
![License](https://img.shields.io/github/license/Longhorn-Developers/UT-Registration-Plus)

We've all been there. 20 tabs of Rate My Professor, Google Spreadsheet, and the UT Course Schedule open and you still don't know what classes to take.
This extension, UT Registration Plus (UTRP), tries to streamline most of the unnecessary steps and headaches of registering for classes at UT Austin.

- For each class in the UT Course Schedule site, UTRP provides a "breakdown" popup, with quick and easy links to the instructor's RateMyProfessor, Course Evaluation Survey (CES) and past syllabi.

- Shows the course description with highlighted information on prerequisites, restrictions, etc.

- Shows an aggregate and semesterly graph of the grade distributions for each course.

- Gives you the ability to add "Add Course" and view them in the extension popup, a quick list of all the courses you have saved and an easy way to copy unique numbers.

- Highlights and crosses-out what courses on the UT Course Catalog would conflict with your currently saved courses, making selecting courses that fit with your schedule so much easier.

- Display's a weekly schedule based on your saved courses.

- Give you the ability to create multiple schedules to plan for different scenarios.

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

## Contributing

Contributions are welcome and encouraged! To contribute, please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes and ensure the code follows the linting and formatting rules (`pnpm run lint` and `pnpm run prettier`)
4. Commit your changes following the **Conventional Commits** specification
5. Push to the branch (`git push origin feature/your-feature`)
6. Open a Pull Request

For large changes, it's recommended to open an issue first to discuss your proposed changes.

## Development: Getting Started

1. Clone this repo
2. This project uses `pnpm` to manage and patch dependencies. Run `pnpm install` to configure the repository for building/development
3. Using either of the methods listed below, the extension will build to the `dist/` directory.

### Development Builds

- Run `pnpm dev`

> [!NOTE]
> Injected content such as extension content on UT pages is not properly styled, and are missing class stylings. When developing for these pages, use `NODE_ENV='development' pnpm run dev build --mode development -w` to build and watch for changes. This will ensure you are seeing an accurate representation of the extension.

### Production Builds

- Run `pnpm build`

<details>
<summary>Beta builds</summary>
Use `BETA=true pnpm build` to build a beta build.
</details>

## Development: Loading the Extension Manually

Open [chrome://extensions](chrome://extensions), ensure you have 'Developer Mode' enabled, and click 'Load unpacked'.

Navigate to the `dist/` folder, and click 'select' to import the extension.

## Bug Reporting

If you encounter any bugs or issues, please submit a detailed report in the [Issues](https://github.com/Longhorn-Developers/UT-Registration-Plus/issues) section. Be sure to include:

- A descriptive title
- Steps to reproduce the issue
- Expected behavior
- Screenshots or logs (if applicable)

We will address issues as promptly as possible.

## Conventional Commits & Branch Naming Convention

We follow the **Conventional Commits** specification for commit messages. This helps us maintain a consistent history, enabling automated versioning and changelog generation.

### Commit Messages

Please format your commit messages as follows:

```
<type>(<scope>): <subject>
```

Where:

- **type**: One of the following:
  - `feat`: A new feature
  - `fix`: A bug fix
  - `docs`: Documentation changes
  - `style`: Code formatting (white-space, formatting, missing semi-colons, etc.)
  - `refactor`: Code restructuring (neither fixes a bug nor adds a feature)
  - `test`: Adding or modifying tests
  - `chore`: Changes to the build process or auxiliary tools

Example:

```
feat(auth): add login functionality
fix(ui): correct button alignment
```

### Branch Naming

Branch names should follow the format:

```
<type>/<short-description>
```

Examples:

- `feat/user-login`
- `fix/navbar-layout`
- `docs/update-readme`

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE.md) file for more details.

## Code of Conduct [TODO]

We adhere to a strict code of conduct. By participating, you are expected to uphold this code. Please read [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) for details.

## Acknowledgements

This project leverages several powerful open-source tools and libraries. Special thanks to the developers behind:
- React 18
- TypeScript
- Vite 5
- ESLint
- Prettier
- Storybook
- Semantic-Release
- [chrome-extension-toolkit](https://github.com/sghsri/chrome-extension-toolkit)
- [UT_Grade_Parser](https://github.com/doprz/UT_Grade_Parser)
- [eslint-plugin-import-essentials](https://github.com/doprz/eslint-plugin-import-essentials)
- Figma designs by @IsaDavRod
- Custom pnpm patches by @Razboy20
- UT Registration Plus v1 with @sghsri as the original author for creating the foundation of UTRP and impacting thousands of UT students positively via his Chrome Extension
- [UT Registration Planner](https://github.com/doprz/UT-Registration-Planner) was archived and it's developer @doprz joined UT Registration Plus in 2023
- [Longhorn Developers](https://github.com/Longhorn-Developers) organization was created in 2024 for further development of UTRP and other student-led projects.
- All UTRP devs, beta testers, and anyone who helped support this project
