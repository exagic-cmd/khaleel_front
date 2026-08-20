import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import Footer from '../components/Footer'
import AiChatModal from '../components/AiChatModal'
import { formatMediaUrl } from '../utils/slugify'

export default function CheckoutPage() {
  const navigate = useNavigate()

  const getStoredCart = () => {
    try {
      const stored = localStorage.getItem('khaleel_cart')
      const items = stored ? JSON.parse(stored) : []
      return Array.isArray(items) ? items : []
    } catch {
      return []
    }
  }

  // Cart State from localStorage
  const [cartItems] = useState(getStoredCart)

  // Passenger & Traveler Contact State
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [communicationMode, setCommunicationMode] = useState('whatsapp')
  const [roamingEnabled, setRoamingEnabled] = useState('no')

  // Submission & Loading State
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderError, setOrderError] = useState(null)

  // AI Assistant Modal
  const [isAiModalOpen, setIsAiModalOpen] = useState(false)
  const [aiQuery, setAiQuery] = useState('')

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://app.khaleel.ai/api'
  const stripePaymentUrl = 'https://checkout.stripe.com/c/pay/cs_live_a12fciuk398kb53YKoxMDoYPI8Uujazib5UwgkSSIJWupz1x1Dw8tPw9vC#fidnandhYHdWcXxpYCc%2FJ2FgY2RwaXEnKSdicGRmZGhqaWBTZHdsZGtxJz8nZmprcXdqaScpJ2R1bE5gfCc%2FJ3VuWmlsc2BaMDRWREFzSDdJa1BnYXxqa1FwdHR0N0JHbHA9QEFoQWB3QUliZkl2MmZCaWxmcDMzQG9yQG5obkpASlFIUktMVGdfa3FiRmByQWJsbXZnM2ZTalxmdWh9UkI1NUd3MlVBblJBJyknY3dqaFZgd3Ngdyc%2FcXdwYCknZ2RmbmJ3anBrYUZqaWp3Jz8nJjU1NTU1NScpJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl'

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Calculate order totals
  const grandTotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0)
  const currencySymbol = cartItems[0]?.currency || 'SGD'
  const fallbackImg = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbStP2lAc6byVYksTXcXz5w8IKt_KpUJsjAqWS687yiXpYLAu0JmLTU18kw7BGEW5cn5-T_G9Sak138KT-Ik5sFu9anrSsXGe8D5hvSMypu2R4Xl5fk4VLZ_ECZ2-s7IjHqGE3WvTsAWzxbu5_2CTC5Kk7es4xK07GcASBmPb7BuGcza2Fp7QtnEvXZOGRtrY1E7slDTT6ch_PDb3zzHPBlwnjEPTxuDlcjHOer5EWWb34-0fiynaAVA'

  // Submit Order API Call to /create_new_order & redirect to Stripe
  const handlePlaceOrder = async (e) => {
    e.preventDefault()

    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items to cart before checking out.')
      return
    }

    if (!firstName || !email || !phone) {
      alert('Please complete all required contact information fields.')
      return
    }

    setIsProcessing(true)
    setOrderError(null)

    // Generate dynamic session & visitor IDs
    const randomSessionId = Math.random().toString(36).substring(2, 12)
    const randomVisitorNum = `user_${Math.random().toString(36).substring(2, 12)}`

    // Map cart items to required API payload format
    const formattedCartItems = cartItems.map((item) => ({
      adult_count: Number(item.adults || 1),
      child_count: Number(item.children || 0),
      twin_sharing: Number(item.adults_sharing || 0),
      single_sharing: Number(item.adults_private || 0),
      child_with_bed: Number(item.children_with_bed || 0),
      child_without_bed: Number(item.children_without_bed || 0),
      accommodation_group_id: String(item.accommodation_group_id || ''),
      group_hotel_id: '',
      category_id: Number(item.category_id || 2),
      dropoff_point: 'Hilton Hotel',
      flight_number: '',
      operator_email: 'operator@example.com',
      operator_id: '12345',
      pickup_date: item.date || '2026-08-27',
      pickup_point: 'Hilton Hotel',
      pickup_point_id: '',
      dropoff_point_id: '',
      two_way_pickup_point_id: '',
      two_way_dropoff_point_id: '',
      feature_type_id: 1,
      flight_estimated_time: '',
      flight_dep_estimated_time: '',
      pickup_time: item.time || '9:00AM',
      product_id: String(item.productId || '814'),
      total: Number(item.price || 50),
      tour_date: item.date || '2026-08-27',
      tourplan_hotel_id: '789',
      vehicle_id: 'V102',
      transfer_type: '',
      flight_dep_number: '',
      two_way_dropoff_date: '',
      two_way_dropoff_time: '',
      baggage: 0,
      pickup_surcharge: 0,
      return_surcharge: 0,
      return_surcharge_id: 0,
      pickup_surcharge_id: 0,
      addons: [],
      addons_round: [],
      exceptions: []
    }))

    const orderPayload = {
      cart_items: formattedCartItems,
      paxinfo: {
        email: email,
        username: email.split('@')[0] || 'user',
        first_name: firstName,
        last_name: lastName || '',
        contactNumber: phone,
        communication_mode: communicationMode,
        roaming_enabled: roamingEnabled
      },
      payment_details: {
        charge_to: '',
        currency: currencySymbol,
        charge_for: 'order',
        token: '',
        xendit_authentication_id: ''
      },
      payment_mode: 2,
      client_id: '',
      agent_id: 501,
      source: 'Direct',
      source_link: 'Khaleel',
      promo_id: '',
      discount: '',
      session_id: randomSessionId,
      customer_type: 'potential_customer',
      visitor_number: randomVisitorNum,
      ip: '',
      redemption_voucher_id: 0,
      ref_type: null,
      track_agent_id: null,
      user_comment: null,
      language_id: 1
    }

    try {
      const response = await fetch(`${apiBaseUrl}/create_new_order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      })

      const json = await response.json()
      console.log('Unconfirmed order created:', json)
    } catch (err) {
      console.warn('Order API request note:', err)
    } finally {
      // Clear cart & redirect to Stripe payment URL
      localStorage.removeItem('khaleel_cart')
      window.dispatchEvent(new Event('cartUpdated'))
      window.location.href = stripePaymentUrl
    }
  }

  return (
    <div className="min-h-screen bg-[#101415] text-[#e0e3e5] font-[#Hanken_Grotesk] selection:bg-[#f2ca50] selection:text-[#020617] pb-24 md:pb-0 pt-16">
      {/* Top Navbar */}
      <Navbar
        activeNav="explore"
        setActiveNav={() => navigate('/')}
        onOpenProfile={() => {
          setAiQuery('My checkout orders and status')
          setIsAiModalOpen(true)
        }}
      />

      <main className="w-full max-w-[1280px] mx-auto px-4 md:px-16 py-8">
        {/* Breadcrumb Header */}
        <div className="flex items-center gap-2 text-xs md:text-sm text-[#d0c5af] mb-6">
          <button onClick={() => navigate('/')} className="hover:text-[#f2ca50] transition-colors cursor-pointer flex items-center gap-1">
            <span className="material-symbols-outlined text-base">home</span> Home
          </button>
          <span>/</span>
          <button onClick={() => navigate(-1)} className="hover:text-[#f2ca50] transition-colors cursor-pointer">
            Cart
          </button>
          <span>/</span>
          <span className="text-[#f2ca50] font-semibold">Checkout &amp; Payment</span>
        </div>

        {/* Page Title Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="font-['Manrope'] font-extrabold text-2xl md:text-3xl text-white tracking-tight flex items-center gap-3">
              <span className="material-symbols-outlined text-[#f2ca50] text-3xl">lock</span>
              Passenger Details
            </h1>
            {/* <p className="text-xs md:text-sm text-[#d0c5af] mt-1">
              Enter traveler details to place your unconfirmed order and proceed to Stripe payment
            </p> */}
          </div>

          {/* <div className="flex items-center gap-2 text-xs bg-[#f2ca50]/10 border border-[#f2ca50]/30 text-[#f2ca50] px-3.5 py-1.5 rounded-full font-bold self-start md:self-auto">
            <span className="material-symbols-outlined text-base">verified</span>
            Khaleel &middot; Stripe Checkout
          </div> */}
        </div>

        {/* Empty Cart View */}
        {cartItems.length === 0 && (
          <div className="my-16 p-12 glass-panel rounded-3xl border border-white/10 text-center max-w-xl mx-auto space-y-4">
            <span className="material-symbols-outlined text-5xl text-[#f2ca50]">shopping_bag</span>
            <h3 className="font-['Manrope'] text-2xl font-bold text-white">Your Cart is Empty</h3>
            <p className="text-sm text-[#d0c5af]">You do not have any tour items in your cart to checkout.</p>
            <button
              onClick={() => navigate('/')}
              className="mt-2 px-6 py-3 rounded-xl bg-[#f2ca50] text-[#020617] font-bold text-sm hover:bg-[#ffe088] transition-all cursor-pointer shadow-lg"
            >
              Explore Tour Packages
            </button>
          </div>
        )}

        {/* Checkout Main Layout */}
        {cartItems.length > 0 && (
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Form Column (7 Cols) */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Contact & Passenger Info */}
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-xl">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <div className="w-8 h-8 rounded-xl bg-[#f2ca50] text-[#020617] font-bold font-['Manrope'] flex items-center justify-center text-sm shadow-md">
                    1
                  </div>
                  <h2 className="font-['Manrope'] font-bold text-xl text-white">
                    Lead Traveler Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#d0c5af] uppercase tracking-wider block mb-1.5">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                      className="w-full bg-[#020617] border border-white/20 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#f2ca50] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#d0c5af] uppercase tracking-wider block mb-1.5">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                      className="w-full bg-[#020617] border border-white/20 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#f2ca50] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#d0c5af] uppercase tracking-wider block mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full bg-[#020617] border border-white/20 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#f2ca50] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#d0c5af] uppercase tracking-wider block mb-1.5">
                      Contact / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+92 300 1234567"
                      className="w-full bg-[#020617] border border-white/20 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#f2ca50] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-xs font-bold text-[#d0c5af] uppercase tracking-wider block mb-1.5">
                      Communication Mode
                    </label>
                    <select
                      value={communicationMode}
                      onChange={(e) => setCommunicationMode(e.target.value)}
                      className="w-full bg-[#020617] border border-white/20 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#f2ca50] outline-none cursor-pointer"
                    >
                      <option value="whatsapp">WhatsApp</option>
                      <option value="line">Line</option>
                      <option value="telegram">Telegram</option>
                      <option value="viber">Viber</option>
                      <option value="email">Email</option>
                      <option value="sms">SMS</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#d0c5af] uppercase tracking-wider block mb-1.5">
                      Roaming Enabled?
                    </label>
                    <select
                      value={roamingEnabled}
                      onChange={(e) => setRoamingEnabled(e.target.value)}
                      className="w-full bg-[#020617] border border-white/20 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#f2ca50] outline-none cursor-pointer"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Summary Column (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl sticky top-24">
                <h3 className="font-['Manrope'] font-bold text-xl text-white border-b border-white/10 pb-4 flex items-center justify-between">
                  <span>Order Items</span>
                  <span className="bg-[#f2ca50]/20 text-[#f2ca50] text-xs px-2.5 py-0.5 rounded-full font-bold">
                    {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
                  </span>
                </h3>

                {/* Cart Items List */}
                <div className="space-y-4 max-h-[300px] overflow-y-auto hide-scrollbar divide-y divide-white/10 pr-1">
                  {cartItems.map((item, idx) => {
                    const itemImg = item.image ? formatMediaUrl(item.image) : fallbackImg
                    return (
                      <div key={idx} className="pt-3 first:pt-0 flex items-start gap-3">
                        <img
                          alt={item.title}
                          src={itemImg}
                          onError={(e) => { e.target.onerror = null; e.target.src = fallbackImg }}
                          className="w-14 h-14 rounded-xl object-cover border border-white/10 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-white text-xs line-clamp-2 leading-tight">
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-[#d0c5af] mt-0.5">
                            Date: {item.date || '2026-08-27'} &middot; Pax: {item.adults || 1}
                          </p>
                          <p className="font-bold text-[#f2ca50] text-xs mt-1">
                            {currencySymbol} {Number(item.price || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Order Totals Table */}
                <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
                  <div className="flex justify-between text-[#d0c5af]">
                    <span>Items Subtotal:</span>
                    <span className="font-bold text-white">{currencySymbol} {Number(grandTotal).toLocaleString()}</span>
                  </div>
                </div>

                {/* Grand Total */}
                <div className="pt-4 border-t border-white/10 flex items-baseline justify-between">
                  <div>
                    <p className="text-xs text-[#d0c5af] font-bold uppercase tracking-wider">Total Charge</p>
                    {/* <p className="text-[11px] text-[#f2ca50]">Stripe Secure Payment</p> */}
                  </div>
                  <p className="font-['Manrope'] text-3xl font-extrabold text-[#f2ca50]">
                    {currencySymbol} {Number(grandTotal).toLocaleString()}
                  </p>
                </div>

                {orderError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                    {orderError}
                  </div>
                )}

                {/* Place Order & Pay Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 rounded-xl bg-[#f2ca50] hover:bg-[#ffe088] text-[#020617] font-['Manrope'] font-bold text-base transition-all duration-300 shadow-xl shadow-[#f2ca50]/20 hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-[#020617] border-t-transparent rounded-full animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-xl">open_in_new</span>
                      Place &amp; Pay
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Nav */}
      <BottomNav
        activeNav="explore"
        setActiveNav={() => navigate('/')}
        onOpenProfile={() => {
          setAiQuery('My reservations and profile')
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
