'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OrdersRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/customer/orders');
  }, [router]);
  return null;
}
