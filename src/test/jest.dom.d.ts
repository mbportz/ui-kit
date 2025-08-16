import '@testing-library/jest-dom';
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

// Add jest-dom + axe matchers to Vitest's Assertion type
declare module 'vitest' {
  interface Assertion<T = unknown> extends TestingLibraryMatchers<T, void> {
    toHaveNoViolations(): void;
  }
  interface AsymmetricMatchersContaining
    extends TestingLibraryMatchers<unknown, void> {
    toHaveNoViolations(): void;
  }
}
