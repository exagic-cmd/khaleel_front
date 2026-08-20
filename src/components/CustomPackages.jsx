import React from 'react'
import { CUSTOM_PACKAGES } from '../data/contentData'

export default function CustomPackages({ onSelectPackage, onStartBuilder }) {
  return (
    <section id="custom" className="py-16 md:py-24 px-4 md:px-16 w-full max-w-[1280px] mx-auto bg-[#101415]">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <h2 className="font-['Manrope'] font-semibold text-2xl md:text-3xl text-white mb-2 tracking-tight">
            Customize your Umrah Package 2026
          </h2>
          <p className="font-['Hanken_Grotesk'] text-sm md:text-base text-[#d0c5af] max-w-3xl leading-relaxed">
            We are home to the DIY (Do-It-Yourself) Umrah Package. Choose the hotels, transportation, attractions, and travel dates that work for YOU.
          </p>
        </div>

        <button 
          onClick={() => onSelectPackage && onSelectPackage('all-packages')}
          className="hidden md:flex items-center gap-2 text-[#f2ca50] hover:text-[#ffe088] transition-colors font-['Hanken_Grotesk'] text-sm font-medium border border-[#f2ca50] hover:border-[#ffe088] px-4 py-2 rounded-full cursor-pointer hover:bg-[#f2ca50]/10"
        >
          View All <span className="material-symbols-outlined text-sm">chevron_right</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 & 2 */}
        {CUSTOM_PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            className="rounded-2xl glass-panel overflow-hidden group cursor-pointer relative flex flex-col border border-white/10 hover:border-[#f2ca50]/50 transition-all duration-300 hover:-translate-y-1 shadow-lg"
          >
            {pkg.badge && (
              <div className="absolute top-4 right-4 z-10 bg-[#020617]/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#f2ca50]/30 shadow-md">
                <span className="font-['Hanken_Grotesk'] text-xs font-bold text-[#f2ca50] tracking-wider uppercase">
                  {pkg.badge}
                </span>
              </div>
            )}

            <div className="h-48 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] to-transparent z-10" />
              <img
                alt={pkg.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none"
                src={pkg.image}
              />
            </div>

            <div className="p-6 relative z-20 flex-1 flex flex-col">
              <h3 className="font-['Manrope'] font-semibold text-white text-xl leading-tight mb-4 whitespace-pre-line group-hover:text-[#f2ca50] transition-colors">
                {pkg.title}
              </h3>

              {/* Inclusions */}
              <div className="flex justify-around items-center py-4 border-y border-white/10 mb-6 bg-[#020617]/40 rounded-xl">
                {pkg.inclusions.map((inc, i) => (
                  <div
                    key={i}
                    className={`flex flex-col items-center gap-1 ${
                      inc.active ? 'text-[#f2ca50]' : 'text-[#d0c5af]/50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">{inc.icon}</span>
                    <span
                      className={`text-[10px] font-['Hanken_Grotesk'] font-bold tracking-wider ${
                        inc.active ? 'text-white' : 'line-through text-[#d0c5af]/40'
                      }`}
                    >
                      {inc.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Locations */}
              <div className="space-y-2 mb-6">
                {pkg.locations.map((loc, i) => (
                  <div key={i} className="flex items-center gap-2 text-[#d0c5af] font-['Hanken_Grotesk'] text-sm">
                    <span className="material-symbols-outlined text-sm text-[#f2ca50]">location_on</span>
                    <span>{loc}</span>
                  </div>
                ))}
              </div>

              {/* Pricing & CTA */}
              <div className="mt-auto flex justify-between items-end">
                <div>
                  <p className="font-['Hanken_Grotesk'] text-xs font-bold text-[#d0c5af] uppercase tracking-wider mb-1">
                    FROM
                  </p>
                  <p className="font-['Manrope'] text-2xl font-bold text-[#f2ca50]">
                    {pkg.price}
                  </p>
                </div>
                <button
                  onClick={() => onSelectPackage && onSelectPackage(pkg)}
                  className="bg-[#f2ca50] text-[#020617] px-4 py-2 rounded-lg font-['Hanken_Grotesk'] font-bold text-sm hover:bg-[#ffe088] transition-all active:scale-95 cursor-pointer shadow-md"
                >
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Custom Build Card */}
        <div
          onClick={onStartBuilder}
          className="rounded-2xl glass-panel p-8 flex flex-col justify-center items-center text-center group cursor-pointer border-dashed border-2 border-white/20 hover:border-[#f2ca50]/70 transition-all duration-300 hover:bg-[#020617]/70"
        >
          <div className="w-16 h-16 rounded-full bg-[#f2ca50]/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#f2ca50]/20 transition-all duration-300 text-[#f2ca50]">
            <span className="material-symbols-outlined text-3xl">dashboard_customize</span>
          </div>

          <h3 className="font-['Manrope'] font-semibold text-white text-xl mb-2 group-hover:text-[#f2ca50] transition-colors">
            Build Your Own
          </h3>

          <p className="font-['Hanken_Grotesk'] text-sm text-[#d0c5af] mb-6 max-w-xs leading-relaxed">
            Start from scratch and let our AI assist you in crafting the perfect itinerary.
          </p>

          <button
            type="button"
            className="bg-transparent border border-[#f2ca50] text-[#f2ca50] px-6 py-2 rounded-full font-['Hanken_Grotesk'] text-sm font-bold hover:bg-[#f2ca50]/10 hover:border-[#ffe088] hover:text-[#ffe088] transition-all cursor-pointer shadow-sm"
          >
            Start Builder
          </button>
        </div>
      </div>
    </section>
  )
}
