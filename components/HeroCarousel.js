'use client';

import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Link from 'next/link';
import Image from 'next/image';
import { buildApiUrl } from '../utils/api';

const HeroCarousel = () => {
  const [slides, setSlides] = useState([
    {
      id: 1,
      image: '/images/hero-snack-1.jpg',
      title: 'Bite into Happiness',
      subtitle: 'Crunchy, healthy, and 100% natural snacks',
      button: 'Shop Now',
      link: '/products',
    },
    {
      id: 2,
      image: '/images/hero-snack-2.jpg',
      title: 'Taste the Vibe',
      subtitle: 'Handcrafted snacks that love you back',
      button: 'Explore Flavors',
      link: '/products',
    },
    {
      id: 3,
      image: '/images/hero-snack-3.jpg',
      title: 'Free Shipping on Orders ₹500+',
      subtitle: 'Pan-India delivery in 3–5 days',
      button: 'Start Shopping',
      link: '/products',
    },
  ]);
  const [loading, setLoading] = useState(true);

  // Fetch banners from backend
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(buildApiUrl('/admin/banners'));
        const data = await response.json();
        
        if (data.success && data.data && data.data.length > 0) {
          setSlides(data.data);
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
        // Keep default slides if fetch fails
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  return (
    <div className="w-screen relative overflow-hidden bg-transparent" style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)' }}>
      {loading ? (
        <div className="h-[400px] sm:h-[500px] md:h-[600px] lg:h-screen flex items-center justify-center bg-transparent">
          <div className="text-vibe-brown text-lg">Loading banners...</div>
        </div>
      ) : (
        <Carousel
          autoPlay
          infiniteLoop
          showThumbs={false}
          showStatus={false}
          interval={5000}
          transitionTime={900}
          swipeable
          emulateTouch
          className="w-full hero-carousel"
          showArrows={true}
          showIndicators={true}
          renderIndicator={(onClickHandler, isSelected, index, label) => {
            return (
              <li
                className={"inline-block mx-1 w-2.5 h-2.5 rounded-full " + (isSelected ? "bg-white" : "bg-white/50")}
                onClick={onClickHandler}
                onKeyDown={onClickHandler}
                value={index}
                key={index}
                role="button"
                tabIndex={0}
                aria-label={`${label} ${index + 1}`}
                title={`${label} ${index + 1}`}
              />
            )
          }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-screen bg-transparent m-0 p-0">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                style={{ 
                  objectFit: 'cover',
                  objectPosition: 'center center',
                  backgroundColor: 'transparent'
                }}
                priority={slide.id === 1}
                className="w-full h-full"
                sizes="100vw"
              />
              {/* Subtle gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/40"></div>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">{slide.title}</h2>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 max-w-2xl mx-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">{slide.subtitle}</p>
                  <Link href={slide.link}>
                    <button className="bg-[#D9A066] hover:bg-[#c48841] transition-all duration-300 px-6 py-3 rounded-full text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
                      {slide.button}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      )}
    </div>
  );
};

export default HeroCarousel;
