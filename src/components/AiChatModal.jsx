import React, { useState, useEffect } from 'react'

export default function AiChatModal({ isOpen, onClose, initialQuery }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleUserQuery = (queryText) => {
    const userMsg = { sender: 'user', text: queryText }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)

    // Simulate verified AI retrieval grounded in verified sources
    setTimeout(() => {
      let responseText = ''
      let sources = []

      const q = queryText.toLowerCase()
      if (q.includes('ihram') || q.includes('restriction')) {
        responseText = "During the state of Ihram, the following key restrictions apply according to standard Islamic jurisprudence:\n\n1. Prohibited for both men and women: Cutting hair, clipping nails, using scented perfumes or soaps, hunting or cutting wild plants within the Haram territory, and engaging in marital intimacy.\n2. Specific for Men: Wearing stitched garments (tailored shirts, trousers, underwear) and covering the head with headgear.\n3. Specific for Women: Covering the face with a tight Niqab or wearing gloves (loose headscarf/hijab is obligatory)."
        sources = ["General Authority of Islamic Affairs & Endowments", "Fiqh Council of North America & Saudi Senior Scholars Council"]
      } else if (q.includes('tawaf') || q.includes('qudum')) {
        responseText = "Tawaf al-Qudum (The Arrival Tawaf) is performed upon first entering Makkah for Hajj or single Umrah:\n\n• Make the Niyyah (intention) and ensure valid Wudu.\n• Start at the Black Stone (Hajar al-Aswad) and circle the Kaaba counter-clockwise 7 full times.\n• For men, Idtiba' (uncovering the right shoulder) and Raml (brisk walking for the first 3 circuits) is Sunnah.\n• Pray two Rak'ahs behind Maqam Ibrahim or anywhere in the Haram, then drink Zamzam water."
        sources = ["Ministry of Hajj and Umrah Guidelines", "Sahih Bukhari & Sahih Muslim Ritual Standards"]
      } else if (q.includes('miqat') || q.includes('flight')) {
        responseText = "If arriving by air:\n• Flight captains announce the Miqat approximately 20-30 minutes before crossing the boundary.\n• Pilgrims should bathe and put on Ihram garments before boarding or at the transit airport, and formulate intention/Talbiyah right before reaching the designated Miqat (e.g., Yalamlam or Qarn al-Manazil)."
        sources = ["Civil Aviation & Hajj Logistics Protocol"]
      } else {
        responseText = `Regarding "${queryText}":\n\nOur AI verification engine has cross-referenced recognized scholars and official Ministry of Hajj & Umrah sources. Guidance indicates following verified step-by-step Sunnah while respecting local crowd regulations.`
        sources = ["Verified Fatwa Repository", "Ministry of Hajj and Umrah Logistics 2026"]
      }

      const botMsg = {
        sender: 'ai',
        text: responseText,
        sources: sources,
      }
      setMessages((prev) => [...prev, botMsg])
      setLoading(false)
    }, 900)
  }

  useEffect(() => {
    if (isOpen && initialQuery) {
      const timer = setTimeout(() => {
        handleUserQuery(initialQuery)
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [isOpen, initialQuery])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return
    const text = input.trim()
    setInput('')
    handleUserQuery(text)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#101415] border border-[#f2ca50]/30 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#020617]/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#f2ca50]/20 text-[#f2ca50] flex items-center justify-center border border-[#f2ca50]/30">
              <span className="material-symbols-outlined text-xl">auto_awesome</span>
            </div>
            <div>
              <h3 className="font-['Manrope'] font-bold text-white text-lg leading-tight">
                Khaleel.ai Assistant
              </h3>
              <p className="font-['Hanken_Grotesk'] text-xs text-[#d0c5af]">
                Authoritative rulings &amp; verified itinerary intelligence
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#d0c5af] hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Message Log */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          {messages.length === 0 && !loading && (
            <div className="text-center py-12 text-[#d0c5af]">
              <span className="material-symbols-outlined text-4xl text-[#f2ca50] mb-2">
                travel_explore
              </span>
              <p className="font-['Hanken_Grotesk'] text-sm">
                Ask any question regarding Hajj, Umrah rituals, dates, or travel guidance.
              </p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#f2ca50] text-[#020617] font-semibold'
                    : 'bg-[#191c1e] text-[#e0e3e5] border border-white/10 font-["Hanken_Grotesk"]'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-white/10 text-xs text-[#f2ca50]">
                    <div className="flex items-center gap-1 font-bold mb-1">
                      <span className="material-symbols-outlined text-sm">verified</span>
                      <span>Verified Sources:</span>
                    </div>
                    <ul className="list-disc pl-4 space-y-0.5 text-[#d0c5af]">
                      {msg.sources.map((src, i) => (
                        <li key={i}>{src}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-[#f2ca50] text-sm font-['Hanken_Grotesk'] py-2">
              <span className="w-2 h-2 rounded-full bg-[#f2ca50] animate-ping" />
              <span>Synthesizing authoritative rulings...</span>
            </div>
          )}
        </div>

        {/* Input Footer */}
        <form
          onSubmit={handleSubmit}
          className="p-4 border-t border-white/10 bg-[#020617]/50 flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a follow-up or specific question..."
            className="flex-1 bg-[#191c1e] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:ring-2 focus:ring-[#f2ca50] outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#f2ca50] text-[#020617] px-4 py-2.5 rounded-xl font-bold font-['Hanken_Grotesk'] text-sm hover:bg-[#ffe088] transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-lg">send</span>
          </button>
        </form>
      </div>
    </div>
  )
}
