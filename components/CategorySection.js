'use client'

import React, { useState, useEffect } from 'react'
import SafeImage from './SafeImage'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { buildApiUrl } from '../utils/api'


const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fallback categories in case API fails
    const fallbackCategories = [
      {
        _id: '1',
        name: 'Healthy Snacks',
        description: 'Nutritious and delicious snacks for a healthy lifestyle',
        image: '/images/hero-snack-1.jpg'
      },
      {
        _id: '2', 
        name: 'Protein Bars',
        description: 'High protein bars for energy and muscle recovery',
        image: '/images/hero-snack-2.jpg'
      },
      {
        _id: '3',
        name: 'Trail Mix',
        description: 'Perfect blend of nuts, dried fruits and seeds',
        image: '/images/hero-snack-3.jpg'
      },
      {
        _id: '4',
        name: 'Energy Bites',
        description: 'Quick energy bites made with natural ingredients',
        image: '/images/hero-snack-1.jpg'
      },
      {
        _id: '5',
        name: 'Granola',
        description: 'Crunchy granola with oats, nuts and honey',
        image: '/images/hero-snack-2.jpg'
      },
      {
        _id: '6',
        name: 'Dried Fruits',
        description: 'Natural dried fruits without added sugar',
        image: '/images/hero-snack-3.jpg'
      }
    ];

    async function fetchCategories() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(buildApiUrl('/categories'));
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data = await res.json();
        const apiCategories = (data.data.categories || []).map(cat => {
          // Handle image URLs - convert relative paths to full URLs
          let image = cat.image || '/images/hero-snack-1.jpg';
          if (image && image.startsWith('/uploads/')) {
            // Use relative path for images - backend will serve them through Vercel proxy
            image = buildApiUrl(image);
          }
          return { ...cat, image };
        });
        
        // If API returns categories, use them; otherwise use fallback
        if (apiCategories.length > 0) {
          setCategories(apiCategories);
        } else {
          setCategories(fallbackCategories);
        }
      } catch (err) {
        console.log('API failed, using fallback categories:', err.message);
        setCategories(fallbackCategories);
        setError(null); // Don't show error, just use fallback
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-vibe-brown mb-4">
            Discover Our Categories
          </h2>
          <p className="text-lg text-vibe-brown/70 max-w-2xl mx-auto">
            Explore our diverse range of healthy snacks, each crafted with care and packed with nutrition
          </p>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="text-center py-8 text-vibe-brown">Loading categories...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category._id || category.id}
                href={`/products?category=${encodeURIComponent(category.name)}`}
                className="group relative overflow-hidden rounded-2xl bg-vibe-bg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="relative h-64">
                  <SafeImage
                    src={category.image}
                    alt={category.name}
                    fill
                    fallback="/images/hero-snack-1.jpg"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-vibe-brown/60 via-transparent to-transparent"></div>
                  {/* Category Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {category.name}
                    </h3>
                    <p className="text-white/90 text-sm mb-4">
                      {category.description || ''}
                    </p>
                    <div className="flex items-center text-white/90 group-hover:text-white transition-colors">
                      <span className="text-sm font-medium">Explore</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-8 py-4 bg-vibe-cookie text-vibe-brown font-semibold rounded-full hover:bg-vibe-accent transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            View All Products
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CategorySection 