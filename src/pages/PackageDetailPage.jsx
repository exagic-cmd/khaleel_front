import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import Footer from '../components/Footer'
import AiChatModal from '../components/AiChatModal'
import BookingModal from '../components/BookingModal'
import { slugify, formatMediaUrl } from '../utils/slugify'

export default function PackageDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [productData, setProductData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('overview') // 'overview', 'itinerary', 'hotels', 'inclusions'
  const [collapsedDays, setCollapsedDays] = useState({})

  // Modals
  const [isAiModalOpen, setIsAiModalOpen] = useState(false)
  const [aiQuery, setAiQuery] = useState('')
  const [bookingModalState, setBookingModalState] = useState({
    isOpen: false,
    item: null,
    type: 'package',
  })

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://app.khaleel.ai/api'

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true)
      setError(null)
      try {
        // Fetch details from /product/{id}/1 endpoint
        const response = await fetch(`${apiBaseUrl}/product/${id}/1`)
        if (!response.ok) {
          throw new Error(`Failed to fetch product details (Status ${response.status})`)
        }
        const json = await response.json()
        const info = json?.data?.basicinfo || json?.data

        if (info) {
          setProductData(info)
        } else {
          throw new Error('Invalid product payload structure')
        }
      } catch (err) {
        console.warn('API error fetching package details:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProductDetails()
      window.scrollTo(0, 0)
    }
  }, [id, apiBaseUrl])

  const fallbackImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbStP2lAc6byVYksTXcXz5w8IKt_KpUJsjAqWS687yiXpYLAu0JmLTU18kw7BGEW5cn5-T_G9Sak138KT-Ik5sFu9anrSsXGe8D5hvSMypu2R4Xl5fk4VLZ_ECZ2-s7IjHqGE3WvTsAWzxbu5_2CTC5Kk7es4xK07GcASBmPb7BuGcza2Fp7QtnEvXZOGRtrY1E7slDTT6ch_PDb3zzHPBlwnjEPTxuDlcjHOer5EWWb34-0fiynaAVA'

  const handleImageError = (e) => {
    e.target.onerror = null
    e.target.src = fallbackImage
  }

  const desc = productData?.product_description || {}
  const images = productData?.images || []
  const currentImage = images[activeImageIndex]?.image ? formatMediaUrl(images[activeImageIndex].image) : fallbackImage
  const highlights = desc.highlights || []
  const itineraryDays = productData?.itinerary?.itinerary_days || []
  const accommodationGroups = productData?.accommodation_group_pricing || []
  const relatedProducts = productData?.related_products || []

  // Gallery Navigation Controls
  const handlePrevImage = (e) => {
    e?.stopPropagation()
    if (!images || images.length === 0) return
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  }

  const handleNextImage = (e) => {
    e?.stopPropagation()
    if (!images || images.length === 0) return
    setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
  }

  // Itinerary Accordion Controls
  const toggleDayCollapse = (dayNum) => {
    setCollapsedDays((prev) => {
      const currentlyCollapsed = prev[dayNum] !== undefined ? prev[dayNum] : (dayNum !== 1)
      return {
        ...prev,
        [dayNum]: !currentlyCollapsed,
      }
    })
  }

  const handleExpandAllDays = (expand) => {
    const newCollapsed = {}
    itineraryDays.forEach((d) => {
      newCollapsed[d.day] = !expand
    })
    setCollapsedDays(newCollapsed)
  }

  const handleBookClick = () => {
    navigate(`/booking/${id}`)
  }

  const handleAskAi = (queryText) => {
    setAiQuery(queryText)
    setIsAiModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#101415] text-[#e0e3e5] font-['Hanken_Grotesk'] selection:bg-[#f2ca50] selection:text-[#020617] pb-24 md:pb-0 pt-16">
      {/* Top Navbar */}
      <Navbar
        activeNav="explore"
        setActiveNav={() => navigate('/')}
        onOpenProfile={() => handleAskAi('My profile and bookings')}
      />

      <main className="w-full max-w-[1280px] mx-auto px-4 md:px-16 py-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs md:text-sm text-[#d0c5af] mb-6">
          <button onClick={() => navigate('/')} className="hover:text-[#f2ca50] transition-colors cursor-pointer flex items-center gap-1">
            <span className="material-symbols-outlined text-base">home</span> Home
          </button>
          <span>/</span>
          <span className="text-[#f2ca50]">Package Tour</span>
          <span>/</span>
          <span className="text-white truncate max-w-xs">{desc.title || 'Details'}</span>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-[#f2ca50] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-['Hanken_Grotesk'] text-[#d0c5af] text-sm animate-pulse">
              Loading package details from server...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="my-12 p-8 glass-panel rounded-3xl border border-red-500/30 text-center max-w-xl mx-auto space-y-4">
            <span className="material-symbols-outlined text-4xl text-red-400">error</span>
            <h3 className="font-['Manrope'] text-xl font-bold text-white">Could Not Load Tour</h3>
            <p className="text-sm text-[#d0c5af]">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 rounded-xl bg-[#f2ca50] text-[#020617] font-bold text-xs hover:bg-[#ffe088] transition-all cursor-pointer shadow-md"
            >
              Back to Home
            </button>
          </div>
        )}

        {/* Main Product Layout */}
        {!loading && productData && (
          <div className="space-y-12">
            {/* Top Grid: Gallery + Quick Summary Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Gallery (7 Cols) */}
              <div className="lg:col-span-7 space-y-4">
                {/* Featured Big Image */}
                <div className="h-[360px] sm:h-[440px] rounded-3xl overflow-hidden relative border border-white/10 shadow-2xl bg-[#020617] group">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/70 via-transparent to-transparent z-10" />
                  <img
                    alt={desc.title || 'Tour image'}
                    src={currentImage}
                    onError={handleImageError}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none"
                  />
                  {productData.tourtype && (
                    <span className="absolute top-4 left-4 z-20 bg-[#020617]/80 backdrop-blur-md border border-[#f2ca50]/40 text-[#f2ca50] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                      {productData.tourtype}
                    </span>
                  )}

                  {/* Navigation Arrows & Counter */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        aria-label="Previous image"
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#020617]/70 backdrop-blur-md border border-white/20 text-white hover:text-[#f2ca50] hover:border-[#f2ca50] hover:bg-[#020617] flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
                      >
                        <span className="material-symbols-outlined text-2xl">chevron_left</span>
                      </button>

                      <button
                        onClick={handleNextImage}
                        aria-label="Next image"
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#020617]/70 backdrop-blur-md border border-white/20 text-white hover:text-[#f2ca50] hover:border-[#f2ca50] hover:bg-[#020617] flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
                      >
                        <span className="material-symbols-outlined text-2xl">chevron_right</span>
                      </button>

                      {/* Image Counter Badge */}
                      <div className="absolute bottom-4 right-4 z-20 bg-[#020617]/80 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-full text-xs font-bold font-['Hanken_Grotesk'] tracking-wide shadow-md">
                        {activeImageIndex + 1} / {images.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Gallery Thumbnails */}
                {images.length > 1 && (
                  <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2">
                    {images.map((imgObj, idx) => {
                      const fullUrl = formatMediaUrl(imgObj.image)
                      return (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIndex(idx)}
                          className={`w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                            activeImageIndex === idx
                              ? 'border-[#f2ca50] scale-105 shadow-md shadow-[#f2ca50]/20'
                              : 'border-white/10 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img
                            alt={`Thumbnail ${idx + 1}`}
                            src={fullUrl}
                            onError={handleImageError}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Right Column: Title & Booking Sidebar Card (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl relative">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-[#f2ca50] text-sm">location_on</span>
                      <span className="text-[#f2ca50] text-xs font-bold tracking-wider uppercase">
                        {productData.city || 'Singapore'}
                      </span>
                    </div>

                    <h1 className="font-['Manrope'] font-extrabold text-2xl sm:text-3xl text-white leading-tight mb-3">
                      {desc.title}
                    </h1>

                    {desc.short_desc && (
                      <p className="text-sm text-[#d0c5af] leading-relaxed">
                        {desc.short_desc}
                      </p>
                    )}
                  </div>

                  {/* Highlights Pills */}
                  {highlights.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-white/10">
                      <p className="text-xs font-bold text-white uppercase tracking-wider">
                        Key Highlights:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {highlights.map((hl, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 bg-[#f2ca50]/15 text-[#f2ca50] border border-[#f2ca50]/30 px-3 py-1 rounded-full text-xs font-medium"
                          >
                            <span className="material-symbols-outlined text-xs">auto_awesome</span>
                            {hl}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Stats Bar */}
                  <div className="grid grid-cols-3 gap-3 py-4 border-y border-white/10 text-center bg-[#020617]/50 rounded-2xl">
                    <div>
                      <p className="text-[11px] text-[#d0c5af] uppercase">Duration</p>
                      <p className="text-sm font-bold text-white mt-0.5">
                        {productData.duration ? `${productData.duration} Days` : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-[#d0c5af] uppercase">Guide</p>
                      <p className="text-sm font-bold text-white mt-0.5">
                        {productData.guidelanguage || 'English'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-[#d0c5af] uppercase">Tour Type</p>
                      <p className="text-sm font-bold text-white mt-0.5 truncate">
                        {productData.tourtype || 'Shared'}
                      </p>
                    </div>
                  </div>

                  {/* Pricing Display & Action */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <p className="text-xs text-[#d0c5af] uppercase font-bold tracking-wider">Starting Price</p>
                        <p className="font-['Manrope'] text-3xl font-extrabold text-[#f2ca50]">
                          {productData.currency || 'SGD'} {productData.starting_price || productData.adult_price}
                        </p>
                      </div>

                      {productData.child_price && (
                        <div className="text-right text-xs text-[#d0c5af]">
                          <span>Child: </span>
                          <span className="font-bold text-white">
                            {productData.currency} ${productData.child_price}
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleBookClick}
                      className="w-full py-4 rounded-xl bg-[#f2ca50] hover:bg-[#ffe088] text-[#020617] font-['Manrope'] font-bold text-base transition-all duration-300 shadow-xl shadow-[#f2ca50]/20 hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-xl">confirmation_number</span>
                      Reserve This Tour Package
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-white/10 flex items-center gap-6 text-sm font-medium">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-3 transition-colors cursor-pointer border-b-2 ${
                  activeTab === 'overview'
                    ? 'border-[#f2ca50] text-[#f2ca50] font-bold'
                    : 'border-transparent text-[#d0c5af] hover:text-white'
                }`}
              >
                Overview &amp; Details
              </button>
              
              {itineraryDays.length > 0 && (
                <button
                  onClick={() => setActiveTab('itinerary')}
                  className={`pb-3 transition-colors cursor-pointer border-b-2 ${
                    activeTab === 'itinerary'
                      ? 'border-[#f2ca50] text-[#f2ca50] font-bold'
                      : 'border-transparent text-[#d0c5af] hover:text-white'
                  }`}
                >
                  Itinerary ({itineraryDays.length} Days)
                </button>
              )}

              {accommodationGroups.length > 0 && (
                <button
                  onClick={() => setActiveTab('hotels')}
                  className={`pb-3 transition-colors cursor-pointer border-b-2 ${
                    activeTab === 'hotels'
                      ? 'border-[#f2ca50] text-[#f2ca50] font-bold'
                      : 'border-transparent text-[#d0c5af] hover:text-white'
                  }`}
                >
                  Hotels
                </button>
              )}

              <button
                onClick={() => setActiveTab('inclusions')}
                className={`pb-3 transition-colors cursor-pointer border-b-2 ${
                  activeTab === 'inclusions'
                    ? 'border-[#f2ca50] text-[#f2ca50] font-bold'
                    : 'border-transparent text-[#d0c5af] hover:text-white'
                }`}
              >
                Inclusions &amp; Policies
              </button>
            </div>

            {/* Tab Contents */}
            <div className="min-h-[250px]">
              {/* TAB 1: Overview */}
              {activeTab === 'overview' && (
                <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6">
                  <h3 className="font-['Manrope'] font-bold text-xl text-white">Description</h3>
                  <div
                    className="text-[#d0c5af] leading-relaxed space-y-4 text-sm sm:text-base"
                    dangerouslySetInnerHTML={{ __html: desc.long_desc || desc.short_desc || 'No detailed description available.' }}
                  />
                </div>
              )}

              {/* TAB 2: Itinerary */}
              {activeTab === 'itinerary' && (
                <div className="space-y-6">
                  {/* Expand / Collapse All Controls */}
                  <div className="flex items-center justify-between px-2">
                    <p className="text-xs text-[#d0c5af] font-['Hanken_Grotesk']">
                      Click on any day to expand or collapse details.
                    </p>
                    <div className="flex items-center gap-3 text-xs">
                      <button
                        onClick={() => handleExpandAllDays(true)}
                        className="text-[#f2ca50] hover:underline cursor-pointer font-bold"
                      >
                        Expand All
                      </button>
                      <span className="text-[#d0c5af]/40">|</span>
                      <button
                        onClick={() => handleExpandAllDays(false)}
                        className="text-[#d0c5af] hover:text-white hover:underline cursor-pointer"
                      >
                        Collapse All
                      </button>
                    </div>
                  </div>

                  {itineraryDays.map((dayObj, dIdx) => {
                    const isCollapsed = collapsedDays[dayObj.day] !== undefined ? collapsedDays[dayObj.day] : (dayObj.day !== 1)
                    const activityCount = dayObj.activities?.length || 0

                    return (
                      <div key={dIdx} className="glass-panel rounded-3xl border border-white/10 overflow-hidden transition-all duration-300">
                        {/* Day Accordion Header */}
                        <button
                          onClick={() => toggleDayCollapse(dayObj.day)}
                          className="w-full p-6 text-left flex items-center justify-between bg-[#020617]/60 hover:bg-[#020617]/90 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            {/* <div className="w-10 h-10 rounded-xl bg-[#f2ca50] text-[#020617] font-bold font-['Manrope'] flex items-center justify-center text-lg shadow-md shrink-0">
                              D{dayObj.day}
                            </div> */}
                            <div>
                              <h3 className="font-['Manrope'] font-bold text-lg sm:text-xl text-white">
                                Day {dayObj.day}
                              </h3>
                              <p className="text-xs text-[#d0c5af]">
                                {activityCount} {activityCount === 1 ? 'Activity' : 'Activities'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#f2ca50] hidden sm:inline">
                              {isCollapsed ? 'Expand' : 'Collapse'}
                            </span>
                            <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white transition-transform duration-300 ${isCollapsed ? 'rotate-0' : 'rotate-180'}`}>
                              <span className="material-symbols-outlined text-lg">expand_more</span>
                            </div>
                          </div>
                        </button>

                        {/* Collapsible Content Body */}
                        {!isCollapsed && (
                          <div className="p-6 sm:p-8 pt-4 space-y-6 border-t border-white/10 animate-fadeIn">
                            {dayObj.activities && dayObj.activities.map((act) => {
                              const rawActImg = act.image || act.hotel_img_stay || act.hotel_img_checkin || act.hotel_img_checkout || act.img_stay || act.img_checkin || act.img_breakfast
                              const actImgUrl = rawActImg ? formatMediaUrl(rawActImg) : fallbackImage

                              return (
                                <div key={act.id} className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-[#020617]/50 border border-white/5 items-start">
                                  <div className="w-full sm:w-40 h-28 rounded-xl overflow-hidden relative shrink-0 bg-[#020617] border border-white/10">
                                    <img
                                      alt={act.title}
                                      src={actImgUrl}
                                      onError={handleImageError}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>

                                  <div className="space-y-1.5 flex-1">
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <h4 className="font-['Manrope'] font-bold text-base text-white">
                                      {act.title}
                                    </h4>
                                    {act.display_time && (
                                      <span className="text-xs bg-[#f2ca50]/20 text-[#f2ca50] px-2.5 py-0.5 rounded-full font-bold">
                                        ⏰ {act.display_time}
                                      </span>
                                    )}
                                  </div>

                                  {act.tag && (
                                    <span className="inline-block text-[11px] text-[#d0c5af] font-semibold bg-white/10 px-2 py-0.5 rounded">
                                      {act.tag}
                                    </span>
                                  )}

                                  <p className="text-xs sm:text-sm text-[#d0c5af] leading-relaxed pt-1">
                                    {act.description || act.remarks}
                                  </p>

                                  {act.category_name && (
                                    <p className="text-[11px] text-[#f2ca50]/80 pt-1 font-medium">
                                      Category: {act.category_name}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* TAB 3: Hotels */}
              {activeTab === 'hotels' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {accommodationGroups.map((group) => (
                    <div
                      key={group.group_id}
                      className={`glass-panel p-6 sm:p-8 rounded-3xl border ${
                        group.is_default ? 'border-[#f2ca50]' : 'border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-['Manrope'] font-bold text-xl text-white">
                          {group.name}
                        </h3>
                        {group.is_default && (
                          <span className="bg-[#f2ca50] text-[#020617] font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-full">
                            Included Default
                          </span>
                        )}
                      </div>

                      {/* Hotel List */}
                      <div className="space-y-3">
                        <p className="text-xs font-bold text-[#d0c5af] uppercase tracking-wider">
                          Included Hotel Options:
                        </p>
                        {group.hotels && group.hotels.map((h) => (
                          <div key={h.id} className="flex items-center gap-3 text-sm text-white bg-[#020617]/60 p-3.5 rounded-xl border border-white/5">
                            <span className="material-symbols-outlined text-[#f2ca50] text-xl">hotel</span>
                            <span className="font-medium">{h.title}</span>
                            {h.is_default === 1 && (
                              <span className="ml-auto text-[10px] text-[#f2ca50] font-bold bg-[#f2ca50]/10 px-2 py-0.5 rounded">
                                Default
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: Inclusions & Policies */}
              {activeTab === 'inclusions' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Inclusion */}
                  <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-4">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <span className="material-symbols-outlined">check_circle</span>
                      <h3 className="font-['Manrope'] font-bold text-lg text-white">What's Included</h3>
                    </div>
                    <div
                      className="text-sm text-[#d0c5af] leading-relaxed space-y-2"
                      dangerouslySetInnerHTML={{ __html: desc.inclusion || 'Standard package inclusions apply.' }}
                    />
                  </div>

                  {/* Exclusion */}
                  <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-4">
                    <div className="flex items-center gap-2 text-rose-400">
                      <span className="material-symbols-outlined">cancel</span>
                      <h3 className="font-['Manrope'] font-bold text-lg text-white">What's Excluded</h3>
                    </div>
                    <div
                      className="text-sm text-[#d0c5af] leading-relaxed space-y-2"
                      dangerouslySetInnerHTML={{ __html: desc.exclusion || 'Personal expenses, tips, and optional activities are excluded.' }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
              <div className="pt-8 space-y-6">
                <h3 className="font-['Manrope'] font-bold text-2xl text-white tracking-tight">
                  You Might Also Like
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {relatedProducts.map((rel) => {
                    const relSlug = slugify(rel.Title)
                    const relImg = rel.image ? formatMediaUrl(rel.image) : fallbackImage
                    return (
                      <Link
                        key={rel.product_id}
                        to={`/package-tour/${relSlug}/${rel.product_id}`}
                        className="glass-panel p-4 rounded-2xl border border-white/10 hover:border-[#f2ca50]/50 transition-all duration-300 group hover:-translate-y-1 flex flex-col justify-between"
                      >
                        <div>
                          <div className="h-36 rounded-xl overflow-hidden relative mb-3 bg-[#020617]">
                            <img
                              alt={rel.Title}
                              src={relImg}
                              onError={handleImageError}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <h4 className="font-['Manrope'] font-semibold text-white text-base line-clamp-2 group-hover:text-[#f2ca50] transition-colors mb-1">
                            {rel.Title}
                          </h4>
                          {rel.Description && (
                            <p className="text-xs text-[#d0c5af] line-clamp-2 mb-2">
                              {rel.Description}
                            </p>
                          )}
                        </div>

                        <div className="pt-2 border-t border-white/10 flex items-center justify-between mt-2">
                          <span className="text-xs font-bold text-[#f2ca50]">
                            {rel.currency_name || 'SGD'} ${rel.Starting_price}
                          </span>
                          <span className="text-xs text-[#d0c5af] group-hover:text-[#f2ca50] font-semibold flex items-center gap-0.5">
                            View <span className="material-symbols-outlined text-xs">arrow_forward</span>
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Bottom Nav Mobile */}
      <BottomNav
        activeNav="explore"
        setActiveNav={() => navigate('/')}
        onOpenProfile={() => handleAskAi('My profile')}
      />

      {/* AI Assistant Modal */}
      <AiChatModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        initialQuery={aiQuery}
      />

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModalState.isOpen}
        onClose={() => setBookingModalState({ isOpen: false, item: null, type: 'package' })}
        selectedItem={bookingModalState.item}
        type={bookingModalState.type}
      />
    </div>
  )
}
