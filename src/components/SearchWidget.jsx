import React, { useState } from 'react'

export default function SearchWidget({ onSearch }) {
  const [activeTab, setActiveTab] = useState('packages')
  const [month, setMonth] = useState('All Months*')
  const [packageType, setPackageType] = useState('Select Package Type')
  const [pilgrims, setPilgrims] = useState('Number of Pilgrims')

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (onSearch) {
      onSearch({ activeTab, month, packageType, pilgrims })
    }
  }

  return (
    <div className="relative z-20 w-full max-w-4xl mx-auto mt-8">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-white/20 shadow-2xl backdrop-blur-2xl">
        {/* Category Tabs */}
        <div className="flex items-center gap-6 mb-6 justify-center text-white font-['Hanken_Grotesk'] text-sm font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('packages')}
            className={`flex items-center gap-2 pb-1 transition-all cursor-pointer ${
              activeTab === 'packages'
                ? 'text-[#f2ca50] border-b-2 border-[#f2ca50] font-semibold'
                : 'text-[#d0c5af] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-lg">package</span> Packages
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('hotels')}
            className={`flex items-center gap-2 pb-1 transition-all cursor-pointer ${
              activeTab === 'hotels'
                ? 'text-[#f2ca50] border-b-2 border-[#f2ca50] font-semibold'
                : 'text-[#d0c5af] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-lg">hotel</span> Hotels
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('transport')}
            className={`flex items-center gap-2 pb-1 transition-all cursor-pointer ${
              activeTab === 'transport'
                ? 'text-[#f2ca50] border-b-2 border-[#f2ca50] font-semibold'
                : 'text-[#d0c5af] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-lg">directions_car</span> Transport
          </button>
        </div>

        {/* Filters Form */}
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-white font-['Hanken_Grotesk'] text-sm font-medium">
              Month
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full bg-[#020617] border border-white/20 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#f2ca50] focus:border-[#f2ca50] outline-none transition-all cursor-pointer text-sm"
            >
              <option value="All Months*">All Months*</option>
              <option value="Ramadan">Ramadan</option>
              <option value="Shawwal">Shawwal</option>
              <option value="Shaban">Shaban</option>
              <option value="Dhul Hijjah">Dhul Hijjah</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-white font-['Hanken_Grotesk'] text-sm font-medium">
              Package Type
            </label>
            <select
              value={packageType}
              onChange={(e) => setPackageType(e.target.value)}
              className="w-full bg-[#020617] border border-white/20 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#f2ca50] focus:border-[#f2ca50] outline-none transition-all cursor-pointer text-sm"
            >
              <option value="Select Package Type">Select Package Type</option>
              <option value="Budget">Budget</option>
              <option value="Premium">Premium</option>
              <option value="VIP">VIP</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-white font-['Hanken_Grotesk'] text-sm font-medium">
              Pilgrim
            </label>
            <select
              value={pilgrims}
              onChange={(e) => setPilgrims(e.target.value)}
              className="w-full bg-[#020617] border border-white/20 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#f2ca50] focus:border-[#f2ca50] outline-none transition-all cursor-pointer text-sm"
            >
              <option value="Number of Pilgrims">Number of Pilgrims</option>
              <option value="1-2">1-2 Pilgrims</option>
              <option value="3-5">3-5 Pilgrims</option>
              <option value="6+">6+ Pilgrims (Group)</option>
            </select>
          </div>

          <div className="flex flex-col gap-2 justify-end">
            <button
              type="submit"
              className="w-full bg-[#f2ca50] hover:bg-[#ffe088] text-[#020617] font-['Hanken_Grotesk'] text-sm px-6 py-3 rounded-xl font-bold transition-all duration-300 h-[50px] shadow-lg shadow-[#f2ca50]/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">search</span>
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
