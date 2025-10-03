'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useCart } from '../../context/CartContext'
import { useToast } from '../../components/Toaster'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CreditCard, Truck, Shield, CheckCircle } from 'lucide-react'
// import RazorpayPayment from '../../components/RazorpayPayment' // Commented out - COD only for now

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
    paymentMethod: 'cod'
  })
  const [createdOrder, setCreatedOrder] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return { 'Content-Type': 'application/json' }
    }
    const token = localStorage.getItem('token')
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

  const createOrder = async () => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      addToast('Please login to place order', 'error')
      router.push('/login')
      return null
    }
    
    const token = localStorage.getItem('token')
    if (!token) {
      addToast('Please login to place order', 'error')
      router.push('/login')
      return null
    }

    const payload = {
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
      paymentMethod: formData.paymentMethod,
      appliedCoupon: appliedCoupon || undefined
    }

    try {
      const orderRes = await fetch(`${'http://localhost:8080/api'}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      })
      
      const orderData = await orderRes.json()
      
      if (!orderRes.ok || !orderData.success) {
        console.error('Order creation failed:', orderData)
        // Don't show toast here as it will be handled by the calling function
        return null
      }

      return orderData.data.order
    } catch (error) {
      console.error('Network error during order creation:', error)
      return null
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      if (formData.paymentMethod === 'cod') {
        // Handle Cash on Delivery
        const order = await createOrder()
        if (order) {
          addToast('Order placed successfully!', 'success')
          // Clear cart after successful order
          clearCart()
          router.push('/checkout/confirmation')
        } else {
          addToast('Failed to create order. Please try again.', 'error')
        }
      } else {
        // For Razorpay, create order first
        const order = await createOrder()
        if (order) {
          setCreatedOrder(order)
        } else {
          addToast('Failed to create order. Please try again.', 'error')
        }
      }
    } catch (err) {
      console.error('Order creation error:', err)
      addToast('Something went wrong. Please try again.', 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePaymentSuccess = (paymentResponse) => {
    addToast('Payment successful! Order placed.', 'success')
    // Clear cart after successful payment
    clearCart()
    router.push('/checkout/confirmation')
  }

  const handlePaymentError = (error) => {
    addToast('Payment failed. Please try again.', 'error')
    setCreatedOrder(null)
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
              <form onSubmit={handleSubmit} className="space-y-4">
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
                {/* Razorpay Payment Option - Commented out for now */}
                {/* <label className="flex items-center p-4 border border-vibe-cookie/30 rounded-lg cursor-pointer hover:bg-vibe-bg transition-colors">
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
                </label> */}
                
                {/* COD Payment Option - Only option available */}
                <label className="flex items-center p-4 border border-vibe-cookie/30 rounded-lg cursor-pointer hover:bg-vibe-bg transition-colors">
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
                </label>
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

              {/* Place Order Button */}
              {/* Razorpay Payment Component - Commented out for now */}
              {/* {formData.paymentMethod === 'razorpay' && createdOrder ? (
                <RazorpayPayment
                  amount={total}
                  orderId={createdOrder._id}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  userInfo={{
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    phone: formData.phone
                  }}
                />
              ) : ( */}
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
              {/* )} */}

              {/* Security Notice */}
              <div className="mt-4 text-center text-sm text-vibe-brown/60">
                <CheckCircle className="h-4 w-4 inline mr-1" />
                Secure checkout powered by VIBE BITES
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