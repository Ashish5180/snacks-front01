'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Play, ChevronLeft, ChevronRight } from 'lucide-react'

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: "Vibe Every",
      titleHighlight: "Bite",
      description: "At VibeBites, we believe snacking should be both delicious and wholesome. Crafted with care, our snacks are handmade in small batches using natural ingredients—free from artificial additives and unhealthy oils.",
      image: "/images/hero-snack-1.jpg",
      alt: "VIBE BITES Healthy Snacks",
      stats: [
        { label: "Snack Smart" },
        { label: "Handmade Goodness" },
        { label: "Healthy Vibes" }
      ]
    },
    {
      title: "Handmade",
      titleHighlight: "Goodness",
      description: "Every bite is packed with goodness, offering you a healthier way to satisfy your cravings while keeping the authentic taste of traditional recipes alive. Experience the difference of artisanal quality.",
      image: "/images/hero-snack-1.jpg",
      alt: "Handmade Natural Snacks",
      stats: [
        { label: "100% Natural" },
        { label: "No Preservatives" },
        { label: "Small Batches" }
      ]
    },
    {
      title: "Premium",
      titleHighlight: "Quality",
      description: "From farm to your table, we ensure the highest quality ingredients. Our commitment to excellence means every product meets our strict standards for taste, nutrition, and sustainability.",
      image: "/images/hero-snack-1.jpg",
      alt: "Premium Quality Snacks",
      stats: [
        { label: "Farm Fresh" },
        { label: "Quality Tested" },
        { label: "Sustainably Sourced" }
      ]
    }
  ]

  // Auto carousel functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 3000) // Change slide every 3 seconds

    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }
  return (
    <section className="relative bg-gradient-to-br from-vibe-bg via-vibe-cookie/20 to-vibe-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-vibe-brown mb-6">
              {slides[currentSlide].title}{' '}
              <span className="text-vibe-cookie">{slides[currentSlide].titleHighlight}</span>
            </h1>
            <p className="text-lg md:text-xl text-vibe-brown/80 mb-8 max-w-2xl mx-auto lg:mx-0">
              {slides[currentSlide].description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-8 py-4 bg-vibe-cookie text-vibe-brown font-semibold rounded-full hover:bg-vibe-brown hover:text-white transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 max-w-md mx-auto lg:mx-0">
              {slides[currentSlide].stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-lg font-bold text-vibe-cookie">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative h-96 lg:h-[500px] lg:w-[800px] rounded-2xl overflow-hidden shadow-2xl mx-auto lg:mx-0">
              <Image
                src={slides[currentSlide].image}
                alt={slides[currentSlide].alt}
                fill
                className="object-cover transition-all duration-500"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-vibe-brown/20 to-transparent"></div>
              
              {/* Navigation Arrows - Positioned better for the image */}
              <button
                onClick={prevSlide}
                className="absolute left-2 lg:left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 lg:p-3 shadow-xl transition-all duration-200 hover:scale-110 z-10"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-5 w-5 lg:h-6 lg:w-6 text-vibe-brown" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 lg:right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 lg:p-3 shadow-xl transition-all duration-200 hover:scale-110 z-10"
                aria-label="Next slide"
              >
                <ChevronRight className="h-5 w-5 lg:h-6 lg:w-6 text-vibe-brown" />
              </button>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -left-4 bg-white rounded-full p-4 shadow-lg">
              <div className="w-16 h-16 bg-vibe-cookie rounded-full flex items-center justify-center">
                <span className="text-vibe-brown font-bold text-sm">100%</span>
              </div>
              <div className="text-xs text-vibe-brown mt-1 text-center">Natural</div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-white rounded-full p-4 shadow-lg">
              <div className="w-16 h-16 bg-vibe-cookie rounded-full flex items-center justify-center">
                <span className="text-vibe-brown font-bold text-sm">0g</span>
              </div>
              <div className="text-xs text-vibe-brown mt-1 text-center">Trans Fat</div>
            </div>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center mt-8 lg:mt-12 space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 border-2 ${
                index === currentSlide
                  ? 'bg-vibe-cookie border-vibe-cookie scale-125 shadow-lg'
                  : 'bg-transparent border-vibe-brown/40 hover:border-vibe-brown/70 hover:bg-vibe-brown/20'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-20 left-10 w-20 h-20 bg-vibe-cookie rounded-full"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-vibe-cookie rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-vibe-cookie rounded-full"></div>
        <div className="absolute bottom-40 right-10 w-24 h-24 bg-vibe-cookie rounded-full"></div>
      </div>
    </section>
  )
}

export default HeroSection 