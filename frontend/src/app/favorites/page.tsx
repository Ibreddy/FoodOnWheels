'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FavoritesRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/customer/favorites');
  }, [router]);
  return null;
}
