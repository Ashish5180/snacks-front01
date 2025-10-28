'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Mail, Phone, MapPin, Instagram, Youtube, MessageCircle } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-vibe-brown text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="relative w-32 h-10 mr-3">
                <Image
                  src="/images/logo.jpeg"
                  alt="VIBE BITES"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold">VIBE BITES</span>
            </div>
            <p className="text-white/80 mb-6 leading-relaxed">
              Vibe Every Bite. We&apos;re committed to bringing you the healthiest and tastiest snacks 
              that nourish your body and soul.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-white/80 hover:text-vibe-cookie transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-white/80 hover:text-vibe-cookie transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/80 hover:text-vibe-cookie transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/80 hover:text-vibe-cookie transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-white/80 hover:text-vibe-cookie transition-colors">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Policies</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy-policy" className="text-white/80 hover:text-vibe-cookie transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="text-white/80 hover:text-vibe-cookie transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="text-white/80 hover:text-vibe-cookie transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/cancellation-refund" className="text-white/80 hover:text-vibe-cookie transition-colors">
                  Cancellation & Refund
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="text-white/80 hover:text-vibe-cookie transition-colors">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="text-white/80 hover:text-vibe-cookie transition-colors">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-vibe-cookie mt-1 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-white/80">
          BB-92 Vip park <br />Prafullakanan West kolkata 700101
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-vibe-cookie mr-3 flex-shrink-0" />
                <a href="tel:+918697380653" className="text-white/80 hover:text-vibe-cookie transition-colors">
                  +91 86973 80653
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-vibe-cookie mr-3 flex-shrink-0" />
                <a href="mailto:support@vibebites.shop" className="text-white/80 hover:text-vibe-cookie transition-colors">
                  support@vibebites.shop
                </a>
              </div>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="lg:col-span-4 mt-8">
            <div className="bg-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-center">Follow Us</h3>
              <div className="flex justify-center gap-4 flex-wrap">
                <a 
                  href="https://www.instagram.com/vibebites_25?utm_source=qr&igsh=b2EyMWJ0a3FyOHd3" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105"
                >
                  <Instagram className="h-4 w-4" />
                  <span className="hidden sm:inline">Instagram</span>
                </a>
                <a 
                  href="https://wa.me/message/YJ6KYWC4AX7WP1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all duration-300 hover:scale-105"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
                <a 
                  href="https://youtube.com/@vibebites_025?si=tYJxMOitQentjAVs" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-300 hover:scale-105"
                >
                  <Youtube className="h-4 w-4" />
                  <span className="hidden sm:inline">YouTube</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-white/60 text-sm mb-4 md:mb-0">
              © {currentYear} VIBE BITES. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/privacy-policy" className="text-white/60 hover:text-vibe-cookie transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-conditions" className="text-white/60 hover:text-vibe-cookie transition-colors">
                Terms & Conditions
              </Link>
              <Link href="/shipping-policy" className="text-white/60 hover:text-vibe-cookie transition-colors">
                Shipping Policy
              </Link>
              <Link href="/cancellation-refund" className="text-white/60 hover:text-vibe-cookie transition-colors">
                Cancellation & Refund
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
