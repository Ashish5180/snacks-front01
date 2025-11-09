'use client'

import React, { useState, useEffect } from 'react'
import SafeImage from './SafeImage'
import Link from 'next/link'
import { ShoppingCart, Star, Heart } from 'lucide-react'
import { buildApiUrl } from '../utils/api'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useToast } from './Toaster'

const ProductCard = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]?.size || '')
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, items: wishlistItems } = useWishlist()
  const { addToast } = useToast()
  
  // Check if product is in wishlist
  const isInWishlist = wishlistItems.some(item => item.id === product.id)

  const handleAddToCart = () => {
    if (!selectedSize) {
      addToast('Please select a size', 'error')
      return
    }
    
    addToCart(product, selectedSize, quantity)
    addToast(`${product.name} added to cart!`, 'success')
    setQuantity(1)
  }

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id)
      addToast(`${product.name} removed from wishlist`, 'success')
    } else {
      const selectedSizeObj = product.sizes.find(size => size.size === selectedSize) || product.sizes[0]
      addToWishlist({ 
        id: product.id, 
        name: product.name, 
        image: product.image,
        price: selectedSizeObj?.price || 0
      })
      addToast(`${product.name} added to wishlist`, 'success')
    }
  }

  const currentPrice = product.sizes.find(size => size.size === selectedSize)?.price || 0

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Product Image */}
      <Link href={`/product/${product._id || product.id}`} className="relative h-64 overflow-hidden block">
        <SafeImage
          src={product.image}
          alt={product.name}
          fill
          fallback="/images/hero-snack-1.jpg"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <button 
            onClick={handleWishlistToggle}
            className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
          >
            <Heart className={`h-5 w-5 transition-colors ${
              isInWishlist 
                ? 'text-red-500 fill-current' 
                : 'text-vibe-brown hover:text-red-500'
            }`} />
          </button>
        </div>
        <div className="absolute top-4 left-4">
          <div className="flex items-center bg-vibe-cookie text-vibe-brown px-2 py-1 rounded-full text-xs font-semibold">
            <Star className="h-3 w-3 fill-current mr-1" />
            Featured
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-6">
        <div className="mb-2">
          <span className="text-xs text-vibe-brown/60 uppercase tracking-wide">
            {product.category}
          </span>
        </div>
        
        <Link href={`/product/${product._id || product.id}`}>
          <h3 className="text-lg font-semibold text-vibe-brown mb-2 hover:text-vibe-cookie transition-colors cursor-pointer">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-vibe-brown/70 mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Size Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-vibe-brown mb-2">
            Size
          </label>
          <div className="flex gap-2">
            {product.sizes.map((size) => (
              <button
                key={size.size}
                onClick={() => setSelectedSize(size.size)}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  selectedSize === size.size
                    ? 'bg-vibe-cookie text-vibe-brown border-vibe-cookie'
                    : 'border-vibe-cookie/30 text-vibe-brown hover:border-vibe-cookie'
                }`}
              >
                {size.size}
              </button>
            ))}
          </div>
        </div>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-vibe-brown">
              ₹{currentPrice}
            </span>
            <span className="text-sm text-vibe-brown/60 ml-2">
              / {selectedSize}
            </span>
          </div>
          
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center px-4 py-2 bg-vibe-cookie text-vibe-brown rounded-full hover:bg-vibe-accent transition-colors"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add
          </button>
        </div>
      </div>
    </div>
  )
}

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(buildApiUrl('/products?featured=true'))
        if (!res.ok) throw new Error('Failed to fetch featured products')
        const data = await res.json()
        setFeaturedProducts(data.data.products || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  return (
    <section className="py-20 bg-vibe-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-vibe-brown mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-vibe-brown/70 max-w-2xl mx-auto">
            Our most loved snacks, carefully selected for their amazing taste and nutritional value
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center text-vibe-brown">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.length === 0 ? (
              <div className="col-span-full text-center text-vibe-brown/60">No featured products found.</div>
            ) : (
              featuredProducts.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))
            )}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-8 py-4 bg-vibe-cookie text-vibe-brown font-semibold rounded-full hover:bg-vibe-accent transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts 