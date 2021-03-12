module.exports = {
  purge: {
    content: ['./pages/**/*.{js,ts,jsx,tsx}','./layouts/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],

    // These options are passed through directly to PurgeCSS
    options: {
      safelist: ['sm:grid-cols-1', 'sm:grid-cols-2', 'sm:grid-cols-3','sm:grid-cols-3', 'sm:grid-cols-4', 'sm:grid-cols-5', 'grid-cols-6', 'grid-cols-8'],
      blocklist: [/^debug-/],
      keyframes: true,
      fontFace: true,
    },
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      'NanumGothic': ['"Nanum Gothic"', 'sans-serif']
    },
    extend: {
      backgroundImage: {
        'hero-lg': "url('/img/handshake.jpeg')",
      },
      height: {
        'mobile': "25rem",
      },
      shadow: {
        'left': "-10px 0px 10px 1px #aaaaaa"
      }
    },
  },
  variants: {
    extend: {
        opacity: [
          "disabled"
        ],
        backgroundColor: [
            "disabled"
        ],
        cursor: [
            "disabled"
        ]
    }
},
  plugins: [

  ]
}