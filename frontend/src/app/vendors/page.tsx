'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VendorsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/customer/vendors');
  }, [router]);
  return null;
}
