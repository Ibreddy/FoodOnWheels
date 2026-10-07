'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RestaurantsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/customer/restaurants');
  }, [router]);
  return null;
}
