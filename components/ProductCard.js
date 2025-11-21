'use client'

import React, { useState, useEffect, useRef } from 'react'
import SafeImage from './SafeImage'
import Link from 'next/link'
import { ShoppingCart, Heart, Star, Play } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useToast } from './Toaster'
import { useWishlist } from '../context/WishlistContext'

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]?.size || '')
  const [quantity, setQuantity] = useState(1)
  const [showVideo, setShowVideo] = useState(false)
  const [carouselIdx, setCarouselIdx] = useState(0)
  const autoPlayRef = useRef(null)
  const selectedSizeObj = product.sizes.find(size => size.size === selectedSize) || {}
  const maxStock = selectedSizeObj.stock ?? 99
  const { addToCart } = useCart()
  const { addToast } = useToast()
  const { addToWishlist, removeFromWishlist, items: wishlistItems } = useWishlist()
  
  // Check if product is in wishlist
  const isInWishlist = wishlistItems.some(item => item.id === product.id)

  // Get all product images
  const allImages = product.images && Array.isArray(product.images) && product.images.length > 0
    ? product.images.filter(img => img && img.trim())
    : product.image 
      ? [product.image]
      : ['/images/hero-snack-1.jpg']
  
  const totalImages = allImages.length

  // Auto-play carousel
  useEffect(() => {
    if (totalImages <= 1 || showVideo) return

    autoPlayRef.current = setInterval(() => {
      setCarouselIdx((prev) => (prev + 1) % totalImages)
    }, 3000) // Change image every 3 seconds

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [totalImages, showVideo])

  const handleAddToCart = () => {
    if (!selectedSize) {
      addToast('Please select a size', 'error')
      return
    }
    if (selectedSizeObj.stock === 0) {
      addToast('Selected size is out of stock', 'error')
      return
    }
    if (quantity > maxStock) {
      addToast(`Only ${maxStock} left in stock`, 'error')
      setQuantity(maxStock)
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
      addToWishlist({ 
        id: product.id, 
        name: product.name, 
        image: product.image,
        price: selectedSizeObj.price || product.sizes[0]?.price || 0
      })
      addToast(`${product.name} added to wishlist`, 'success')
    }
  }

  const currentPrice = selectedSizeObj.price || 0

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Product Image */}
          <Link href={`/product/${product.id}`} className="relative w-full md:w-64 h-64 md:h-auto flex-shrink-0">
            {showVideo && product.video ? (
              <video
                src={product.video}
                autoPlay
                muted
                loop
                className="w-full h-full object-cover"
                onError={() => setShowVideo(false)}
              />
            ) : (
              <div className="relative w-full h-full bg-transparent">
                <SafeImage
                  src={allImages[carouselIdx]}
                alt={product.name}
                fill
                  fallback="/images/hero-snack-1.jpg"
                  className="object-cover transition-opacity duration-500"
                  style={{ backgroundColor: 'transparent' }}
                />
                {/* Carousel Indicators */}
                {totalImages > 1 && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {allImages.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          carouselIdx === idx 
                            ? 'bg-white w-4' 
                            : 'bg-white/50 w-1.5'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
            <div className="absolute top-4 right-4">
              <button 
                onClick={handleWishlistToggle}
                className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
              >
                <Heart 
                  className={`h-5 w-5 transition-colors ${
                    isInWishlist 
                      ? 'text-red-500 fill-current' 
                      : 'text-vibe-brown hover:text-red-500'
                  }`} 
                />
              </button>
            </div>
            {product.featured && (
              <div className="absolute top-4 left-4">
            <div className="flex items-center bg-vibe-cookie text-vibe-brown px-2 py-1 rounded-full text-xs font-semibold">
                  <Star className="h-3 w-3 fill-current mr-1" />
                  Featured
                </div>
              </div>
            )}
            {product.video && !showVideo && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    setShowVideo(true)
                  }}
                  className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors"
                >
                  <Play className="h-6 w-6 text-vibe-brown fill-current" />
                </button>
              </div>
            )}
          </Link>

          {/* Product Info */}
          <div className="flex-1 p-6">
            <div className="mb-2">
              <span className="text-xs text-vibe-brown/60 uppercase tracking-wide">
                {product.category}
              </span>
            </div>
            
            <Link href={`/product/${product.id}`} className="block">
              <h3 className="text-xl font-semibold text-vibe-brown mb-2 hover:text-vibe-cookie transition-colors">
                {product.name}
              </h3>
            </Link>
            
            <p className="text-vibe-brown/70 mb-4">
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
                    disabled={size.stock === 0}
                  >
                    {size.size} {size.stock === 0 && <span className="text-red-500 ml-1">(Out of Stock)</span>}
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
                {selectedSizeObj.stock !== undefined && (
                  <span className="text-xs text-vibe-brown/60 ml-2">Stock: {selectedSizeObj.stock}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={maxStock}
                  value={quantity}
                  onChange={e => {
                    const val = Number(e.target.value)
                    if (val > maxStock) {
                      setQuantity(maxStock)
                      addToast(`Only ${maxStock} left in stock`, 'error')
                    } else {
                      setQuantity(Math.max(1, val))
                    }
                  }}
                  className="w-16 px-2 py-1 border rounded text-vibe-brown"
                  disabled={selectedSizeObj.stock === 0}
                />
                <button
                  onClick={handleAddToCart}
                  className="flex items-center justify-center px-6 py-2 bg-vibe-cookie text-vibe-brown rounded-full hover:bg-vibe-accent transition-colors"
                  disabled={selectedSizeObj.stock === 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {selectedSizeObj.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Grid view (default)
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Product Image */}
      <Link href={`/product/${product.id}`} className="relative h-64 overflow-hidden block">
        {showVideo && product.video ? (
          <video
            src={product.video}
            autoPlay
            muted
            loop
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setShowVideo(false)}
          />
        ) : (
          <div className="relative w-full h-full bg-transparent">
            <SafeImage
              src={allImages[carouselIdx]}
            alt={product.name}
            fill
              fallback="/images/hero-snack-1.jpg"
              className="object-cover group-hover:scale-105 transition-all duration-500"
              style={{ backgroundColor: 'transparent' }}
            />
            {/* Carousel Indicators */}
            {totalImages > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {allImages.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      carouselIdx === idx 
                        ? 'bg-white w-4' 
                        : 'bg-white/50 w-1.5'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        <div className="absolute top-4 right-4">
          <button 
            onClick={handleWishlistToggle}
            className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
          >
            <Heart 
              className={`h-5 w-5 transition-colors ${
                isInWishlist 
                  ? 'text-red-500 fill-current' 
                  : 'text-vibe-brown hover:text-red-500'
              }`} 
            />
          </button>
        </div>
        {product.featured && (
          <div className="absolute top-4 left-4">
            <div className="flex items-center bg-vibe-cookie text-vibe-brown px-2 py-1 rounded-full text-xs font-semibold">
              <Star className="h-3 w-3 fill-current mr-1" />
              Featured
            </div>
          </div>
        )}
        {product.video && !showVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <button
              onClick={(e) => {
                e.preventDefault()
                setShowVideo(true)
              }}
              className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors"
            >
              <Play className="h-6 w-6 text-vibe-brown fill-current" />
            </button>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-6">
        <div className="mb-2">
          <span className="text-xs text-vibe-brown/60 uppercase tracking-wide">
            {product.category}
          </span>
        </div>
        
        <Link href={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-vibe-brown mb-2 hover:text-vibe-cookie transition-colors">
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

export default ProductCard 