import React, { useState, useEffect } from 'react'
import { formatMediaUrl } from '../utils/slugify'

export default function CartDrawer() {
  const getStoredCart = () => {
    try {
      const stored = localStorage.getItem('khaleel_cart')
      const items = stored ? JSON.parse(stored) : []
      return Array.isArray(items) ? items : []
    } catch {
      return []
    }
  }

  const [isOpen, setIsOpen] = useState(false)
  const [cartItems, setCartItems] = useState(getStoredCart)
  const [itemToDeleteIndex, setItemToDeleteIndex] = useState(null)

  useEffect(() => {
    const handleCartUpdated = () => {
      setCartItems(getStoredCart())
    }

    const handleOpenDrawer = () => {
      setCartItems(getStoredCart())
      setIsOpen(true)
    }

    window.addEventListener('cartUpdated', handleCartUpdated)
    window.addEventListener('openCartDrawer', handleOpenDrawer)

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdated)
      window.removeEventListener('openCartDrawer', handleOpenDrawer)
    }
  }, [])

  const confirmDelete = () => {
    if (itemToDeleteIndex === null) return
    const updated = cartItems.filter((_, idx) => idx !== itemToDeleteIndex)
    setCartItems(updated)
    localStorage.setItem('khaleel_cart', JSON.stringify(updated))
    
    // Clear session storage if cart is empty
    if (updated.length === 0) {
      sessionStorage.removeItem('khaleel_cart_session')
    }

    window.dispatchEvent(new Event('cartUpdated'))
    setItemToDeleteIndex(null)
  }

  // Calculate grand total of all items in cart
  const cartTotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0)
  const currencySymbol = cartItems[0]?.currency || 'PKR'
  const fallbackImg = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbStP2lAc6byVYksTXcXz5w8IKt_KpUJsjAqWS687yiXpYLAu0JmLTU18kw7BGEW5cn5-T_G9Sak138KT-Ik5sFu9anrSsXGe8D5hvSMypu2R4Xl5fk4VLZ_ECZ2-s7IjHqGE3WvTsAWzxbu5_2CTC5Kk7es4xK07GcASBmPb7BuGcza2Fp7QtnEvXZOGRtrY1E7slDTT6ch_PDb3zzHPBlwnjEPTxuDlcjHOer5EWWb34-0fiynaAVA'

  return (
    <>
      {/* Floating Right-Bottom Cart Bubble Button (Only shown when cart has items) */}
      {cartItems.length > 0 && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="View Shopping Cart"
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#f2ca50] text-[#020617] shadow-2xl shadow-[#f2ca50]/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer group border-2 border-[#020617]"
        >
          <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">
            shopping_cart
          </span>
          <span className="absolute -top-1.5 -right-1.5 bg-[#0047ab] text-white font-extrabold text-xs w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-md animate-bounce">
            {cartItems.length}
          </span>
        </button>
      )}

      {/* Slide-Over Cart Drawer Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
          {/* Backdrop Overlay */}
          <div
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Container (Right Side) */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white text-[#0f172a] shadow-2xl flex flex-col justify-between border-l border-slate-200">
              
              {/* Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#0047ab] text-2xl">shopping_cart</span>
                  <h2 className="font-['Manrope'] font-bold text-xl text-[#0f172a]">
                    Your Cart
                  </h2>
                  <span className="bg-slate-100 text-[#0047ab] font-bold text-xs px-2.5 py-0.5 rounded-full">
                    {cartItems.length}
                  </span>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close cart"
                  className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-slate-100">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-16 text-slate-400">
                    <span className="material-symbols-outlined text-5xl text-slate-300">remove_shopping_cart</span>
                    <p className="font-['Manrope'] font-semibold text-base text-slate-600">Your cart is empty</p>
                    <p className="text-xs text-slate-400 max-w-xs">
                      Explore our packages and add your preferred pilgrimage tour to get started.
                    </p>
                  </div>
                ) : (
                  cartItems.map((item, idx) => {
                    const itemImg = item.image ? formatMediaUrl(item.image) : fallbackImg
                    return (
                      <div key={idx} className="pt-4 first:pt-0 flex items-start gap-3.5 group">
                        <img
                          alt={item.title}
                          src={itemImg}
                          onError={(e) => { e.target.onerror = null; e.target.src = fallbackImg }}
                          className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0 shadow-sm"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-['Manrope'] font-semibold text-sm text-slate-800 line-clamp-2 leading-tight">
                              {item.title}
                            </h3>

                            <button
                              onClick={() => setItemToDeleteIndex(idx)}
                              title="Remove item"
                              aria-label="Remove item"
                              className="text-[#d0c5af] hover:text-red-600 transition-colors p-1 cursor-pointer shrink-0"
                            >
                              <span className="material-symbols-outlined text-lg">delete_outline</span>
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            <span className="text-[11px] text-slate-500 font-medium">
                              {item.date ? `Date: ${item.date}` : ''}
                            </span>
                            <span className="font-['Manrope'] font-bold text-sm text-[#0047ab]">
                              {currencySymbol} {Number(item.price || 0).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Drawer Footer (Fixed at bottom) */}
              <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-['Manrope'] font-bold text-base text-slate-800">Total</span>
                  <span className="font-['Manrope'] font-extrabold text-xl text-[#0047ab]">
                    {currencySymbol} {Number(cartTotal).toLocaleString()}
                  </span>
                </div>

                <div className="space-y-2">
                  <button
                    disabled={cartItems.length === 0}
                    onClick={() => {
                      setIsOpen(false)
                      window.location.href = '/checkout'
                    }}
                    className="w-full py-3.5 rounded-xl bg-[#0047ab] hover:bg-[#003380] text-white font-['Manrope'] font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-lg">credit_card</span>
                    Proceed to Checkout
                  </button>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-['Manrope'] font-semibold text-sm transition-all cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Delete Item Confirmation Modal */}
      {itemToDeleteIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 text-center space-y-4 shadow-2xl border border-slate-100 relative">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto shadow-inner">
              <span className="material-symbols-outlined text-3xl">delete_forever</span>
            </div>

            <div className="space-y-1">
              <h3 className="font-['Manrope'] font-bold text-lg text-slate-800">
                Remove Item from Cart?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to remove <span className="font-semibold text-slate-700">{cartItems[itemToDeleteIndex]?.title}</span> from your cart?
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setItemToDeleteIndex(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs transition-colors shadow-md cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
