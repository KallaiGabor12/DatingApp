/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    screens: {
      // Mobile-first (defaults)
      sm:  '640px',   // phones (landscape, small tablets)
      md:  '768px',   // tablets
      lg:  '1024px',  // small laptops
      xl:  '1280px',  // laptops / desktops
      '2xl': '1536px', // large desktops (default Tailwind max)

      // Extended, still reasonable
      '3xl': '1920px', // Full HD
      '4xl': '2560px', // QHD / 1440p
      '5xl': '3200px', // Ultrawide / large desktop
      // intentionally stopping before UHD (3840px)
    },
  },
  plugins: [],
}