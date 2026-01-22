"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface RecipeImageProps {
  slug: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
}

const RecipeImage: React.FC<RecipeImageProps> = ({
  slug,
  alt,
  className,
  fill = false,
  sizes,
  width,
  height,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  if (imageError) {
    return (
      <div
        className={cn(
          "bg-gray-800",
          fill ? "absolute inset-0" : "",
          className
        )}
      />
    );
  }

  return (
    <>
      {imageLoading && fill && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse" />
      )}
      <Image
        alt={alt}
        src={`/images/recipes/${slug}.jpg`}
        fill={fill}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        sizes={sizes}
        className={cn(
          "transition-opacity duration-300",
          imageLoading ? "opacity-0" : "opacity-100",
          className
        )}
        onError={() => {
          setImageError(true);
          setImageLoading(false);
        }}
        onLoad={() => setImageLoading(false)}
      />
    </>
  );
};

export default RecipeImage;
