'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CommunityRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/customer/community');
  }, [router]);
  return null;
}
