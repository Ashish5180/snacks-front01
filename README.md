# VIBE BITES - E-commerce Frontend

A fully responsive, branded e-commerce frontend for VIBE BITES healthy snacks, built with Next.js and Tailwind CSS.

## 🎯 Features

### ✅ Core E-commerce Functionality
- **Shopping Cart System** - Add, remove, update quantities with local storage persistence
- **Product Variants** - Multiple pack sizes (50g, 100g, 200g) with dynamic pricing
- **Video Upload & Display** - Optional product videos with play button overlay on product cards
- **Coupon System** - VIBE10 (10% off) and MAKHANA20 (20% off makhana products)
- **Product Filtering** - By category, price range, and search functionality
- **Responsive Design** - Mobile-first approach with full responsive layout

### ✅ Pages & Routing
- **Homepage** (`/`) - Hero section, categories, featured products
- **Products Page** (`/products`) - Grid/list view with filtering and search
- **Product Detail** (`/product/[id]`) - Individual product with size selection and optional video display
- **Cart Page** (`/cart`) - Cart management with quantity controls
- **About Page** (`/about`) - Brand story and company information
- **Contact Page** (`/contact`) - Contact form and company details
- **Track Order** (`/track-order`) - Order tracking with cancel/return request functionality
- **Profile** (`/profile`) - User profile with order history

### ✅ Brand Identity
- **Custom Color Palette**: 
  - Background: `#FFF4E0`
  - Primary Brown: `#5A3B1C`
  - Cookie Accent: `#D9A25F`
- **Typography**: Poppins font family
- **Consistent Branding**: Logo placement in header and footer

