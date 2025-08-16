# Accessible UI Kit (React + TS + Storybook)

An accessible React UI Kit built with TypeScript and Storybook. Designed for robust accessibility, developer experience, and easy integration.

---

## Features
- **Accessible Components**: All components include proper ARIA attributes and support for assistive technologies.
- **Keyboard Support**: Full keyboard navigation and focus-visible styles.
- **A11y Testing**: Integrated Storybook Accessibility panel (WCAG 2A/AA).
- **Storybook Integration**: Interactive component workshop and documentation.
- **TypeScript**: Strongly typed for safety and IDE support.
- **Testing**: Vitest + React Testing Library for unit and integration tests.
- **CI Integration**: Continuous Integration setup with linting, type-checking, and tests to ensure code quality and prevent regressions.

---

## Components
The kit includes the following components:
- **Button**
- **Input**
- **Select**
- **Modal**
- **Tabs**
- **Toast**

All components include focus-visible styles, keyboard support, and accessibility attributes by default.

---

## Getting Started

1. **Install dependencies**
   ```sh
   npm install
   ```
2. **Run Storybook (component workshop)**
   ```sh
   npm run storybook
   ```
3. **Run the app dev server**
   ```sh
   npm run dev
   ```
4. **Run tests**
   ```sh
   npm run test
   ```
5. **Build Storybook static docs**
   ```sh
   npm run build-storybook
   ```
6. **Use components**
   - Import and use components from the kit in your React application as needed.

---

## Scripts
- `npm run dev` – app dev server
- `npm run storybook` – component workshop
- `npm run build-storybook` – build static docs (`./storybook-static`)
- `npm run test` / `npm run test:run` – run tests (Vitest + RTL)
- `npm run lint` / `npm run typecheck` – code quality checks

---

## Conventions
- **Commit style**: [Conventional Commits](https://www.conventionalcommits.org/)
- **Pre-commit**: Lint, typecheck, and tests enforced via Husky
- **A11y**: Run Storybook **Accessibility** panel (WCAG 2A/AA) to verify compliance
