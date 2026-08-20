import React from 'react'

export default function Footer() {
  return (
    <footer className="w-full bg-[#0b0f10] border-t border-white/5 flex flex-col items-center gap-4 py-12 px-4 md:px-16 text-center md:mb-0 mb-20">
      <h2 className="font-['Manrope'] font-bold text-2xl text-[#f2ca50] tracking-wider">
        KHALEEL.AI
      </h2>

      <div className="flex flex-wrap justify-center gap-6 my-2">
        <a href="#privacy" className="font-['Hanken_Grotesk'] text-sm text-[#d0c5af] hover:text-white transition-colors opacity-80 hover:opacity-100">
          Privacy
        </a>
        <a href="#terms" className="font-['Hanken_Grotesk'] text-sm text-[#d0c5af] hover:text-white transition-colors opacity-80 hover:opacity-100">
          Terms
        </a>
        <a href="#concierge" className="font-['Hanken_Grotesk'] text-sm text-[#d0c5af] hover:text-white transition-colors opacity-80 hover:opacity-100">
          Concierge
        </a>
        <a href="#contact" className="font-['Hanken_Grotesk'] text-sm text-[#d0c5af] hover:text-white transition-colors opacity-80 hover:opacity-100">
          Contact
        </a>
      </div>

      <p className="font-['Hanken_Grotesk'] text-xs text-[#d0c5af] opacity-60 tracking-wider">
        © 2026 KHALEEL.AI. BESPOKE INTELLIGENCE. ALL RIGHTS RESERVED.
      </p>
    </footer>
  )
}
