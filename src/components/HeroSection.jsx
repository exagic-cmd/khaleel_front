import React, { useState } from 'react'
import SearchWidget from './SearchWidget'
import { HERO_IMAGE_CONFIG } from '../data/contentData'

export default function HeroSection({ onAskAi, onSearch }) {
  const [query, setQuery] = useState('')

  const handleAsk = (e) => {
    e?.preventDefault()
    if (query.trim() && onAskAi) {
      onAskAi(query.trim())
    }
  }

  const handleSampleClick = (text) => {
    setQuery(text)
    if (onAskAi) {
      onAskAi(text)
    }
  }

  return (
    <section id="explore" className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 pb-16 overflow-hidden px-4 md:px-16">
      {/* Background Image with Cinematic Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/80 to-[#020617]/60 z-10" />
        <img
          alt={HERO_IMAGE_CONFIG.alt}
          className="w-full h-full object-cover select-none transform scale-105 transition-transform duration-1000"
          src={HERO_IMAGE_CONFIG.url}
          loading="eager"
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto text-center flex flex-col items-center gap-6 mt-8 mb-8">
        <h1 className="font-['Manrope'] text-4xl sm:text-5xl md:text-6xl font-extrabold text-white max-w-4xl mx-auto leading-tight drop-shadow-2xl tracking-tight">
          AI-Powered Guidance for<br />
          <span className="text-[#f2ca50] bg-clip-text text-transparent bg-gradient-to-r from-[#f2ca50] via-[#ffe088] to-[#f2ca50]">
            Hajj &amp; Umrah
          </span>
        </h1>

        {/* AI Prompt Input Bar */}
        <div className="w-full max-w-2xl mt-4 relative">
          <form
            onSubmit={handleAsk}
            className="bg-white rounded-full p-2 flex items-center gap-2 shadow-2xl transition-all duration-300 focus-within:ring-4 focus-within:ring-[#f2ca50]/40"
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent border-none text-[#020617] placeholder:text-[#020617]/50 focus:ring-0 font-['Hanken_Grotesk'] text-base md:text-lg px-6 py-2 outline-none"
              placeholder="Ask about Hajj rituals, Umrah rulings..."
              type="text"
            />
            <button
              type="submit"
              aria-label="Submit question to AI"
              className="bg-[#f2ca50] text-[#020617] w-12 h-12 rounded-full flex items-center justify-center hover:bg-[#ffe088] transition-all duration-200 cursor-pointer shrink-0 shadow-md active:scale-95"
            >
              <span className="material-symbols-outlined text-xl">send</span>
            </button>
          </form>

          {/* Quick suggestions */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[#f2ca50]/90 font-['Hanken_Grotesk'] text-sm">
            <span className="w-2 h-2 rounded-full bg-[#f2ca50] animate-pulse" />
            <span>Try asking:</span>
            <button
              type="button"
              onClick={() => handleSampleClick("What are the restrictions during Ihram?")}
              className="underline decoration-[#f2ca50]/50 hover:decoration-[#f2ca50] text-[#f2ca50] hover:text-[#ffe088] transition-colors cursor-pointer text-left"
            >
              "What are the restrictions during Ihram?"
            </button>
          </div>
        </div>
      </div>

      {/* Embedded Search Widget */}
      <SearchWidget onSearch={onSearch} />
    </section>
  )
}
