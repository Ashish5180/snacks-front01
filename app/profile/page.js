'use client'

import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useRouter } from 'next/navigation'
import { useToast } from '../../components/Toaster'
import { Star, Package, Calendar, ExternalLink, LogOut } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { buildApiUrl } from '../../utils/api'

const ProfilePage = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const router = useRouter()
  const { addToast } = useToast()

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
    const loadProfile = async () => {
      try {
        if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
          router.push('/login')
          return
        }
        
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/login')
          return
        }
        const res = await fetch(buildApiUrl('/auth/profile'), {
          headers: getAuthHeaders()
        })
        const data = await res.json()
        if (data.success) {
          setUser(data.data.user)
          if (typeof window !== 'undefined' && typeof localStorage !== 'undefined' && !localStorage.getItem('user')) {
            localStorage.setItem('user', JSON.stringify(data.data.user))
          }
        } else {
          if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
          }
          router.push('/login')
        }
      } catch (e) {
        console.error('Profile load error:', e)
        addToast('Failed to load profile', 'error')
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [router, addToast])

  useEffect(() => {
    const loadOrders = async () => {
      setOrdersLoading(true)
      try {
        const res = await fetch(buildApiUrl('/orders'), {
          headers: getAuthHeaders()
        })
        const data = await res.json()
        if (data.success) {
          setOrders(data.data.orders)
        }
      } catch (e) {
        console.error('Orders load error:', e)
      } finally {
        setOrdersLoading(false)
      }
    }
    loadOrders()
  }, [])


  return (
    <div className="min-h-screen bg-vibe-bg">
      <Navbar />
      <div className="pt-20">
        <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <h1 className="text-3xl font-bold text-vibe-brown mb-6">My Profile</h1>
        {loading ? (
          <div className="text-vibe-brown/70">Loading...</div>
        ) : user ? (
          <>
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold text-vibe-brown">Profile Information</h2>
                <button
                  onClick={() => router.push('/logout')}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors duration-200 font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-vibe-brown/60 text-sm">First Name</div>
                  <div className="text-vibe-brown font-semibold">{user.firstName}</div>
                </div>
                <div>
                  <div className="text-vibe-brown/60 text-sm">Last Name</div>
                  <div className="text-vibe-brown font-semibold">{user.lastName}</div>
                </div>
                <div>
                  <div className="text-vibe-brown/60 text-sm">Email</div>
                  <div className="text-vibe-brown font-semibold">{user.email}</div>
                </div>
                <div>
                  <div className="text-vibe-brown/60 text-sm">Phone</div>
                  <div className="text-vibe-brown font-semibold">{user.phone || '—'}</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-vibe-brown mb-4">My Orders</h2>
              {ordersLoading ? (
                <div className="text-vibe-brown/70">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="text-vibe-brown/70">No orders found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-vibe-brown font-medium">{order.orderNumber || order._id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{order.total}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              order.orderStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                              order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.orderStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              className="px-3 py-1 bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-md text-xs font-medium"
                              onClick={() => router.push(`/track-order?orderId=${order.orderNumber || order._id}`)}
                            >
                              Track Order
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </>
        ) : (
          <div className="text-vibe-brown/70">Unable to load profile</div>
        )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ProfilePage

