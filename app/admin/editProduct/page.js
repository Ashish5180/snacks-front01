'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useToast } from '../../../components/Toaster'
import { Loader2, ArrowLeft, Save, Plus, X, Home } from 'lucide-react'

function EditProductContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { addToast } = useToast()
  
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [user, setUser] = useState(null)
  const [categories, setCategories] = useState([])
  const [product, setProduct] = useState(null)
  
  const apiBase = '/api' // Use relative path to leverage Vercel proxy (avoids CORS)
  const getFileUploadHeaders = () => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return {}
    }
    const token = localStorage.getItem('token')
    return { 'Authorization': `Bearer ${token}` }
  }
  const productId = searchParams.get('id')

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

  // Check authentication and fetch initial data
  useEffect(() => {
    const initializePage = async () => {
      if (!productId) {
        addToast('Product ID is required', 'error')
        router.push('/admin')
        return
      }

      try {
        // Check if user is authenticated and is admin
        if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
          addToast('Please login to continue', 'error')
          router.push('/login')
          return
        }
        
        const token = localStorage.getItem('token')
        if (!token) {
          addToast('Please login to continue', 'error')
          router.push('/login')
          return
        }

        const authResponse = await fetch(`${apiBase}/auth/me`, {
          headers: getAuthHeaders()
        })

        if (!authResponse.ok) {
          // Token might be expired, clear it and redirect to login
          if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
          }
          addToast('Please login to continue', 'error')
          router.push('/login')
          return
        }

        const authData = await authResponse.json()
        
        if (!authData.success || authData.data.role !== 'admin') {
          addToast('Admin access required', 'error')
          router.push('/')
          return
        }

        setUser(authData.data)

        // Fetch categories
        const categoriesResponse = await fetch(`${apiBase}/categories/all`, {
          headers: getAuthHeaders()
        })
        
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json()
          setCategories(categoriesData.data?.categories?.filter(cat => cat.isActive) || [])
        }

        // Fetch product data
        const productResponse = await fetch(`${apiBase}/admin/products/edit/${productId}`, {
          headers: getAuthHeaders()
        })

        if (!productResponse.ok) {
          if (productResponse.status === 404) {
            addToast('Product not found', 'error')
            router.push('/admin')
            return
          }
          throw new Error('Failed to fetch product')
        }

        const productData = await productResponse.json()
        if (productData.success) {
          setProduct(productData.data.product)
        } else {
          throw new Error(productData.message || 'Failed to fetch product')
        }

      } catch (error) {
        console.error('Initialization error:', error)
        addToast(error.message || 'Failed to initialize page', 'error')
        router.push('/admin')
      } finally {
        setLoading(false)
      }
    }

    initializePage()
  }, [productId, apiBase, router, addToast])

  // Form state
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    image: '',
    images: [''],
    sizes: [{ size: '', price: '', stock: '' }],
    ingredients: '',
    nutrition: { calories: '', protein: '', carbs: '', fat: '', fiber: '' },
    featured: false,
    video: ''
  })

  // File upload state for edit
  const [mainImageFile, setMainImageFile] = useState(null)
  const [additionalImageFiles, setAdditionalImageFiles] = useState([])
  const [uploading, setUploading] = useState(false)

  const uploadImageToServer = async (file) => {
    const fd = new FormData()
    fd.append('image', file)
    try {
      const res = await fetch(`${apiBase}/admin/upload-image`, {
        method: 'POST',
        headers: getFileUploadHeaders(),
        body: fd
      })
      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()
      if (data.success && data.data?.imageUrl) return data.data.imageUrl
      throw new Error(data.message || 'Upload failed')
    } catch (e) {
      throw e
    }
  }

  // Update form when product data is loaded
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        description: product.description || '',
        category: product.category || '',
        image: product.image || '',
        images: product.images?.length ? product.images : [''],
        sizes: product.sizes?.length ? product.sizes : [{ size: '', price: '', stock: '' }],
        ingredients: product.ingredients || '',
        nutrition: product.nutrition || { calories: '', protein: '', carbs: '', fat: '', fiber: '' },
        featured: !!product.featured,
        video: product.video || ''
      })
    }
  }, [product])

  // Form update functions
  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const updateNutrition = (field, value) => {
    setForm(prev => ({
      ...prev,
      nutrition: { ...prev.nutrition, [field]: value }
    }))
  }

  const updateSize = (index, field, value) => {
    setForm(prev => ({
      ...prev,
      sizes: prev.sizes.map((size, i) => 
        i === index ? { ...size, [field]: value } : size
      )
    }))
  }

  const addSize = () => {
    setForm(prev => ({
      ...prev,
      sizes: [...prev.sizes, { size: '', price: '', stock: '' }]
    }))
  }

  const removeSize = (index) => {
    if (form.sizes.length > 1) {
      setForm(prev => ({
        ...prev,
        sizes: prev.sizes.filter((_, i) => i !== index)
      }))
    }
  }

  const updateImage = (index, value) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img)
    }))
  }

  const addImage = () => {
    setForm(prev => ({
      ...prev,
      images: [...prev.images, '']
    }))
  }

  const removeImage = (index) => {
    if (form.images.length > 1) {
      setForm(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }))
    }
  }

  // Handlers: upload main image file
  const handleMainImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { addToast('Invalid image file', 'error'); return }
    if (file.size > 5 * 1024 * 1024) { addToast('Max 5MB image size', 'error'); return }
    try {
      setUploading(true)
      const url = await uploadImageToServer(file)
      setMainImageFile(file)
      updateField('image', url)
      addToast('Main image uploaded', 'success')
    } catch (err) {
      addToast(err.message || 'Upload failed', 'error')
    } finally {
      setUploading(false)
    }
  }

  // Handlers: upload additional image file
  const handleAdditionalImageUpload = async (e, index) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { addToast('Invalid image file', 'error'); return }
    if (file.size > 5 * 1024 * 1024) { addToast('Max 5MB image size', 'error'); return }
    try {
      setUploading(true)
      const url = await uploadImageToServer(file)
      setAdditionalImageFiles(prev => { const c = [...prev]; c[index] = file; return c })
      updateImage(index, url)
      addToast('Image uploaded', 'success')
    } catch (err) {
      addToast(err.message || 'Upload failed', 'error')
    } finally {
      setUploading(false)
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Validate form data
      if (!form.name.trim() || !form.description.trim() || !form.category.trim() || !form.image.trim()) {
        addToast('Please fill in all required fields', 'error')
        return
      }

      if (!form.sizes.length || form.sizes.some(s => !s.size.trim() || !s.price || s.stock === '')) {
        addToast('Please fill in all size details', 'error')
        return
      }

      if (!form.ingredients.trim()) {
        addToast('Please fill in ingredients', 'error')
        return
      }

      // Prepare payload
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category.trim(),
        image: form.image.trim(),
        images: form.images.filter(img => img.trim()),
        sizes: form.sizes.map(s => ({
          size: s.size.trim(),
          price: parseFloat(s.price),
          stock: parseInt(s.stock)
        })),
        ingredients: form.ingredients.trim(),
        nutrition: {
          calories: form.nutrition.calories || '',
          protein: form.nutrition.protein || '',
          carbs: form.nutrition.carbs || '',
          fat: form.nutrition.fat || '',
          fiber: form.nutrition.fiber || ''
        },
        featured: form.featured,
        video: form.video?.trim() || ''
      }

      // Submit update
      const response = await fetch(`${apiBase}/admin/products/edit/${productId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        addToast('Product updated successfully!', 'success')
        router.push('/admin')
      } else {
        addToast(data.message || 'Failed to update product', 'error')
      }

    } catch (error) {
      console.error('Update error:', error)
      addToast('Network error. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-vibe-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-vibe-brown mx-auto mb-4" />
          <p className="text-vibe-brown text-lg">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-vibe-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-vibe-brown text-lg mb-4">Product not found</p>
          <button 
            onClick={() => router.push('/admin')}
            className="px-4 py-2 bg-vibe-cookie text-vibe-brown rounded-md hover:bg-vibe-brown hover:text-white"
          >
            Back to Admin
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-vibe-bg px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/admin')}
              className="p-2 rounded-full bg-white border border-vibe-cookie text-vibe-brown hover:bg-vibe-cookie/30"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-3xl font-bold text-vibe-brown">Edit Product</h1>
          </div>
          <button 
            onClick={() => router.push('/')} 
            className="flex items-center space-x-2 px-4 py-2 rounded-md bg-white border border-vibe-cookie text-vibe-brown hover:bg-vibe-cookie/30 transition-colors"
            title="Go to Home Page"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg border border-vibe-cookie p-6">
            <h2 className="text-xl font-semibold text-vibe-brown mb-6">Basic Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-vibe-brown mb-2">Product Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="w-full px-3 py-2 border border-vibe-cookie rounded-md focus:outline-none focus:ring-2 focus:ring-vibe-cookie"
                  placeholder="Enter product name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-vibe-brown mb-2">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => updateField('category', e.target.value)}
                  className="w-full px-3 py-2 border border-vibe-cookie rounded-md focus:outline-none focus:ring-2 focus:ring-vibe-cookie"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-vibe-brown mb-2">Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-vibe-cookie rounded-md focus:outline-none focus:ring-2 focus:ring-vibe-cookie"
                  placeholder="Enter product description"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-vibe-brown mb-2">Main Image *</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <input id="edit-main-image" type="file" accept="image/*" className="hidden" onChange={handleMainImageUpload} disabled={uploading} />
                    <label htmlFor="edit-main-image" className={`px-3 py-2 border-2 border-dashed rounded-md cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>Upload from device</label>
                    {mainImageFile && (
                      <span className="text-sm text-vibe-brown/70">{mainImageFile.name}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-vibe-brown/70">OR</span>
                    <input
                      type="url"
                      value={mainImageFile ? '' : form.image}
                      onChange={(e) => updateField('image', e.target.value)}
                      className="flex-1 px-3 py-2 border border-vibe-cookie rounded-md focus:outline-none focus:ring-2 focus:ring-vibe-cookie"
                      placeholder="https://example.com/image.jpg"
                      disabled={!!mainImageFile}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-vibe-brown mb-2">Ingredients *</label>
                <textarea
                  value={form.ingredients}
                  onChange={(e) => updateField('ingredients', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-vibe-cookie rounded-md focus:outline-none focus:ring-2 focus:ring-vibe-cookie"
                  placeholder="Enter ingredients list"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-vibe-brown mb-2">Product Video URL (optional)</label>
                <input
                  type="url"
                  value={form.video}
                  onChange={(e) => updateField('video', e.target.value)}
                  className="w-full px-3 py-2 border border-vibe-cookie rounded-md focus:outline-none focus:ring-2 focus:ring-vibe-cookie"
                  placeholder="https://example.com/video.mp4"
                />
              </div>
            </div>
          </div>

          {/* Additional Images */}
          <div className="bg-white rounded-lg border border-vibe-cookie p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-vibe-brown">Additional Images</h2>
              <button
                type="button"
                onClick={addImage}
                className="flex items-center gap-2 px-4 py-2 bg-vibe-cookie text-vibe-brown rounded-md hover:bg-vibe-brown hover:text-white"
              >
                <Plus className="h-4 w-4" />
                Add Image
              </button>
            </div>
            
                <div className="space-y-3">
                  {form.images.map((image, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center gap-3">
                        <input id={`edit-add-image-${index}`} type="file" accept="image/*" className="hidden" onChange={(e)=>handleAdditionalImageUpload(e, index)} disabled={uploading} />
                        <label htmlFor={`edit-add-image-${index}`} className={`px-3 py-2 border-2 border-dashed rounded-md cursor-pointer text-sm ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>Upload from device</label>
                        {additionalImageFiles[index] && (
                          <span className="text-xs text-vibe-brown/70">{additionalImageFiles[index].name}</span>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <input
                          type="url"
                          value={additionalImageFiles[index] ? '' : image}
                          onChange={(e) => updateImage(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-vibe-cookie rounded-md focus:outline-none focus:ring-2 focus:ring-vibe-cookie"
                          placeholder={`Additional image URL ${index + 1}`}
                          disabled={!!additionalImageFiles[index]}
                        />
                        {form.images.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
          </div>

          {/* Sizes and Pricing */}
          <div className="bg-white rounded-lg border border-vibe-cookie p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-vibe-brown">Sizes & Pricing *</h2>
              <button
                type="button"
                onClick={addSize}
                className="flex items-center gap-2 px-4 py-2 bg-vibe-cookie text-vibe-brown rounded-md hover:bg-vibe-brown hover:text-white"
              >
                <Plus className="h-4 w-4" />
                Add Size
              </button>
            </div>
            
            <div className="space-y-4">
              {form.sizes.map((size, index) => (
                <div key={index} className="grid md:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="block text-sm font-medium text-vibe-brown mb-2">Size Label</label>
                    <input
                      type="text"
                      value={size.size}
                      onChange={(e) => updateSize(index, 'size', e.target.value)}
                      className="w-full px-3 py-2 border border-vibe-cookie rounded-md focus:outline-none focus:ring-2 focus:ring-vibe-cookie"
                      placeholder="e.g., 100g"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-vibe-brown mb-2">Price (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={size.price}
                      onChange={(e) => updateSize(index, 'price', e.target.value)}
                      className="w-full px-3 py-2 border border-vibe-cookie rounded-md focus:outline-none focus:ring-2 focus:ring-vibe-cookie"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-vibe-brown mb-2">Stock</label>
                    <input
                      type="number"
                      min="0"
                      value={size.stock}
                      onChange={(e) => updateSize(index, 'stock', e.target.value)}
                      className="w-full px-3 py-2 border border-vibe-cookie rounded-md focus:outline-none focus:ring-2 focus:ring-vibe-cookie"
                      placeholder="0"
                      required
                    />
                  </div>
                  
                  <div>
                    {form.sizes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSize(index)}
                        className="w-full px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                      >
                        <X className="h-4 w-4 mx-auto" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nutrition Information */}
          <div className="bg-white rounded-lg border border-vibe-cookie p-6">
            <h2 className="text-xl font-semibold text-vibe-brown mb-6">Nutrition Information</h2>
            <div className="grid md:grid-cols-5 gap-4">
              {Object.entries(form.nutrition).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-vibe-brown mb-2 capitalize">{key}</label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => updateNutrition(key, e.target.value)}
                    className="w-full px-3 py-2 border border-vibe-cookie rounded-md focus:outline-none focus:ring-2 focus:ring-vibe-cookie"
                    placeholder={key}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Featured Product */}
          <div className="bg-white rounded-lg border border-vibe-cookie p-6">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                checked={form.featured}
                onChange={(e) => updateField('featured', e.target.checked)}
                className="w-4 h-4 text-vibe-cookie border-vibe-cookie rounded focus:ring-vibe-cookie"
              />
              <label htmlFor="featured" className="text-lg font-medium text-vibe-brown">
                Mark as Featured Product
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push('/admin')}
              className="px-6 py-3 border border-vibe-cookie text-vibe-brown rounded-md hover:bg-vibe-cookie/30"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-3 bg-vibe-cookie text-vibe-brown font-semibold rounded-md hover:bg-vibe-brown hover:text-white disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Update Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const EditProductPage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-vibe-bg text-vibe-brown">Loading...</div>}>
      <EditProductContent />
    </Suspense>
  );
}

export default EditProductPage
