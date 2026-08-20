import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import HowItWorks from './components/HowItWorks'
import FixedDepartures from './components/FixedDepartures'
import HotelTiers from './components/HotelTiers'
import ZiyaratPlaces from './components/ZiyaratPlaces'
import CustomPackages from './components/CustomPackages'
import BottomNav from './components/BottomNav'
import Footer from './components/Footer'
import AiChatModal from './components/AiChatModal'
import BookingModal from './components/BookingModal'
import PackageDetailPage from './pages/PackageDetailPage'
import BookingPage from './pages/BookingPage'
import CheckoutPage from './pages/CheckoutPage'
import CartDrawer from './components/CartDrawer'

function HomePage() {
  const [activeNav, setActiveNav] = useState('explore')
  const [isAiModalOpen, setIsAiModalOpen] = useState(false)
  const [aiQuery, setAiQuery] = useState('')
  const [bookingModalState, setBookingModalState] = useState({
    isOpen: false,
    item: null,
    type: 'package',
  })

  const handleAskAi = (question) => {
    setAiQuery(question)
    setIsAiModalOpen(true)
  }

  const handleSearch = (searchParams) => {
    const summaryQuery = `Searching ${searchParams.packageType} for ${searchParams.month} (${searchParams.pilgrims}) in ${searchParams.activeTab}`
    setAiQuery(summaryQuery)
    setIsAiModalOpen(true)
  }

  const handleSelectPackage = (item) => {
    setBookingModalState({
      isOpen: true,
      item: typeof item === 'string' ? { title: 'All Departures Schedule' } : item,
      type: 'package',
    })
  }

  const handleSelectTier = (tier) => {
    setBookingModalState({
      isOpen: true,
      item: tier,
      type: 'hotel-tier',
    })
  }

  const handleSelectSite = (site) => {
    handleAskAi(`Tell me about historical Ziyarat and religious significance of ${site.name}`)
  }

  const handleStartBuilder = () => {
    setBookingModalState({
      isOpen: true,
      item: null,
      type: 'builder',
    })
  }

  const handleOpenProfile = () => {
    handleAskAi('My account profile & pilgrimage checklist')
  }

  return (
    <div className="min-h-screen bg-[#101415] text-[#e0e3e5] font-['Hanken_Grotesk'] selection:bg-[#f2ca50] selection:text-[#020617] pb-24 md:pb-0 pt-16">
      {/* Top Navbar */}
      <Navbar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        onOpenProfile={handleOpenProfile}
      />

      <main className="w-full">
        {/* Hero Section with AI Prompt Input & Advanced Search Widget */}
        <HeroSection
          onAskAi={handleAskAi}
          onSearch={handleSearch}
        />

        {/* How it Works Section */}
        <HowItWorks />

        {/* Upcoming Fixed Departures Section */}
        <FixedDepartures
          onSelectPackage={handleSelectPackage}
        />

        {/* Tiered Hotel Packages Section */}
        <HotelTiers
          onSelectTier={handleSelectTier}
        />

        {/* Holy Sites & Cities Snap Carousel */}
        <ZiyaratPlaces
          onSelectSite={handleSelectSite}
        />

        {/* Fixed & DIY Umrah Package 2026 */}
        <CustomPackages
          onSelectPackage={handleSelectPackage}
          onStartBuilder={handleStartBuilder}
        />
      </main>

      {/* Mobile Floating Bottom Navigation */}
      <BottomNav
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        onOpenProfile={handleOpenProfile}
      />

      {/* Footer */}
      <Footer />

      {/* Interactive AI Chat & Fatwa Verification Modal */}
      <AiChatModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        initialQuery={aiQuery}
      />

      {/* Inquiry & Details Modal */}
      <BookingModal
        isOpen={bookingModalState.isOpen}
        onClose={() => setBookingModalState({ isOpen: false, item: null, type: 'package' })}
        selectedItem={bookingModalState.item}
        type={bookingModalState.type}
      />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/package-tour/:slug/:id" element={<PackageDetailPage />} />
        <Route path="/booking/:id" element={<BookingPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
      <CartDrawer />
    </BrowserRouter>
  )
}