'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '../context/CartContext'
import { useToast } from './Toaster'
import { ShoppingCart, Search, Menu, X, User, Heart, LogOut } from 'lucide-react'
import { buildApiUrl } from '../utils/api'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { getCartCount } = useCart()
  const { addToast } = useToast()
  const router = useRouter()

  const cartCount = getCartCount()

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setIsMenuOpen(false)
    }
  }

  const handleUserClick = () => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      router.push('/login')
      return
    }
    
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    
    fetch(buildApiUrl('/auth/me'), {
      headers: getAuthHeaders()
    })
      .then(async (r) => {
        // Handle non-OK responses
        if (!r.ok) {
          // Clear token on auth/server errors
          if (r.status === 401 || r.status === 500) {
            localStorage.removeItem('token')
          }
          throw new Error('Authentication failed')
        }
        return r.json()
      })
      .then(data => {
        if (data.success) {
          const role = data.data?.role || data.data?.user?.role
          if (role === 'admin') {
            router.push('/admin')
          } else {
            router.push('/profile')
          }
        } else {
          localStorage.removeItem('token')
          router.push('/login')
        }
      })
      .catch(() => {
        localStorage.removeItem('token')
        router.push('/login')
      })
  }

  const handleWishlistClick = () => {
    router.push('/wishlist')
  }

  const handleCartClick = () => {
    router.push('/cart')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-md border border-white/20 rounded-full shadow-lg shadow-black/5">
          <div className="flex justify-between items-center h-16 px-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 transition-all duration-200 rounded-full overflow-hidden bg-white/50 backdrop-blur-sm border border-white/30 mx-2">
                <Image
                  src="/images/logo.jpeg"
                  alt="VIBE BITES"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <span className="ml-2 text-vibe-brown font-bold text-sm sm:text-base md:text-lg hidden sm:block whitespace-nowrap">
                VIBE BITES
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              <Link
                href="/"
                className="text-vibe-brown hover:text-vibe-cookie hover:bg-white/50 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-vibe-brown hover:text-vibe-cookie hover:bg-white/50 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
              >
                Products
              </Link>
              <Link
                href="/about"
                className="text-vibe-brown hover:text-vibe-cookie hover:bg-white/50 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-vibe-brown hover:text-vibe-cookie hover:bg-white/50 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:block flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-vibe-brown" />
              </div>
              <input
                type="text"
                placeholder="Search snacks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 border border-white/30 rounded-full text-sm bg-white/50 backdrop-blur-sm text-vibe-brown placeholder-vibe-brown/70 focus:outline-none focus:ring-2 focus:ring-vibe-cookie/50 focus:border-vibe-cookie/50 transition-all duration-200"
              />
            </form>
          </div>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-2">
            <button 
              onClick={handleUserClick}
              className="text-vibe-brown hover:text-vibe-cookie hover:bg-white/50 p-2.5 rounded-full transition-all duration-200"
              title="User Profile"
            >
              <User className="h-6 w-6" />
            </button>
            <button 
              onClick={handleWishlistClick}
              className="text-vibe-brown hover:text-vibe-cookie hover:bg-white/50 p-2.5 rounded-full transition-all duration-200"
              title="Wishlist"
            >
              <Heart className="h-6 w-6" />
            </button>
            <button
              onClick={handleCartClick}
              className="text-vibe-brown hover:text-vibe-cookie hover:bg-white/50 p-2.5 rounded-full transition-all duration-200 relative"
              title="Shopping Cart"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-vibe-cookie text-vibe-brown text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-vibe-brown hover:text-vibe-cookie hover:bg-white/50 p-2.5 rounded-full transition-all duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4">
          <div className="bg-white/90 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg shadow-black/5 px-4 pt-4 pb-4 space-y-2">
            <Link
              href="/"
              className="text-vibe-brown hover:text-vibe-cookie hover:bg-white/50 block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-vibe-brown hover:text-vibe-cookie hover:bg-white/50 block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              href="/about"
              className="text-vibe-brown hover:text-vibe-cookie hover:bg-white/50 block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-vibe-brown hover:text-vibe-cookie hover:bg-white/50 block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            
            {/* Mobile Search */}
            <div className="px-4 py-2">
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-vibe-brown" />
                </div>
                <input
                  type="text"
                  placeholder="Search snacks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 border border-white/30 rounded-full text-sm bg-white/50 backdrop-blur-sm text-vibe-brown placeholder-vibe-brown/70 focus:outline-none focus:ring-2 focus:ring-vibe-cookie/50 focus:border-vibe-cookie/50 transition-all duration-200"
                />
              </form>
            </div>

            {/* Mobile Icons */}
            <div className="flex items-center justify-center space-x-6 px-4 py-3">
              <button 
                onClick={() => {
                  handleUserClick()
                  setIsMenuOpen(false)
                }}
                className="text-vibe-brown hover:text-vibe-cookie hover:bg-white/50 p-3 rounded-full transition-all duration-200"
                title="User Profile"
              >
                <User className="h-6 w-6" />
              </button>
              <button 
                onClick={() => {
                  handleWishlistClick()
                  setIsMenuOpen(false)
                }}
                className="text-vibe-brown hover:text-vibe-cookie hover:bg-white/50 p-3 rounded-full transition-all duration-200"
                title="Wishlist"
              >
                <Heart className="h-6 w-6" />
              </button>
              <button
                onClick={() => {
                  handleCartClick()
                  setIsMenuOpen(false)
                }}
                className="text-vibe-brown hover:text-vibe-cookie hover:bg-white/50 p-3 rounded-full transition-all duration-200 relative"
                title="Shopping Cart"
              >
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-vibe-cookie text-vibe-brown text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Logout Button */}
            {(typeof window !== 'undefined' && typeof localStorage !== 'undefined' && localStorage.getItem('token')) && (
              <div className="px-4 py-2 border-t border-white/20">
                <button
                  onClick={() => {
                    router.push('/logout')
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center gap-2 w-full px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50/50 rounded-xl transition-all duration-200 font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
