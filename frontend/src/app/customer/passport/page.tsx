'use client';

import React from 'react';
import { FoodiePassport } from '../../../components/customer/FoodiePassport';
import { AuthGuard } from '../../../components/auth/AuthGuard';

export default function CustomerPassportPage() {
  return (
    <AuthGuard allowedRoles={['CUSTOMER']}>
      <FoodiePassport />
    </AuthGuard>
  );
}
