'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

export default function Shop() {
  const [clothing, setClothing] = useState<any[]>([]);
  const [jewelry, setJewelry] = useState<any[]>([]);
  const [prints, setPrints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all data in parallel
        const [clothingData, jewelryData, printsData] = await Promise.all([
          client.fetch(`*[_type == "clothing"] | order(_createdAt desc)`),
          client.fetch(`*[_type == "jewelry"] | order(_createdAt desc)`),
          client.fetch(`*[_type == "prints"] | order(_createdAt desc)`),
        ]);
        
        setClothing(clothingData || []);
        setJewelry(jewelryData || []);
        setPrints(printsData || []);
      } catch (err) {
        console.error('Error fetching from Sanity:', err);
        setError(err instanceof Error ? err.message : 'Failed to connect to Sanity. Please check your environment variables.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  return (
    <div className='relative min-h-screen w-full text-white flex flex-col'>
      {/* Background */}
      <div className='fixed inset-0 -z-10'>
        <Image
          src='/background.jpeg'
          alt='Background'
          fill
          className='object-cover'
          priority
          quality={90}
        />
        {/* Glossy glaze overlay */}
        <div className='absolute inset-0 backdrop-blur-[2px] bg-gradient-to-b from-black/60 via-black/50 to-black/70' />
        <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent' />
        <div className='absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-50' />
      </div>

      {/* Header */}
      <header className='w-full px-4 sm:px-6 py-4 border-b border-gray-700 flex justify-between items-center bg-black/50 backdrop-blur-sm'>
        <h1 className='text-2xl sm:text-3xl text-gray-100 font-bold tracking-wide'>L0ST M00N</h1>
        <nav>
          <Link href='/' className='text-sm text-gray-100 hover:underline'>
            Back to Landing
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className='flex flex-col border-b border-neutral-800 items-center justify-center text-center z-10 relative px-4 sm:px-6 pt-6 sm:pt-8 pb-4 sm:pb-6 text-white'>
        <div>
          <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold'>Shop</h2>
          <p className='text-gray-100 mt-2 pt-2 sm:pt-3 text-xs sm:text-sm'>Browse Our Celestial Collection</p>
          {error && (
            <div className='mt-3 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-100 text-xs max-w-2xl mx-auto'>
              <p className='font-semibold'>Connection Error:</p>
              <p>{error}</p>
              <p className='mt-2 text-xs'>Make sure NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET are set in your .env.local file</p>
            </div>
          )}
          {loading && !error && (
            <div className='mt-3 text-gray-300 text-xs'>Loading products...</div>
          )}
        </div>
      </section>

      {/* Clothing Section */}
      <section className="px-4 sm:px-6 py-4 sm:py-6">
        <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">Clothing</h3>
        {clothing.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {clothing.map((product) => (
              <Link href={`/product/${product.slug?.current || product._id}`} key={product._id}>
                <div className="bg-neutral-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-200 ease-in-out cursor-pointer">
                  {product.images && product.images[0] && (
                    <Image
                      src={urlFor(product.images[0]).url()}
                      alt={product.title || 'Clothing item'}
                      width={400}
                      height={400}
                      className="object-cover w-full h-40 sm:h-48"
                    />
                  )}
                  <div className="p-2 sm:p-3">
                    <h3 className="text-white text-xs sm:text-sm font-semibold truncate">{product.title}</h3>
                    {product.price && (
                      <p className="text-neutral-400 text-xs mt-1">${product.price}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-neutral-400 text-center py-4 text-sm">No clothing items available at this time.</p>
        )}
      </section>

      {/* Jewelry Section */}
      <section className="px-4 sm:px-6 py-4 sm:py-6">
        <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">Jewelry</h3>
        {jewelry.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {jewelry.map((product) => (
              <Link href={`/product/${product.slug?.current || product._id}`} key={product._id}>
                <div className="bg-neutral-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-200 ease-in-out cursor-pointer">
                  {product.images && product.images[0] && (
                    <Image
                      src={urlFor(product.images[0]).url()}
                      alt={product.title || 'Jewelry item'}
                      width={400}
                      height={400}
                      className="object-cover w-full h-40 sm:h-48"
                    />
                  )}
                  <div className="p-2 sm:p-3">
                    <h3 className="text-white text-xs sm:text-sm font-semibold truncate">{product.title}</h3>
                    {product.price && (
                      <p className="text-neutral-400 text-xs mt-1">${product.price}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-neutral-400 text-center py-4 text-sm">No jewelry items available at this time.</p>
        )}
      </section>

      {/* Prints Section */}
      <section className="px-4 sm:px-6 py-4 sm:py-6">
        <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">Prints</h3>
        {prints.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {prints.map((product) => (
              <Link href={`/product/${product.slug?.current || product._id}`} key={product._id}>
                <div className="bg-neutral-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-200 ease-in-out cursor-pointer">
                  {product.images && product.images[0] && (
                    <Image
                      src={urlFor(product.images[0]).url()}
                      alt={product.title || 'Print'}
                      width={400}
                      height={400}
                      className="object-cover w-full h-40 sm:h-48"
                    />
                  )}
                  <div className="p-2 sm:p-3">
                    <h3 className="text-white text-xs sm:text-sm font-semibold truncate">{product.title}</h3>
                    {product.price && (
                      <p className="text-neutral-400 text-xs mt-1">${product.price}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-neutral-400 text-center py-4 text-sm">No prints available at this time.</p>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800 text-center text-neutral-500 text-sm py-6 mt-auto bg-black/50">
        &copy; {new Date().getFullYear()} L0ST M00N x Carolingian Programs Inc. All rights reserved.
      </footer>
    </div>
  );
}
