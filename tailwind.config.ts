import type { Config } from "tailwindcss";
import daisyui from 'daisyui'

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./node_modules/daisyui/dist/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [
      daisyui
  ],
  daisyui: {
    themes: [
      {
        custom: {
          "primary": "#4F46E5",  // Customize primary color (adjust as needed)
          "secondary": "#9333EA",  // Customize secondary color (adjust as needed)
          "accent": "#06B6D4",     // Customize accent color (adjust as needed)
          "neutral": "#171717",    // Foreground color
          "base-100": "#ffffff",  // Background color
          "base-200": "#f3f4f6",  // Light background shade
        },
      },
    ],
  },
} satisfies Config;
