'use client';

import React, { useEffect, useState } from 'react';
import { Business } from '../../types';
import { getSocket } from '../../services/socket';
import { useLocation } from '../../context/LocationContext';
import { Target, MapPin } from 'lucide-react';

interface MapViewProps {
  businesses: Business[];
  selectedBusiness: Business | null;
  onSelectBusiness: (b: Business) => void;
  filterCategory?: string;
  filterType?: string;
}

export const MapView: React.FC<MapViewProps> = ({
  businesses,
  selectedBusiness,
  onSelectBusiness,
  filterCategory = 'ALL',
  filterType = 'ALL'
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [liveLocations, setLiveLocations] = useState<Record<string, { lat: number; lng: number }>>({});
  const { location, refreshLocation } = useLocation();

  useEffect(() => {
    setIsMounted(true);

    const socket = getSocket();
    socket.on('vendor:location:updated', (data: { businessId: string; lat: number; lng: number }) => {
      setLiveLocations((prev) => ({
        ...prev,
        [data.businessId]: { lat: data.lat, lng: data.lng }
      }));
    });

    return () => {
      socket.off('vendor:location:updated');
    };
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-full min-h-[500px] bg-dark-bg flex items-center justify-center border border-dark-border rounded-3xl">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-gray-400 font-semibold">Loading Live Satellite Map...</p>
        </div>
      </div>
    );
  }

  // Dynamic Leaflet render
  const L = require('leaflet');
  require('leaflet/dist/leaflet.css');

  const filtered = businesses.filter((b) => {
    if (filterType !== 'ALL' && filterType !== 'MOBILE_VENDORS' && b.businessType !== filterType) {
      if (filterType === 'MOBILE_VENDORS' && b.businessType !== 'MOBILE_VENDOR') return false;
      if (filterType === 'RESTAURANTS' && b.businessType === 'MOBILE_VENDOR') return false;
    }
    if (filterCategory !== 'ALL' && !b.categories.includes(filterCategory)) return false;
    return true;
  });

  // Center coordinate: Default to real user GPS location if no business is selected
  const centerLat = selectedBusiness 
    ? (liveLocations[selectedBusiness._id]?.lat || selectedBusiness.liveLocation?.lat || selectedBusiness.location.coordinates[1]) 
    : location.lat;

  const centerLng = selectedBusiness 
    ? (liveLocations[selectedBusiness._id]?.lng || selectedBusiness.liveLocation?.lng || selectedBusiness.location.coordinates[0]) 
    : location.lng;

  return (
    <div className="relative z-0 isolate w-full h-full min-h-[500px] rounded-3xl overflow-hidden border border-dark-border shadow-2xl">
      {/* Map Header Overlay */}
      <div className="absolute top-4 left-4 z-[400] flex items-center gap-2 bg-dark-bg/90 backdrop-blur border border-dark-border px-3 py-1.5 rounded-full shadow-lg">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="text-xs font-bold text-white">🛰️ Live Satellite Tracking</span>
        <span className="text-[10px] text-gray-400 font-medium">({filtered.length} active)</span>
      </div>

      {/* Locate Me GPS Refresh Button Overlay */}
      <button
        onClick={refreshLocation}
        title="Re-center on My Real GPS Location"
        className="absolute top-4 right-4 z-[400] flex items-center gap-1.5 bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white font-extrabold text-xs px-3 py-1.5 rounded-full shadow-lg transition-transform hover:scale-105"
      >
        <Target className="w-3.5 h-3.5" />
        <span>Locate Me</span>
      </button>

      <LeafletMapContainer
        center={[centerLat, centerLng]}
        zoom={14}
        style={{ width: '100%', height: '100%', minHeight: '500px' }}
      >
        {/* Esri World Imagery Satellite View Tiles */}
        <TileLayerUrl
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
        />
        {/* Labels Overlay */}
        <TileLayerUrl
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        {/* User Location Marker with Real GPS Coordinates */}
        <CustomUserMarker position={[location.lat, location.lng]} address={location.address} />

        {/* Business Markers */}
        {filtered.map((b) => {
          const lat = liveLocations[b._id]?.lat || b.liveLocation?.lat || b.location.coordinates[1];
          const lng = liveLocations[b._id]?.lng || b.liveLocation?.lng || b.location.coordinates[0];
          const isSelected = selectedBusiness?._id === b._id;

          return (
            <CustomBusinessMarker
              key={b._id}
              business={b}
              position={[lat, lng]}
              isSelected={isSelected}
              onClick={() => onSelectBusiness(b)}
            />
          );
        })}
      </LeafletMapContainer>
    </div>
  );
};

// Internal Leaflet Wrapper Components
const LeafletMapContainer = ({ center, zoom, style, children }: any) => {
  const { MapContainer, useMap } = require('react-leaflet');

  const MapResizer = () => {
    const map = useMap();
    useEffect(() => {
      if (map) {
        setTimeout(() => {
          map.invalidateSize();
          map.setView(center, zoom);
        }, 150);
      }
    }, [map, center, zoom]);
    return null;
  };

  return (
    <MapContainer center={center} zoom={zoom} style={style} zoomControl={false}>
      <MapResizer />
      {children}
    </MapContainer>
  );
};

const TileLayerUrl = ({ url, attribution }: any) => {
  const { TileLayer } = require('react-leaflet');
  return <TileLayer url={url} attribution={attribution} />;
};

const CustomUserMarker = ({ position, address }: { position: [number, number]; address?: string }) => {
  const L = require('leaflet');
  const { Marker, Popup } = require('react-leaflet');

  const userIcon = L.divIcon({
    className: 'custom-user-pin',
    html: `
      <div class="relative flex items-center justify-center w-6 h-6">
        <div class="absolute w-6 h-6 rounded-full bg-blue-500/40 animate-ping"></div>
        <div class="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-md"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });

  return (
    <Marker position={position} icon={userIcon}>
      <Popup className="custom-popup">
        <div className="p-1.5 text-xs font-extrabold text-dark-bg text-center space-y-0.5">
          <p className="text-blue-600 font-black">📍 Your Current GPS Location</p>
          <p className="text-[10px] text-gray-700 font-semibold line-clamp-2">{address || 'Live Coordinates'}</p>
        </div>
      </Popup>
    </Marker>
  );
};

const CustomBusinessMarker = ({
  business,
  position,
  isSelected,
  onClick
}: {
  business: Business;
  position: [number, number];
  isSelected: boolean;
  onClick: () => void;
}) => {
  const L = require('leaflet');
  const { Marker } = require('react-leaflet');

  const isMobile = business.businessType === 'MOBILE_VENDOR';
  const colorClass = isMobile ? 'bg-gradient-to-tr from-brand-orange to-brand-yellow' : 'bg-gradient-to-tr from-purple-500 to-indigo-600';
  const iconEmoji = isMobile ? '🚚' : '🍛';

  const markerHtml = `
    <div class="relative group cursor-pointer transition-transform ${isSelected ? 'scale-125 z-50' : 'hover:scale-110'}">
      <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full ${colorClass} text-white font-bold text-[11px] shadow-lg border border-white/20 whitespace-nowrap">
        <span>${iconEmoji}</span>
        <span>${business.name.split(' ')[0]}</span>
        <span class="bg-black/30 px-1 py-0.2 rounded text-[10px]">⭐ ${business.rating.average}</span>
      </div>
      <div class="w-2 h-2 mx-auto bg-white rotate-45 -mt-1 shadow-md"></div>
    </div>
  `;

  const customIcon = L.divIcon({
    className: 'custom-business-pin',
    html: markerHtml,
    iconSize: [120, 32],
    iconAnchor: [60, 32]
  });

  return (
    <Marker
      position={position}
      icon={customIcon}
      eventHandlers={{
        click: onClick
      }}
    />
  );
};
