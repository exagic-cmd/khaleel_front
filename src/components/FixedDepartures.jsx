import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FIXED_DEPARTURES } from '../data/contentData'
import { slugify } from '../utils/slugify'

export default function FixedDepartures({ onSelectPackage }) {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://app-staging.airporttransfers.ai/api'
  const mediaBaseUrl = import.meta.env.VITE_MEDIA_BASE_URL || 'https://smartdestinations-media.s3.ap-southeast-1.amazonaws.com/'

  useEffect(() => {
    const fetchFixedDepartures = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`${apiBaseUrl}/products/1?category_id=8`)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const json = await response.json()
        
        // Extract array from response payload: response.data.data.data
        const items = json?.data?.data?.data || json?.data?.data || json?.data || []
        
        if (Array.isArray(items) && items.length > 0) {
          const formatted = items.map((item) => {
            // Build full image URL using mediaBaseUrl if relative path
            let imgUrl = item.image || ''
            if (imgUrl && !imgUrl.startsWith('http://') && !imgUrl.startsWith('https://')) {
              const cleanMediaBase = mediaBaseUrl.endsWith('/') ? mediaBaseUrl : `${mediaBaseUrl}/`
              imgUrl = `${cleanMediaBase}${imgUrl.replace(/^\//, '')}`
            }

            return {
              id: item.id,
              title: item.title || item.product_content_title || 'Package Tour',
              startingPrice: item.starting_price,
              currency: item.currency || 'USD',
              categoryName: item.category_name || 'Package Tour',
              city: item.City_name,
              country: item.Country_name,
              isGroup: item.is_group,
              image: imgUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbStP2lAc6byVYksTXcXz5w8IKt_KpUJsjAqWS687yiXpYLAu0JmLTU18kw7BGEW5cn5-T_G9Sak138KT-Ik5sFu9anrSsXGe8D5hvSMypu2R4Xl5fk4VLZ_ECZ2-s7IjHqGE3WvTsAWzxbu5_2CTC5Kk7es4xK07GcASBmPb7BuGcza2Fp7QtnEvXZOGRtrY1E7slDTT6ch_PDb3zzHPBlwnjEPTxuDlcjHOer5EWWb34-0fiynaAVA',
              raw: item,
            }
          })
          setProducts(formatted)
        } else {
          setProducts([])
        }
      } catch (err) {
        console.warn('Could not fetch products from API, falling back to static data:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchFixedDepartures()
  }, [apiBaseUrl, mediaBaseUrl])

  // Helper for image loading errors
  const handleImageError = (e, fallbackUrl) => {
    e.target.onerror = null
    e.target.src = fallbackUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbStP2lAc6byVYksTXcXz5w8IKt_KpUJsjAqWS687yiXpYLAu0JmLTU18kw7BGEW5cn5-T_G9Sak138KT-Ik5sFu9anrSsXGe8D5hvSMypu2R4Xl5fk4VLZ_ECZ2-s7IjHqGE3WvTsAWzxbu5_2CTC5Kk7es4xK07GcASBmPb7BuGcza2Fp7QtnEvXZOGRtrY1E7slDTT6ch_PDb3zzHPBlwnjEPTxuDlcjHOer5EWWb34-0fiynaAVA'
  }

  return (
    <section id="fixed" className="py-16 px-4 md:px-16 w-full max-w-[1280px] mx-auto bg-[#101415]">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h2 className="font-['Manrope'] font-semibold text-2xl md:text-3xl text-white tracking-tight">
              Upcoming Fixed Departures
            </h2>
            {products.length > 0 && !loading && (
              <span className="bg-[#f2ca50]/20 text-[#f2ca50] border border-[#f2ca50]/30 text-xs px-2.5 py-0.5 rounded-full font-bold">
                API Live
              </span>
            )}
          </div>
          <p className="font-['Hanken_Grotesk'] text-sm md:text-base text-[#d0c5af] max-w-3xl leading-relaxed">
            Join our expertly guided group tours with fixed departure dates. Perfect for families, first-timers, and those looking for a community experience.
          </p>
        </div>

        <button 
          onClick={() => onSelectPackage && onSelectPackage('all-schedules')}
          className="hidden md:flex items-center gap-2 text-[#f2ca50] hover:text-[#ffe088] transition-colors font-['Hanken_Grotesk'] text-sm font-medium border border-[#f2ca50] hover:border-[#ffe088] px-4 py-2 rounded-full cursor-pointer hover:bg-[#f2ca50]/10"
        >
          View Schedule <span className="material-symbols-outlined text-sm">calendar_month</span>
        </button>
      </div>

      {/* API Error Notice */}
      {error && !loading && products.length === 0 && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-['Hanken_Grotesk'] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base">warning</span>
            <span>Unable to connect to API ({error}). Showing offline package schedules.</span>
          </div>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="glass-panel p-6 rounded-2xl animate-pulse space-y-4">
              <div className="h-48 bg-[#323537] rounded-xl" />
              <div className="h-6 bg-[#323537] rounded w-3/4" />
              <div className="h-4 bg-[#323537] rounded w-1/2" />
              <div className="h-10 bg-[#323537] rounded-lg mt-4" />
            </div>
          ))}
        </div>
      )}

      {/* Live API Products Grid */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((item) => {
            const productSlug = slugify(item.title)
            const detailUrl = `/package-tour/${productSlug}/${item.id}`
            return (
              <div
                key={item.id}
                className="glass-panel p-6 rounded-2xl flex flex-col border border-white/10 hover:border-[#f2ca50]/50 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-[#f2ca50]/5 cursor-pointer"
                onClick={() => navigate(detailUrl)}
              >
                <div className="h-48 overflow-hidden relative rounded-xl mb-4 bg-[#020617]">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/70 to-transparent z-10" />
                  <img
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none"
                    src={item.image}
                    onError={(e) => handleImageError(e)}
                  />
                </div>

                <div className="flex justify-between items-start mb-4 gap-2">
                  <h3 className="font-['Manrope'] font-semibold text-white text-xl group-hover:text-[#f2ca50] transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <span className="bg-[#f2ca50]/20 text-[#f2ca50] px-3 py-1 rounded-full font-['Hanken_Grotesk'] text-xs font-bold tracking-wider uppercase border border-[#f2ca50]/30 shrink-0">
                    {item.currency} {item.startingPrice}
                  </span>
                </div>

                <div className="space-y-3 mb-6 flex-1">
                  {item.city && (
                    <div className="flex items-center gap-3 text-[#d0c5af] font-['Hanken_Grotesk'] text-sm">
                      <span className="material-symbols-outlined text-[#f2ca50]">location_on</span>
                      <span>{item.city}{item.country ? `, ${item.country}` : ''}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-[#d0c5af] font-['Hanken_Grotesk'] text-sm">
                    <span className="material-symbols-outlined text-[#f2ca50]">category</span>
                    <span>{item.categoryName}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#d0c5af] font-['Hanken_Grotesk'] text-sm">
                    <span className="material-symbols-outlined text-[#f2ca50]">confirmation_number</span>
                    <span>Product Code: #{item.id}</span>
                  </div>
                </div>

                <Link
                  to={detailUrl}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full bg-transparent border border-[#f2ca50] text-[#f2ca50] hover:bg-[#f2ca50] hover:text-[#020617] px-4 py-2.5 rounded-lg font-['Hanken_Grotesk'] font-bold transition-all text-center text-sm shadow-sm flex items-center justify-center gap-1"
                >
                  View Details <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            )
          })}
        </div>
      )}

      {/* Fallback to default static departures if API returns empty or fails */}
      {!loading && products.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FIXED_DEPARTURES.map((item) => (
            <div
              key={item.id}
              className="glass-panel p-6 rounded-2xl flex flex-col border border-white/10 hover:border-[#f2ca50]/50 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-[#f2ca50]/5"
            >
              <div className="h-48 overflow-hidden relative rounded-xl mb-4">
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/70 to-transparent z-10" />
                <img
                  alt={item.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none"
                  src={item.image}
                  onError={(e) => handleImageError(e)}
                />
              </div>

              <div className="flex justify-between items-start mb-4">
                <h3 className="font-['Manrope'] font-semibold text-white text-xl group-hover:text-[#f2ca50] transition-colors">
                  {item.title}
                </h3>
                {item.tag && (
                  <span className="bg-[#f2ca50]/20 text-[#f2ca50] px-3 py-1 rounded-full font-['Hanken_Grotesk'] text-xs font-bold tracking-wider uppercase border border-[#f2ca50]/30">
                    {item.tag}
                  </span>
                )}
              </div>

              <div className="space-y-3 mb-6 flex-1">
                <div className="flex items-center gap-3 text-[#d0c5af] font-['Hanken_Grotesk'] text-sm">
                  <span className="material-symbols-outlined text-[#f2ca50]">event</span>
                  <span>{item.date}</span>
                </div>
                <div className="flex items-center gap-3 text-[#d0c5af] font-['Hanken_Grotesk'] text-sm">
                  <span className="material-symbols-outlined text-[#f2ca50]">schedule</span>
                  <span>{item.duration}</span>
                </div>
                <div className="flex items-center gap-3 text-[#d0c5af] font-['Hanken_Grotesk'] text-sm">
                  <span className="material-symbols-outlined text-[#f2ca50]">
                    {item.iconType || 'group'}
                  </span>
                  <span>{item.guide}</span>
                </div>
              </div>

              <button
                onClick={() => onSelectPackage && onSelectPackage(item)}
                className="w-full bg-transparent border border-[#f2ca50] text-[#f2ca50] px-4 py-2.5 rounded-lg font-['Hanken_Grotesk'] font-bold hover:bg-[#f2ca50]/10 hover:border-[#ffe088] hover:text-[#ffe088] transition-all cursor-pointer text-sm shadow-sm"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
