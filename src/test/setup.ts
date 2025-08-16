import { expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import 'jest-axe/extend-expect';

expect.extend(matchers as unknown as typeof matchers);
