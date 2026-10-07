'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ReelsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/customer/reels');
  }, [router]);
  return null;
}
