'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Star, ThumbsUp, MessageCircle, User } from 'lucide-react'

const ProductReviews = ({ productId, productName }) => {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: ''
  })
  const [reviews, setReviews] = useState([])
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return { 'Content-Type': 'application/json' }
    }
    const token = localStorage.getItem('token')
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }

  useEffect(() => {
    async function fetchReviews() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/reviews/product/${productId}`)
        if (!res.ok) throw new Error('Failed to fetch reviews')
        const data = await res.json()
        if (data.success) {
          setReviews(data.data.reviews)
          setAverageRating(data.data.productRating || 0)
          setTotalReviews(data.data.totalReviews || 0)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (productId) fetchReviews()
  }, [productId])

  const handleSubmitReview = (e) => {
    e.preventDefault()
    async function submitReview() {
      try {
        if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
          alert('Please login to submit a review')
          return
        }
        
        const token = localStorage.getItem('token')
        if (!token) {
          alert('Please login to submit a review')
          return
        }

        // Client-side validation
        if (!newReview.title.trim() || newReview.title.trim().length < 5) {
          alert('Title must be at least 5 characters long')
          return
        }
        if (!newReview.comment.trim() || newReview.comment.trim().length < 10) {
          alert('Comment must be at least 10 characters long')
          return
        }
        if (newReview.rating < 1 || newReview.rating > 5) {
          alert('Rating must be between 1 and 5')
          return
        }
        
        const res = await fetch('/api/reviews', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            productId,
            rating: newReview.rating,
            title: newReview.title,
            comment: newReview.comment
          })
        })
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.message || 'Failed to submit review')
        }
        
        const data = await res.json()
        if (data.success) {
          setShowReviewForm(false)
          setNewReview({ rating: 5, title: '', comment: '' })
          // Refresh reviews after submit
        } else {
          throw new Error(data.message || 'Failed to submit review')
        }
        if (productId) {
          const reviewsRes = await fetch(`/api/reviews/product/${productId}`)
          if (reviewsRes.ok) {
            const data = await reviewsRes.json()
            setReviews(data.data.reviews)
            setAverageRating(data.data.productRating)
            setTotalReviews(data.data.totalReviews)
          }
        }
      } catch (err) {
        alert(err.message)
      }
    }
    submitReview()
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="mt-12">
      {/* Reviews Header */}
      <div className="border-b border-vibe-cookie/20 pb-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-vibe-brown">Customer Reviews</h2>
          <button
            onClick={() => setShowReviewForm(true)}
            className="px-6 py-2 bg-vibe-cookie text-vibe-brown rounded-full hover:bg-vibe-accent transition-colors"
          >
            Write a Review
          </button>
        </div>

        {/* Rating Summary */}
        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-vibe-brown">{averageRating.toFixed(1)}</div>
            <div className="flex items-center justify-center mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(averageRating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-vibe-brown/60 mt-1">
              {totalReviews} reviews
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviews.filter(r => r.rating === rating).length
              const percentage = (count / totalReviews) * 100
              return (
                <div key={rating} className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-vibe-brown/60 w-4">{rating}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-vibe-cookie h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-vibe-brown/60 w-8">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-vibe-bg rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-vibe-brown mb-4">Write Your Review</h3>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-vibe-brown mb-2">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating })}
                    className="p-1"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        rating <= newReview.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>


            <div>
              <label className="block text-sm font-medium text-vibe-brown mb-2">Review Title</label>
              <input
                type="text"
                value={newReview.title}
                onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                className="w-full px-4 py-2 border border-vibe-cookie/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibe-cookie"
                placeholder="Summarize your experience"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-vibe-brown mb-2">Your Review</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-vibe-cookie/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibe-cookie resize-none"
                placeholder="Share your experience with this product..."
                required
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-vibe-cookie text-vibe-brown rounded-full hover:bg-vibe-accent transition-colors"
              >
                Submit Review
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-6 py-2 border border-vibe-cookie text-vibe-brown rounded-full hover:bg-vibe-cookie/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vibe-cookie mx-auto"></div>
          <p className="text-vibe-brown/60 mt-2">Loading reviews...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-8">
          <p className="text-red-600">Error loading reviews: {error}</p>
        </div>
      )}

      {/* Reviews List */}
      {!loading && !error && (
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-vibe-brown/60">No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            reviews.map((review) => (
          <div key={review.id} className="border-b border-vibe-cookie/20 pb-6 last:border-b-0">
            <div className="flex items-start gap-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-vibe-cookie flex items-center justify-center">
                {review.avatar ? (
                  <Image
                    src={review.avatar}
                    alt={review.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <User className="h-8 w-8 text-vibe-brown" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-vibe-brown">{review.userName}</h4>
                  {review.verified && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Verified Purchase
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-vibe-brown/60">
                    {formatDate(review.date)}
                  </span>
                </div>
                <h5 className="font-medium text-vibe-brown mb-2">{review.title}</h5>
                <p className="text-vibe-brown/70 mb-3">{review.comment}</p>
              </div>
            </div>
          </div>
        ))
          )}
        </div>
      )}

      {/* Load More Reviews */}
      <div className="text-center mt-8">
        <button className="px-6 py-2 border border-vibe-cookie text-vibe-brown rounded-full hover:bg-vibe-cookie transition-colors">
          Load More Reviews
        </button>
      </div>
    </div>
  )
}

export default ProductReviews 