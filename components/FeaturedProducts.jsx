"use client"
import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../utils/api';


const FeaturedProducts = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-[#D9A066]">
        Featured Products
      </h2>

  {/* Fetch featured products from backend API */}
  <FeaturedProductsList />
    </section>
  );
};


// Client-side component to fetch and display featured products
function FeaturedProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${getApiUrl()}/products?featured=true`);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        // Filter products with featured field true
        const featured = (data.data.products || []).filter(p => p.featured);
        setProducts(featured);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) {
    return <div className="text-center py-8 text-vibe-brown">Loading featured products...</div>;
  }
  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }
  if (!products.length) {
    return <div className="text-center py-8 text-vibe-brown">No featured products found.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
      {products.map((product, idx) => (
        <Link 
          key={product._id || product.id}
          href={`/product/${product._id || product.id}`}
          className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col group"
        >
          <div className="relative w-full h-48 sm:h-56 md:h-64">
            <Image
              src={product.image || '/images/hero-snack-1.jpg'}
              alt={product.name}
              fill
              style={{ objectFit: 'cover' }}
              priority={idx === 0}
              className="group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.src = '/images/hero-snack-1.jpg'
              }}
            />
          </div>
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-lg sm:text-xl font-semibold mb-2 group-hover:text-[#D9A066] transition-colors">{product.name}</h3>
            <p className="text-[#D9A066] font-bold text-xl mb-4">₹{product.sizes && product.sizes.length ? product.sizes[0].price : product.price}</p>
            <button className="mt-auto w-full bg-[#D9A066] hover:bg-[#c48841] text-white py-2 rounded-md font-semibold transition">
              Shop Now
            </button>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default FeaturedProducts;
