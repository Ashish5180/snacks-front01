'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useToast } from './Toaster'
import { buildApiUrl } from '../utils/api'

const RazorpayPayment = ({ amount, onSuccess, onError, userInfo, orderPayload }) => {
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const { addToast } = useToast()
  const razorpayKeyRef = useRef(null)
  const razorpayOrderRef = useRef(null)

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

  // Check if Razorpay script is loaded and preload payment data
  useEffect(() => {
    // Check if Razorpay is available (loaded via layout)
    const checkRazorpayScript = () => {
      if (typeof window !== 'undefined' && window.Razorpay) {
        setRazorpayLoaded(true)
        return true
      }
      return false
    }

    // Immediate check
    if (checkRazorpayScript()) {
      return
    }

    // Poll for script if not loaded yet (with timeout)
    const pollInterval = setInterval(() => {
      if (checkRazorpayScript()) {
        clearInterval(pollInterval)
      }
    }, 100)

    // Clear after 5 seconds
    const timeout = setTimeout(() => {
      clearInterval(pollInterval)
      if (!razorpayLoaded) {
        console.error('Razorpay script failed to load')
        addToast('Payment system failed to load. Please refresh the page.', 'error')
      }
    }, 5000)

    return () => {
      clearInterval(pollInterval)
      clearTimeout(timeout)
    }
  }, [razorpayLoaded, addToast])

  // Preload Razorpay key and order when component mounts
  useEffect(() => {
    if (!razorpayLoaded || razorpayKeyRef.current) return

    const preloadPaymentData = async () => {
      try {
        // Fetch Razorpay key
        const keyRes = await fetch(buildApiUrl('/payments/razorpay/keys'), {
          headers: getAuthHeaders()
        })
        const keyData = await keyRes.json()
        
        if (keyRes.ok && keyData.success) {
          razorpayKeyRef.current = keyData.data.keyId
        }

        // Prefetch and cache the order
        const orderRes = await fetch(buildApiUrl('/payments/razorpay/create-order'), {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            amount: amount,
            currency: 'INR',
            // Do not pass our internal orderId; backend accepts optional and will create receipt itself
          })
        })

        const orderData = await orderRes.json()
        
        if (orderRes.ok && orderData.success) {
          razorpayOrderRef.current = orderData.data
        }
      } catch (error) {
        console.error('Preload payment data error:', error)
      }
    }

    preloadPaymentData()
  }, [razorpayLoaded, amount])

  const handlePayment = useCallback(async () => {
    // Immediate feedback
    setIsProcessing(true)
    
    if (!razorpayLoaded) {
      addToast('Payment system is loading, please wait...', 'error')
      setIsProcessing(false)
      return
    }

    if (!amount || amount <= 0) {
      addToast('Invalid payment amount', 'error')
      setIsProcessing(false)
      return
    }

    try {
      // Use cached key or fetch if not available
      let razorpayKey = razorpayKeyRef.current
      if (!razorpayKey) {
        const keyRes = await fetch(buildApiUrl('/payments/razorpay/keys'), {
          headers: getAuthHeaders()
        })
        const keyData = await keyRes.json()
        
        if (!keyRes.ok || !keyData.success) {
          throw new Error('Failed to get payment keys')
        }
        razorpayKey = keyData.data.keyId
        razorpayKeyRef.current = razorpayKey
      }

      // Use cached order or create new one
      let orderData = razorpayOrderRef.current
      if (!orderData) {
        const orderRes = await fetch(buildApiUrl('/payments/razorpay/create-order'), {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            amount: amount,
            currency: 'INR',
            // No internal orderId pre-creation
          })
        })

        const orderResponse = await orderRes.json()
        
        if (!orderRes.ok || !orderResponse.success) {
          throw new Error(orderResponse.message || 'Failed to create payment order')
        }
        
        orderData = orderResponse.data
        razorpayOrderRef.current = orderData
      }

      // Razorpay options with enhanced configuration
      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'VIBE BITES',
        description: 'Order Payment',
        order_id: orderData.orderId,
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
            setIsProcessing(false)
            addToast('Payment cancelled', 'info')
          },
          escape: true,
          backdropclose: false
        },
        handler: async function (response) {
          try {
            setVerifying(true)
            // Verify payment
            const verifyRes = await fetch(buildApiUrl('/payments/razorpay/verify'), {
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
              // After payment verification, create the internal order
              try {
                const createRes = await fetch(buildApiUrl('/orders'), {
                  method: 'POST',
                  headers: getAuthHeaders(),
                  body: JSON.stringify({
                    ...orderPayload,
                    paymentMethod: 'razorpay',
                    razorpay: {
                      orderId: response.razorpay_order_id,
                      paymentId: response.razorpay_payment_id,
                      signature: response.razorpay_signature
                    }
                  })
                })
                const createData = await createRes.json()
                if (createRes.ok && createData.success) {
                  addToast('Payment successful! Order placed.', 'success')
                  onSuccess({ payment: response, order: createData.data.order })
                } else {
                  console.error('Order creation after payment failed:', createData)
                  addToast('Payment done but order creation failed. Contact support.', 'error')
                  onError(createData)
                }
              } catch (orderErr) {
                console.error('Post-payment order creation error:', orderErr)
                addToast('Payment done but order creation failed. Contact support.', 'error')
                onError(orderErr)
              }
            } else {
              console.error('Payment verification failed:', verifyData)
              throw new Error(verifyData.message || 'Payment verification failed')
            }
          } catch (error) {
            console.error('Payment verification error:', error)
            addToast('Payment verification failed', 'error')
            onError(error)
          } finally {
            setVerifying(false)
          }
        },
        retry: {
          enabled: true,
          max_count: 3
        },
        timeout: 300,
        remember_customer: true
      }

      // Open Razorpay directly
      const razorpay = new window.Razorpay(options)
      razorpay.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error)
        setIsProcessing(false)
        addToast('Payment failed: ' + response.error.description, 'error')
        onError(response.error)
      })

      razorpay.open()
      // Reset processing state after opening modal
      setIsProcessing(false)

    } catch (error) {
      console.error('Payment error:', error)
      setIsProcessing(false)
      addToast(error.message || 'Payment failed', 'error')
      onError(error)
    }
  }, [razorpayLoaded, amount, userInfo, orderPayload, onSuccess, onError, addToast])

  return (
    <div className="relative">
      <button
        onClick={handlePayment}
        disabled={!razorpayLoaded || isProcessing || verifying}
        className="w-full inline-flex items-center justify-center px-6 py-3 bg-vibe-cookie text-vibe-brown font-semibold rounded-full hover:bg-vibe-accent transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
      >
        {verifying ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-vibe-brown mr-2"></div>
            Verifying Payment...
          </>
        ) : isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-vibe-brown mr-2"></div>
            Opening Payment Gateway...
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
    </div>
  )
}

export default RazorpayPayment
