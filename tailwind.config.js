module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      // Custom breakpoints for better responsiveness
      'xs': '375px',   // Extra small phones
      'sm': '640px',   // Small phones (landscape) / tablets (portrait)
      'md': '768px',   // Tablets
      'lg': '1024px',  // Small laptops
      'xl': '1280px',  // Desktop
      '2xl': '1536px', // Large desktop
      // Custom utility breakpoints
      'mobile': '480px',    // Mobile landscape
      'tablet': '768px',    // Tablet portrait
      'desktop': '1024px',  // Desktop
      'wide': '1400px',     // Wide screens
    },
    extend: {
      // Custom spacing for better mobile experience
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      // Custom container sizes
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      // Custom grid columns for different layouts
      gridTemplateColumns: {
        'responsive': 'repeat(auto-fit, minmax(280px, 1fr))',
        'cards': 'repeat(auto-fit, minmax(200px, 1fr))',
      }
    },
  },
  plugins: [],
}