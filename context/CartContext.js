'use client'

import { createContext, useContext, useReducer, useEffect, useState } from 'react'
import { buildApiUrl } from '../utils/api'

const CartContext = createContext()

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_CART':
      return {
        ...state,
        ...action.payload
      }
    case 'ADD_ITEM': {
      const existingItem = state.items.find(
        item => item.id === action.payload.id && item.selectedSize === action.payload.selectedSize
      )
      // Get max stock from payload (should be passed from frontend)
      const maxStock = action.payload.maxStock ?? 99
      if (existingItem) {
        const newQuantity = Math.min(existingItem.quantity + action.payload.quantity, maxStock)
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id && item.selectedSize === action.payload.selectedSize
              ? { ...item, quantity: newQuantity }
              : item
          )
        }
      } else {
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: Math.min(action.payload.quantity, maxStock) }]
        }
      }
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(
          item => !(item.id === action.payload.id && item.selectedSize === action.payload.selectedSize)
        )
      }

    case 'UPDATE_QUANTITY': {
      // Get max stock from payload (should be passed from frontend)
      const maxStock = action.payload.maxStock ?? 99
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id && item.selectedSize === action.payload.selectedSize
            ? { ...item, quantity: Math.min(action.payload.quantity, maxStock) }
            : item
        )
      }
    }

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        appliedCoupon: null
      }

    case 'APPLY_COUPON':
      return {
        ...state,
        appliedCoupon: action.payload
      }

    case 'REMOVE_COUPON':
      return {
        ...state,
        appliedCoupon: null
      }

    default:
      return state
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    appliedCoupon: null
  })
  const [shippingFee, setShippingFee] = useState(0)
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(500)
  
  // Fetch shipping settings from backend on mount
  useEffect(() => {
    const fetchShippingSettings = async () => {
      try {
        const res = await fetch(buildApiUrl(`/admin/shipping-fee?_=${Date.now()}`), {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store'
        })
        if (res.ok) {
          const data = await res.json()
          setShippingFee(data.shippingFee || 0)
          setFreeShippingThreshold(data.freeShippingThreshold || 500)
        }
      } catch {}
    }
    fetchShippingSettings()
  }, [])

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

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return
    
    const savedCart = localStorage.getItem('vibe-bites-cart')
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart)
      dispatch({ type: 'LOAD_CART', payload: parsedCart })
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return

    // Remove coupon if subtotal drops below minOrderAmount
    if (state.appliedCoupon && typeof state.appliedCoupon.minOrderAmount === 'number') {
      const subtotal = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
      if (subtotal < state.appliedCoupon.minOrderAmount) {
        dispatch({ type: 'REMOVE_COUPON' })
      }
    }

    localStorage.setItem('vibe-bites-cart', JSON.stringify(state))
    // If logged-in, try to sync to server (best-effort)
    fetch(buildApiUrl('/cart/sync'), {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(state)
    }).catch(() => {})
  }, [state])

  const addToCart = (product, selectedSize, quantity = 1) => {
    const sizeObj = product.sizes.find(size => size.size === selectedSize) || {}
    const price = sizeObj.price || 0
    const maxStock = sizeObj.stock ?? 99
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        image: product.image,
        selectedSize,
        price,
        quantity,
        category: product.category,
        maxStock
      }
    })
  }

  const removeFromCart = (id, selectedSize) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: { id, selectedSize }
    })
  }

  const updateQuantity = (id, selectedSize, quantity, maxStock = 99) => {
    if (quantity <= 0) {
      removeFromCart(id, selectedSize)
    } else {
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: { id, selectedSize, quantity, maxStock }
      })
    }
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const getCartTotal = () => {
    const subtotal = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    let discount = 0
    if (state.appliedCoupon) {
      if (state.appliedCoupon.type === 'percentage') {
        if (state.appliedCoupon.category) {
          // Category-specific discount
          const categoryItems = state.items.filter(item => item.category === state.appliedCoupon.category)
          const categoryTotal = categoryItems.reduce((total, item) => total + (item.price * item.quantity), 0)
          discount = (categoryTotal * state.appliedCoupon.discount) / 100
        } else {
          // General discount
          discount = (subtotal * state.appliedCoupon.discount) / 100
        }
      } else if (state.appliedCoupon.type === 'fixed') {
        // Fixed amount discount
        discount = state.appliedCoupon.discount
      }
      
      // Apply max discount limit if specified
      const maxDiscountLimit = state.appliedCoupon.maxDiscount || state.appliedCoupon.maxDiscountAmount
      if (maxDiscountLimit && maxDiscountLimit !== -1 && discount > maxDiscountLimit) {
        discount = maxDiscountLimit
      }
    }
    // Apply shipping fee based on threshold (only if cart is not empty)
    const currentShippingFee = state.items.length > 0 && subtotal < freeShippingThreshold ? shippingFee : 0
    return subtotal - discount + currentShippingFee
  }

  const getShippingCost = () => {
    const subtotal = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    return state.items.length > 0 && subtotal < freeShippingThreshold ? shippingFee : 0
  }

  const applyCoupon = async (couponCode) => {
    try {
      const subtotal = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
      const res = await fetch(buildApiUrl('/coupons/validate'), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ 
          code: couponCode, 
          orderAmount: subtotal, // Use subtotal instead of total for validation
          items: state.items 
        })
      });
      const data = await res.json();
      if (res.ok && data.success && data.data && data.data.coupon) {
        dispatch({
          type: 'APPLY_COUPON',
          payload: { code: couponCode.toUpperCase(), ...data.data.coupon, discountAmount: data.data.discountAmount }
        });
        return { success: true, message: `Coupon ${couponCode.toUpperCase()} applied successfully!` }
      } else {
        return { success: false, message: data.message || 'Invalid coupon code' }
      }
    } catch (error) {
      console.error('Coupon apply error:', error)
      return { success: false, message: 'Network error. Please try again.' }
    }
  }

  const removeCoupon = () => {
    dispatch({ type: 'REMOVE_COUPON' })
  }

  const getCartCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0)
  }

  const value = {
    items: state.items,
    appliedCoupon: state.appliedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    getCartTotal,
    getCartCount,
    shippingFee,
    freeShippingThreshold,
    getShippingCost
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
} 