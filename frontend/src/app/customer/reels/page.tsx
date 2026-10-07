'use client';

import React from 'react';
import { VideoReels } from '../../../components/customer/VideoReels';
import { mockVideos } from '../../../utils/mockData';
import { AuthGuard } from '../../../components/auth/AuthGuard';

export default function CustomerReelsPage() {
  return (
    <AuthGuard allowedRoles={['CUSTOMER']}>
      <VideoReels videos={mockVideos} />
    </AuthGuard>
  );
}
