'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'

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
            <div className="flex space-x-4">
              <a href="#" className="text-white/60 hover:text-vibe-cookie transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-vibe-cookie transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-vibe-cookie transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-vibe-cookie transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
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
                <a href="tel:+919874120380" className="text-white/80 hover:text-vibe-cookie transition-colors">
                  +91 9874120380
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
