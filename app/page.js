import Navbar from '../components/Navbar'
import AnnouncementStrip from '../components/AnnouncementStrip'
import HeroCarousel from '../components/HeroCarousel'
import CategorySection from '../components/CategorySection'
import FeaturedProducts from '../components/FeaturedProducts'
import WhyChooseUs from '../components/WhyChooseUs'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-vibe-bg overflow-x-hidden">
      <Navbar />
      {/* Offset content from fixed navbar for clear visibility */}
      <div className="pt-24">
        {/* Announcement Strip - Completely separate section */}
        <AnnouncementStrip />
        {/* Hero Section - Completely separate section with its own space */}
        <div className="relative w-full">
          <HeroCarousel />
        </div>
        {/* Rest of the content */}
        <div className="relative">
          <CategorySection />
          <FeaturedProducts />
          <WhyChooseUs />
          <Footer />
        </div>
      </div>
    </main>
  )
}
