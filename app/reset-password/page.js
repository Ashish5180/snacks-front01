'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Lock, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react'
import { useToast } from '../../components/Toaster'
import { buildApiUrl } from '../../utils/api'

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { addToast } = useToast()
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)
  const [token, setToken] = useState('')

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    if (!tokenParam) {
      addToast('Invalid reset link. Token is missing.', 'error')
      router.push('/forgot-password')
    } else {
      setToken(tokenParam)
    }
  }, [searchParams, router, addToast])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password)
    }
    return requirements
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { password, confirmPassword } = formData

    // Validation
    if (!password || !confirmPassword) {
      addToast('Please fill in all fields', 'error')
      return
    }

    if (password !== confirmPassword) {
      addToast('Passwords do not match', 'error')
      return
    }

    const requirements = validatePassword(password)
    if (!requirements.length || !requirements.uppercase || !requirements.lowercase || !requirements.number) {
      addToast('Password must be at least 6 characters with uppercase, lowercase, and number', 'error')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(buildApiUrl('/auth/reset-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, password })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setResetSuccess(true)
        addToast('Password reset successfully!', 'success')
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } else {
        addToast(data.message || 'Failed to reset password', 'error')
      }
    } catch (error) {
      console.error('Reset password error:', error)
      addToast('Network error occurred. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  if (resetSuccess) {
    return (
      <div className="min-h-screen bg-vibe-bg flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-vibe-brown mb-4">Password Reset Successful!</h1>
          <p className="text-vibe-brown/70 mb-6">
            Your password has been successfully reset. You can now log in with your new password.
          </p>
          <p className="text-sm text-vibe-brown/60 mb-4">Redirecting to login page in 3 seconds...</p>
          <Link 
            href="/login" 
            className="inline-flex items-center px-6 py-3 bg-vibe-cookie text-vibe-brown font-semibold rounded-lg hover:bg-vibe-brown hover:text-white transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  const passwordRequirements = validatePassword(formData.password)

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
          <h1 className="text-2xl font-bold text-vibe-brown mb-2">Reset Password</h1>
          <p className="text-vibe-brown/70">
            Enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-vibe-brown mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="appearance-none relative block w-full pl-10 pr-10 py-3 border border-vibe-cookie/30 placeholder-gray-500 text-vibe-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-vibe-cookie focus:border-transparent"
                placeholder="Enter your new password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            
            {/* Password Requirements */}
            {formData.password && (
              <div className="mt-2 text-xs space-y-1">
                <div className={`flex items-center ${passwordRequirements.length ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="mr-1">{passwordRequirements.length ? '✓' : '✗'}</span>
                  At least 6 characters
                </div>
                <div className={`flex items-center ${passwordRequirements.uppercase ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="mr-1">{passwordRequirements.uppercase ? '✓' : '✗'}</span>
                  One uppercase letter
                </div>
                <div className={`flex items-center ${passwordRequirements.lowercase ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="mr-1">{passwordRequirements.lowercase ? '✓' : '✗'}</span>
                  One lowercase letter
                </div>
                <div className={`flex items-center ${passwordRequirements.number ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="mr-1">{passwordRequirements.number ? '✓' : '✗'}</span>
                  One number
                </div>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-vibe-brown mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="appearance-none relative block w-full pl-10 pr-10 py-3 border border-vibe-cookie/30 placeholder-gray-500 text-vibe-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-vibe-cookie focus:border-transparent"
                placeholder="Confirm your new password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !token}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-vibe-cookie hover:bg-vibe-brown focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vibe-cookie disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Resetting Password...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-vibe-bg text-vibe-brown">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

export default ResetPasswordPage
