import '@testing-library/jest-dom';

// Mock global fetch if necessary, but Next.js jest preset usually handles globals.
// We might need to polyfill TextEncoder/TextDecoder if using older node environments, but Node 20 is fine.
