'use client';

import React from 'react';
import { VendorDashboard } from '../../../components/vendor/VendorDashboard';
import { AuthGuard } from '../../../components/auth/AuthGuard';

export default function VendorDashboardPage() {
  return (
    <AuthGuard allowedRoles={['MOBILE_VENDOR']}>
      <VendorDashboard />
    </AuthGuard>
  );
}
