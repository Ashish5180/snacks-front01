'use client'

import React from 'react'
import Link from 'next/link'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen bg-vibe-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <AlertTriangle className="h-16 w-16 text-orange-500 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-vibe-brown mb-4">Something went wrong!</h1>
        <p className="text-vibe-brown/70 mb-6">
          An unexpected error occurred. We apologize for the inconvenience.
        </p>
        
        {process.env.NODE_ENV === 'development' && error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
            <h3 className="text-sm font-medium text-red-800 mb-2">Error Details:</h3>
            <p className="text-xs text-red-700 font-mono">{error.message}</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full flex items-center justify-center px-6 py-3 bg-vibe-cookie text-vibe-brown font-semibold rounded-lg hover:bg-vibe-brown hover:text-white transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </button>
          <Link
            href="/"
            className="w-full flex items-center justify-center px-6 py-3 border border-vibe-cookie text-vibe-brown font-semibold rounded-lg hover:bg-vibe-cookie/10 transition-colors"
          >
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
