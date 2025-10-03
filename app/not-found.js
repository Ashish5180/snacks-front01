'use client'

import React from 'react'
import Link from 'next/link'
import { FileX, Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-vibe-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <FileX className="h-16 w-16 text-vibe-cookie mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-vibe-brown mb-4">404</h1>
        <h2 className="text-xl font-semibold text-vibe-brown mb-4">Page Not Found</h2>
        <p className="text-vibe-brown/70 mb-6">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>

        <div className="space-y-3">
          <Link
            href="/"
            className="w-full flex items-center justify-center px-6 py-3 bg-vibe-cookie text-vibe-brown font-semibold rounded-lg hover:bg-vibe-brown hover:text-white transition-colors"
          >
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Link>
          <Link
            href="/products"
            className="w-full flex items-center justify-center px-6 py-3 border border-vibe-cookie text-vibe-brown font-semibold rounded-lg hover:bg-vibe-cookie/10 transition-colors"
          >
            <Search className="h-4 w-4 mr-2" />
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  )
}
