import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import tailwindcss from 'eslint-plugin-tailwindcss'

const eslintConfig = [
    ...nextCoreWebVitals,
    ...nextTypescript,
    ...tailwindcss.configs['flat/recommended'],
    eslintPluginPrettierRecommended,
    {
        rules: {
            'react-hooks/purity': 'off',
            'react-hooks/set-state-in-effect': 'off',
            'react-hooks/refs': 'off',
        },
    },
    {
        ignores: ['.idea/', 'dist/', 'public/', '.prettierrc.js', 'webpack.*.js', '.next/'],
    },
]

export default eslintConfig
