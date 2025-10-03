'use client'

import React, { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { useToast } from './Toaster'
import { Tag, X } from 'lucide-react'

const CouponInput = () => {
  const [couponCode, setCouponCode] = useState('')
  const [availableCoupons, setAvailableCoupons] = useState([])
  const { applyCoupon, removeCoupon, appliedCoupon } = useCart()
  const { addToast } = useToast()

  useEffect(() => {
    // Fetch public available coupons from backend
    fetch('https://snacks-back01.onrender.com/api/coupons')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.coupons) {
          setAvailableCoupons(data.data.coupons)
        }
      })
      .catch(() => setAvailableCoupons([]))
  }, [])

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      addToast('Please enter a coupon code', 'error')
      return
    }

    const result = applyCoupon(couponCode)
    if (result.success) {
      addToast(result.message, 'success')
      setCouponCode('')
    } else {
      addToast(result.message, 'error')
    }
  }

  const handleRemoveCoupon = () => {
    removeCoupon()
    addToast('Coupon removed', 'success')
  }

  return (
    <div className="mb-6">
      <h3 className="font-medium text-vibe-brown mb-3">Have a coupon?</h3>
      
      {appliedCoupon ? (
        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center">
            <Tag className="h-4 w-4 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-800">
              {appliedCoupon.code} applied
            </span>
          </div>
          <button
            onClick={handleRemoveCoupon}
            className="text-green-600 hover:text-green-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="flex-1 px-3 py-2 border border-vibe-cookie/30 rounded-lg text-vibe-brown placeholder-vibe-brown/60 focus:outline-none focus:ring-2 focus:ring-vibe-cookie focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
          />
          <button
            onClick={handleApplyCoupon}
            className="px-4 py-2 bg-vibe-cookie text-vibe-brown rounded-lg hover:bg-vibe-accent transition-colors font-medium"
          >
            Apply
          </button>
        </div>
      )}

      {/* Available Coupons */}
      <div className="mt-3">
        <p className="text-xs text-vibe-brown/60 mb-2">Available coupons:</p>
        <div className="space-y-1">
          {availableCoupons.length === 0 && (
            <div className="text-xs text-vibe-brown/70">No coupons available</div>
          )}
          {availableCoupons.map(coupon => (
            <div key={coupon._id} className="text-xs text-vibe-brown/70">
              <span className="font-medium">{coupon.code}</span>
              {coupon.description ? ` - ${coupon.description}` : ''}
              {coupon.minOrderAmount > 0 ? ` (Min order: ₹${coupon.minOrderAmount})` : ''}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CouponInput 