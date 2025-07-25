import { useState } from 'react';
import { ImageIcon } from 'lucide-react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackText?: string;
}

export function ImageWithFallback({ src, alt, className = "", fallbackText }: ImageWithFallbackProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  console.log("ImageWithFallback: Attempting to load image:", src);

  const handleImageError = () => {
    console.error("ImageWithFallback: Failed to load image:", src);
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    console.log("ImageWithFallback: Successfully loaded image:", src);
    setImageLoading(false);
    setImageError(false);
  };

  if (imageError) {
    console.log("ImageWithFallback: Showing fallback for:", src);
    return (
      <div className={`flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 ${className}`}>
        <div className="text-center p-4">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">
            {fallbackText || "Image not available"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {imageLoading && (
        <div className="flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 h-full">
          <div className="text-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">Loading image...</p>
          </div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${imageLoading ? 'hidden' : ''}`}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
    </div>
  );
}