'use client';

import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Link from 'next/link';
import Image from 'next/image';

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
        const response = await fetch('https://snacks-back01.onrender.com/api/admin/banners');
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
    <div className="w-full bg-[#FFF8ED] -mt-4 -mb-4">
      {loading ? (
        <div className="h-[400px] sm:h-[500px] lg:h-[600px] flex items-center justify-center pt-20">
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
          className="w-full"
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
            <div key={slide.id} className="relative h-[400px] sm:h-[500px] lg:h-[600px] w-full">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                style={{ objectFit: 'cover', filter: 'brightness(0.5)' }}
                priority={slide.id === 1}
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center text-center text-white px-4 pt-20">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">{slide.title}</h2>
                  <p className="text-base sm:text-lg md:text-xl mb-6 max-w-2xl mx-auto">{slide.subtitle}</p>
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
