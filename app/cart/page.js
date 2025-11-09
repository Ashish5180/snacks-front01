'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import CouponInput from '../../components/CouponInput'
import { useCart } from '../../context/CartContext'
import { useToast } from '../../components/Toaster'
import { Trash2, ArrowLeft, ShoppingBag, Plus, Minus } from 'lucide-react'
import { warmUpBackend } from '../../utils/keepAlive'

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, getCartTotal, appliedCoupon, removeCoupon, shippingFee, freeShippingThreshold, getShippingCost } = useCart()
  const { addToast } = useToast()
  const [couponCode, setCouponCode] = useState('')

  // Pre-warm backend when user is on cart page (preparing for checkout)
  useEffect(() => {
    if (items.length > 0) {
      // Silently warm up backend in background
      warmUpBackend().then((isReady) => {
        console.log('[Cart] Backend warmup:', isReady ? 'Ready' : 'Still warming')
      })
    }
  }, [items.length])

  const handleQuantityChange = (id, selectedSize, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id, selectedSize)
      addToast('Item removed from cart', 'success')
    } else {
      updateQuantity(id, selectedSize, newQuantity)
    }
  }

  const handleRemoveItem = (id, selectedSize) => {
    removeFromCart(id, selectedSize)
    addToast('Item removed from cart', 'success')
  }

  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0)
  const currentShippingCost = getShippingCost()
  const total = getCartTotal()
  const discount = appliedCoupon ? Number((subtotal - (total - currentShippingCost)).toFixed(2)) : 0

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-vibe-bg">
        <Navbar />
        <div className="pt-20">
          <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="text-center flex flex-col items-center justify-center">
            <ShoppingBag className="h-20 w-20 sm:h-24 sm:w-24 text-vibe-brown/40 mx-auto mb-6" />
            <h1 className="text-2xl sm:text-3xl font-bold text-vibe-brown mb-4">Your Cart is Empty</h1>
            <p className="text-base sm:text-lg text-vibe-brown/70 mb-8">
              Looks like you haven&apos;t added any snacks to your cart yet.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 bg-vibe-cookie text-vibe-brown font-semibold rounded-full hover:bg-vibe-accent transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Continue Shopping
            </Link>
          </div>
        </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-vibe-bg">
      <Navbar />
      <div className="pt-20">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-vibe-brown mb-2">Shopping Cart</h1>
          <p className="text-vibe-brown/70">
            {items.length} item{items.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-2 sm:p-4 md:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-vibe-brown mb-4 sm:mb-6">Cart Items</h2>
              <div className="space-y-4 sm:space-y-6">
                {items.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex flex-col sm:flex-row items-center gap-4 p-2 sm:p-4 bg-vibe-bg rounded-xl">
                    {/* Product Image */}
                    <div className="relative w-24 h-24 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 w-full sm:w-auto text-center sm:text-left">
                      <h3 className="font-semibold text-vibe-brown mb-1">{item.name}</h3>
                      <p className="text-sm text-vibe-brown/60 mb-2">
                        Size: {item.selectedSize}
                      </p>
                      <div className="text-lg font-bold text-vibe-brown">
                        ₹{item.price}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.selectedSize, item.quantity - 1)}
                        className="p-1 rounded-full bg-vibe-cookie text-vibe-brown hover:bg-vibe-accent transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-semibold text-vibe-brown">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.selectedSize, item.quantity + 1)}
                        className="p-1 rounded-full bg-vibe-cookie text-vibe-brown hover:bg-vibe-accent transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Total Price */}
                    <div className="text-right w-full sm:w-auto mt-2 sm:mt-0">
                      <div className="font-bold text-vibe-brown">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.id, item.selectedSize)}
                      className="p-2 text-vibe-brown/60 hover:text-vibe-brown transition-colors mt-2 sm:mt-0"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-2 sm:p-4 md:p-6 sticky top-24">
              <h2 className="text-lg sm:text-xl font-semibold text-vibe-brown mb-4 sm:mb-6">Order Summary</h2>
              {/* Coupon Input */}
              <CouponInput />
              {/* Price Breakdown */}
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
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
                  <span>Shipping Fee</span>
                  <span className={currentShippingCost === 0 ? 'text-green-600 font-semibold' : ''}>
                    {currentShippingCost === 0 ? 'FREE' : `₹${currentShippingCost}`}
                  </span>
                </div>
                {subtotal < freeShippingThreshold && subtotal > 0 && (
                  <div className="text-xs text-vibe-brown/60 bg-vibe-cookie/10 p-2 rounded-md">
                    Add ₹{(freeShippingThreshold - subtotal).toFixed(0)} more for free shipping!
                  </div>
                )}
                <div className="border-t border-vibe-brown/20 pt-2 sm:pt-3">
                  <div className="flex justify-between text-base sm:text-lg font-bold text-vibe-brown">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>
              </div>
              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="w-full inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-vibe-cookie text-vibe-brown font-semibold rounded-full hover:bg-vibe-accent transition-colors duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                Proceed to Checkout
              </Link>
              {/* Continue Shopping */}
              <Link
                href="/products"
                className="w-full inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 mt-3 sm:mt-4 border-2 border-vibe-cookie text-vibe-brown font-semibold rounded-full hover:bg-vibe-cookie transition-colors duration-300 text-sm sm:text-base"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default CartPage 