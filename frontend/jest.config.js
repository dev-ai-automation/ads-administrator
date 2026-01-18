const nextJest = require('next/jest');

// Proporcionar la ruta a tu aplicación Next.js para cargar next.config.js y los archivos .env en tu entorno de prueba
const createJestConfig = nextJest({
  dir: './',
});

// Configuración personalizada de Jest para pasar a Jest
const customJestConfig = {
  coverageProvider: 'v8',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    // Manejar alias de módulos
    '^@/(.*)$': '<rootDir>/src/$1',
    // Manejar importaciones de CSS/Sass
    '^.+\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  // Seniority Tip: Ignorar directorios que no contienen tests para mayor performance
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
};

// createJestConfig se exporta de esta manera para asegurar que next/jest pueda cargar la configuración de Next.js
module.exports = createJestConfig(customJestConfig);