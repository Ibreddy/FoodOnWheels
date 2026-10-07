// Utility for calculating geographical distance using the Haversine formula
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export interface OrderEligibilityResult {
  canOrder: boolean;
  reason?: string;
  distanceKm?: number;
}

export function checkOrderEligibility(
  business: {
    businessType?: string;
    location?: { coordinates?: number[] };
    liveLocation?: { lat?: number; lng?: number };
  } | null,
  userLocation?: { lat: number; lng: number } | null
): OrderEligibilityResult {
  if (!business) {
    return { canOrder: false, reason: 'No business selected' };
  }

  // 1. Food Truck / Mobile Vendor Restriction
  const isFoodTruck =
    business.businessType === 'MOBILE_VENDOR' ||
    business.businessType === 'FOOD_TRUCK';

  if (isFoodTruck) {
    return {
      canOrder: false,
      reason:
        'Orders cannot be placed for food trucks. Online ordering is strictly reserved for restaurants within a 10 km radius.'
    };
  }

  // 2. 10 Kilometers Distance Restriction
  const defaultUserLat = userLocation?.lat ?? 12.9716;
  const defaultUserLng = userLocation?.lng ?? 77.607;

  const bizLat =
    business.liveLocation?.lat ??
    (business.location?.coordinates ? business.location.coordinates[1] : 12.9716);
  const bizLng =
    business.liveLocation?.lng ??
    (business.location?.coordinates ? business.location.coordinates[0] : 77.607);

  const distanceKm = calculateDistanceKm(
    defaultUserLat,
    defaultUserLng,
    bizLat,
    bizLng
  );

  if (distanceKm > 10) {
    return {
      canOrder: false,
      reason: `This restaurant is located ${distanceKm.toFixed(
        1
      )} km away. Online orders are only accepted for restaurants within a 10 km radius.`,
      distanceKm
    };
  }

  return { canOrder: true, distanceKm };
}
