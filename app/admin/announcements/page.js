'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../../../components/Navbar'
import { buildApiUrl } from '../../../utils/api'
import { useToast } from '../../../components/Toaster'

export default function ManageAnnouncementsPage() {
  const router = useRouter()
  const { addToast } = useToast()
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    message: '',
    isActive: true,
    priority: 0
  })

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    
    if (!token || user.role !== 'admin') {
      addToast('Access denied. Admin only.', 'error')
      router.push('/login')
      return
    }

    fetchAnnouncements()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(buildApiUrl('/announcements'), {
        headers: getAuthHeaders()
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setAnnouncements(data.data)
        }
      } else if (response.status === 401) {
        addToast('Session expired. Please login again.', 'error')
        router.push('/login')
      }
    } catch (error) {
      console.error('Failed to fetch announcements:', error)
      addToast('Failed to load announcements', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.message.trim()) {
      addToast('Message is required', 'error')
      return
    }

    try {
      const url = editingId
        ? buildApiUrl(`/announcements/${editingId}`)
        : buildApiUrl('/announcements')

      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        addToast(data.message || `Announcement ${editingId ? 'updated' : 'created'} successfully`, 'success')
        setShowForm(false)
        setEditingId(null)
        setFormData({ message: '', isActive: true, priority: 0 })
        fetchAnnouncements()
      } else {
        addToast(data.message || 'Failed to save announcement', 'error')
      }
    } catch (error) {
      console.error('Save announcement error:', error)
      addToast('Failed to save announcement', 'error')
    }
  }

  const handleEdit = (announcement) => {
    setEditingId(announcement._id)
    setFormData({
      message: announcement.message,
      isActive: announcement.isActive,
      priority: announcement.priority
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this announcement?')) {
      return
    }

    try {
      const response = await fetch(buildApiUrl(`/announcements/${id}`), {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      const data = await response.json()

      if (response.ok && data.success) {
        addToast('Announcement deleted successfully', 'success')
        fetchAnnouncements()
      } else {
        addToast(data.message || 'Failed to delete announcement', 'error')
      }
    } catch (error) {
      console.error('Delete announcement error:', error)
      addToast('Failed to delete announcement', 'error')
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({ message: '', isActive: true, priority: 0 })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-vibe-bg">
        <Navbar />
        <div className="pt-24 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vibe-brown"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-vibe-bg">
      <Navbar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-vibe-brown">Manage Announcements</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-vibe-brown text-white px-6 py-2 rounded-lg hover:bg-vibe-cookie transition-colors"
            >
              {showForm ? 'Cancel' : '+ New Announcement'}
            </button>
          </div>

          {/* Create/Edit Form */}
          {showForm && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-vibe-brown mb-4">
                {editingId ? 'Edit Announcement' : 'Create New Announcement'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vibe-brown focus:border-transparent"
                    rows="3"
                    maxLength="200"
                    placeholder="Enter announcement message (max 200 characters)"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.message.length}/200 characters
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority (0-100)
                    </label>
                    <input
                      type="number"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vibe-brown focus:border-transparent"
                      min="0"
                      max="100"
                    />
                    <p className="text-xs text-gray-500 mt-1">Higher priority shows first</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.isActive.toString()}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vibe-brown focus:border-transparent"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-vibe-brown text-white rounded-lg hover:bg-vibe-cookie transition-colors"
                  >
                    {editingId ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Announcements List */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {announcements.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No announcements found.</p>
                <p className="text-sm mt-2">Create your first announcement to get started.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Message
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {announcements.map((announcement) => (
                      <tr key={announcement._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 max-w-md">
                          <p className="text-sm text-gray-900">{announcement.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Created: {new Date(announcement.createdAt).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {announcement.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              announcement.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {announcement.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleEdit(announcement)}
                            className="text-vibe-brown hover:text-vibe-cookie"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(announcement._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Back to Admin Dashboard */}
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/admin')}
              className="text-vibe-brown hover:text-vibe-cookie underline"
            >
              ← Back to Admin Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

