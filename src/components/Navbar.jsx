import React from 'react'
import { NAV_LINKS } from '../data/contentData'

export default function Navbar({ activeNav, setActiveNav, onOpenProfile }) {
  return (
    <>
      {/* Desktop TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/10 shadow-2xl items-center justify-between px-6 md:px-16 h-16 hidden md:flex transition-transform duration-300">
        <div className="flex items-center gap-4">
          <button 
            aria-label="Menu" 
            className="text-[#d0c5af] hover:text-[#f2ca50] transition-colors duration-300 active:scale-95 flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-2xl" data-icon="travel_explore">travel_explore</span>
          </button>
          <a href="/" className="font-['Manrope'] font-bold text-2xl text-[#f2ca50] tracking-tighter uppercase leading-none hover:opacity-90 transition-opacity">
            KHALEEL.AI
          </a>
        </div>

        <nav className="hidden md:flex gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setActiveNav(link.label.toLowerCase())}
              className={`transition-colors duration-300 active:scale-95 font-['Hanken_Grotesk'] text-sm tracking-wide ${
                activeNav === link.label.toLowerCase()
                  ? 'text-[#f2ca50] font-bold border-b-2 border-[#f2ca50] pb-0.5'
                  : 'text-[#d0c5af] hover:text-[#f2ca50]'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button 
          onClick={onOpenProfile}
          aria-label="Profile" 
          className="text-[#d0c5af] hover:text-[#f2ca50] transition-colors duration-300 active:scale-95 flex items-center justify-center cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl" data-icon="account_circle">account_circle</span>
        </button>
      </header>

      {/* Mobile Header Fallback */}
      <header className="fixed top-0 w-full z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 h-16 md:hidden">
        <a href="/" className="font-['Manrope'] font-bold text-xl text-[#f2ca50] tracking-tighter uppercase leading-none">
          KHALEEL.AI
        </a>
        <button 
          onClick={onOpenProfile}
          aria-label="Profile"
          className="text-[#d0c5af] hover:text-[#f2ca50] transition-colors active:scale-95"
        >
          <span className="material-symbols-outlined text-2xl">account_circle</span>
        </button>
      </header>
    </>
  )
}
