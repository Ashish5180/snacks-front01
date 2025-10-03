"use client"
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

const GoToCartBar = () => {
  const { items } = useCart();
  const [showBar, setShowBar] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setShowBar(
      items.length > 0 &&
      pathname !== '/cart' &&
      !pathname.startsWith('/checkout')
    );
  }, [items, pathname]);

  if (!showBar) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center pointer-events-none">
      <div className="pointer-events-auto bg-vibe-cookie text-vibe-brown px-6 py-3 rounded-t-xl shadow-lg flex items-center gap-4 max-w-md w-full justify-between">
        <span className="font-semibold">{items.length} item{items.length > 1 ? 's' : ''} in cart</span>
        <Link href="/cart">
          <button className="bg-vibe-brown text-white px-4 py-2 rounded-lg font-semibold hover:bg-vibe-accent transition-colors">Go to Cart</button>
        </Link>
      </div>
    </div>
  );
};

export default GoToCartBar;
