'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PassportRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/customer/passport');
  }, [router]);
  return null;
}
