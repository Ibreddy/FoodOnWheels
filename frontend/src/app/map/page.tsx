'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MapRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/customer/map');
  }, [router]);
  return null;
}
