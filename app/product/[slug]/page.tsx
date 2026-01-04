'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import imageUrlBuilder from '@sanity/image-url';

function urlFor(source: any) {
  if (!source) return null;
  try {
    const builder = imageUrlBuilder(client);
    return builder.image(source);
  } catch (error) {
    console.error('Error creating image URL:', error);
    return null;
  }
}

interface Product {
  _id: string;
  _type: string;
  title: string;
  description?: string;
  images?: any[];
  price?: number;
  sizes?: string[];
  available?: boolean;
  slug: {
    current: string;
  };
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      if (!slug) return;
      
      try {
        setLoading(true);
        setError(null);

        // Query all product types to find the one with matching slug
        const query = `*[slug.current == $slug][0]{
          _id,
          _type,
          title,
          description,
          images,
          price,
          sizes,
          available,
          slug
        }`;

        const data = await client.fetch(query, { slug });
        
        if (!data) {
          setError('Product not found');
        } else {
          setProduct(data);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="relative min-h-screen w-full text-white flex items-center justify-center">
        <div className="fixed inset-0 -z-10">
          <div className="w-full h-full bg-black" />
          <div className="absolute inset-0 backdrop-blur-sm bg-black/60" />
        </div>
        <div className="text-center">
          <div className="text-xl mb-4">Loading product...</div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="relative min-h-screen w-full text-white flex items-center justify-center">
        <div className="fixed inset-0 -z-10">
          <div className="w-full h-full bg-black" />
          <div className="absolute inset-0 backdrop-blur-sm bg-black/60" />
        </div>
        <div className="text-center max-w-md px-4">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-300 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <Link 
            href="/shop" 
            className="inline-block px-6 py-3 bg-green-500 hover:bg-green-600 font-semibold rounded-lg transition-colors"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images || [];
  const mainImage = images[selectedImageIndex] || images[0];

  return (
    <div className="relative min-h-screen w-full text-white flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/background.jpeg"
          alt="Background"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        <div className="absolute inset-0 backdrop-blur-[2px] bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-50" />
      </div>

      {/* Header */}
      <header className="w-full px-4 sm:px-6 py-4 border-b border-gray-700 flex justify-between items-center bg-black/50 backdrop-blur-sm">
        <Link href="/shop" className="text-2xl sm:text-3xl text-gray-100 font-bold tracking-wide hover:text-green-400 transition-colors">
          L0ST M00N
        </Link>
        <nav className="flex gap-4">
          <Link href="/shop" className="text-sm text-gray-100 hover:text-green-400 hover:underline transition-colors">
            Back to Shop
          </Link>
          <Link href="/" className="text-sm text-gray-100 hover:text-green-400 hover:underline transition-colors">
            Home
          </Link>
        </nav>
      </header>

      {/* Product Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square w-full bg-neutral-900 rounded-lg overflow-hidden">
              {mainImage && urlFor(mainImage) ? (
                <Image
                  src={urlFor(mainImage)!.url()}
                  alt={product.title}
                  fill
                  className="object-contain p-4"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  No image available
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? 'border-green-500 ring-2 ring-green-500/50'
                        : 'border-transparent hover:border-gray-600'
                    }`}
                  >
                    {urlFor(image) && (
                      <Image
                        src={urlFor(image)!.width(200).height(200).url()}
                        alt={`${product.title} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">
              {product.title}
            </h1>

            {product.price && (
              <div className="text-3xl sm:text-4xl font-bold text-green-400 mb-6">
                ${product.price.toFixed(2)}
              </div>
            )}

            {product.description && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3 text-gray-200">Description</h2>
                <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Sizes */}
            {(product.sizes && product.sizes.length > 0) && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3 text-gray-200">Sizes</h2>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 rounded-lg transition-colors text-white"
                    >
                      {size.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Availability */}
            <div className="mb-8">
              {product.available !== false ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-900/30 border border-green-500/50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-green-400 font-semibold">Available</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-900/30 border border-red-500/50 rounded-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-red-400 font-semibold">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Contact Button */}
            <button
              disabled={product.available === false}
              className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all ${
                product.available !== false
                  ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {product.available !== false ? 'Contact Now' : 'Out of Stock'}
            </button>

            {/* Product Type Badge */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <span className="text-sm text-gray-400 capitalize">
                Category: {product._type}
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800 text-center text-neutral-500 text-sm py-6 mt-auto bg-black/50">
        &copy; {new Date().getFullYear()} L0ST M00N x Carolingian Programs Inc. All rights reserved.
      </footer>
    </div>
  );
}

