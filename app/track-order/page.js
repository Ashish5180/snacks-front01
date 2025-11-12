'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useToast } from '../../components/Toaster'
import { Search, Package, CheckCircle, Clock, Truck, MapPin, Loader2 } from 'lucide-react'
import { getApiUrl } from '../../utils/api'

function TrackOrderContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { addToast } = useToast()
  const [orderId, setOrderId] = useState('')
  const [orderData, setOrderData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

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

  useEffect(() => {
    const queryOrderId = searchParams.get('orderId')
    if (queryOrderId) {
      setOrderId(queryOrderId)
    }
  }, [searchParams])

  const handleTrackOrder = async (e) => {
    e.preventDefault()
    
    if (!orderId.trim()) {
      addToast('Please enter an order ID', 'error')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${getApiUrl()}/orders/${orderId}/track`)
      const data = await response.json()

      if (response.ok && data.success) {
        setOrderData(data.data)
      } else {
        addToast(data.message || 'Order not found', 'error')
        setOrderData(null)
      }
    } catch (error) {
      console.error('Track order error:', error)
      addToast('Network error. Please try again.', 'error')
      setOrderData(null)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status, completed) => {
    const iconClass = `h-6 w-6 ${completed ? 'text-green-600' : 'text-gray-400'}`
    
    switch (status) {
      case 'pending':
        return <Clock className={iconClass} />
      case 'confirmed':
        return <CheckCircle className={iconClass} />
      case 'processing':
        return <Package className={iconClass} />
      case 'shipped':
        return <Truck className={iconClass} />
      case 'delivered':
        return <MapPin className={iconClass} />
      default:
        return <Clock className={iconClass} />
    }
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleCancelRequest = async (orderId) => {
    const reason = prompt('Please select a reason for cancellation:\n1. Changed mind\n2. Wrong item\n3. Defective\n4. Late delivery\n5. Other\n\nEnter the number (1-5):')
    
    if (!reason || !['1', '2', '3', '4', '5'].includes(reason)) {
      addToast('Please select a valid reason', 'error')
      return
    }

    const reasonMap = {
      '1': 'changed_mind',
      '2': 'wrong_item', 
      '3': 'defective',
      '4': 'late_delivery',
      '5': 'other'
    }

    const description = prompt('Please provide additional details (optional):') || ''

    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        addToast('Please login to cancel order', 'error')
        return
      }
      
      const token = localStorage.getItem('token')
      const response = await fetch(`${getApiUrl()}/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        headers: getAuthHeaders(),
        body: JSON.stringify({
          reason: reasonMap[reason],
          description
        })
      })

      if (response.ok) {
        addToast('Order cancelled successfully', 'success')
        // Refresh order data
        handleTrackOrder({ preventDefault: () => {} })
      } else {
        const data = await response.json()
        addToast(data.message || 'Error cancelling order', 'error')
      }
    } catch (error) {
      console.error('Cancel order error:', error)
      addToast('Error cancelling order', 'error')
    }
  }



  return (
    <div className="min-h-screen bg-vibe-bg">
      <Navbar />
      
      <div className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-vibe-brown">Track Your Order</h1>
          <p className="mt-2 text-vibe-brown/70">Enter your order ID to track your package</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <form onSubmit={handleTrackOrder} className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="orderId" className="block text-sm font-medium text-vibe-brown mb-2">
                Order ID
              </label>
              <input
                type="text"
                id="orderId"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter your order ID (e.g., VB-2024-001)"
                className="w-full px-4 py-2 border border-vibe-cookie/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibe-cookie"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-vibe-cookie text-white rounded-lg hover:bg-vibe-brown focus:outline-none focus:ring-2 focus:ring-vibe-cookie disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Track
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Order Tracking Results */}
        {orderData && (
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-vibe-brown mb-4">Order Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-vibe-brown/70">Order Number</p>
                  <p className="font-semibold text-vibe-brown">{orderData.order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-vibe-brown/70">Order Total</p>
                  <p className="font-semibold text-vibe-brown">₹{orderData.order.total}</p>
                </div>
                <div>
                  <p className="text-sm text-vibe-brown/70">Order Date</p>
                  <p className="font-semibold text-vibe-brown">{formatDate(orderData.order.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-vibe-brown/70">Status</p>
                  <p className="font-semibold text-vibe-brown capitalize">{orderData.order.orderStatus}</p>
                </div>
              </div>

              {orderData.order.shippingDetails?.trackingNumber && (
                <div className="mt-4 p-4 bg-vibe-bg rounded-lg">
                  <p className="text-sm text-vibe-brown/70">Tracking Number</p>
                  <p className="font-semibold text-vibe-brown">{orderData.order.shippingDetails.trackingNumber}</p>
                  {orderData.order.shippingDetails.carrier && (
                    <>
                      <p className="text-sm text-vibe-brown/70 mt-2">Carrier</p>
                      <p className="font-semibold text-vibe-brown">{orderData.order.shippingDetails.carrier}</p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cancel/Return Actions */}
            {orderData && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-vibe-brown mb-4">Order Actions</h2>
                <div className="flex flex-wrap gap-4">
                  {/* Cancel Order Button */}
                  {['pending', 'confirmed', 'processing'].includes(orderData.order.orderStatus) && 
                   !orderData.order.cancelRequest && (
                    <button
                      onClick={() => handleCancelRequest(orderData.order._id)}
                      className="px-6 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                    >
                      Request Cancellation
                    </button>
                  )}
                  
                  
                  {/* Show cancel status */}
                  {orderData.order.cancelRequest && (
                    <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                      ✅ Order Cancelled - {orderData.order.cancelRequest.reason}
                    </div>
                  )}
                </div>
              </div>
            )}


            {/* Order Timeline */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-vibe-brown mb-6">Order Timeline</h2>
              
              <div className="space-y-6">
                {orderData.timeline.map((step, index) => (
                  <div key={step.status} className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                      step.completed ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      {getStatusIcon(step.status, step.completed)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className={`text-lg font-medium ${
                          step.completed ? 'text-vibe-brown' : 'text-gray-500'
                        }`}>
                          {step.title}
                        </h3>
                        {step.timestamp && (
                          <span className="text-sm text-vibe-brown/70">
                            {formatDate(step.timestamp)}
                          </span>
                        )}
                      </div>
                      <p className={`mt-1 text-sm ${
                        step.completed ? 'text-vibe-brown/70' : 'text-gray-400'
                      }`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-vibe-brown mb-4">Shipping Address</h2>
              <div className="text-vibe-brown">
                <p className="font-semibold">
                  {orderData.order.shippingAddress.firstName} {orderData.order.shippingAddress.lastName}
                </p>
                <p>{orderData.order.shippingAddress.address}</p>
                <p>
                  {orderData.order.shippingAddress.city}, {orderData.order.shippingAddress.state} - {orderData.order.shippingAddress.pincode}
                </p>
                <p className="mt-2">Phone: {orderData.order.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-vibe-brown mb-4">Order Items</h2>
              <div className="space-y-4">
                {orderData.order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-vibe-bg rounded-lg">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                          width={64}
                          height={64}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-vibe-brown">{item.name}</h4>
                      <p className="text-sm text-vibe-brown/70">
                        Size: {item.size} | Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-vibe-brown">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

const TrackOrderPage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-vibe-bg text-vibe-brown">Loading...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}

export default TrackOrderPage
