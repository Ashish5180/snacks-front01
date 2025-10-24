import Navbar from '../components/Navbar'
import HeroCarousel from '../components/HeroCarousel'
import CategorySection from '../components/CategorySection'
import FeaturedProducts from '../components/FeaturedProducts'
import WhyChooseUs from '../components/WhyChooseUs'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-vibe-bg">
      <Navbar />
      <HeroCarousel />
      <CategorySection />
      <FeaturedProducts />
      <WhyChooseUs />
      <Footer />
    </main>
  )
}
