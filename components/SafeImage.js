'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

const SafeImage = ({ 
  src, 
  alt, 
  fallback = '/images/hero-snack-1.jpg',
  fill = false,
  width,
  height,
  className = '',
  ...props 
}) => {
  const [imgSrc, setImgSrc] = useState(src || fallback)
  const [hasError, setHasError] = useState(false)

  // Update imgSrc when src prop changes
  useEffect(() => {
    if (src && src !== imgSrc && !hasError) {
      setImgSrc(src)
      setHasError(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]) // Only depend on src to avoid infinite loops

  const handleError = () => {
    if (!hasError && imgSrc !== fallback) {
      setHasError(true)
      setImgSrc(fallback)
    }
  }

  // If src is external URL, use unoptimized to avoid Next.js Image optimization issues
  const isExternal = imgSrc && (imgSrc.startsWith('http://') || imgSrc.startsWith('https://'))
  
  // For Next.js Image component, we need to handle external URLs
  if (fill) {
    return (
      <Image
        src={imgSrc}
        alt={alt || 'Image'}
        fill
        className={className}
        onError={handleError}
        unoptimized={isExternal}
        priority={false}
        style={{ backgroundColor: 'transparent', ...props.style }}
        {...props}
      />
    )
  }

  return (
    <Image
      src={imgSrc}
      alt={alt || 'Image'}
      width={width || 400}
      height={height || 300}
      className={className}
      onError={handleError}
      unoptimized={isExternal}
      priority={false}
      style={{ backgroundColor: 'transparent', ...props.style }}
      {...props}
    />
  )
}

export default SafeImage

