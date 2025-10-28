'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useToast } from './Toaster'

const RazorpayPayment = ({ amount, orderId, onSuccess, onError, userInfo }) => {
  const [loading, setLoading] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)
  const [initializing, setInitializing] = useState(false)
  const { addToast } = useToast()
  const razorpayKeyRef = useRef(null)
  const scriptLoadedRef = useRef(false)

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

  // Preload Razorpay script and key
  useEffect(() => {
    const preloadRazorpay = async () => {
      try {
        // Load Razorpay script if not already loaded
        if (!scriptLoadedRef.current) {
          const script = document.createElement('script')
          script.src = 'https://checkout.razorpay.com/v1/checkout.js'
          script.async = true
          script.onload = () => {
            setRazorpayLoaded(true)
            scriptLoadedRef.current = true
          }
          script.onerror = () => {
            console.error('Failed to load Razorpay script')
            addToast('Payment system failed to load', 'error')
          }
          document.head.appendChild(script)
        }

        // Preload Razorpay key
        if (!razorpayKeyRef.current) {
          const keyRes = await fetch(`https://snacks-back01.onrender.com/api/payments/razorpay/keys`, {
            headers: getAuthHeaders()
          })
          const keyData = await keyRes.json()
          
          if (keyRes.ok && keyData.success) {
            razorpayKeyRef.current = keyData.data.keyId
          }
        }
      } catch (error) {
        console.error('Preload error:', error)
      }
    }

    preloadRazorpay()
  }, [addToast])

  const handlePayment = useCallback(async () => {
    if (!razorpayLoaded) {
      addToast('Payment system is loading, please wait...', 'error')
      return
    }

    if (!amount || amount <= 0) {
      addToast('Invalid payment amount', 'error')
      return
    }

    if (!orderId) {
      addToast('Order ID is missing', 'error')
      return
    }

    setLoading(true)
    setInitializing(true)

    try {
      // Use preloaded key or fetch if not available
      let razorpayKey = razorpayKeyRef.current
      if (!razorpayKey) {
        const keyRes = await fetch(`https://snacks-back01.onrender.com/api/payments/razorpay/keys`, {
          headers: getAuthHeaders()
        })
        const keyData = await keyRes.json()
        
        if (!keyRes.ok || !keyData.success) {
          throw new Error('Failed to get payment keys')
        }
        razorpayKey = keyData.data.keyId
        razorpayKeyRef.current = razorpayKey
      }

      // Create Razorpay order
      const orderRes = await fetch(`https://snacks-back01.onrender.com/api/payments/razorpay/create-order`, {
        method: 'POST',
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

      setInitializing(false)

      // Razorpay options with enhanced configuration
      const options = {
        key: razorpayKey,
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
          color: '#D9A25F',
          backdrop_color: '#00000080'
        },
        modal: {
          ondismiss: function() {
            setLoading(false)
            addToast('Payment cancelled', 'info')
          },
          escape: true,
          backdropclose: false
        },
        handler: async function (response) {
          try {
            setLoading(true)
            // Verify payment
            const verifyRes = await fetch(`https://snacks-back01.onrender.com/api/payments/razorpay/verify`, {
              method: 'POST',
              headers: getAuthHeaders(),
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature
              })
            })

            const verifyData = await verifyRes.json()
            
            if (verifyRes.ok && verifyData.success) {
              addToast('Payment successful! Order confirmed.', 'success')
              onSuccess(response)
            } else {
              console.error('Payment verification failed:', verifyData)
              throw new Error(verifyData.message || 'Payment verification failed')
            }
          } catch (error) {
            console.error('Payment verification error:', error)
            addToast('Payment verification failed', 'error')
            onError(error)
          } finally {
            setLoading(false)
          }
        },
        retry: {
          enabled: true,
          max_count: 3
        },
        timeout: 300,
        remember_customer: true
      }

      // Open Razorpay with smooth animation
      const razorpay = new window.Razorpay(options)
      razorpay.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error)
        addToast('Payment failed: ' + response.error.description, 'error')
        setLoading(false)
        onError(response.error)
      })

      razorpay.open()

    } catch (error) {
      console.error('Payment error:', error)
      addToast(error.message || 'Payment failed', 'error')
      onError(error)
      setLoading(false)
      setInitializing(false)
    }
  }, [razorpayLoaded, amount, orderId, userInfo, onSuccess, onError, addToast])

  return (
    <div className="relative">
      <button
        onClick={handlePayment}
        disabled={loading || !razorpayLoaded}
        className="w-full inline-flex items-center justify-center px-6 py-3 bg-vibe-cookie text-vibe-brown font-semibold rounded-full hover:bg-vibe-accent transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
      >
        {loading ? (
          <>
            {initializing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-vibe-brown mr-2"></div>
                Initializing...
              </>
            ) : (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-vibe-brown mr-2"></div>
                Processing...
              </>
            )}
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
      
      {/* Loading overlay for better UX */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm mx-4 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vibe-brown mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-vibe-brown mb-2">
              {initializing ? 'Initializing Payment...' : 'Processing Payment...'}
            </h3>
            <p className="text-sm text-vibe-brown/70">
              {initializing ? 'Please wait while we set up your payment' : 'Please complete the payment in the popup'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default RazorpayPayment
