'use client';

import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Link from 'next/link';
import Image from 'next/image';

const HeroCarousel = () => {
  const slides = [
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
    {
      id: 4,
      image: '/images/hero-snack-1.jpg',
      title: 'Premium Quality',
      subtitle: 'Made with love and finest ingredients',
      button: 'Discover More',
      link: '/products',
    },
    {
      id: 5,
      image: '/images/hero-snack-2.jpg',
      title: 'Healthy Living',
      subtitle: 'Nutritious snacks for your active lifestyle',
      button: 'Shop Healthy',
      link: '/products',
    },
  ];

  return (
    <div className="w-full bg-[#FFF8ED] -mx-4 sm:-mx-6 lg:-mx-8">
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        interval={1500}
        swipeable
        emulateTouch
        className="w-full"
        showArrows={true}
        showIndicators={true}
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
            <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center text-center text-white px-4">
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
    </div>
  );
};

export default HeroCarousel;
