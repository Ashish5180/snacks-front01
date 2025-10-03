'use client'

import { useEffect, useState } from 'react'
import { useToast } from './Toaster'

const RazorpayPayment = ({ amount, orderId, onSuccess, onError, userInfo }) => {
  const [loading, setLoading] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)
  const { addToast } = useToast()

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
    // Load Razorpay script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => setRazorpayLoaded(true)
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      addToast('Payment system is loading, please wait...', 'error')
      return
    }

    setLoading(true)

    try {
      
      // Get Razorpay key
      const keyRes = await fetch(`${'/api'}/payments/razorpay/keys`, {
        headers: getAuthHeaders()
      })
      const keyData = await keyRes.json()
      
      if (!keyRes.ok || !keyData.success) {
        throw new Error('Failed to get payment keys')
      }

      // Create Razorpay order
      const orderRes = await fetch(`${'/api'}/payments/razorpay/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        headers: getAuthHeaders(),
        body: JSON.stringify({
          amount: amount,
          currency: 'INR',
          orderId: orderId
        })
      })

      const orderData = await orderRes.json()
      
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.message || 'Failed to create payment order')
      }

      // Razorpay options
      const options = {
        key: keyData.data.keyId,
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: 'VIBE BITES',
        description: 'Order Payment',
        order_id: orderData.data.orderId,
        prefill: {
          name: userInfo?.name || '',
          email: userInfo?.email || '',
          contact: userInfo?.phone || ''
        },
        theme: {
          color: '#D9A25F'
        },
        handler: async function (response) {
          try {
            // Verify payment
            const verifyRes = await fetch(`${'/api'}/payments/razorpay/verify`, {
              method: 'POST',
              headers: {
          'Content-Type': 'application/json'
        },
        headers: getAuthHeaders(),
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature
              })
            })

            const verifyData = await verifyRes.json()
            
            if (verifyRes.ok && verifyData.success) {
              addToast('Payment successful!', 'success')
              onSuccess(response)
            } else {
              throw new Error(verifyData.message || 'Payment verification failed')
            }
          } catch (error) {
            console.error('Payment verification error:', error)
            addToast('Payment verification failed', 'error')
            onError(error)
          }
        },
        modal: {
          ondismiss: function() {
            setLoading(false)
            addToast('Payment cancelled', 'info')
          }
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()

    } catch (error) {
      console.error('Payment error:', error)
      addToast(error.message || 'Payment failed', 'error')
      onError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handlePayment}
      disabled={loading || !razorpayLoaded}
      className="w-full inline-flex items-center justify-center px-6 py-3 bg-vibe-cookie text-vibe-brown font-semibold rounded-full hover:bg-vibe-accent transition-colors duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-vibe-brown mr-2"></div>
          Processing...
        </>
      ) : (
        <>
          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          Pay with Razorpay
        </>
      )}
    </button>
  )
}

export default RazorpayPayment
