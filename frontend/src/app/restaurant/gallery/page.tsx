'use client';

import React, { useState } from 'react';
import { Image as ImageIcon, Plus, Trash2, Eye, Sparkles, CheckCircle2, Filter } from 'lucide-react';
import { AuthGuard } from '../../../components/auth/AuthGuard';
import { useOwnerContext } from '../../../context/OwnerContext';

export interface GalleryPhoto {
  id: string;
  title: string;
  category: 'INDOOR' | 'OUTDOOR' | 'BAR' | 'KITCHEN' | 'VIP_ROOM';
  imageUrl: string;
  description: string;
  uploadedAt: string;
}

const DEFAULT_PHOTOS: GalleryPhoto[] = [
  {
    id: 'g1',
    title: 'Main Fine Dining Indoor Hall',
    category: 'INDOOR',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop',
    description: 'Warm mood lighting with handcrafted wooden tables & plush seating.',
    uploadedAt: '2 days ago',
  },
  {
    id: 'g2',
    title: 'Open-Air Garden Terrace Seating',
    category: 'OUTDOOR',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop',
    description: 'Starlit outdoor dining surrounded by lush greenery & ambient fairy lights.',
    uploadedAt: '1 week ago',
  },
  {
    id: 'g3',
    title: 'Artisanal Cocktail & Wine Bar Counter',
    category: 'BAR',
    imageUrl: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&auto=format&fit=crop',
    description: 'Custom marble bar counter serving signature cocktails & fine imported wines.',
    uploadedAt: '3 days ago',
  },
  {
    id: 'g4',
    title: 'Open Kitchen Woodfired Pizza Station',
    category: 'KITCHEN',
    imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop',
    description: 'Master chefs preparing authentic hand-tossed pizzas in real time.',
    uploadedAt: 'Yesterday',
  },
  {
    id: 'g5',
    title: 'Royal VIP Private Dining Suite',
    category: 'VIP_ROOM',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop',
    description: 'Private 12-seater executive dining room for celebrations & corporate meetings.',
    uploadedAt: '4 days ago',
  },
];

