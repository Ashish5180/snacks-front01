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
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          const role = data.data.role
            || data.data.user?.role
          if (role === 'admin') {
            router.push('/admin')
          } else {
            router.push('/profile')
          }
        } else {
          router.push('/login')
        }
      })
      .catch(() => router.push('/login'))
  }

  const handleWishlistClick = () => {
    router.push('/wishlist')
  }

  const handleCartClick = () => {
    router.push('/cart')
  }

  return (
    <nav className="bg-vibe-bg border-b-2 border-vibe-cookie sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="relative w-36 h-14 sm:w-44 sm:h-16 md:w-52 md:h-20 transition-all duration-200">
                <Image
                  src="/images/logo.jpeg"
                  alt="VIBE BITES"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="ml-2 text-vibe-brown font-bold text-lg sm:text-xl md:text-2xl hidden sm:block whitespace-nowrap">
                VIBE BITES
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                href="/"
                className="text-vibe-brown hover:text-vibe-cookie px-3 py-2 rounded-md text-sm font-medium transition-colors relative z-50"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-vibe-brown hover:text-vibe-cookie px-3 py-2 rounded-md text-sm font-medium transition-colors relative z-50"
              >
                Products
              </Link>
              <Link
                href="/about"
                className="text-vibe-brown hover:text-vibe-cookie px-3 py-2 rounded-md text-sm font-medium transition-colors relative z-50"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-vibe-brown hover:text-vibe-cookie px-3 py-2 rounded-md text-sm font-medium transition-colors relative z-50"
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
                className="block w-full pl-10 pr-3 py-2 border border-vibe-cookie rounded-full text-sm bg-white text-vibe-brown placeholder-vibe-brown focus:outline-none focus:ring-2 focus:ring-vibe-cookie focus:border-transparent"
              />
            </form>
          </div>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={handleUserClick}
              className="text-vibe-brown hover:text-vibe-cookie p-2 rounded-full transition-colors"
              title="User Profile"
            >
              <User className="h-6 w-6" />
            </button>
            <button 
              onClick={handleWishlistClick}
              className="text-vibe-brown hover:text-vibe-cookie p-2 rounded-full transition-colors"
              title="Wishlist"
            >
              <Heart className="h-6 w-6" />
            </button>
            <button
              onClick={handleCartClick}
              className="text-vibe-brown hover:text-vibe-cookie p-2 rounded-full transition-colors relative"
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
              className="text-vibe-brown hover:text-vibe-cookie p-2 rounded-md transition-colors"
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

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-vibe-bg border-t border-vibe-cookie">
            <Link
              href="/"
              className=" relative text-vibe-brown hover:text-vibe-cookie block px-3 py-2 rounded-md text-base font-medium transition-colors z-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-vibe-brown hover:text-vibe-cookie block px-3 py-2 rounded-md text-base font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              href="/about"
              className="text-vibe-brown hover:text-vibe-cookie block px-3 py-2 rounded-md text-base font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-vibe-brown hover:text-vibe-cookie block px-3 py-2 rounded-md text-base font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            
            {/* Mobile Search */}
            <div className="px-3 py-2">
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-vibe-brown" />
                </div>
                <input
                  type="text"
                  placeholder="Search snacks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-vibe-cookie rounded-full text-sm bg-white text-vibe-brown placeholder-vibe-brown focus:outline-none focus:ring-2 focus:ring-vibe-cookie focus:border-transparent"
                />
              </form>
            </div>

            {/* Mobile Icons */}
            <div className="flex items-center space-x-4 px-3 py-2">
              <button 
                onClick={() => {
                  handleUserClick()
                  setIsMenuOpen(false)
                }}
                className="text-vibe-brown hover:text-vibe-cookie p-2 rounded-full transition-colors"
                title="User Profile"
              >
                <User className="h-6 w-6" />
              </button>
              <button 
                onClick={() => {
                  handleWishlistClick()
                  setIsMenuOpen(false)
                }}
                className="text-vibe-brown hover:text-vibe-cookie p-2 rounded-full transition-colors"
                title="Wishlist"
              >
                <Heart className="h-6 w-6" />
              </button>
              <button
                onClick={() => {
                  handleCartClick()
                  setIsMenuOpen(false)
                }}
                className="text-vibe-brown hover:text-vibe-cookie p-2 rounded-full transition-colors relative"
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
              <div className="px-3 py-2 border-t border-vibe-cookie/20">
                <button
                  onClick={() => {
                    router.push('/logout')
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200 font-medium"
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
