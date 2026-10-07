'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserLocation {
  lat: number;
  lng: number;
  address: string;
  city: string;
  isPermissionGranted: boolean;
  isLoading: boolean;
  error: string | null;
}

interface LocationContextType {
  location: UserLocation;
  refreshLocation: () => void;
  updateCustomLocation: (lat: number, lng: number, address: string) => void;
}

const defaultLocation: UserLocation = {
  lat: 12.9716,
  lng: 77.6070,
  address: 'MG Road, Bengaluru',
  city: 'Bengaluru',
  isPermissionGranted: false,
  isLoading: true,
  error: null,
};

const LocationContext = createContext<LocationContextType>({
  location: defaultLocation,
  refreshLocation: () => {},
  updateCustomLocation: () => {},
});

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<UserLocation>(defaultLocation);

  const fetchAddressFromCoords = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
      if (res.ok) {
        const data = await res.json();
        const addressObj = data.address || {};
        const area = addressObj.suburb || addressObj.neighbourhood || addressObj.road || addressObj.residential || 'Current Area';
        const city = addressObj.city || addressObj.town || addressObj.state_district || addressObj.state || 'Your City';
        const fullAddress = `${area}, ${city}`;
        
        setLocation((prev) => ({
          ...prev,
          lat,
          lng,
          address: fullAddress,
          city: city,
          isPermissionGranted: true,
          isLoading: false,
          error: null,
        }));
        return;
      }
    } catch (e) {
      console.warn('Reverse geocoding error:', e);
    }

    // Fallback if reverse geocode fails
    setLocation((prev) => ({
      ...prev,
      lat,
      lng,
      address: `GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      city: 'Live GPS',
      isPermissionGranted: true,
      isLoading: false,
      error: null,
    }));
  };

  const refreshLocation = () => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      setLocation((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Geolocation is not supported by your browser',
      }));
      return;
    }

    setLocation((prev) => ({ ...prev, isLoading: true }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchAddressFromCoords(latitude, longitude);
      },
      (error) => {
        console.warn('Geolocation permission error or timeout:', error.message);
        setLocation((prev) => ({
          ...prev,
          isLoading: false,
          error: error.message,
          // Keep default Bengaluru coordinates if denied
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const updateCustomLocation = (lat: number, lng: number, address: string) => {
    setLocation((prev) => ({
      ...prev,
      lat,
      lng,
      address,
      city: address.split(',').pop()?.trim() || address,
      isLoading: false,
    }));
  };

  useEffect(() => {
    refreshLocation();

    // Set up continuous watchPosition if supported
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation((prev) => ({
            ...prev,
            lat: latitude,
            lng: longitude,
          }));
        },
        (err) => console.warn('GPS Watcher warning:', err.message),
        { enableHighAccuracy: true, maximumAge: 5000 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  return (
    <LocationContext.Provider value={{ location, refreshLocation, updateCustomLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
