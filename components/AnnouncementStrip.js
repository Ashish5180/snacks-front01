'use client'

import React, { useState, useEffect } from 'react'
import { buildApiUrl } from '../utils/api'

const defaultMessages = [
  'Premium roasted snacks • Fresh batches daily • Pan-India delivery',
  'Free shipping on orders above ₹500 • VIBE BITES • Snack smart, snack happy',
  'Limited time offers • Healthy, tasty & crunchy • VIBE BITES originals'
]

const AnnouncementStrip = () => {
  const [messages, setMessages] = useState(defaultMessages)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Fetch active announcements from backend
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch(buildApiUrl('/announcements/active'))
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data && data.data.length > 0) {
            const activeMessages = data.data.map(announcement => announcement.message)
            setMessages(activeMessages)
          }
        }
      } catch (error) {
        console.error('Failed to fetch announcements:', error)
        // Continue with default messages
      }
    }

    fetchAnnouncements()
  }, [])

  // Cycle through messages every 5 seconds
  useEffect(() => {
    if (messages.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [messages.length])

  const currentMessage = messages[currentIndex]

  return (
    <div className="bg-vibe-brown text-vibe-bg border-b border-vibe-cookie/30">
      <div className="max-w-7xl mx-auto overflow-hidden">
        <div className="marquee whitespace-nowrap pt-5 pb-5 sm:pt-6 sm:pb-6 md:pt-7 md:pb-7 text-sm sm:text-base md:text-lg lg:text-xl tracking-[0.3em] font-semibold uppercase">
          <span className="inline-block mr-20 opacity-90">{currentMessage}</span>
          <span className="inline-block mr-20 opacity-80">{currentMessage}</span>
          <span className="inline-block mr-20 opacity-70">{currentMessage}</span>
        </div>
      </div>
    </div>
  )
}

export default AnnouncementStrip


