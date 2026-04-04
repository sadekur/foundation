import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-white shadow-inner border-t mt-8">
      <div className="w-full max-w-none xs:max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-8xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-4 text-center text-xs xs:text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Sadekur Rahman. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
