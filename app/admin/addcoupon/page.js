"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { buildApiUrl } from "../../../utils/api";

export default function AddCouponPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    code: "",
    description: "",
    discount: "",
    type: "percentage",
    categories: [],
    minOrderAmount: "",
    maxDiscount: "",
    noLimit: false,
    usageLimit: "",
    validFrom: "",
    validUntil: "",
    isActive: true,
    isFirstTimeOnly: false,
    applicableUsers: "",
    excludedUsers: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

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
    // Fetch categories from backend
    fetch(buildApiUrl('/products/categories'))
      .then(res => res.json())
      .then(data => {
        setCategories(data.data.categories || []);
      });
  }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    if (name === "categories") {
      setForm(prev => ({
        ...prev,
        categories: checked
          ? [...prev.categories, value]
          : prev.categories.filter(cat => cat !== value)
      }));
    } else if (name === "noLimit") {
      setForm(prev => ({ ...prev, noLimit: checked, maxDiscount: checked ? "" : prev.maxDiscount }));
    } else if (name === "isActive" || name === "isFirstTimeOnly") {
      setForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      // Build payload matching backend validation
      const allowedCategories = ["Makhana", "Chips", "Bites", "Nuts", "Seeds"];
      const payload = {
        code: form.code.trim(),
        description: form.description.trim(),
        discount: parseFloat(form.discount),
        type: form.type,
        categories: form.categories.filter(cat => allowedCategories.includes(cat)),
        minOrderAmount: form.minOrderAmount ? parseFloat(form.minOrderAmount) : 0,
        maxDiscount: form.noLimit ? -1 : (form.maxDiscount ? parseFloat(form.maxDiscount) : undefined),
        usageLimit: form.usageLimit ? parseInt(form.usageLimit) : -1,
        validFrom: form.validFrom || new Date().toISOString().slice(0, 10),
        validUntil: form.validUntil,
        isActive: form.isActive,
        isFirstTimeOnly: form.isFirstTimeOnly,
        applicableUsers: form.applicableUsers ? form.applicableUsers.split(',').map(u => u.trim()) : [],
        excludedUsers: form.excludedUsers ? form.excludedUsers.split(',').map(u => u.trim()) : []
      };
      const res = await fetch(buildApiUrl('/coupons'), {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Coupon added successfully!");
        setForm({
          code: "",
          description: "",
          discount: "",
          type: "percentage",
          categories: [],
          minOrderAmount: "",
          maxDiscount: "",
          noLimit: false,
          usageLimit: "",
          validFrom: "",
          validUntil: "",
          isActive: true,
          isFirstTimeOnly: false,
          applicableUsers: "",
          excludedUsers: ""
        });
      } else {
        // Show detailed validation errors if present
        if (data.errors && Array.isArray(data.errors)) {
          setError(data.errors.map(e => e.msg).join(", "));
        } else {
          setError(data.message || "Error adding coupon");
        }
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Add Coupon</h1>
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow">
          <div className="mb-4">
            <label className="block font-medium mb-2">Coupon Code</label>
            <input
              type="text"
              name="code"
              value={form.code}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-2">Description</label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
              maxLength={200}
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-2">Discount</label>
            <input
              type="number"
              name="discount"
              value={form.discount}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
              min="1"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-2">Minimum Order Amount (₹)</label>
            <input
              type="number"
              name="minOrderAmount"
              value={form.minOrderAmount}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              min="0"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-2">Usage Limit</label>
            <input
              type="number"
              name="usageLimit"
              value={form.usageLimit}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              min="-1"
              placeholder="-1 for unlimited"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-2">Valid From</label>
            <input
              type="date"
              name="validFrom"
              value={form.validFrom}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-2">Is Active</label>
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-2">First Time Only</label>
            <input
              type="checkbox"
              name="isFirstTimeOnly"
              checked={form.isFirstTimeOnly}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-2">Applicable Users (comma separated user IDs)</label>
            <input
              type="text"
              name="applicableUsers"
              value={form.applicableUsers}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-2">Excluded Users (comma separated user IDs)</label>
            <input
              type="text"
              name="excludedUsers"
              value={form.excludedUsers}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-2">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-2">Categories</label>
            <div className="flex flex-wrap gap-3">
              {categories.map(cat => {
                const value = cat.category || cat._id || cat;
                return (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="categories"
                      value={value}
                      checked={form.categories.includes(value)}
                      onChange={handleChange}
                    />
                    {value}
                  </label>
                );
              })}
            </div>
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-2">Max Discount (₹)</label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                name="maxDiscount"
                value={form.noLimit ? "" : form.maxDiscount}
                onChange={handleChange}
                className="border px-3 py-2 rounded"
                min="0"
                disabled={form.noLimit}
                style={{ width: "150px" }}
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="noLimit"
                  checked={form.noLimit}
                  onChange={handleChange}
                />
                Unlimited
              </label>
            </div>
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-2">Expiry Date</label>
            <input
              type="date"
              name="validUntil"
              value={form.validUntil}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div className="mb-6 flex justify-center">
            <button
              type="submit"
              className="bg-brown text-black px-8 py-3 rounded-lg text-lg font-semibold shadow hover:bg-vibe-accent transition border-2 border-vibe-brown"
              disabled={loading}
              style={{ minWidth: "180px" }}
            >
              {loading ? "Adding..." : "Add Coupon"}
            </button>
          </div>
          {success && <p className="text-green-600 mt-4">{success}</p>}
          {error && <p className="text-red-600 mt-4">{error}</p>}
        </form>
        <div className="mt-8">
          <Link href="/admin" className="text-primary hover:underline">&larr; Back to Admin</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
