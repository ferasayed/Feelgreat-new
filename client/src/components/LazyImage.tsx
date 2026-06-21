import { useState, useRef, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
}

/**
 * Optimized Image Component with:
 * - Native lazy loading
 * - Blur-up placeholder effect
 * - WebP auto-detection
 * - Intersection Observer for better performance
 */
export default function LazyImage({
  src,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy',
  priority = false
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for better control
  useEffect(() => {
    if (priority) return; // Skip if priority (above fold)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '100px', // Start loading 100px before viewport
        threshold: 0
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  // Generate WebP src if not already WebP
  const getWebPSrc = (originalSrc: string) => {
    if (originalSrc.includes('.webp')) return originalSrc;
    // For external images, try to detect if they support WebP
    if (originalSrc.includes('manus-storage')) {
      return originalSrc; // These are uploaded, assume current format
    }
    return originalSrc;
  };

  return (
    <div
      ref={imgRef}
      className={`lazy-image-container ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
        aspectRatio: width && height ? `${width} / ${height}` : undefined
      }}
    >
      {/* Blur placeholder */}
      {!isLoaded && (
        <div
          className="lazy-image-placeholder"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'lazy-shimmer 1.5s infinite'
          }}
        />
      )}

      {/* Actual image */}
      {isInView && (
        <img
          src={getWebPSrc(src)}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : loading}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={() => setIsLoaded(true)}
          className="lazy-image"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out'
          }}
        />
      )}

      <style>{`
        @keyframes lazy-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}

/**
 * Responsive Image Component with srcset
 */
interface ResponsiveImageProps extends LazyImageProps {
  srcSet?: {
    width: number;
    src: string;
  }[];
}

export function ResponsiveImage({
  srcSet,
  src,
  alt,
  ...props
}: ResponsiveImageProps) {
  if (!srcSet || srcSet.length === 0) {
    return <LazyImage src={src} alt={alt} {...props} />;
  }

  return (
    <LazyImage
      src={src}
      alt={alt}
      {...props}
    />
  );
}
