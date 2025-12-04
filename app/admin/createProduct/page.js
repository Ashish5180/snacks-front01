'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '../../../components/Toaster'
import { Plus, X, Loader2, Home } from 'lucide-react'
import { getApiUrl } from '../../../utils/api'
import Image from 'next/image'

// Remove hardcoded enum, use dynamic categories from backend

const CreateProductPage = () => {
  const router = useRouter()
  const { addToast } = useToast()
  const [user, setUser] = useState(null)
  const [loadingAuth, setLoadingAuth] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const apiBase = getApiUrl()
  const [categories, setCategories] = useState([])

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

  // File upload states
  const [mainImageFile, setMainImageFile] = useState(null)
  const [additionalImageFiles, setAdditionalImageFiles] = useState([])
  const [uploading, setUploading] = useState(false)

  // Auth check
  useEffect(() => {
    const check = async () => {
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

        const res = await fetch(`${apiBase}/auth/me`, { headers: getAuthHeaders() })
        if (!res.ok) {
          // Handle different error statuses
          if (res.status === 500) {
            addToast('Server error. Please try again later.', 'error')
          } else if (res.status === 401) {
            addToast('Your session has expired. Please login again.', 'error')
          }
          
          // Clear token and redirect to login
          if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
          }
          router.push('/login')
          return
        }
        
        const data = await res.json()
        if (data.success && data.data.role === 'admin') {
          setUser(data.data)
        } else {
          addToast('Admin access required', 'error')
          router.push('/')
        }
      } catch (e) {
        // Clear invalid token and redirect
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
        router.push('/login')
      } finally {
        setLoadingAuth(false)
      }
    }
    check()
  }, [apiBase, router, addToast])

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${apiBase}/categories/all`, { headers: getAuthHeaders() })
        if (res.ok) {
          const data = await res.json()
          setCategories(data.data.categories.filter(cat => cat.isActive))
          if (data.data.categories.length && !form.category) {
            setForm(f => ({ ...f, category: data.data.categories[0].name }))
          }
        }
      } catch (e) {
        addToast('Error loading categories', 'error')
      }
    }
    fetchCategories()
    // eslint-disable-next-line
  }, [])

  const updateField = (field, value) => setForm(f => ({ ...f, [field]: value }))
  const updateNutrition = (nField, value) => setForm(f => ({ ...f, nutrition: { ...f.nutrition, [nField]: value } }))

  const updateSize = (idx, key, value) => {
    setForm(f => ({
      ...f,
      sizes: f.sizes.map((s, i) => i === idx ? { ...s, [key]: value } : s)
    }))
  }

  const addSize = () => setForm(f => ({ ...f, sizes: [...f.sizes, { size: '', price: '', stock: '' }] }))
  const removeSize = (idx) => setForm(f => ({ ...f, sizes: f.sizes.filter((_, i) => i !== idx) }))

  const addImage = () => setForm(f => ({ ...f, images: [...f.images, ''] }))
  const updateImage = (idx, value) => setForm(f => ({ ...f, images: f.images.map((im, i) => i === idx ? value : im) }))
  const removeImage = (idx) => setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))

  // File upload functions
  const uploadImageToServer = async (file, isMainImage = true) => {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('isMainImage', isMainImage.toString())

    try {
      const response = await fetch(`${apiBase}/admin/upload-image`, {
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

  const handleMainImageUpload = async (event) => {
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
      const imageUrl = await uploadImageToServer(file, true)
      setMainImageFile(file)
      updateField('image', imageUrl)
      addToast('Main image uploaded successfully', 'success')
    } catch (error) {
      addToast('Error uploading image: ' + error.message, 'error')
    } finally {
      setUploading(false)
    }
  }

  const handleAdditionalImageUpload = async (event, index) => {
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
      const imageUrl = await uploadImageToServer(file, false)
      
      // Update the additional image files array
      const newFiles = [...additionalImageFiles]
      newFiles[index] = file
      setAdditionalImageFiles(newFiles)
      
      // Update the form with the server URL
      updateImage(index, imageUrl)
      addToast('Additional image uploaded successfully', 'success')
    } catch (error) {
      addToast('Error uploading image: ' + error.message, 'error')
    } finally {
      setUploading(false)
    }
  }

  const clearMainImage = () => {
    setMainImageFile(null)
    updateField('image', '')
  }

  const clearAdditionalImage = (index) => {
    const newFiles = [...additionalImageFiles]
    newFiles[index] = null
    setAdditionalImageFiles(newFiles)
    updateImage(index, '')
  }

  const validateClient = () => {
    const errors = []
    if (!form.name.trim()) errors.push('Name required')
    // Allow empty/short descriptions
    if (!form.image.trim()) errors.push('Main image required')
    if (!form.ingredients.trim()) errors.push('Ingredients required')
    form.sizes.forEach((s, i) => {
      if (!s.size) errors.push(`Size #${i+1} label required`)
      if (s.price === '' || isNaN(parseFloat(s.price))) errors.push(`Size #${i+1} price invalid`)
      if (s.stock === '' || isNaN(parseInt(s.stock))) errors.push(`Size #${i+1} stock invalid`)
    })
    Object.entries(form.nutrition).forEach(([k,v]) => { if (!v) errors.push(`Nutrition ${k} required`) })
    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validateClient()
    if (errs.length) { errs.slice(0,6).forEach(m => addToast(m, 'error')); return }
    setSubmitting(true)
    
    try {
      // Prepare payload with proper image handling
      const payload = {
        ...form,
        sizes: form.sizes.map(s => ({ size: s.size.trim(), price: parseFloat(s.price), stock: parseInt(s.stock) })),
        images: form.images.filter(im => im.trim()),
        video: form.video?.trim() || ''
      }

      // Use FormData if we have uploaded files, otherwise use JSON
      const hasUploadedFiles = mainImageFile || additionalImageFiles.some(file => file !== null);
      
      let requestOptions;
      
      if (hasUploadedFiles) {
        // Use FormData for multipart upload
        const formData = new FormData();
        
        // Add all form fields
        Object.keys(payload).forEach(key => {
          if (key === 'sizes' || key === 'images' || key === 'nutrition') {
            formData.append(key, JSON.stringify(payload[key]));
          } else {
            formData.append(key, payload[key]);
          }
        });
        
        // Add main image file if exists
        if (mainImageFile) {
          formData.append('image', mainImageFile);
        }
        
        // Add additional image files with proper field names
        additionalImageFiles.forEach((file, index) => {
          if (file) {
            formData.append('images', file);
          }
        });
        
        requestOptions = {
          method: 'POST',
          headers: getFileUploadHeaders(),
          body: formData
        };
      } else {
        // Use JSON for URL-based images
        requestOptions = {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload)
        };
      }

      const res = await fetch(`${apiBase}/admin/products/create`, requestOptions);
      const data = await res.json().catch(()=>({}));
      
      if (res.ok && data.success) {
        addToast('Product created successfully', 'success');
        router.push('/admin');
      } else {
        if (data.errors) data.errors.slice(0,6).forEach(er => addToast(er.msg, 'error'));
        else addToast(data.message || 'Create failed', 'error');
      }
    } catch (e) {
      console.error('Submit error:', e);
      addToast('Network error: ' + e.message, 'error');
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingAuth) return <div className='min-h-screen flex items-center justify-center bg-vibe-bg text-vibe-brown'>Checking auth...</div>

  return (
    <div className='min-h-screen bg-vibe-bg px-4 py-8 max-w-5xl mx-auto'>
      <div className='flex items-center justify-between mb-8'>
        <h1 className='text-3xl font-bold text-vibe-brown'>Create Product</h1>
        <div className='flex items-center space-x-3'>
          <button 
            onClick={() => router.push('/')} 
            className='flex items-center space-x-2 px-4 py-2 rounded-md bg-white border border-vibe-cookie text-vibe-brown hover:bg-vibe-cookie/30 transition-colors'
            title="Go to Home Page"
          >
            <Home className='h-4 w-4' />
            <span>Home</span>
          </button>
          <button onClick={() => router.push('/admin')} className='px-4 py-2 rounded-md bg-white border border-vibe-cookie text-vibe-brown hover:bg-vibe-cookie/30'>Back</button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className='space-y-8'>
        <section className='bg-white border border-vibe-cookie rounded-lg p-6 space-y-4'>
          <h2 className='text-lg font-semibold text-vibe-brown'>Basic Info</h2>
          <div className='grid md:grid-cols-2 gap-4'>
            <input className='input' placeholder='Name' value={form.name} onChange={e=>updateField('name', e.target.value)} />
            <select className='input' value={form.category} onChange={e=>updateField('category', e.target.value)}>
              {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
            </select>
            
            {/* Main Image Section */}
            <div className='md:col-span-2 space-y-3'>
              <label className='block text-sm font-medium text-vibe-brown'>Main Product Image</label>
              
              {/* File Upload Option */}
              <div className='space-y-2'>
                <div className='flex items-center gap-4'>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageUpload}
                    className='hidden'
                    id='main-image-upload'
                    disabled={uploading}
                  />
                  <label
                    htmlFor='main-image-upload'
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-vibe-cookie/50 hover:border-vibe-cookie transition-colors cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Plus className='h-4 w-4 text-vibe-brown' />
                    <span className='text-vibe-brown'>
                      {uploading ? 'Uploading...' : 'Upload from device'}
                    </span>
                  </label>
                  
                  {mainImageFile && (
                    <div className='flex items-center gap-2'>
                      <span className='text-sm text-vibe-brown/70'>{mainImageFile.name}</span>
                      <button
                        type='button'
                        onClick={clearMainImage}
                        className='p-1 text-red-600 hover:text-red-800'
                      >
                        <X className='h-4 w-4' />
                      </button>
                    </div>
                  )}
                </div>
                
                {/* URL Input Option */}
                <div className='flex items-center gap-2'>
                  <span className='text-sm text-vibe-brown/70'>OR</span>
                  <input 
                    className='input flex-1' 
                    placeholder='Enter Image URL' 
                    value={mainImageFile ? '' : form.image} 
                    onChange={e=>updateField('image', e.target.value)}
                    disabled={!!mainImageFile}
                  />
                </div>
                
                {/* Image Preview */}
                {form.image && (
                  <div className='mt-2'>
                    <div className='relative h-32 w-32 rounded-lg border border-vibe-cookie/30 overflow-hidden'>
                      <Image 
                        src={form.image} 
                        alt='Main product preview' 
                        fill
                        className='object-cover'
                        onError={(e) => {
                          // Retry loading the image once after a short delay
                          setTimeout(() => {
                            if (e.target.src !== form.image) {
                              e.target.src = form.image;
                            } else {
                              e.target.style.display = 'none'
                              // addToast('Invalid image URL', 'error')
                            }
                          }, 1000);
                        }}
                        onLoad={() => {
                          // Image loaded successfully, ensure it's visible
                          document.querySelector('.h-32.w-32.object-cover').style.display = 'block';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <textarea className='input md:col-span-2' rows={3} placeholder='Description' value={form.description} onChange={e=>updateField('description', e.target.value)} />
            <textarea className='input md:col-span-2' rows={2} placeholder='Ingredients' value={form.ingredients} onChange={e=>updateField('ingredients', e.target.value)} />
            <input className='input md:col-span-2' placeholder='Product Video URL (optional)' value={form.video} onChange={e=>updateField('video', e.target.value)} />
          </div>
        </section>

        <section className='bg-white border border-vibe-cookie rounded-lg p-6 space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold text-vibe-brown'>Additional Images (optional)</h2>
            <button type='button' onClick={addImage} className='flex items-center gap-1 text-sm px-3 py-1 rounded bg-vibe-cookie text-vibe-brown hover:bg-vibe-brown hover:text-white'><Plus className='h-4 w-4'/>Add</button>
          </div>
          <div className='space-y-4'>
            {form.images.map((img, idx) => (
              <div key={idx} className='border border-vibe-cookie/20 rounded-lg p-4 space-y-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium text-vibe-brown'>Image #{idx + 1}</span>
                  {form.images.length > 1 && (
                    <button 
                      type='button' 
                      onClick={() => removeImage(idx)} 
                      className='p-1 text-red-600 hover:text-red-800'
                    >
                      <X className='h-4 w-4' />
                    </button>
                  )}
                </div>
                
                {/* File Upload Option */}
                <div className='space-y-2'>
                  <div className='flex items-center gap-4'>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleAdditionalImageUpload(e, idx)}
                      className='hidden'
                      id={`additional-image-upload-${idx}`}
                      disabled={uploading}
                    />
                    <label
                      htmlFor={`additional-image-upload-${idx}`}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-dashed border-vibe-cookie/50 hover:border-vibe-cookie transition-colors cursor-pointer text-sm ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Plus className='h-3 w-3 text-vibe-brown' />
                      <span className='text-vibe-brown'>
                        {uploading ? 'Uploading...' : 'Upload from device'}
                      </span>
                    </label>
                    
                    {additionalImageFiles[idx] && (
                      <div className='flex items-center gap-2'>
                        <span className='text-xs text-vibe-brown/70'>{additionalImageFiles[idx].name}</span>
                        <button
                          type='button'
                          onClick={() => clearAdditionalImage(idx)}
                          className='p-1 text-red-600 hover:text-red-800'
                        >
                          <X className='h-3 w-3' />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* URL Input Option */}
                  <div className='flex items-center gap-2'>
                    <span className='text-xs text-vibe-brown/70'>OR</span>
                    <input 
                      className='input flex-1' 
                      placeholder={`Image URL #${idx + 1}`} 
                      value={additionalImageFiles[idx] ? '' : img} 
                      onChange={e => updateImage(idx, e.target.value)}
                      disabled={!!additionalImageFiles[idx]}
                    />
                  </div>
                  
                  {/* Image Preview */}
                  {img && (
                    <div className='mt-2'>
                      <div className='relative h-24 w-24 rounded-lg border border-vibe-cookie/30 overflow-hidden'>
                        <Image 
                          src={img} 
                          alt={`Additional product preview ${idx + 1}`} 
                          fill
                          className='object-cover'
                          onError={(e) => {
                            e.target.style.display = 'none'
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className='bg-white border border-vibe-cookie rounded-lg p-6 space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold text-vibe-brown'>Sizes & Pricing</h2>
            <button type='button' onClick={addSize} className='flex items-center gap-1 text-sm px-3 py-1 rounded bg-vibe-cookie text-vibe-brown hover:bg-vibe-brown hover:text-white'><Plus className='h-4 w-4'/>Add Size</button>
          </div>
          <div className='space-y-3'>
            {form.sizes.map((s, idx) => (
              <div key={idx} className='grid md:grid-cols-4 gap-3 items-start'>
                <input className='input' placeholder='Size label (e.g. 100g)' value={s.size} onChange={e=>updateSize(idx,'size',e.target.value)} />
                <input className='input' placeholder='Price' value={s.price} onChange={e=>updateSize(idx,'price',e.target.value)} />
                <input className='input' placeholder='Stock' value={s.stock} onChange={e=>updateSize(idx,'stock',e.target.value)} />
                <div className='flex items-center'>
                  {form.sizes.length>1 && <button type='button' onClick={()=>removeSize(idx)} className='px-2 rounded bg-red-100 text-red-700 hover:bg-red-200 h-9'><X className='h-4 w-4'/></button>}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className='bg-white border border-vibe-cookie rounded-lg p-6 space-y-4'>
            <h2 className='text-lg font-semibold text-vibe-brown'>Nutrition</h2>
            <div className='grid md:grid-cols-5 gap-3'>
              {Object.keys(form.nutrition).map(key => (
                <input key={key} className='input' placeholder={key} value={form.nutrition[key]} onChange={e=>updateNutrition(key, e.target.value)} />
              ))}
            </div>
        </section>

        <div className='pt-2'>
          <div className='flex items-center gap-4 mb-4'>
            <label className='flex items-center gap-2 text-vibe-brown font-medium'>
              <input type='checkbox' checked={form.featured} onChange={e=>updateField('featured', e.target.checked)} />
              Featured Product
            </label>
          </div>
          <button disabled={submitting} type='submit' className='px-6 py-3 rounded-md bg-vibe-cookie text-vibe-brown font-semibold hover:bg-vibe-brown hover:text-white transition-colors disabled:opacity-50 flex items-center gap-2'>
            {submitting && <Loader2 className='h-4 w-4 animate-spin'/>}
            {submitting ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </form>

      <style jsx global>{`
        .input { @apply px-3 py-2 border border-vibe-cookie rounded-md focus:outline-none focus:ring-2 focus:ring-vibe-cookie bg-white text-vibe-brown placeholder-gray-400; }
      `}</style>
    </div>
  )
}

export default CreateProductPage
