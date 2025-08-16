import { expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import 'jest-axe/extend-expect';

// Extend Vitest expect with DOM matchers
expect.extend(matchers as unknown as typeof matchers);
