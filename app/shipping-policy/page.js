'use client'

import React from 'react'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { ArrowLeft, Truck } from 'lucide-react'

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-vibe-bg">
      <Navbar />
      
      <div className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-vibe-brown/60">
            <li><Link href="/" className="hover:text-vibe-brown">Home</Link></li>
            <li>/</li>
            <li className="text-vibe-brown font-medium">Shipping Policy</li>
          </ol>
        </nav>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-vibe-cookie/20 rounded-full">
              <Truck className="h-8 w-8 text-vibe-brown" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-vibe-brown">Shipping & Delivery Policy</h1>
              <p className="text-lg text-vibe-brown/70 mt-2">Fast and reliable delivery</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-vibe-brown mb-6">Shipping Information</h2>
          <div className="space-y-4 text-gray-700">
            <p><strong>Domestic Orders:</strong> Shipped via registered domestic courier companies</p>
            <p><strong>International Orders:</strong> Shipped via registered international courier companies</p>
            <p><strong>Processing Time:</strong> Orders shipped within 0-7 days</p>
            <p><strong>Contact:</strong> support@vibebites.shop | 8697380653</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 bg-vibe-cookie text-vibe-brown font-semibold rounded-full hover:bg-vibe-brown hover:text-white transition-colors duration-300"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
        </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
