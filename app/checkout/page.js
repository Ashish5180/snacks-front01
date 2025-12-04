'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useCart } from '../../context/CartContext'
import { useToast } from '../../components/Toaster'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CreditCard, Shield, CheckCircle, Loader } from 'lucide-react'
// Truck icon removed - was only used for COD option which we don't need now
import RazorpayPayment from '../../components/RazorpayPayment'
import { warmUpBackend } from '../../utils/keepAlive'
import { buildApiUrl } from '../../utils/api'

const CheckoutPage = () => {
  const { items, getCartTotal, appliedCoupon, removeCoupon, clearCart } = useCart()
  const { addToast } = useToast()
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'razorpay' // Default to Razorpay for better user experience
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [backendReady, setBackendReady] = useState(false)
  const [warmupStatus, setWarmupStatus] = useState('')
  const [showWarmupOverlay, setShowWarmupOverlay] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const authCheckedRef = useRef(false)

  // Protected route - verify authentication and token validity
  useEffect(() => {
    // Only check once
    if (authCheckedRef.current) return
    authCheckedRef.current = true

    const verifyAuth = async () => {
      try {
        if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
          setIsCheckingAuth(false)
          return
        }

        const token = localStorage.getItem('token')
        
        // Check if token exists and is valid
        if (!token || typeof token !== 'string' || token.trim() === '') {
          addToast('Please login to continue checkout', 'error')
          router.push('/login?redirect=/checkout')
          setIsCheckingAuth(false)
          return
        }

        // Clean and validate token
        const cleanToken = token.trim()
        
        // Verify token validity by calling /api/auth/me
        const response = await fetch(buildApiUrl('/auth/me'), {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${cleanToken}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })

        // Handle non-OK responses (including 500 errors)
        if (!response.ok) {
          let errorMessage = 'Authentication failed. Please login again.'
          
          // Try to parse error response if available
          try {
            const errorText = await response.text()
            let errorData = null
            
            // Try to parse as JSON
            try {
              errorData = errorText ? JSON.parse(errorText) : null
            } catch (parseError) {
              // Not JSON, use text as is
              console.error('[Auth] Non-JSON error response:', errorText)
            }
            
            if (errorData?.message) {
              errorMessage = errorData.message
            } else if (response.status === 500) {
              errorMessage = 'Server error. Please try again later or login again.'
              console.error('[Auth] 500 Server Error:', {
                status: response.status,
                statusText: response.statusText,
                error: errorData || errorText
              })
            } else if (response.status === 401) {
              errorMessage = 'Your session has expired. Please login again.'
            }
          } catch (e) {
            // Response might not be readable, use default message
            console.error('[Auth] Error reading response:', e)
            if (response.status === 500) {
              errorMessage = 'Server error. Please try again later or login again.'
            }
          }
          
          localStorage.removeItem('token')
          addToast(errorMessage, 'error')
          router.push('/login?redirect=/checkout')
          setIsCheckingAuth(false)
          return
        }

        // Parse successful response
        const data = await response.json()

        if (!data.success) {
          // Token is invalid or expired
          localStorage.removeItem('token')
          addToast('Your session has expired. Please login again.', 'error')
          router.push('/login?redirect=/checkout')
          setIsCheckingAuth(false)
          return
        }

        // Token is valid
        setIsAuthenticated(true)
        setIsCheckingAuth(false)
      } catch (error) {
        console.error('Auth verification error:', error)
        // On error, treat as unauthenticated
        localStorage.removeItem('token')
        addToast('Authentication failed. Please login again.', 'error')
        router.push('/login?redirect=/checkout')
        setIsCheckingAuth(false)
      }
    }

    verifyAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount

  // Aggressive backend warmup on mount
  useEffect(() => {
    const warmup = async () => {
      setWarmupStatus('Connecting to server...')
      
      const isReady = await warmUpBackend((progress) => {
        setWarmupStatus(progress)
      })
      
      setBackendReady(isReady)
      
      if (isReady) {
        setWarmupStatus('✅ Connected! Ready to place order.')
        setTimeout(() => setShowWarmupOverlay(false), 1500)
      } else {
        setWarmupStatus('⚠️ Server is warming up. Order may take longer.')
        setTimeout(() => setShowWarmupOverlay(false), 2000)
      }
    }
    warmup()
  }, [])

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return { 'Content-Type': 'application/json' }
    }
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No authentication token found')
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }

  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0)
  const total = getCartTotal()
  const discount = subtotal - total

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // No pre-order creation; order will be created after successful payment

  const handlePaymentSuccess = (paymentResponse) => {
    addToast('Payment successful! Order placed.', 'success')
    // Clear cart after successful payment
    clearCart()
    router.push('/checkout/confirmation')
  }

  const handlePaymentError = (error) => {
    addToast('Payment failed. Please try again.', 'error')
  }

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-vibe-bg flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 text-vibe-cookie animate-spin mx-auto mb-4" />
          <p className="text-vibe-brown">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  // Don't render checkout if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-vibe-bg">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-vibe-brown mb-4">Your Cart is Empty</h1>
            <p className="text-lg text-vibe-brown/70 mb-8">
              Add some products to your cart before checkout.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 bg-vibe-cookie text-vibe-brown font-semibold rounded-full hover:bg-vibe-accent transition-colors duration-300"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Continue Shopping
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-vibe-bg">
      <Navbar />
      
      {/* Backend Warmup Overlay */}
      {showWarmupOverlay && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
            <div className="text-center">
              <Loader className="h-12 w-12 text-vibe-cookie animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-bold text-vibe-brown mb-2">
                Preparing Your Checkout
              </h3>
              <p className="text-vibe-brown/70 mb-4">
                {warmupStatus}
              </p>
              <div className="w-full bg-vibe-bg rounded-full h-2 overflow-hidden">
                <div className="h-full bg-vibe-cookie animate-pulse"></div>
              </div>
              <p className="text-sm text-vibe-brown/50 mt-4">
                First-time connection may take a moment...
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center text-vibe-brown/70 hover:text-vibe-brown transition-colors mb-4"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold text-vibe-brown">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-8">
            {/* Shipping Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-vibe-brown mb-6">Shipping Information</h2>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-vibe-brown mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-vibe-cookie/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibe-cookie"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-vibe-brown mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-vibe-cookie/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibe-cookie"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-vibe-brown mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-vibe-cookie/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibe-cookie"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-vibe-brown mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-vibe-cookie/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibe-cookie"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-vibe-brown mb-2">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-2 border border-vibe-cookie/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibe-cookie resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-vibe-brown mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-vibe-cookie/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibe-cookie"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-vibe-brown mb-2">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-vibe-cookie/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibe-cookie"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-vibe-brown mb-2">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-vibe-cookie/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibe-cookie"
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-vibe-brown mb-6">Payment Method</h2>
              <div className="space-y-4">
                {/* Razorpay Payment Option */}
                <label className="flex items-center p-4 border border-vibe-cookie/30 rounded-lg cursor-pointer hover:bg-vibe-bg transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={formData.paymentMethod === 'razorpay'}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <CreditCard className="h-5 w-5 text-vibe-brown mr-3" />
                  <span className="text-vibe-brown">Credit/Debit Card (Razorpay)</span>
                </label>
                
                {/* COD Payment Option - Commented out as we don't need it now */}
                {/* <label className="flex items-center p-4 border border-vibe-cookie/30 rounded-lg cursor-pointer hover:bg-vibe-bg transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <Truck className="h-5 w-5 text-vibe-brown mr-3" />
                  <span className="text-vibe-brown">Cash on Delivery</span>
                </label> */}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-vibe-brown mb-6">Order Summary</h2>
              
              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-vibe-brown">{item.name}</h4>
                      <p className="text-sm text-vibe-brown/60">
                        {item.selectedSize} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-vibe-brown">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-vibe-brown/70">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-vibe-brown/70">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-vibe-brown/20 pt-3">
                  <div className="flex justify-between text-lg font-bold text-vibe-brown">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>
              </div>

              {/* Pay Button (opens Razorpay instantly) */}
              {formData.paymentMethod === 'razorpay' && (
                <RazorpayPayment
                  amount={total}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  userInfo={{
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    phone: formData.phone
                  }}
                  orderPayload={{
                    items: items.map(i => ({
                      productId: i.id,
                      size: i.selectedSize,
                      quantity: i.quantity
                    })),
                    shippingAddress: {
                      firstName: formData.firstName,
                      lastName: formData.lastName,
                      address: formData.address,
                      city: formData.city,
                      state: formData.state,
                      pincode: formData.pincode,
                      phone: formData.phone
                    },
                    paymentMethod: 'razorpay',
                    appliedCoupon: appliedCoupon || undefined
                  }}
                />
              )}
              {/* COD Button - Commented out as we don't need it now */}
              {/* {formData.paymentMethod === 'cod' ? (
                <button
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-vibe-cookie text-vibe-brown font-semibold rounded-full hover:bg-vibe-accent transition-colors duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-vibe-brown mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-5 w-5" />
                      Place Order (COD)
                    </>
                  )}
                </button>
              ) : null} */}

              {/* Security Notice */}
              <div className="mt-4 text-center text-sm text-vibe-brown/60">
                <CheckCircle className="h-4 w-4 inline mr-1" />
                Secure checkout powered by VIBE BITES
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default CheckoutPage 