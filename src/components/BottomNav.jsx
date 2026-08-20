import React from 'react'

export default function BottomNav({ activeNav, setActiveNav, onOpenProfile }) {
  return (
    <nav className="fixed bottom-0 w-full z-50 rounded-t-2xl bg-[#020617]/95 backdrop-blur-xl border-t border-white/10 shadow-[0_-4px_25px_rgba(242,202,80,0.1)] flex justify-around items-center h-20 px-4 pb-safe md:hidden">
      <a
        href="#explore"
        onClick={() => setActiveNav('explore')}
        className={`flex flex-col items-center justify-center transition-all duration-200 px-3 py-1.5 rounded-xl ${
          activeNav === 'explore'
            ? 'text-[#f2ca50] font-bold bg-[#323537]/60 shadow-inner'
            : 'text-[#d0c5af] hover:text-[#f2ca50]'
        }`}
      >
        <span className="material-symbols-outlined text-2xl mb-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
          explore
        </span>
        <span className="font-['Hanken_Grotesk'] text-[11px] font-bold uppercase tracking-wider">
          Explore
        </span>
      </a>

      <a
        href="#fixed"
        onClick={() => setActiveNav('fixed')}
        className={`flex flex-col items-center justify-center transition-all duration-200 px-3 py-1.5 rounded-xl ${
          activeNav === 'fixed'
            ? 'text-[#f2ca50] font-bold bg-[#323537]/60 shadow-inner'
            : 'text-[#d0c5af] hover:text-[#f2ca50]'
        }`}
      >
        <span className="material-symbols-outlined text-2xl mb-0.5">flight_takeoff</span>
        <span className="font-['Hanken_Grotesk'] text-[11px] font-bold uppercase tracking-wider">
          Fixed
        </span>
      </a>

      <a
        href="#custom"
        onClick={() => setActiveNav('custom')}
        className={`flex flex-col items-center justify-center transition-all duration-200 px-3 py-1.5 rounded-xl ${
          activeNav === 'custom'
            ? 'text-[#f2ca50] font-bold bg-[#323537]/60 shadow-inner'
            : 'text-[#d0c5af] hover:text-[#f2ca50]'
        }`}
      >
        <span className="material-symbols-outlined text-2xl mb-0.5">dashboard_customize</span>
        <span className="font-['Hanken_Grotesk'] text-[11px] font-bold uppercase tracking-wider">
          Custom
        </span>
      </a>

      <button
        onClick={onOpenProfile}
        className="flex flex-col items-center justify-center transition-all duration-200 px-3 py-1.5 rounded-xl text-[#d0c5af] hover:text-[#f2ca50] cursor-pointer"
      >
        <span className="material-symbols-outlined text-2xl mb-0.5">person</span>
        <span className="font-['Hanken_Grotesk'] text-[11px] font-bold uppercase tracking-wider">
          Profile
        </span>
      </button>
    </nav>
  )
}
