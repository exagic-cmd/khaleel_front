import React, { useRef } from 'react'
import { HOLY_SITES } from '../data/contentData'

export default function ZiyaratPlaces({ onSelectSite }) {
  const scrollContainerRef = useRef(null)

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <section className="py-16 px-4 md:px-16 w-full max-w-[1280px] mx-auto bg-[#101415]">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="font-['Manrope'] font-semibold text-2xl md:text-3xl text-white mb-2 tracking-tight">
            Explore Holy Sites &amp; Cities
          </h2>
          <p className="font-['Hanken_Grotesk'] text-sm md:text-base text-[#d0c5af] max-w-3xl leading-relaxed">
            Enrich your spiritual journey with guided visits to historically and religiously significant locations.
          </p>
        </div>

        {/* Scroll navigation arrows for desktop */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="w-10 h-10 rounded-full border border-white/20 text-[#d0c5af] hover:text-[#f2ca50] hover:border-[#f2ca50] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">chevron_left</span>
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="w-10 h-10 rounded-full border border-white/20 text-[#d0c5af] hover:text-[#f2ca50] hover:border-[#f2ca50] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Snap Scroll Gallery */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto hide-scrollbar gap-6 pb-6 snap-x scroll-smooth"
      >
        {HOLY_SITES.map((site) => (
          <div
            key={site.id}
            onClick={() => onSelectSite && onSelectSite(site)}
            className="min-w-[280px] sm:min-w-[300px] h-[340px] rounded-2xl overflow-hidden relative group cursor-pointer snap-start shrink-0 border border-white/10 hover:border-[#f2ca50]/50 transition-all duration-300 shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent z-10" />
            <img
              alt={site.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 select-none"
              src={site.image}
            />
            <div className="absolute bottom-6 left-6 z-20">
              <span className="inline-block bg-[#f2ca50]/20 backdrop-blur-md border border-[#f2ca50]/30 text-[#f2ca50] px-3 py-1 rounded-full font-['Hanken_Grotesk'] text-xs font-bold tracking-wider uppercase mb-3">
                {site.tag}
              </span>
              <h3 className="font-['Manrope'] font-semibold text-white text-2xl group-hover:text-[#f2ca50] transition-colors">
                {site.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