## 🛠 Technical Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 3.3.2
- **Icons**: Lucide React
- **State Management**: React Context for cart
- **Images**: Next.js Image optimization
- **Fonts**: Google Fonts (Poppins)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Vibe_Bites/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
client/
├── app/                    # Next.js App Router pages
│   ├── page.js            # Homepage
│   ├── products/          # Products listing
│   ├── product/[id]/      # Product detail pages
│   ├── cart/              # Shopping cart
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   └── layout.js          # Root layout
├── components/            # Reusable components
│   ├── Navbar.js         # Navigation header
│   ├── Footer.js         # Footer component
│   ├── ProductCard.js    # Product display card
│   ├── CartContext.js    # Shopping cart context
│   └── ...
├── context/              # React contexts
│   └── CartContext.js    # Cart state management
├── data/                 # Static data
│   └── products.js       # Product data with variants
├── public/               # Static assets
│   └── images/           # Product and brand images
└── tailwind.config.js    # Tailwind configuration
```

## 📸 Hero Banner Image Specifications

For optimal display on the homepage hero carousel, admin should upload images with the following specifications:

### ✅ Recommended Specifications
- **Dimensions**: 1920×600px (Standard) or 1920×800px (Wider view)
- **Aspect Ratio**: 16:9 or 21:9 (Landscape orientation)
- **File Format**: JPG (preferred) or PNG
- **File Size**: Under 500KB (compress for faster loading)
- **Resolution**: 72-150 DPI (web optimized)

### ⚠️ Important Guidelines
- **Use bright, vibrant images** with good contrast
- **Avoid dark images** or heavy shadows (gradient overlay is applied for text readability)
- **Keep important content centered** - edges may be cropped on mobile
- **Test on mobile devices** - banner height adjusts responsively
- **White text overlay** is used, so avoid very light backgrounds in the center area
- **Product focus**: Show snacks/products prominently in the frame

### 📱 Responsive Behavior
- **Desktop**: 600px height (full width)
- **Tablet**: 500px height
- **Mobile**: 400px height
- Images use `object-fit: cover` to maintain aspect ratio across all devices

## 🐛 Recent Fixes

### Hero Banner Visual Enhancement (Latest - November 2025)
- **Removed Harsh Blackish Effect**: Eliminated `brightness(0.5)` filter that was making images too dark
- **Subtle Gradient Overlay**: Replaced flat dark overlay with elegant gradient (20% → 30% → 40% from top to bottom)
- **Enhanced Text Readability**: Added drop shadows to text for better visibility on any background
- **Result**: Images now appear vibrant and natural while maintaining excellent text readability

### UI Consistency & Fixed Navbar Layout (November 2025)
- **Fixed Navbar Overlap Issue**: Added consistent `pt-20` padding to all pages to prevent content from being hidden behind fixed navbar
- **Pages Fixed**: Profile, Wishlist, Contact, Checkout, Track Order, About, and all policy pages (Privacy, Terms, Shipping, Return, Cancellation)
- **Product Detail Error State**: Fixed error state to also have proper navbar spacing
- **Consistent Layout**: Now all pages have uniform spacing from the fixed navbar
- **Smart Implementation**: Wrapper div approach maintains existing page structure while fixing overlap
- **Enhanced UX**: Headers and content no longer go behind the navbar on any page

### Payment Gateway & Backend Optimization (November 2025)
- **Razorpay Script Preloading**: Moved Razorpay script loading to layout level using Next.js Script component with `afterInteractive` strategy
- **Backend Keep-Alive System**: Implemented automatic health-check pinging every 5 minutes to prevent Render.com cold starts
- **Aggressive Multi-Attempt Warmup**: 3-attempt retry system with 15-second timeout per attempt (45s total) to reliably wake backend
- **Full-Screen Warmup Overlay**: Beautiful loading modal on checkout showing real-time connection progress
- **Cart Page Pre-Warming**: Backend warms up silently when user views cart, ready before checkout
- **Intelligent Retry Mechanism**: Order creation auto-retries up to 2 times on failures with clear user feedback
- **45-Second Request Timeout**: Long timeout for order creation with intermediate progress messages
- **Progressive Loading Messages**: Real-time feedback: "Attempt 1/3", "Connected in 12.3s", "Creating order", "Retrying"
- **Backend Status Indicators**: Visual warning when backend is cold with user-friendly messaging
- **Payment Data Caching**: Intelligent caching for Razorpay keys and order data to minimize API calls
- **Eliminated Cold Start UX Issues**: Users see clear progress instead of feeling stuck during 30-60s cold starts
- **Enhanced Error Handling**: Better error messages, retry logic, and fallback mechanisms
- **Optimized Complete Flow**: Cart warmup → Checkout aggressive warmup → Order creation with retry → Payment gateway

### UI/UX Improvements (Latest - January 2025)
- **Fixed Featured Products Navigation**: Made entire product cards clickable with hover effects and smooth transitions
- **Improved Carousel Performance**: Reduced carousel display time from 2.5s to 1.5s for better sliding effect
- **Enhanced Banner Design**: Made homepage banner full-width with multiple image support and better responsive design
- **Mobile Coupon Button Fix**: Fixed mobile responsiveness for coupon apply button on cart page
- **Coupon Toast Notifications**: Fixed red toast notifications showing even when coupons are applied successfully
- **Max Discount Amount**: Fixed maximum discount amount application on cart calculations

### Complete Product Editing System
- **New Working Edit Product API**: Created completely new `/api/admin/products/edit/:id` endpoints for GET and PUT operations
- **New Edit Product Page**: Built from scratch with proper authentication, form handling, and error management
- **Fixed Product Page**: Resolved infinite loop issues and improved error handling for product display
- **Enhanced User Experience**: Better loading states, error messages, and form validation
- **No Infinite Loops**: Clean, stable code that properly handles all edge cases

### Category Management Fixes (Latest)
- **Fixed POST /api/categories 400 Error**: Resolved validation issues with empty optional fields
- **Fixed PUT /api/categories 404 Error**: Corrected client-side API calls to include category ID
- **Improved Form Handling**: Client-side payload preparation to avoid sending empty strings
- **Better Validation**: Server-side validation now properly handles optional fields
- **Enhanced Error Handling**: Better error messages, duplicate name detection, and helpful API usage hints

### Admin Dashboard Fixes (Latest)
- **Fixed Recent Orders Amount Display**: Corrected field mapping from `totalAmount` to `total`
- **Improved Order Status Display**: Added proper status colors and field mapping
- **Enhanced Data Selection**: Server now properly selects required order fields
- **Better Error Handling**: Added empty state and debugging for dashboard data
- **Fixed Syntax Errors**: Resolved missing closing brace and ESLint unescaped entities
- **Improved Code Quality**: Replaced hardcoded API URLs with memoized API_BASE_URL for better maintainability
- **Build Optimization**: Admin page now builds successfully without errors

## 🎨 Brand Colors

The application uses a custom color palette defined in `tailwind.config.js`:

```javascript
colors: {
  'vibe-bg': '#FFF4E0',      // Background color
  'vibe-brown': '#5A3B1C',   // Primary brown
  'vibe-cookie': '#D9A25F',  // Cookie accent
  'vibe-accent': '#8B4513',  // Darker accent
}
```

## 🎥 Video Upload & Display Features

### Video Functionality
- **Optional Video Upload** - Admins can add product videos during creation/editing
- **Product Card Integration** - Play button overlay on product cards when video is available
- **Video Modal** - Full-screen video playback with controls on product detail page
- **Auto-play Support** - Videos can autoplay on hover (muted) for better UX
- **Error Handling** - Graceful fallback to image if video fails to load
- **Responsive Design** - Video displays work seamlessly across all device sizes

### Video Implementation
- **Admin Forms** - Video URL input field in both create and edit product forms
- **Database Schema** - Optional `video` field in Product model
- **Frontend Display** - Interactive video player with play/pause controls
- **Performance Optimized** - Videos load only when user interacts with them
- **Clean Implementation** - Removed YouTube video integration for streamlined video experience


## 🛒 Shopping Cart Features

### Cart Functionality
- Add products with size selection
- Update quantities
- Remove items
- Local storage persistence
- Cart count badge in navbar

### Coupon System
- **VIBE10**: 10% discount on all products
- **MAKHANA20**: 20% discount on makhana category products
- Real-time discount calculation
- Category-specific discounts

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first design approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interface
- Optimized for all device sizes

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📄 Pages Overview

### Homepage (`/`)
- Hero section with "Vibe Every Bite" tagline
- Category showcase
- Featured products grid
- Why choose us section
- Customer testimonials

### Products (`/products`)
- Product grid/list view toggle
- Advanced filtering (category, price)
- Search functionality
- Product cards with size selection

### Product Detail (`/product/[id]`)
- Large product image with optional video display
- Video modal with full-screen playback
- Size selection with pricing
- Quantity controls
- Add to cart functionality
- Nutrition facts and ingredients

### Cart (`/cart`)
- Cart items with quantity controls
- Coupon application
- Order summary with discounts
- Checkout button

### About (`/about`)
- Brand story and mission
- Company values
- Team section
- Impact statistics

### Contact (`/contact`)
- Contact form
- Company information
- FAQ section
- Business hours

## 🎯 Key Features Implemented

✅ **Fully Responsive Design** - Works on all devices  
✅ **Shopping Cart System** - Complete cart functionality  
✅ **Product Variants** - Multiple pack sizes with dynamic pricing  
✅ **Video Upload & Display** - Optional product videos with interactive playback  
✅ **Coupon System** - Discount codes with category-specific offers  
✅ **Search & Filtering** - Advanced product filtering  
✅ **Toast Notifications** - User feedback for all actions  
✅ **SEO Optimized** - Proper metadata and page titles  
✅ **Brand Consistent** - VIBE BITES branding throughout  
✅ **Performance Optimized** - Next.js Image optimization  

## 🚀 Deployment

The application is ready for deployment to platforms like:
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Any static hosting service

## 📞 Support

For questions or support, please contact:
- Email: hello@vibebites.com
- Phone: +91 98765 43210

---

**VIBE BITES** - Vibe Every Bite! 🍪✨
