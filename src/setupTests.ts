import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'util';

// react-router v7 requires TextEncoder/TextDecoder in jsdom environment
Object.assign(global, { TextDecoder, TextEncoder });

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
