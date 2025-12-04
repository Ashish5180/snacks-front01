'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, Loader2 } from 'lucide-react'
import { useToast } from '../../components/Toaster'
import { buildApiUrl } from '../../utils/api'

const ForgotPasswordPage = () => {
  const router = useRouter()
  const { addToast } = useToast()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email) {
      addToast('Please enter your email address', 'error')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(buildApiUrl('/auth/forgot-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setEmailSent(true)
        addToast('Password reset email sent successfully!', 'success')
      } else {
        addToast(data.message || 'Failed to send reset email', 'error')
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      addToast('Network error occurred. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen bg-vibe-bg flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <Mail className="h-16 w-16 text-vibe-cookie mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-vibe-brown mb-4">Check Your Email</h1>
          <p className="text-vibe-brown/70 mb-6">
            We&apos;ve sent a password reset link to <strong>{email}</strong>. 
            Please check your email and follow the instructions to reset your password.
          </p>
          <p className="text-sm text-vibe-brown/60 mb-6">
            The link will expire in 1 hour for security reasons.
          </p>
          <div className="space-y-3">
            <Link 
              href="/login" 
              className="block w-full py-3 bg-vibe-cookie text-vibe-brown font-semibold rounded-lg hover:bg-vibe-brown hover:text-white transition-colors"
            >
              Back to Login
            </Link>
            <button 
              onClick={() => setEmailSent(false)}
              className="block w-full py-3 border border-vibe-cookie text-vibe-brown font-semibold rounded-lg hover:bg-vibe-cookie/10 transition-colors"
            >
              Send Another Email
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-vibe-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-8">
          <Link 
            href="/login" 
            className="inline-flex items-center text-vibe-brown hover:text-vibe-cookie transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Link>
          <h1 className="text-2xl font-bold text-vibe-brown mb-2">Forgot Password?</h1>
          <p className="text-vibe-brown/70">
            No worries! Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-vibe-brown mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-vibe-cookie/30 placeholder-gray-500 text-vibe-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-vibe-cookie focus:border-transparent"
                placeholder="Enter your email address"
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-vibe-cookie hover:bg-vibe-brown focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vibe-cookie disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending Reset Link...
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-vibe-brown/60">
            Remember your password?{' '}
            <Link href="/login" className="font-medium text-vibe-cookie hover:text-vibe-brown transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
