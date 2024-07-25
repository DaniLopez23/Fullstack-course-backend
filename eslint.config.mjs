// Importaciones necesarias para ESM

export default {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  plugins: [
    '@stylistic/js',
  ],
  extends: 'eslint:recommended',
  rules: {
    
  },
};