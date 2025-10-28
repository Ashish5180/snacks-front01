"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";
import FilterSidebar from "../../components/FilterSidebar";
import { Filter, Grid, List } from "lucide-react";
import Head from "next/head";
import { getApiUrl } from "../../utils/api";

function ProductsContent() {
	const searchParams = useSearchParams();
	const [products, setProducts] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [viewMode, setViewMode] = useState("grid");
	const [showFilters, setShowFilters] = useState(false);
	const [filters, setFilters] = useState({
		category: searchParams.get("category") || "",
		priceRange: "",
		search: searchParams.get("search") || "",
	});
	const [categories, setCategories] = useState([]);
	const apiBase = getApiUrl();
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const res = await fetch(`${apiBase}/products`);
				const data = await res.json();
				if (res.ok && data.success) {
					setProducts(data.data.products);
				} else {
					setProducts([]);
				}
			} catch (err) {
				setProducts([]);
			}
		};
		const fetchCategories = async () => {
			try {
				const res = await fetch(`${apiBase}/categories`);
				const data = await res.json();
				if (res.ok && data.success) {
					setCategories(data.data.categories || []);
				} else {
					setCategories([]);
				}
			} catch (err) {
				setCategories([]);
			}
		};
		fetchProducts();
		fetchCategories();
	}, [apiBase]);

	useEffect(() => {
		let filtered = products;
		if (filters.category) {
			filtered = filtered.filter(
				(product) =>
					product.category?.toLowerCase() === filters.category.toLowerCase()
			);
		}
		if (filters.priceRange) {
			const [min, max] = filters.priceRange.split("-").map(Number);
			filtered = filtered.filter((product) => {
				const minPrice = Math.min(...(product.sizes || []).map((s) => s.price));
				return minPrice >= min && (max ? minPrice <= max : true);
			});
		}
		if (filters.search) {
			filtered = filtered.filter(
				(product) =>
					product.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
					product.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
					product.category?.toLowerCase().includes(filters.search.toLowerCase())
			);
		}
		setFilteredProducts(filtered);
	}, [products, filters]);

	const productsSchema = {
		"@context": "https://schema.org",
		"@type": "ItemList",
		"name": "VIBE BITES Products",
		"description": "Healthy snacks collection",
		"numberOfItems": products.length,
		"itemListElement": products.map((product, index) => ({
			"@type": "ListItem",
			"position": index + 1,
			"item": {
				"@type": "Product",
				"name": product.name,
				"description": product.description,
				"image": product.image,
				"brand": {
					"@type": "Brand",
					"name": "VIBE BITES",
				},
				"offers": {
					"@type": "Offer",
					"price": Math.min(...(product.sizes || []).map((s) => s.price)),
					"priceCurrency": "INR",
					"availability": "https://schema.org/InStock",
				},
			},
		})),
	};

	const handleFilterChange = (newFilters) => {
		setFilters((prev) => ({ ...prev, ...newFilters }));
	};

	const clearFilters = () => {
		setFilters({ category: "", priceRange: "", search: "" });
	};

	return (
		<React.Fragment>
			<Head>
				<title>Products | VIBE BITES</title>
				<meta name="description" content="Browse our complete collection of healthy snacks including roasted makhanas, baked chips, and protein energy bites. Find your perfect healthy snack at VIBE BITES." />
				<meta name="keywords" content="healthy snacks, roasted makhanas, baked chips, protein snacks, energy bites, organic snacks, gluten-free snacks" />
				<meta property="og:title" content="Products | VIBE BITES" />
				<meta property="og:description" content="Browse our complete collection of healthy snacks including roasted makhanas, baked chips, and protein energy bites." />
				<meta property="og:type" content="website" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content="Products | VIBE BITES" />
				<meta name="twitter:description" content="Browse our complete collection of healthy snacks." />
				{isClient && (
					<script
						type="application/ld+json"
						dangerouslySetInnerHTML={{ __html: JSON.stringify(productsSchema) }}
					/>
				)}
			</Head>
			<div className="min-h-screen bg-vibe-bg">
				<Navbar />
				<div className="pt-20">
					<div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
					<div className="mb-8">
						<h1 className="text-3xl md:text-4xl font-bold text-vibe-brown mb-4">Our Products</h1>
						<p className="text-lg text-vibe-brown/70">Discover our range of healthy and delicious snacks</p>
						{filters.search && (
							<div className="mt-4 p-3 bg-vibe-cookie/20 rounded-lg">
								<p className="text-vibe-brown">
									Search results for: <span className="font-semibold">&quot;{filters.search}&quot;</span>
									<button
										onClick={() => handleFilterChange({ search: "" })}
										className="ml-2 text-vibe-brown/60 hover:text-vibe-brown underline"
									>
										Clear search
									</button>
								</p>
							</div>
						)}
					</div>
					<div className="flex flex-col lg:flex-row gap-6 mb-8">
						<div className="flex-1">
							<div className="relative">
								<input
									type="text"
									placeholder="Search products..."
									value={filters.search}
									onChange={(e) => handleFilterChange({ search: e.target.value })}
									className="w-full pl-10 pr-4 py-3 border border-vibe-cookie rounded-full text-vibe-brown placeholder-vibe-brown/60 focus:outline-none focus:ring-2 focus:ring-vibe-cookie focus:border-transparent"
								/>
								<Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-vibe-brown" />
							</div>
						</div>
						<div className="flex items-center gap-2">
							<button
								onClick={() => setViewMode("grid")}
								className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-vibe-cookie text-vibe-brown" : "text-vibe-brown hover:bg-vibe-cookie/20"}`}
							>
								<Grid className="h-5 w-5" />
							</button>
							<button
								onClick={() => setViewMode("list")}
								className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-vibe-cookie text-vibe-brown" : "text-vibe-brown hover:bg-vibe-cookie/20"}`}
							>
								<List className="h-5 w-5" />
							</button>
						</div>
						<button
							onClick={() => setShowFilters(!showFilters)}
							className="lg:hidden flex items-center gap-2 px-4 py-2 bg-vibe-cookie text-vibe-brown rounded-full hover:bg-vibe-accent transition-colors"
						>
							<Filter className="h-5 w-5" />
							Filters
						</button>
					</div>
					<div className="flex gap-8">
						<div className={`lg:block ${showFilters ? "block" : "hidden"} lg:w-64 flex-shrink-0`}>
							<FilterSidebar
								filters={filters}
								onFilterChange={handleFilterChange}
								onClearFilters={clearFilters}
								categories={categories}
							/>
						</div>
						<div className="flex-1">
							{filteredProducts.length === 0 ? (
								<div className="text-center py-12">
									<h3 className="text-xl font-semibold text-vibe-brown mb-2">No products found</h3>
									<p className="text-vibe-brown/70 mb-4">Try adjusting your filters or search terms</p>
									<button
										onClick={clearFilters}
										className="px-6 py-2 bg-vibe-cookie text-vibe-brown rounded-full hover:bg-vibe-accent transition-colors"
									>
										Clear All Filters
									</button>
								</div>
							) : (
								<div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
									{filteredProducts.map((product) => (
										<ProductCard key={product._id || product.id} product={product} viewMode={viewMode} />
									))}
								</div>
							)}
						</div>
					</div>
					</div>
				</div>
				<Footer />
			</div>
		</React.Fragment>
	);
};

const ProductsPage = () => {
	return (
		<Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-vibe-bg text-vibe-brown">Loading...</div>}>
			<ProductsContent />
		</Suspense>
	);
};

export default ProductsPage;
