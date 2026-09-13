import React from 'react';
import Image from 'next/image';

export default function Logo({
  variant = 'light', // 'light' for light background, 'dark' for dark background, 'mark' for icon mark only
  className = '',
  width = 160,
  height = 36,
  priority = false,
}) {
  if (variant === 'mark') {
    return (
      <span className={`inline-block relative ${className}`} style={{ width: height, height }}>
        <Image
          src="/brand/mark.png"
          alt="Scepter Mark"
          width={height}
          height={height}
          className="object-contain w-full h-full"
          priority={priority}
        />
      </span>
    );
  }

  const src = variant === 'dark' ? '/brand/logo-dark.png' : '/brand/logo-light.png';
  const alt = 'Scepter - Malawian Furniture & Interior Design';

  return (
    <span className={`inline-flex items-center relative ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="object-contain h-auto w-auto max-h-9"
        priority={priority}
      />
    </span>
  );
}
