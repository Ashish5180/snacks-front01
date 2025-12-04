"use client";

import dynamic from 'next/dynamic'
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function EditCouponContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const couponId = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    code: "",
    description: "",
    discount: "",
    type: "percentage",
    categories: [],
    maxDiscount: "",
    minOrderAmount: "",
    usageLimit: "",
    validUntil: "",
    isActive: true
  });

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
    // Fetch categories
    fetch(buildApiUrl('/products/categories'))
      .then(res => res.json())
      .then(data => setCategories(data.data.categories || []));
    // Fetch coupon details
    if (couponId) {
      fetch(buildApiUrl(`/admin/coupons/${couponId}`), {
        headers: getAuthHeaders()
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data.coupon) {
            const c = data.data.coupon;
            setForm({
              code: c.code || "",
              description: c.description || "",
              discount: c.discount || "",
              type: c.type || "percentage",
              categories: c.categories || [],
              maxDiscount: c.maxDiscount || "",
              minOrderAmount: c.minOrderAmount || "",
              usageLimit: c.usageLimit || "",
              validUntil: c.validUntil ? c.validUntil.slice(0, 10) : "",
              isActive: c.isActive
            });
          } else {
            setError(data.message || "Coupon not found");
          }
          setLoading(false);
        })
        .catch(() => {
          setError("Error loading coupon");
          setLoading(false);
        });
    }
  }, [couponId]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    if (name === "categories") {
      setForm(prev => ({
        ...prev,
        categories: checked
          ? [...prev.categories, value]
          : prev.categories.filter(cat => cat !== value)
      }));
    } else if (type === "checkbox") {
      setForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const allowedCategories = ["Makhana", "Chips", "Bites", "Nuts", "Seeds"];
      const payload = {
        code: form.code.trim(),
        description: form.description.trim(),
        discount: parseFloat(form.discount),
        type: form.type,
        categories: form.categories.filter(cat => allowedCategories.includes(cat)),
        maxDiscount: form.maxDiscount ? parseFloat(form.maxDiscount) : undefined,
        minOrderAmount: form.minOrderAmount ? parseFloat(form.minOrderAmount) : undefined,
        usageLimit: form.usageLimit ? parseInt(form.usageLimit) : undefined,
        validUntil: form.validUntil,
        isActive: form.isActive
      };
      const res = await fetch(buildApiUrl(`/coupons/${couponId}`), {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Coupon updated successfully!");
        setTimeout(() => router.push("/admin"), 1200);
      } else {
        if (data.errors && Array.isArray(data.errors)) {
          setError(data.errors.map(e => e.msg).join(", "));
        } else {
          setError(data.message || "Error updating coupon");
        }
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Edit Coupon</h1>
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow">
          <div className="mb-4">
            <label className="block font-medium mb-2">Coupon Code</label>
            <input type="text" name="code" value={form.code} onChange={handleChange} className="w-full border px-3 py-2 rounded" required maxLength={20} />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-2">Description</label>
            <input type="text" name="description" value={form.description} onChange={handleChange} className="w-full border px-3 py-2 rounded" required maxLength={200} />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-2">Discount</label>
            <input type="number" name="discount" value={form.discount} onChange={handleChange} className="w-full border px-3 py-2 rounded" required min="0" />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-2">Type</label>
            <select name="type" value={form.type} onChange={handleChange} className="w-full border px-3 py-2 rounded" required>
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
                    <input type="checkbox" name="categories" value={value} checked={form.categories.includes(value)} onChange={handleChange} />
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
                  checked={form.noLimit || form.maxDiscount === -1}
                  onChange={e => {
                    const checked = e.target.checked;
                    setForm(prev => ({
                      ...prev,
                      noLimit: checked,
                      maxDiscount: checked ? -1 : prev.maxDiscount
                    }));
                  }}
                />
                Unlimited
              </label>
            </div>
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-2">Min Order Amount (₹)</label>
            <input type="number" name="minOrderAmount" value={form.minOrderAmount} onChange={handleChange} className="border px-3 py-2 rounded" min="0" />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-2">Usage Limit</label>
            <input type="number" name="usageLimit" value={form.usageLimit} onChange={handleChange} className="border px-3 py-2 rounded" min="-1" />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-2">Expiry Date</label>
            <input type="date" name="validUntil" value={form.validUntil} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
          </div>
          <div className="mb-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
              Active
            </label>
          </div>
          <div className="mb-6 flex justify-center">
            <button type="submit" className="bg-brown text-black px-8 py-3 rounded-lg text-lg font-semibold shadow hover:bg-primary-dark transition border-2 border-primary" disabled={loading} style={{ minWidth: "180px" }}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
          {success && <p className="text-green-600 mt-4">{success}</p>}
          {error && <p className="text-red-600 mt-4">{error}</p>}
        </form>
        <div className="mt-8">
          <button onClick={() => router.push("/admin")} className="text-primary hover:underline">&larr; Back to Admin</button>
        </div>
      </main>
      <Footer />
    </>
  );
}

const EditCouponPage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-vibe-bg text-vibe-brown">Loading...</div>}>
      <EditCouponContent />
    </Suspense>
  );
}

export default dynamic(() => Promise.resolve(EditCouponPage), {
  ssr: false,
  loading: () => <div className="min-h-screen flex items-center justify-center bg-vibe-bg text-vibe-brown">Loading...</div>
})