export default function RestaurantGalleryPage() {
  const { siteContent, updateBusinessData } = useOwnerContext();
  const [photos, setPhotos] = useState<GalleryPhoto[]>(DEFAULT_PHOTOS);
  const [activeCategory, setActiveCategory] = useState<'ALL' | GalleryPhoto['category']>('ALL');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<GalleryPhoto | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GalleryPhoto['category']>('INDOOR');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  const handleUploadPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) return;

    const newPhoto: GalleryPhoto = {
      id: 'g_' + Date.now(),
      title,
      category,
      imageUrl,
      description: description || 'Beautiful ambience photo.',
      uploadedAt: 'Just Now',
    };

    const updated = [newPhoto, ...photos];
    setPhotos(updated);

    // Sync to OwnerContext business ambience images
    updateBusinessData('b4', {
      ambienceImages: updated.map((p) => p.imageUrl),
    });

    setTitle('');
    setImageUrl('');
    setDescription('');
    setShowUploadForm(false);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  const handleDeletePhoto = (id: string) => {
    if (confirm('Delete this photo from ambience gallery?')) {
      const updated = photos.filter((p) => p.id !== id);
      setPhotos(updated);
      updateBusinessData('b4', {
        ambienceImages: updated.map((p) => p.imageUrl),
      });
    }
  };

  const filteredPhotos = activeCategory === 'ALL' ? photos : photos.filter((p) => p.category === activeCategory);

  return (
    <AuthGuard allowedRoles={['RESTAURANT']}>
      <div className="max-w-6xl mx-auto space-y-6 pb-12 font-sans">
        {/* Header */}
        <div className="bg-[#181C23] border border-[#2A2F3D] p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-xs uppercase tracking-wider mb-1">
              <ImageIcon className="w-4 h-4" />
              <span>Ambience & Photo Showcase</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Ambience & Dining Photo Gallery
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Showcase indoor/outdoor seating, decor & dining ambience to online customers.
            </p>
          </div>

          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold text-xs rounded-2xl flex items-center gap-2 shadow-lg shadow-cyan-600/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{showUploadForm ? 'Close Form' : 'Upload Ambience Photo'}</span>
          </button>
        </div>

        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 font-bold shadow-lg">
            <CheckCircle2 className="w-4 h-4" />
            <span>Photo added to Ambience Gallery & published to Customer Restaurant view!</span>
          </div>
        )}

        {/* Upload Form Modal */}
        {showUploadForm && (
          <form onSubmit={handleUploadPhoto} className="bg-[#181C23] border border-cyan-500/40 p-6 rounded-3xl space-y-4 text-xs shadow-2xl">
            <h3 className="font-black text-base text-white flex items-center gap-2 border-b border-[#2A2F3D] pb-3">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Upload New Ambience Photo
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 font-bold mb-1">Photo Title</label>
                <input
                  type="text"
                  placeholder="e.g. Candlelight Outdoor Terrace"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 bg-[#0F1115] border border-[#2A2F3D] rounded-xl text-white outline-none font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Gallery Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-3 bg-[#0F1115] border border-[#2A2F3D] rounded-xl text-white outline-none font-bold"
                >
                  <option value="INDOOR">Indoor Dining Hall 🏛️</option>
                  <option value="OUTDOOR">Outdoor Terrace / Garden 🌿</option>
                  <option value="BAR">Wine & Cocktail Bar 🍸</option>
                  <option value="KITCHEN">Live Chef Kitchen 🍳</option>
                  <option value="VIP_ROOM">VIP Private Suite 👑</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-400 font-bold mb-1">High-Res Image URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-3 bg-[#0F1115] border border-[#2A2F3D] rounded-xl text-white outline-none font-mono"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-400 font-bold mb-1">Description / Caption</label>
                <input
                  type="text"
                  placeholder="Describe decor, seating capacity, lighting or vibes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 bg-[#0F1115] border border-[#2A2F3D] rounded-xl text-white outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold rounded-2xl shadow-xl transition-all text-xs"
            >
              Publish Ambience Photo to Gallery
            </button>
          </form>
        )}

        {/* Filter Category Tabs */}
        <div className="bg-[#181C23] border border-[#2A2F3D] p-4 rounded-3xl flex items-center gap-2 overflow-x-auto shadow-xl text-xs">
          <span className="text-gray-400 font-bold flex items-center gap-1 shrink-0 mr-2">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>

          {[
            { id: 'ALL', label: 'All Photos' },
            { id: 'INDOOR', label: 'Indoor Dining' },
            { id: 'OUTDOOR', label: 'Outdoor Garden' },
            { id: 'BAR', label: 'Bar & Lounge' },
            { id: 'KITCHEN', label: 'Chef Kitchen' },
            { id: 'VIP_ROOM', label: 'VIP Rooms' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3.5 py-2 rounded-2xl font-black shrink-0 transition-all ${
                activeCategory === cat.id
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-[#252A34] text-gray-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Photo Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPhotos.map((photo) => (
            <div key={photo.id} className="bg-[#181C23] border border-[#2A2F3D] rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group">
              <div className="relative h-56 bg-black overflow-hidden">
                <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur text-[10px] font-black text-cyan-400 border border-cyan-500/30">
                  {photo.category.replace('_', ' ')}
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <button
                    onClick={() => setPreviewPhoto(photo)}
                    className="p-2 rounded-full bg-black/60 backdrop-blur text-white hover:bg-cyan-600 transition-colors"
                    title="View Fullscreen"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="p-2 rounded-full bg-rose-500/20 backdrop-blur border border-rose-500/40 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                    title="Delete Photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white space-y-0.5">
                  <h3 className="font-extrabold text-sm line-clamp-1">{photo.title}</h3>
                  <p className="text-[11px] text-gray-300 line-clamp-1">{photo.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Fullscreen Preview Modal */}
        {previewPhoto && (
          <div className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="relative max-w-4xl w-full bg-[#181C23] border border-[#2A2F3D] rounded-3xl overflow-hidden shadow-2xl">
              <img src={previewPhoto.imageUrl} alt={previewPhoto.title} className="w-full max-h-[70vh] object-cover" />
              <div className="p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-white">{previewPhoto.title}</h2>
                  <p className="text-xs text-gray-300 mt-1">{previewPhoto.description}</p>
                </div>
                <button
                  onClick={() => setPreviewPhoto(null)}
                  className="px-5 py-2 bg-purple-600 text-white font-extrabold text-xs rounded-xl shadow-lg"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
