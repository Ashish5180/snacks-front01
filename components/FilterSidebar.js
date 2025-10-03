'use client'

import React from 'react'
import { X } from 'lucide-react'

const FilterSidebar = ({ filters, onFilterChange, onClearFilters, categories }) => {
  const priceRanges = [
    { label: 'Under ₹50', value: '0-50' },
    { label: '₹50 - ₹100', value: '50-100' },
    { label: '₹100 - ₹150', value: '100-150' },
    { label: 'Over ₹150', value: '150-999' }
  ]

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-vibe-brown">Filters</h3>
        <button
          onClick={onClearFilters}
          className="text-sm text-vibe-brown/60 hover:text-vibe-brown transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h4 className="font-medium text-vibe-brown mb-4">Categories</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category._id || category.id || category.name} className="flex items-center">
              <input
                type="radio"
                name="category"
                value={category.name}
                checked={filters.category === category.name}
                onChange={(e) => onFilterChange({ category: e.target.value })}
                className="mr-3 text-vibe-cookie focus:ring-vibe-cookie"
              />
              <span className="text-vibe-brown/80">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <h4 className="font-medium text-vibe-brown mb-4">Price Range</h4>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <label key={range.value} className="flex items-center">
              <input
                type="radio"
                name="priceRange"
                value={range.value}
                checked={filters.priceRange === range.value}
                onChange={(e) => onFilterChange({ priceRange: e.target.value })}
                className="mr-3 text-vibe-cookie focus:ring-vibe-cookie"
              />
              <span className="text-vibe-brown/80">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Active Filters */}
      {(filters.category || filters.priceRange) && (
        <div className="mb-6">
          <h4 className="font-medium text-vibe-brown mb-3">Active Filters</h4>
          <div className="space-y-2">
            {filters.category && (
              <div className="flex items-center justify-between bg-vibe-bg px-3 py-2 rounded-lg">
                <span className="text-sm text-vibe-brown">
                  Category: {filters.category}
                </span>
                <button
                  onClick={() => onFilterChange({ category: '' })}
                  className="text-vibe-brown/60 hover:text-vibe-brown"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            {filters.priceRange && (
              <div className="flex items-center justify-between bg-vibe-bg px-3 py-2 rounded-lg">
                <span className="text-sm text-vibe-brown">
                  Price: {priceRanges.find(p => p.value === filters.priceRange)?.label}
                </span>
                <button
                  onClick={() => onFilterChange({ priceRange: '' })}
                  className="text-vibe-brown/60 hover:text-vibe-brown"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

  {/* ...existing code... */}
    </div>
  )
}

export default FilterSidebar 