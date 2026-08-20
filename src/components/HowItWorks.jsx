import React from 'react'
import { HOW_IT_WORKS_STEPS } from '../data/contentData'

export default function HowItWorks() {
  return (
    <section className="py-16 px-4 md:px-16 bg-[#0b0f10] border-y border-white/5">
      <div className="w-full max-w-[1280px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-['Manrope'] font-semibold text-2xl md:text-3xl text-white mb-4 tracking-tight">
            How It Works
          </h2>
          <p className="font-['Hanken_Grotesk'] text-sm md:text-base text-[#d0c5af] max-w-2xl mx-auto leading-relaxed">
            A transparent process designed to ensure accuracy and verifiability in every response.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {HOW_IT_WORKS_STEPS.map((item, index) => (
            <div
              key={index}
              className="glass-panel p-8 rounded-2xl flex flex-col items-center text-center group hover:border-[#f2ca50]/50 hover:bg-[#020617]/80 transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
            >
              <div className="w-12 h-12 rounded-full border border-[#f2ca50]/50 bg-[#f2ca50]/10 flex items-center justify-center mb-6 text-[#f2ca50] group-hover:scale-110 group-hover:bg-[#f2ca50] group-hover:text-[#020617] transition-all duration-300">
                <span className="material-symbols-outlined text-2xl">{item.icon}</span>
              </div>
              
              <h3 className="font-['Manrope'] font-semibold text-white text-lg mb-2 group-hover:text-[#f2ca50] transition-colors">
                {item.step}
              </h3>
              
              <p className="font-['Hanken_Grotesk'] text-[#d0c5af] text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
