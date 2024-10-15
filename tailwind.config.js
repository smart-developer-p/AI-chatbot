/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        custom: "1px 2px 20px 2px rgba(0, 0, 0, 0.35)",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      // addCommonColors: true,
      themes: {
        dark: {
          colors: {
            background: "#252525",
            foreground: "#ffffff",
            primary: {
              DEFAULT: "#0FA37F",
              foreground: "#ffffff",
            },
            danger: {
              DEFAULT: "#FC506D",
              foreground: "#ffffff",
            },
            success: {
              DEFAULT: "#4CD19F",
              foreground: "#ffffff",
            },
            secondary: {
              DEFAULT: "#494949",
              foreground: "#ffffff",
            },
          },
        },
        light: {
          colors: {
            background: "#E4E3E8",
            foreground: "#000000",
            primary: {
              DEFAULT: "#000000",
              foreground: "#ffffff",
            },
            danger: {
              DEFAULT: "#FC506D",
              foreground: "#ffffff",
            },
            success: {
              DEFAULT: "#4CD19F",
              foreground: "#ffffff",
            },
            secondary: {
              DEFAULT: "#78778B",
              foreground: "#ffffff",
            },
          },
        },
      },
    }),
  ],
};
