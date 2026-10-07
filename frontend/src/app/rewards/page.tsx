'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RewardsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/customer/rewards');
  }, [router]);
  return null;
}
