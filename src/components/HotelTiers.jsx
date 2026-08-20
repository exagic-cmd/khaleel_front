import React from 'react'
import { HOTEL_TIERS } from '../data/contentData'

export default function HotelTiers({ onSelectTier }) {
  return (
    <section className="py-16 px-4 md:px-16 w-full max-w-[1280px] mx-auto bg-[#0b0f10] border-y border-white/5">
      <div className="text-center mb-12">
        <h2 className="font-['Manrope'] font-semibold text-2xl md:text-3xl text-white mb-4 tracking-tight">
          Tiered Hotel Packages
        </h2>
        <p className="font-['Hanken_Grotesk'] text-sm md:text-base text-[#d0c5af] max-w-2xl mx-auto leading-relaxed">
          Select the level of comfort that suits your budget and needs. We offer carefully vetted accommodations across all tiers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {HOTEL_TIERS.map((tier) => (
          <div
            key={tier.id}
            className={`glass-panel rounded-3xl p-8 flex flex-col relative transition-all duration-300 ${
              tier.isPopular
                ? 'border-2 border-[#f2ca50] shadow-[0_0_40px_rgba(242,202,80,0.15)] md:-translate-y-3 bg-[#020617]/90'
                : 'border border-white/10 hover:border-white/20'
            }`}
          >
            {tier.isPopular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#f2ca50] text-[#020617] px-4 py-1 rounded-full font-['Hanken_Grotesk'] text-xs font-extrabold tracking-wider uppercase shadow-md">
                {tier.badge || 'MOST POPULAR'}
              </div>
            )}

            <h3 className="font-['Manrope'] font-semibold text-white text-xl mb-2">
              {tier.title}
            </h3>

            {/* Star ratings */}
            <div className="flex text-[#f2ca50] mb-6 gap-0.5">
              {[...Array(tier.stars)].map((_, i) => (
                <span
                  key={i}
                  className="material-symbols-outlined text-lg"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
              ))}
            </div>

            {/* Inclusions & Distances */}
            <div className="space-y-4 mb-8 flex-1">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#f2ca50] text-xl mt-0.5">
                  directions_walk
                </span>
                <div>
                  <p className="font-['Hanken_Grotesk'] text-white text-sm font-medium">Distance to Harams</p>
                  <p className="font-['Hanken_Grotesk'] text-xs text-[#d0c5af]">{tier.distance}</p>
                </div>
              </div>

              {tier.features.map((feature, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 font-['Hanken_Grotesk'] text-sm ${
                    feature.available ? 'text-[#d0c5af]' : 'text-[#d0c5af]/50'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-xl ${
                      feature.available ? 'text-[#f2ca50]' : 'text-slate-500'
                    }`}
                  >
                    {feature.available ? 'check_circle' : 'cancel'}
                  </span>
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Pricing and Action */}
            <div className="mt-auto border-t border-white/10 pt-6">
              <p className="font-['Hanken_Grotesk'] text-xs uppercase tracking-wider text-[#d0c5af] mb-1 font-semibold">
                STARTING FROM
              </p>
              <p className="font-['Manrope'] text-3xl font-bold text-[#f2ca50] mb-4">
                PKR{tier.price}{' '}
                <span className="font-['Hanken_Grotesk'] text-sm text-[#d0c5af] font-normal">
                  / night
                </span>
              </p>

              <button
                onClick={() => onSelectTier && onSelectTier(tier)}
                className={`w-full py-3 rounded-xl font-['Hanken_Grotesk'] text-sm font-bold transition-all duration-200 cursor-pointer shadow-md active:scale-95 ${
                  tier.isPopular
                    ? 'bg-[#f2ca50] text-[#020617] hover:bg-[#ffe088]'
                    : 'bg-[#323537] text-white hover:bg-[#3f465c]'
                }`}
              >
                {tier.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
