'use client'

import dynamic from 'next/dynamic'
import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Save, X, RefreshCw, Upload, Image as ImageIcon } from 'lucide-react'
import { useToast } from '../../../components/Toaster'
import Image from 'next/image'

const AddCategoryPage = () => {
  const router = useRouter()
  const { addToast } = useToast()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ name: '', description: '', image: '' })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editValues, setEditValues] = useState({ name: '', description: '', image: '' })
  const [editImageFile, setEditImageFile] = useState(null)
  const [editImagePreview, setEditImagePreview] = useState('')
  const apiBase = 'https://snacks-back01.onrender.com/api'

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

  // Helper function for file uploads (without Content-Type for FormData)
  const getFileUploadHeaders = () => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return {}
    }
    const token = localStorage.getItem('token')
    return {
      'Authorization': `Bearer ${token}`
      // Don't set Content-Type for FormData - let browser set it with boundary
    }
  }

  // Set client state
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Auth check (admin only)
  useEffect(() => {
    if (!isClient) return
    
    const checkAuth = async () => {
      try {
        const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null
        if (!token) {
          router.push('/login')
          return
        }
        const res = await fetch(`${apiBase}/auth/me`, { headers: getAuthHeaders() })
        if (!res.ok) throw new Error('Auth failed')
        const data = await res.json()
        if (data.success && data.data.role === 'admin') {
          setUser(data.data)
          setIsLoading(false)
        } else {
          addToast('Admin access required', 'error')
          router.push('/')
        }
      } catch (e) {
        router.push('/login')
      }
    }
    checkAuth()
  }, [isClient, apiBase, router, addToast])

  const loadCategories = useCallback(async () => {
    try {
      const res = await fetch(`${apiBase}/categories/all`, { headers: getAuthHeaders() })
      if (res.ok) {
        const data = await res.json()
        setCategories(data.data.categories)
      }
    } catch (e) {
      addToast('Error loading categories', 'error')
    }
  }, [apiBase, addToast])

  useEffect(() => { if (user) loadCategories() }, [user, loadCategories])

  // Image upload functions
  const uploadImageToServer = async (file) => {
    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await fetch(`${apiBase}/categories/upload-image`, {
        method: 'POST',
        headers: getFileUploadHeaders(),
        body: formData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      if (data.success) {
        return data.data.imageUrl
      } else {
        throw new Error(data.message || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      throw error
    }
  }

  const handleImageUpload = async (event, isEdit = false) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      addToast('Please select a valid image file', 'error')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      addToast('Image size should be less than 5MB', 'error')
      return
    }

    try {
      setUploading(true)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        if (isEdit) {
          setEditImagePreview(e.target.result)
        } else {
          setImagePreview(e.target.result)
        }
      }
      reader.readAsDataURL(file)

      // Upload to server
      const imageUrl = await uploadImageToServer(file)
      
      if (isEdit) {
        setEditImageFile(file)
        setEditValues(prev => ({ ...prev, image: imageUrl }))
      } else {
        setImageFile(file)
        setForm(prev => ({ ...prev, image: imageUrl }))
      }
      
      addToast('Image uploaded successfully', 'success')
    } catch (error) {
      addToast('Error uploading image: ' + error.message, 'error')
    } finally {
      setUploading(false)
    }
  }

  const clearImage = (isEdit = false) => {
    if (isEdit) {
      setEditImageFile(null)
      setEditImagePreview('')
      setEditValues(prev => ({ ...prev, image: '' }))
    } else {
      setImageFile(null)
      setImagePreview('')
      setForm(prev => ({ ...prev, image: '' }))
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return addToast('Name required', 'error')
    setCreating(true)
    try {
      // Determine if we should use FormData or JSON
      const hasUploadedFile = imageFile;
      
      let requestOptions;
      
      if (hasUploadedFile) {
        // Use FormData for file upload
        const formData = new FormData();
        formData.append('name', form.name.trim());
        if (form.description.trim()) {
          formData.append('description', form.description.trim());
        }
        formData.append('image', imageFile);
        
        requestOptions = {
          method: 'POST',
          headers: getFileUploadHeaders(),
          body: formData
        };
      } else {
        // Use JSON for URL-based images or no image
        const payload = {
          name: form.name.trim(),
          ...(form.description.trim() && { description: form.description.trim() }),
          ...(form.image.trim() && { image: form.image.trim() })
        };
        
        requestOptions = {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload)
        };
      }

      const res = await fetch(`${apiBase}/categories`, requestOptions);
      const data = await res.json();
      
      if (res.ok && data.success) {
        addToast('Category created', 'success')
        setForm({ name: '', description: '', image: '' })
        setImageFile(null)
        setImagePreview('')
        loadCategories()
      } else {
        addToast(data.message || 'Create failed', 'error')
      }
    } catch (e) {
      addToast('Create failed', 'error')
    } finally {
      setCreating(false)
    }
  }

  const startEdit = (cat) => {
    setEditingId(cat._id)
    setEditValues({ name: cat.name, description: cat.description || '', image: cat.image || '' })
    setEditImageFile(null)
    setEditImagePreview(cat.image || '')
  }
  
  const cancelEdit = () => { 
    setEditingId(null)
    setEditValues({ name: '', description: '', image: '' })
    setEditImageFile(null)
    setEditImagePreview('')
  }

  const saveEdit = async (id) => {
    try {
      // Determine if we should use FormData or JSON
      const hasUploadedFile = editImageFile;
      
      let requestOptions;
      
      if (hasUploadedFile) {
        // Use FormData for file upload
        const formData = new FormData();
        formData.append('name', editValues.name.trim());
        if (editValues.description.trim()) {
          formData.append('description', editValues.description.trim());
        }
        formData.append('image', editImageFile);
        
        requestOptions = {
          method: 'PUT',
          headers: getFileUploadHeaders(),
          body: formData
        };
      } else {
        // Use JSON for URL-based images or no image
        const payload = {
          name: editValues.name.trim(),
          ...(editValues.description.trim() && { description: editValues.description.trim() }),
          ...(editValues.image.trim() && { image: editValues.image.trim() })
        };
        
        requestOptions = {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload)
        };
      }
      
      const res = await fetch(`${apiBase}/categories/${id}`, requestOptions)
      const data = await res.json()
      if (res.ok && data.success) {
        addToast('Category updated', 'success')
        cancelEdit()
        loadCategories()
      } else {
        addToast(data.message || 'Update failed', 'error')
      }
    } catch (e) {
      addToast('Update failed', 'error')
    }
  }

  const toggleStatus = async (cat) => {
    try {
      const res = await fetch(`${apiBase}/categories/${cat._id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isActive: !cat.isActive })
      })
      if (res.ok) {
        addToast('Status updated', 'success')
        loadCategories()
      } else {
        addToast('Status change failed', 'error')
      }
    } catch (e) { addToast('Status change failed', 'error') }
  }

  const deleteCategory = async (id) => {
    if (!confirm('Delete this category?')) return
    try {
      const res = await fetch(`${apiBase}/categories/${id}`, { 
        method: 'DELETE', 
        headers: getAuthHeaders() 
      })
      if (res.ok) {
        addToast('Category deleted', 'success')
        loadCategories()
      } else {
        addToast('Delete failed', 'error')
      }
    } catch (e) { addToast('Delete failed', 'error') }
  }

  if (!isClient || isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-vibe-bg text-vibe-brown">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-vibe-bg px-4 py-8 max-w-5xl mx-auto">
      <div className="mb-4">
        <a href="/admin">
          <button style={{ padding: '0.5rem 1rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            ← Back to Dashboard
          </button>
        </a>
      </div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-vibe-brown">Category Management</h1>
        <button onClick={loadCategories} className="flex items-center space-x-2 px-4 py-2 rounded-md bg-white border border-vibe-cookie text-vibe-brown hover:bg-vibe-cookie/30 transition-colors">
          <RefreshCw className="h-4 w-4" /> <span>Refresh</span>
        </button>
      </div>

      {/* Create Form */}
      <form onSubmit={handleCreate} className="bg-white border border-vibe-cookie rounded-lg p-6 mb-10 shadow-sm space-y-4">
        <h2 className="text-xl font-semibold text-vibe-brown flex items-center gap-2"><Plus className="h-5 w-5" /> Add New Category</h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="px-3 py-2 border border-vibe-cookie rounded-md focus:outline-none focus:ring-2 focus:ring-vibe-cookie"
            required
          />
          <input
            type="text"
            placeholder="Short Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="px-3 py-2 border border-vibe-cookie rounded-md focus:outline-none focus:ring-2 focus:ring-vibe-cookie"
          />
        </div>

        {/* Image Upload Section */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-vibe-brown">Category Image</label>
          
          {/* Image Preview */}
          {(imagePreview || form.image) && (
            <div className="relative w-32 h-32 border border-vibe-cookie rounded-lg overflow-hidden">
              <Image
                src={imagePreview || form.image}
                alt="Category preview"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => clearImage(false)}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          <div className="flex gap-4 items-center">
            {/* File Upload Option */}
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, false)}
                className="hidden"
                id="category-image-upload"
                disabled={uploading}
              />
              <label
                htmlFor="category-image-upload"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-vibe-cookie/50 hover:border-vibe-cookie transition-colors cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Upload className="h-4 w-4 text-vibe-brown" />
                <span className="text-vibe-brown">
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </span>
              </label>
            </div>

            <span className="text-sm text-gray-500">or</span>

            {/* URL Input Option */}
            <input
              type="url"
              placeholder="Image URL (optional)"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="flex-1 px-3 py-2 border border-vibe-cookie rounded-md focus:outline-none focus:ring-2 focus:ring-vibe-cookie"
              disabled={imageFile}
            />
          </div>
        </div>

        <button disabled={creating || uploading} type="submit" className="px-5 py-2 bg-vibe-cookie text-vibe-brown font-medium rounded-md hover:bg-vibe-brown hover:text-white transition-colors disabled:opacity-50">
          {creating ? 'Creating...' : 'Create Category'}
        </button>
      </form>

      {/* Categories Table */}
      <div className="bg-white border border-vibe-cookie rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map(cat => (
              <tr key={cat._id} className="hover:bg-vibe-cookie/10">
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === cat._id ? (
                    <div className="space-y-2">
                      {editImagePreview && (
                        <div className="relative w-12 h-12 border border-vibe-cookie rounded overflow-hidden">
                          <Image
                            src={editImagePreview}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => clearImage(true)}
                            className="absolute top-0 right-0 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          >
                            <X className="h-2 w-2" />
                          </button>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, true)}
                          className="hidden"
                          id={`edit-image-${cat._id}`}
                          disabled={uploading}
                        />
                        <label
                          htmlFor={`edit-image-${cat._id}`}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded cursor-pointer"
                        >
                          <ImageIcon className="h-3 w-3" />
                          Upload
                        </label>
                        <input
                          type="url"
                          placeholder="Image URL"
                          value={editValues.image}
                          onChange={(e) => setEditValues({ ...editValues, image: e.target.value })}
                          className="text-xs px-2 py-1 border border-vibe-cookie rounded w-24"
                          disabled={editImageFile}
                        />
                      </div>
                    </div>
                  ) : (
                    cat.image ? (
                      <div className="w-12 h-12 relative border border-vibe-cookie rounded overflow-hidden">
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 border border-vibe-cookie rounded flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-gray-400" />
                      </div>
                    )
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-vibe-brown">
                  {editingId === cat._id ? (
                    <input value={editValues.name} onChange={(e) => setEditValues({ ...editValues, name: e.target.value })} className="px-2 py-1 border border-vibe-cookie rounded" />
                  ) : cat.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-xs">
                  {editingId === cat._id ? (
                    <input value={editValues.description} onChange={(e) => setEditValues({ ...editValues, description: e.target.value })} className="w-full px-2 py-1 border border-vibe-cookie rounded" />
                  ) : (cat.description || '-')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${cat.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{cat.isActive ? 'Active' : 'Inactive'}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {editingId === cat._id ? (
                    <>
                      <button onClick={() => saveEdit(cat._id)} className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200"><Save className="h-4 w-4" /></button>
                      <button onClick={cancelEdit} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"><X className="h-4 w-4" /></button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(cat)} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"><Edit2 className="h-4 w-4" /></button>
                      <button onClick={() => toggleStatus(cat)} className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200">
                        {cat.isActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                      </button>
                      <button onClick={() => deleteCategory(cat._id)} className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"><Trash2 className="h-4 w-4" /></button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-6 text-center text-sm text-gray-500">No categories yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-500 mt-6">Note: Product schema still uses a fixed enum for categories; newly created categories here won&apos;t be usable for products until that enum is updated (left unchanged as requested).</p>
    </div>
  )
}

export default dynamic(() => Promise.resolve(AddCategoryPage), { ssr: false })
