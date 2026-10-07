'use client';

import React from 'react';
import { RestaurantDashboard } from '../../../components/restaurant/RestaurantDashboard';
import { AuthGuard } from '../../../components/auth/AuthGuard';

export default function RestaurantDashboardPage() {
  return (
    <AuthGuard allowedRoles={['RESTAURANT']}>
      <RestaurantDashboard />
    </AuthGuard>
  );
}
