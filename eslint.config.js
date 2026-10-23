import globals from 'globals'
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js'

export default [
  {
    ignores: ['dist/**', 'node_modules/**', '*.config.js']
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  },
  pluginReactConfig,
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off'
    }
  }
]
