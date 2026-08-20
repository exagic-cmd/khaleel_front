import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import Footer from '../components/Footer'
import AiChatModal from '../components/AiChatModal'
import { formatMediaUrl } from '../utils/slugify'

export default function BookingPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  // API State
  const [productData, setProductData] = useState(null)
  const [tieredPricing, setTieredPricing] = useState(null)
  const [availability, setAvailability] = useState([])
  const [cancellationPolicies, setCancellationPolicies] = useState(null)
  const [bookingNotes, setBookingNotes] = useState(null)
  const [termsConditions, setTermsConditions] = useState(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Booking Form State
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedGroupIdx, setSelectedGroupIdx] = useState(0)

  // Room sharing participant counts
  const [participantCounts, setParticipantCounts] = useState({
    twin: 1,
    triple: 0,
    quad: 0,
    single: 0,
  })

  // Calendar Month State (Default: '2026-08')
  const [activeMonth, setActiveMonth] = useState('2026-08')

  // Policy Accordions
  const [openPolicySection, setOpenPolicySection] = useState('cancellation') // 'cancellation', 'notes', 'terms'

  // AI Modal & Voucher
  const [isAiModalOpen, setIsAiModalOpen] = useState(false)
  const [aiQuery, setAiQuery] = useState('')
  const [isBookedSuccess] = useState(false)

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://app.khaleel.ai/api'

  // Extract accommodation groups & pricing list
  const accomGroups = tieredPricing?.accommodation_group_pricing || productData?.accommodation_group_pricing || []
  const productPricingList = tieredPricing?.product_pricing || []
  const activePricing = productPricingList[selectedGroupIdx] || productPricingList[0] || {}

  const currencySymbol = activePricing.currency || tieredPricing?.display_currency || productData?.currency || 'PKR'

  // Extract room prices
  const twinPrice = parseFloat(activePricing.adult_sharing || 270000)
  const triplePrice = parseFloat(activePricing.triple_sharing || 324000)
  const quadPrice = parseFloat(activePricing.quad_sharing || 248400)
  const singlePrice = parseFloat(activePricing.adult_private || 237573)

  // Calculate participant totals
  const twinTotal = (participantCounts.twin || 0) * twinPrice
  const tripleTotal = (participantCounts.triple || 0) * triplePrice
  const quadTotal = (participantCounts.quad || 0) * quadPrice
  const singleTotal = (participantCounts.single || 0) * singlePrice

  const totalParticipants = (participantCounts.twin || 0) + (participantCounts.triple || 0) + (participantCounts.quad || 0) + (participantCounts.single || 0)
  const grandTotal = twinTotal + tripleTotal + quadTotal + singleTotal

  // Initial Load of product details and static endpoints
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true)
      setError(null)

      try {
        const [
          productRes,
          tieredPricingRes,
          cancelRes,
          notesRes,
          termsRes
        ] = await Promise.allSettled([
          fetch(`${apiBaseUrl}/product/${id}/1?currency_id=6`),
          fetch(`${apiBaseUrl}/product_tiered_pricing/${id}?currency_id=6`),
          fetch(`${apiBaseUrl}/cancellationpolicies/${id}/1`),
          fetch(`${apiBaseUrl}/bookingnotes/${id}/1`),
          fetch(`${apiBaseUrl}/termconditions/${id}/1`)
        ])

        if (productRes.status === 'fulfilled' && productRes.value.ok) {
          const json = await productRes.value.json()
          setProductData(json?.data?.basicinfo || json?.data)
        } else {
          throw new Error('Failed to load product details')
        }

        if (tieredPricingRes.status === 'fulfilled' && tieredPricingRes.value.ok) {
          const json = await tieredPricingRes.value.json()
          setTieredPricing(json?.data || json)
        }

        if (cancelRes.status === 'fulfilled' && cancelRes.value.ok) {
          const json = await cancelRes.value.json()
          setCancellationPolicies(json?.data || json?.message || json)
        }

        if (notesRes.status === 'fulfilled' && notesRes.value.ok) {
          const json = await notesRes.value.json()
          setBookingNotes(json?.data || json?.message || json)
        }

        if (termsRes.status === 'fulfilled' && termsRes.value.ok) {
          const json = await termsRes.value.json()
          setTermsConditions(json?.data || json?.message || json)
        }
      } catch (err) {
        console.warn('Initial data fetch error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchInitialData()
      window.scrollTo(0, 0)
    }
  }, [id, apiBaseUrl])

  // POST endpoint for /check-dates-availability whenever group or participant count changes
  useEffect(() => {
    const fetchAvailabilityPost = async () => {
      if (!id) return
      try {
        const groups = tieredPricing?.accommodation_group_pricing || productData?.accommodation_group_pricing || []
        const selectedGroupId = groups[selectedGroupIdx]?.group_id || 10

        const response = await fetch(`${apiBaseUrl}/check-dates-availability`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            product_id: String(id),
            adults: totalParticipants > 0 ? totalParticipants : 1,
            children: 0,
            accommodation_group_id: Number(selectedGroupId),
          }),
        })

        if (response.ok) {
          const json = await response.json()
          const list = json?.availability || json?.data?.availability || []
          setAvailability(list)
          if (list.length > 0) {
            setSelectedDate((prevDate) => {
              if (!prevDate || !list.some((a) => a.date === prevDate)) {
                return list[0].date
              }
              return prevDate
            })
          }
        }
      } catch (err) {
        console.warn('Error calling check-dates-availability POST API:', err)
      }
    }

    fetchAvailabilityPost()
  }, [id, selectedGroupIdx, totalParticipants, tieredPricing, productData, apiBaseUrl])

  // Calendar Helper Functions
  const monthsList = [
    { key: '2026-08', label: 'Aug 2026' },
    { key: '2026-09', label: 'Sep 2026' },
    { key: '2026-10', label: 'Oct 2026' },
    { key: '2026-11', label: 'Nov 2026' },
    { key: '2026-12', label: 'Dec 2026' },
  ]

  const handlePrevMonth = () => {
    const idx = monthsList.findIndex((m) => m.key === activeMonth)
    if (idx > 0) setActiveMonth(monthsList[idx - 1].key)
  }

  const handleNextMonth = () => {
    const idx = monthsList.findIndex((m) => m.key === activeMonth)
    if (idx < monthsList.length - 1) setActiveMonth(monthsList[idx + 1].key)
  }

  // Create availability map for fast lookup: { "2026-08-19": { available: true, qty: 100 } }
  const availMap = {}
  availability.forEach((item) => {
    if (item.date) {
      availMap[item.date] = item
    }
  })

  // Render Days Grid for current activeMonth
  const renderCalendarDays = () => {
    const [yearStr, monthStr] = activeMonth.split('-')
    const year = parseInt(yearStr, 10)
    const month = parseInt(monthStr, 10) - 1 // 0-indexed

    const firstDayIndex = new Date(year, month, 1).getDay() // 0 = Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate() // total days

    const cells = []

    // Blank cells before day 1
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push(<div key={`blank-${i}`} className="h-16" />)
    }

    // Day cells
    for (let d = 1; d <= daysInMonth; d++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const availInfo = availMap[dateKey]
      const isAvailable = availInfo && (availInfo.available || availInfo.available_qty > 0)
      const isSelected = selectedDate === dateKey

      cells.push(
        <button
          key={dateKey}
          type="button"
          disabled={!isAvailable}
          onClick={() => isAvailable && setSelectedDate(dateKey)}
          className={`h-16 rounded-xl flex flex-col items-center justify-center transition-all ${
            isSelected
              ? 'border-2 border-[#3b82f6] bg-[#3b82f6]/10 text-white font-bold shadow-md'
              : isAvailable
              ? 'hover:bg-white/10 text-white cursor-pointer font-semibold'
              : 'text-white/20 cursor-not-allowed'
          }`}
        >
          <span className={`text-sm sm:text-base ${isAvailable ? 'font-bold' : ''}`}>{d}</span>
          {isAvailable && (
            <span className="text-[10px] text-[#d0c5af] font-normal leading-none mt-0.5">
              {availInfo.available_qty || 100} Left
            </span>
          )}
        </button>
      )
    }

    return cells
  }

  const desc = productData?.product_description || {}
  const fallbackImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbStP2lAc6byVYksTXcXz5w8IKt_KpUJsjAqWS687yiXpYLAu0JmLTU18kw7BGEW5cn5-T_G9Sak138KT-Ik5sFu9anrSsXGe8D5hvSMypu2R4Xl5fk4VLZ_ECZ2-s7IjHqGE3WvTsAWzxbu5_2CTC5Kk7es4xK07GcASBmPb7BuGcza2Fp7QtnEvXZOGRtrY1E7slDTT6ch_PDb3zzHPBlwnjEPTxuDlcjHOer5EWWb34-0fiynaAVA'
  const heroImg = productData?.images?.[0]?.image ? formatMediaUrl(productData.images[0].image) : fallbackImage

  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (totalParticipants === 0) {
      alert('Please select at least 1 participant.')
      return
    }
    if (!selectedDate) {
      alert('Please select a travel date from the calendar.')
      return
    }

    const selectedGroupId = accomGroups[selectedGroupIdx]?.group_id || 11
    const rawImage = productData?.images?.[0]?.image || productData?.image || ''

    const cartItem = {
      productId: Number(id),
      productType: 'activity',
      title: desc.title || productData?.title || 'Umrah Package',
      image: rawImage,
      category_id: productData?.category_id || 8,
      adults: totalParticipants,
      children: 0,
      adults_sharing: participantCounts.twin || 0,
      triple_sharing: participantCounts.triple || 0,
      quad_sharing: participantCounts.quad || 0,
      adults_private: participantCounts.single || 0,
      children_with_bed: 0,
      children_without_bed: 0,
      hotelId: null,
      hotelName: '',
      date: selectedDate,
      time: '09:00',
      price: grandTotal,
      currency: currencySymbol,
      sku_details: null,
      free_cancellation: null,
      accommodation_group_id: Number(selectedGroupId),
      group_hotel_id: null,
      quantity: 1,
    }

    try {
      const existingCartStr = localStorage.getItem('khaleel_cart')
      const cart = existingCartStr ? JSON.parse(existingCartStr) : []

      const existingIdx = cart.findIndex((item) => item.productId === cartItem.productId && item.date === cartItem.date)
      if (existingIdx >= 0) {
        cart[existingIdx] = cartItem
      } else {
        cart.push(cartItem)
      }

      localStorage.setItem('khaleel_cart', JSON.stringify(cart))
      window.dispatchEvent(new Event('cartUpdated'))
      window.dispatchEvent(new Event('openCartDrawer'))
    } catch (err) {
      console.warn('Error saving item to cart in localStorage:', err)
    }
  }

  return (
    <div className="min-h-screen bg-[#101415] text-[#e0e3e5] font-['Hanken_Grotesk'] selection:bg-[#f2ca50] selection:text-[#020617] pb-24 md:pb-0 pt-16">
      {/* Navbar */}
      <Navbar
        activeNav="explore"
        setActiveNav={() => navigate('/')}
        onOpenProfile={() => {
          setAiQuery('My booking reservations and profile')
          setIsAiModalOpen(true)
        }}
      />

      <main className="w-full max-w-[1280px] mx-auto px-4 md:px-16 py-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs md:text-sm text-[#d0c5af] mb-6">
          <button onClick={() => navigate('/')} className="hover:text-[#f2ca50] transition-colors cursor-pointer flex items-center gap-1">
            <span className="material-symbols-outlined text-base">home</span> Home
          </button>
          <span>/</span>
          <button onClick={() => navigate(-1)} className="hover:text-[#f2ca50] transition-colors cursor-pointer">
            Package Tour
          </button>
          <span>/</span>
          <span className="text-[#f2ca50] font-semibold">Checkout Reservation</span>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="py-24 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-[#f2ca50] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-['Hanken_Grotesk'] text-[#d0c5af] text-sm animate-pulse">
              Preparing package details and date availability for Tour #{id}...
            </p>
          </div>
        )}

        {/* Error View */}
        {error && !loading && (
          <div className="my-12 p-8 glass-panel rounded-3xl border border-red-500/30 text-center max-w-xl mx-auto space-y-4">
            <span className="material-symbols-outlined text-4xl text-red-400">error</span>
            <h3 className="font-['Manrope'] text-xl font-bold text-white">Booking Unavailable</h3>
            <p className="text-sm text-[#d0c5af]">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 rounded-xl bg-[#f2ca50] text-[#020617] font-bold text-xs hover:bg-[#ffe088] transition-all cursor-pointer shadow-md"
            >
              Return Home
            </button>
          </div>
        )}

        {/* Main Booking Content */}
        {!loading && productData && (
          <div className="space-y-8">
            {/* Header Banner */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl relative">
              <div className="flex items-center gap-5">
                <img
                  alt={desc.title}
                  src={heroImg}
                  onError={(e) => { e.target.onerror = null; e.target.src = fallbackImage }}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-white/10 shrink-0 shadow-lg"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-[#f2ca50]/20 text-[#f2ca50] border border-[#f2ca50]/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Booking #{id}
                    </span>
                    <span className="text-xs text-[#d0c5af] font-medium">{productData.city || 'Singapore'}</span>
                  </div>
                  <h1 className="font-['Manrope'] font-extrabold text-xl sm:text-2xl text-white leading-tight">
                    {desc.title}
                  </h1>
                  <p className="text-xs sm:text-sm text-[#d0c5af] mt-1">
                    {productData.duration ? `${productData.duration} Days` : 'Multi-day'} Tour &middot; {productData.guidelanguage || 'English'} Guide &middot; {productData.tourtype || 'Shared'}
                  </p>
                </div>
              </div>

              <div className="text-right sm:border-l sm:border-white/10 sm:pl-6 shrink-0 w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end border-t border-white/10 pt-4 sm:pt-0">
                <span className="text-xs text-[#d0c5af] font-semibold uppercase">Twin Sharing Rate</span>
                <span className="font-['Manrope'] font-bold text-2xl text-[#f2ca50]">
                  {currencySymbol} {Number(twinPrice).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Booking Form + Summary Grid */}
            <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Form Steps (7 Cols) */}
              <div className="lg:col-span-7 space-y-8">

                {/* STEP 1: Accommodation Package Category */}
                {accomGroups.length > 0 && (
                  <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-xl">
                    <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                      <div className="w-8 h-8 rounded-xl bg-[#f2ca50] text-[#020617] font-bold font-['Manrope'] flex items-center justify-center text-sm shadow-md">
                        1
                      </div>
                      <h2 className="font-['Manrope'] font-bold text-xl text-white">
                        Select Accommodation Package
                      </h2>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {accomGroups.map((grp, idx) => (
                        <button
                          key={grp.group_id || idx}
                          type="button"
                          onClick={() => setSelectedGroupIdx(idx)}
                          className={`py-3.5 px-4 rounded-2xl border font-bold text-sm transition-all cursor-pointer ${
                            selectedGroupIdx === idx
                              ? 'bg-[#f2ca50] text-[#020617] border-[#f2ca50] shadow-md shadow-[#f2ca50]/20 scale-[1.02]'
                              : 'bg-[#020617]/50 text-white border-white/10 hover:border-white/20'
                          }`}
                        >
                          {grp.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 2: Select Participants (Exact Room Sharing Counter Grid) */}
                <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-xl">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <div className="w-8 h-8 rounded-xl bg-[#f2ca50] text-[#020617] font-bold font-['Manrope'] flex items-center justify-center text-sm shadow-md">
                      2
                    </div>
                    <h2 className="font-['Manrope'] font-bold text-xl text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#f2ca50]">group</span>
                      Select Participants
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Twin Sharing */}
                    <div className="p-4 rounded-2xl bg-[#020617]/70 border border-white/10 flex items-center justify-between shadow-sm hover:border-white/20 transition-all">
                      <div className="space-y-0.5">
                        <h4 className="font-['Manrope'] font-bold text-base text-white">Twin Sharing</h4>
                        <p className="text-xs text-[#d0c5af]">
                          {currencySymbol} {Number(twinPrice).toLocaleString()} / per adult
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setParticipantCounts((prev) => ({ ...prev, twin: Math.max(0, prev.twin - 1) }))}
                          className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all cursor-pointer flex items-center justify-center font-bold text-lg active:scale-95"
                        >
                          -
                        </button>
                        <span className="font-bold text-white text-base w-4 text-center">{participantCounts.twin}</span>
                        <button
                          type="button"
                          onClick={() => setParticipantCounts((prev) => ({ ...prev, twin: prev.twin + 1 }))}
                          className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all cursor-pointer flex items-center justify-center font-bold text-lg active:scale-95"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Triple Sharing */}
                    <div className="p-4 rounded-2xl bg-[#020617]/70 border border-white/10 flex items-center justify-between shadow-sm hover:border-white/20 transition-all">
                      <div className="space-y-0.5">
                        <h4 className="font-['Manrope'] font-bold text-base text-white">Triple Sharing</h4>
                        <p className="text-xs text-[#d0c5af]">
                          {currencySymbol} {Number(triplePrice).toLocaleString()} / per adult
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setParticipantCounts((prev) => ({ ...prev, triple: Math.max(0, prev.triple - 1) }))}
                          className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all cursor-pointer flex items-center justify-center font-bold text-lg active:scale-95"
                        >
                          -
                        </button>
                        <span className="font-bold text-white text-base w-4 text-center">{participantCounts.triple}</span>
                        <button
                          type="button"
                          onClick={() => setParticipantCounts((prev) => ({ ...prev, triple: prev.triple + 1 }))}
                          className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all cursor-pointer flex items-center justify-center font-bold text-lg active:scale-95"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Quad Sharing */}
                    <div className="p-4 rounded-2xl bg-[#020617]/70 border border-white/10 flex items-center justify-between shadow-sm hover:border-white/20 transition-all">
                      <div className="space-y-0.5">
                        <h4 className="font-['Manrope'] font-bold text-base text-white">Quad Sharing</h4>
                        <p className="text-xs text-[#d0c5af]">
                          {currencySymbol} {Number(quadPrice).toLocaleString()} / per adult
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setParticipantCounts((prev) => ({ ...prev, quad: Math.max(0, prev.quad - 1) }))}
                          className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all cursor-pointer flex items-center justify-center font-bold text-lg active:scale-95"
                        >
                          -
                        </button>
                        <span className="font-bold text-white text-base w-4 text-center">{participantCounts.quad}</span>
                        <button
                          type="button"
                          onClick={() => setParticipantCounts((prev) => ({ ...prev, quad: prev.quad + 1 }))}
                          className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all cursor-pointer flex items-center justify-center font-bold text-lg active:scale-95"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Single Sharing */}
                    <div className="p-4 rounded-2xl bg-[#020617]/70 border border-white/10 flex items-center justify-between shadow-sm hover:border-white/20 transition-all">
                      <div className="space-y-0.5">
                        <h4 className="font-['Manrope'] font-bold text-base text-white">Single Sharing</h4>
                        <p className="text-xs text-[#d0c5af]">
                          {currencySymbol} {Number(singlePrice).toLocaleString()} / per adult
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setParticipantCounts((prev) => ({ ...prev, single: Math.max(0, prev.single - 1) }))}
                          className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all cursor-pointer flex items-center justify-center font-bold text-lg active:scale-95"
                        >
                          -
                        </button>
                        <span className="font-bold text-white text-base w-4 text-center">{participantCounts.single}</span>
                        <button
                          type="button"
                          onClick={() => setParticipantCounts((prev) => ({ ...prev, single: prev.single + 1 }))}
                          className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all cursor-pointer flex items-center justify-center font-bold text-lg active:scale-95"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* STEP 3: Check Availability (Calendar UI matching user screenshot) */}
                <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-xl">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <div className="w-8 h-8 rounded-xl bg-[#f2ca50] text-[#020617] font-bold font-['Manrope'] flex items-center justify-center text-sm shadow-md">
                      3
                    </div>
                    <h2 className="font-['Manrope'] font-bold text-xl text-white">
                      Check Availability
                    </h2>
                  </div>

                  {/* Calendar Header Month Filter Chips */}
                  <div className="flex items-center justify-between gap-2 overflow-x-auto hide-scrollbar py-1">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="w-9 h-9 rounded-full border border-white/10 bg-[#020617] text-white hover:border-[#f2ca50] hover:text-[#f2ca50] flex items-center justify-center shrink-0 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">chevron_left</span>
                    </button>

                    <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
                      {monthsList.map((m) => (
                        <button
                          key={m.key}
                          type="button"
                          onClick={() => setActiveMonth(m.key)}
                          className={`px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer shrink-0 text-center ${
                            activeMonth === m.key
                              ? 'border-[#3b82f6] text-[#3b82f6] bg-[#3b82f6]/10 shadow-md'
                              : 'border-white/10 text-[#d0c5af] hover:border-white/20 hover:text-white bg-[#020617]/40'
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="w-9 h-9 rounded-full border border-white/10 bg-[#020617] text-white hover:border-[#f2ca50] hover:text-[#f2ca50] flex items-center justify-center shrink-0 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">chevron_right</span>
                    </button>
                  </div>

                  {/* Calendar View Container */}
                  <div className="bg-[#020617]/80 rounded-2xl border border-white/10 p-4 sm:p-6 space-y-4">
                    {/* Weekday Names Header */}
                    <div className="grid grid-cols-7 text-center font-bold text-xs text-[#d0c5af] pb-2 border-b border-white/10">
                      <span>Sun</span>
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                    </div>

                    {/* Day Grid Cells */}
                    <div className="grid grid-cols-7 gap-1 sm:gap-2">
                      {renderCalendarDays()}
                    </div>
                  </div>

                  {selectedDate && (
                    <p className="text-xs text-[#f2ca50] font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base">event_available</span>
                      Selected Travel Date: {selectedDate}
                    </p>
                  )}
                </div>

                {/* STEP 4: Policy Accordions (Cancellation, Booking Notes, Terms) */}
                <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4 shadow-xl">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <div className="w-8 h-8 rounded-xl bg-[#f2ca50] text-[#020617] font-bold font-['Manrope'] flex items-center justify-center text-sm shadow-md">
                      4
                    </div>
                    <h2 className="font-['Manrope'] font-bold text-xl text-white">
                      Policies &amp; Important Instructions
                    </h2>
                  </div>

                  {/* Accordion Tabs Header */}
                  <div className="flex border-b border-white/10 gap-4 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setOpenPolicySection('cancellation')}
                      className={`pb-2.5 transition-colors cursor-pointer border-b-2 ${
                        openPolicySection === 'cancellation'
                          ? 'border-[#f2ca50] text-[#f2ca50]'
                          : 'border-transparent text-[#d0c5af] hover:text-white'
                      }`}
                    >
                      Cancellation Policy
                    </button>

                    <button
                      type="button"
                      onClick={() => setOpenPolicySection('notes')}
                      className={`pb-2.5 transition-colors cursor-pointer border-b-2 ${
                        openPolicySection === 'notes'
                          ? 'border-[#f2ca50] text-[#f2ca50]'
                          : 'border-transparent text-[#d0c5af] hover:text-white'
                      }`}
                    >
                      Booking Notes
                    </button>

                    <button
                      type="button"
                      onClick={() => setOpenPolicySection('terms')}
                      className={`pb-2.5 transition-colors cursor-pointer border-b-2 ${
                        openPolicySection === 'terms'
                          ? 'border-[#f2ca50] text-[#f2ca50]'
                          : 'border-transparent text-[#d0c5af] hover:text-white'
                      }`}
                    >
                      Terms &amp; Conditions
                    </button>
                  </div>

                  {/* Accordion Content */}
                  <div className="pt-2 text-xs text-[#d0c5af] leading-relaxed">
                    {openPolicySection === 'cancellation' && (
                      <div className="space-y-2 animate-fadeIn">
                        {cancellationPolicies ? (
                          <div dangerouslySetInnerHTML={{ __html: typeof cancellationPolicies === 'string' ? cancellationPolicies : JSON.stringify(cancellationPolicies) }} />
                        ) : (
                          <p>Standard cancellation applies: Free cancellation up to 48 hours before travel date. Non-refundable within 24 hours.</p>
                        )}
                      </div>
                    )}

                    {openPolicySection === 'notes' && (
                      <div className="space-y-2 animate-fadeIn">
                        {bookingNotes ? (
                          <div dangerouslySetInnerHTML={{ __html: typeof bookingNotes === 'string' ? bookingNotes : JSON.stringify(bookingNotes) }} />
                        ) : (
                          <p>Please present your booking confirmation voucher upon arrival at the pickup point or hotel check-in desk.</p>
                        )}
                      </div>
                    )}

                    {openPolicySection === 'terms' && (
                      <div className="space-y-2 animate-fadeIn">
                        {termsConditions ? (
                          <div dangerouslySetInnerHTML={{ __html: typeof termsConditions === 'string' ? termsConditions : JSON.stringify(termsConditions) }} />
                        ) : (
                          <p>By placing this reservation, you agree to local operating regulations and Khaleel.ai booking terms.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Right Sticky Order Summary Card (5 Cols) */}
              <div className="lg:col-span-5">
                <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl sticky top-24">
                  <h3 className="font-['Manrope'] font-bold text-xl text-white border-b border-white/10 pb-4">
                    Booking Summary
                  </h3>

                  {/* Item preview */}
                  <div className="flex gap-4 items-center">
                    <img
                      alt={desc.title}
                      src={heroImg}
                      onError={(e) => { e.target.onerror = null; e.target.src = fallbackImage }}
                      className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-white text-sm line-clamp-2">{desc.title}</h4>
                      <p className="text-xs text-[#f2ca50] font-semibold mt-0.5">
                        {selectedDate ? `Date: ${selectedDate}` : 'Date pending selection'}
                      </p>
                    </div>
                  </div>

                  {/* Summary Breakdown Table */}
                  <div className="space-y-3 pt-2 text-xs border-t border-white/10">
                    <div className="flex justify-between text-[#d0c5af]">
                      <span>Travel Date:</span>
                      <span className="font-bold text-white">{selectedDate || 'Not selected'}</span>
                    </div>

                    {accomGroups[selectedGroupIdx] && (
                      <div className="flex justify-between text-[#d0c5af]">
                        <span>Hotel Tier:</span>
                        <span className="font-bold text-[#f2ca50]">{accomGroups[selectedGroupIdx].name}</span>
                      </div>
                    )}

                    {participantCounts.twin > 0 && (
                      <div className="flex justify-between text-[#d0c5af]">
                        <span>Twin Sharing ({participantCounts.twin}):</span>
                        <span className="font-bold text-white">{currencySymbol} {Number(twinTotal).toLocaleString()}</span>
                      </div>
                    )}

                    {participantCounts.triple > 0 && (
                      <div className="flex justify-between text-[#d0c5af]">
                        <span>Triple Sharing ({participantCounts.triple}):</span>
                        <span className="font-bold text-white">{currencySymbol} {Number(tripleTotal).toLocaleString()}</span>
                      </div>
                    )}

                    {participantCounts.quad > 0 && (
                      <div className="flex justify-between text-[#d0c5af]">
                        <span>Quad Sharing ({participantCounts.quad}):</span>
                        <span className="font-bold text-white">{currencySymbol} {Number(quadTotal).toLocaleString()}</span>
                      </div>
                    )}

                    {participantCounts.single > 0 && (
                      <div className="flex justify-between text-[#d0c5af]">
                        <span>Single Sharing ({participantCounts.single}):</span>
                        <span className="font-bold text-white">{currencySymbol} {Number(singleTotal).toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-[#d0c5af] border-t border-white/10 pt-2 font-bold">
                      <span>Total Passengers:</span>
                      <span className="text-white">{totalParticipants}</span>
                    </div>
                  </div>

                  {/* Total Amount (Without Taxes & Service Fee) */}
                  <div className="pt-4 border-t border-white/10 flex items-baseline justify-between">
                    <div>
                      <p className="text-xs text-[#d0c5af] font-bold uppercase tracking-wider">Total Price</p>
                      <p className="text-[11px] text-[#f2ca50]">Final payable amount</p>
                    </div>
                    <p className="font-['Manrope'] text-3xl font-extrabold text-[#f2ca50]">
                      {currencySymbol} {Number(grandTotal).toLocaleString()}
                    </p>
                  </div>

                  {/* CTA Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-[#f2ca50] hover:bg-[#ffe088] text-[#020617] font-['Manrope'] font-bold text-base transition-all duration-300 shadow-xl shadow-[#f2ca50]/20 hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-xl">shopping_cart</span>
                    Add to Cart
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Added to Cart Success Modal */}
      {isBookedSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#101415] border border-[#f2ca50]/40 rounded-3xl w-full max-w-md p-8 text-center space-y-6 shadow-2xl relative">
            <div className="w-16 h-16 rounded-full bg-[#f2ca50]/20 text-[#f2ca50] flex items-center justify-center mx-auto border border-[#f2ca50]/30 shadow-lg">
              <span className="material-symbols-outlined text-3xl">shopping_cart_checkout</span>
            </div>

            <div className="space-y-2">
              <h3 className="font-['Manrope'] font-bold text-2xl text-white">Added to Cart!</h3>
              <p className="text-xs text-[#d0c5af] leading-relaxed">
                <span className="text-[#f2ca50] font-bold">{desc.title}</span> for <span className="text-white font-bold">{selectedDate}</span> has been saved to your shopping cart.
              </p>
            </div>

            <div className="bg-[#020617] p-4 rounded-2xl border border-white/10 text-xs text-left space-y-1.5">
              <div className="flex justify-between"><span className="text-[#d0c5af]">Product ID:</span> <span className="font-bold text-[#f2ca50]">#{id}</span></div>
              <div className="flex justify-between"><span className="text-[#d0c5af]">Travelers:</span> <span className="font-bold text-white">{totalParticipants} Passengers</span></div>
              <div className="flex justify-between"><span className="text-[#d0c5af]">Travel Date:</span> <span className="font-bold text-white">{selectedDate}</span></div>
              <div className="flex justify-between"><span className="text-[#d0c5af]">Total Amount:</span> <span className="font-bold text-white">{currencySymbol} {Number(grandTotal).toLocaleString()}</span></div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/')}
                className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer"
              >
                Continue Exploring
              </button>
              <button
                onClick={() => setIsBookedSuccess(false)}
                className="flex-1 py-3 rounded-xl bg-[#f2ca50] text-[#020617] font-bold text-xs hover:bg-[#ffe088] transition-all cursor-pointer shadow-md"
              >
                Keep Editing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Nav */}
      <BottomNav
        activeNav="explore"
        setActiveNav={() => navigate('/')}
        onOpenProfile={() => {
          setAiQuery('My reservations')
          setIsAiModalOpen(true)
        }}
      />

      {/* AI Assistant Modal */}
      <AiChatModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        initialQuery={aiQuery}
      />
    </div>
  )
}
