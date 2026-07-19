import nodeConfig from '@ims/eslint-config/node';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nodeConfig,
  {
    ignores: ['src/generated/**', 'prisma/migrations/**', '**/*.d.ts'],
  },
];
