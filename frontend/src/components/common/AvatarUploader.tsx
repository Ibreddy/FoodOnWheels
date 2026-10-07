'use client';

import React, { useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Upload, Download, Image as ImageIcon, Camera, Check, RefreshCw } from 'lucide-react';

interface AvatarUploaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showDownload?: boolean;
  className?: string;
}

const PRESET_AVATARS = [
  { id: '1', name: 'Chef Male', url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200&auto=format&fit=crop' },
  { id: '2', name: 'Chef Female', url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&auto=format&fit=crop' },
  { id: '3', name: 'Foodie Explorer', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop' },
  { id: '4', name: 'Gourmet Lover', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop' },
  { id: '5', name: 'Street Food Owner', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop' },
  { id: '6', name: 'Master Baker', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop' },
];

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  size = 'lg',
  showDownload = false,
  className = '',
}) => {
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showPresetModal, setShowPresetModal] = useState(false);

  const currentAvatar = user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop';

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Selected image size exceeds 5MB. Please select a smaller photo.');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        updateProfile({ avatar: base64 });
      }
      setIsUploading(false);
    };

    reader.onerror = () => {
      alert('Failed to read image file.');
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    if (!currentAvatar) return;
    const link = document.createElement('a');
    link.href = currentAvatar;
    link.download = `${(user?.name || 'foodonwheels_user').replace(/\s+/g, '_')}_profile.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

      {/* Avatar Image Container */}
      <div className="relative group">
        <img
          src={currentAvatar}
          alt={user?.name || 'Profile Avatar'}
          className={`${sizeClasses[size]} rounded-full border-4 border-brand-orange object-cover shadow-2xl transition-transform group-hover:scale-105`}
        />

        {/* Floating Upload Overlay Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          title="Upload Custom Image File"
          className="absolute bottom-0 right-0 p-2 rounded-full bg-brand-orange text-white border-2 border-dark-card shadow-lg hover:bg-orange-600 transition-all hover:scale-110 cursor-pointer"
        >
          <Camera className="w-4 h-4" />
        </button>
      </div>

      {/* Control Actions (Upload File, Download Image, Choose Preset) */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="px-3.5 py-2 rounded-xl bg-brand-orange hover:bg-orange-600 text-white font-extrabold shadow-md flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>{isUploading ? 'Uploading...' : 'Upload Photo'}</span>
        </button>

        {showDownload && (
          <button
            type="button"
            onClick={handleDownload}
            className="px-3.5 py-2 rounded-xl bg-[#252A34] hover:bg-gray-700 text-white font-extrabold border border-[#2A2F3D] shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            title="Download profile picture to device"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Download</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setShowPresetModal(!showPresetModal)}
          className="px-3.5 py-2 rounded-xl bg-[#252A34] hover:bg-gray-700 text-gray-300 hover:text-white font-extrabold border border-[#2A2F3D] shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
          <span>Presets</span>
        </button>
      </div>

      {/* Preset Modal Picker */}
      {showPresetModal && (
        <div className="p-4 bg-[#181C23] border border-[#2A2F3D] rounded-2xl shadow-xl space-y-3 max-w-xs text-center mt-2">
          <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">
            Select Preset Profile Photo
          </p>
          <div className="grid grid-cols-3 gap-2">
            {PRESET_AVATARS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  updateProfile({ avatar: preset.url });
                  setShowPresetModal(false);
                }}
                className={`p-1 rounded-xl border transition-all overflow-hidden ${
                  currentAvatar === preset.url
                    ? 'border-brand-orange bg-brand-orange/20 scale-105'
                    : 'border-[#2A2F3D] hover:border-gray-500'
                }`}
              >
                <img src={preset.url} alt={preset.name} className="w-12 h-12 rounded-lg object-cover mx-auto" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
