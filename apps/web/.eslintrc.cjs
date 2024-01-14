module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: ['@repo/eslint-config', 'plugin:react-hooks/recommended'],
    plugins: ['react-refresh'],
    rules: {
        'react-refresh/only-export-components': [
            'warn',
            { allowConstantExport: true }
        ]
    }
};
