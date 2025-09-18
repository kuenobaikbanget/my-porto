/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './src/**/*.{ts,tsx,js,jsx}'
    ],
    theme: {
        extend: {
            colors: {
                bg: '#000000',
                surface: '#1d232a',
                border: '#2f3a44',
                text: '#e6ecf1',
                textSoft: '#9aa8b5',
                heading: '#f1f5f9',
                accent: '#1e6bff',
            },
            borderRadius: {
                md: '12px',
                lg: '18px'
            },
            transitionTimingFunction: {
                base: 'cubic-bezier(.4,.2,.2,1)'
            }
        }
    },
    corePlugins: {
        preflight: false
    }
}
