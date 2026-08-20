import React from 'react'

export default function BookingModal({ isOpen, onClose, selectedItem, type }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#101415] border border-[#f2ca50]/30 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#020617]/80">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#f2ca50]">verified</span>
            <h3 className="font-['Manrope'] font-bold text-white text-lg">
              {type === 'builder' ? 'DIY Umrah Builder' : 'Package Reservation'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#d0c5af] hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="p-6 space-y-4 font-['Hanken_Grotesk'] text-sm">
          {type === 'builder' ? (
            <div>
              <p className="text-[#d0c5af] mb-4">
                Our custom AI concierge is ready to assist you in designing a customized itinerary with your preferred flight dates, 5-star or 4-star hotels, private transport, and guided historical Ziyarat tours.
              </p>
              <div className="bg-[#191c1e] p-4 rounded-xl border border-white/10 space-y-2 text-xs text-[#d0c5af]">
                <p className="text-white font-bold text-sm">Next Step:</p>
                <p>An Umrah specialist concierge will contact you with instant pricing quotes and custom booking confirmation.</p>
              </div>
            </div>
          ) : selectedItem ? (
            <div>
              <h4 className="font-['Manrope'] text-lg font-bold text-white mb-2">
                {selectedItem.title || selectedItem.name}
              </h4>
              {selectedItem.date && (
                <p className="text-[#f2ca50] font-semibold mb-1">
                  📅 {selectedItem.date}
                </p>
              )}
              {selectedItem.price && (
                <p className="text-white font-bold text-base mb-3">
                  Starting from: <span className="text-[#f2ca50]">{typeof selectedItem.price === 'number' ? `$${selectedItem.price} / night` : selectedItem.price}</span>
                </p>
              )}
              {selectedItem.distance && (
                <p className="text-[#d0c5af] text-xs mb-3">
                  📍 {selectedItem.distance}
                </p>
              )}
              <div className="bg-[#191c1e] p-4 rounded-xl border border-white/10 text-xs text-[#d0c5af]">
                Your booking inquiry has been registered. Full itinerary PDF, visa checklist, and flight reservation details will be provided.
              </div>
            </div>
          ) : null}

          <div className="pt-2 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-white/20 text-[#d0c5af] hover:text-white font-semibold cursor-pointer text-xs transition-colors"
            >
              Close
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[#f2ca50] hover:bg-[#ffe088] text-[#020617] font-bold cursor-pointer text-xs transition-colors shadow-md"
            >
              Confirm Inquiry
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
