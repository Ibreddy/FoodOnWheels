'use client';

import React, { useState } from 'react';
import { Table, Plus, Trash2, CheckCircle2, Users, AlertCircle, Sparkles } from 'lucide-react';
import { useOwnerContext } from '@/context/OwnerContext';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { TableItem } from '@/types';

export default function RestaurantTablesPage() {
  const { siteContent, updateTableStatus, updateBusinessData } = useOwnerContext();
  const restaurantBusinessId = 'b4'; // Spice Garden Restaurant
  const restaurant = siteContent.businesses.find((b) => b._id === restaurantBusinessId || b.businessType === 'RESTAURANT') || siteContent.businesses[1];

  const defaultTables: TableItem[] = [
    { id: 't1', tableNumber: 1, seats: 4, status: 'AVAILABLE' },
    { id: 't2', tableNumber: 2, seats: 2, status: 'OCCUPIED' },
    { id: 't3', tableNumber: 3, seats: 6, status: 'RESERVED' },
    { id: 't4', tableNumber: 4, seats: 4, status: 'CLEANING' },
    { id: 't5', tableNumber: 5, seats: 2, status: 'AVAILABLE' },
    { id: 't6', tableNumber: 6, seats: 8, status: 'AVAILABLE' },
  ];

  const tables: TableItem[] = restaurant?.tables && restaurant.tables.length > 0 ? restaurant.tables : defaultTables;

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTableNo, setNewTableNo] = useState<string>(String(tables.length + 1));
  const [newSeats, setNewSeats] = useState<string>('4');
  const [newStatus, setNewStatus] = useState<'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'CLEANING'>('AVAILABLE');

  const handleUpdateStatus = (tableId: string, status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'CLEANING') => {
    updateTableStatus(restaurant._id, tableId, status);
  };

  const handleAddTable = (e: React.FormEvent) => {
    e.preventDefault();
    const tableNum = Number(newTableNo) || tables.length + 1;
    const seatsCount = Number(newSeats) || 4;

    const newTable: TableItem = {
      id: 't_' + Date.now(),
      tableNumber: tableNum,
      seats: seatsCount,
      status: newStatus,
    };

    const updatedTables = [...tables, newTable];
    updateBusinessData(restaurant._id, { tables: updatedTables });

    setShowAddModal(false);
    setNewTableNo(String(updatedTables.length + 1));
    setNewSeats('4');
  };

  const handleDeleteTable = (tableId: string) => {
    if (confirm('Are you sure you want to remove this table from floor plan?')) {
      const updatedTables = tables.filter((t) => t.id !== tableId);
      updateBusinessData(restaurant._id, { tables: updatedTables });
    }
  };

  // Live Stats
  const totalTables = tables.length;
  const availableCount = tables.filter((t) => t.status === 'AVAILABLE').length;
  const occupiedCount = tables.filter((t) => t.status === 'OCCUPIED').length;
  const reservedCount = tables.filter((t) => t.status === 'RESERVED').length;

  return (
    <AuthGuard allowedRoles={['RESTAURANT']}>
      <div className="max-w-6xl mx-auto space-y-6 pb-12 font-sans">
        {/* Header Banner */}
        <div className="bg-[#181C23] border border-[#2A2F3D] p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-purple-400 font-extrabold text-xs uppercase tracking-wider mb-1">
              <Table className="w-4 h-4" />
              <span>Dining Floor Matrix</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Table Floor Plan & Live Seat Matrix
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Changes synchronize instantly with Customer Reservation Page & Restaurant Details.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(!showAddModal)}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-2xl flex items-center gap-2 shadow-lg shadow-purple-600/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{showAddModal ? 'Close Form' : 'Add New Table'}</span>
          </button>
        </div>

        {/* Live KPI Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#181C23] border border-[#2A2F3D] p-4 rounded-3xl space-y-1 shadow-lg">
            <p className="text-[10px] text-gray-400 font-extrabold uppercase">Total Tables</p>
            <p className="text-2xl font-black text-white">{totalTables}</p>
          </div>
          <div className="bg-[#181C23] border border-emerald-500/30 p-4 rounded-3xl space-y-1 shadow-lg">
            <p className="text-[10px] text-emerald-400 font-extrabold uppercase">Available Now</p>
            <p className="text-2xl font-black text-emerald-400">{availableCount}</p>
          </div>
          <div className="bg-[#181C23] border border-rose-500/30 p-4 rounded-3xl space-y-1 shadow-lg">
            <p className="text-[10px] text-rose-400 font-extrabold uppercase">Occupied</p>
            <p className="text-2xl font-black text-rose-400">{occupiedCount}</p>
          </div>
          <div className="bg-[#181C23] border border-purple-500/30 p-4 rounded-3xl space-y-1 shadow-lg">
            <p className="text-[10px] text-purple-400 font-extrabold uppercase">Reserved</p>
            <p className="text-2xl font-black text-purple-400">{reservedCount}</p>
          </div>
        </div>

        {/* Add Table Form */}
        {showAddModal && (
          <form onSubmit={handleAddTable} className="bg-[#181C23] border border-purple-500/40 p-6 rounded-3xl space-y-4 text-xs shadow-2xl">
            <h3 className="font-black text-base text-white flex items-center gap-2 border-b border-[#2A2F3D] pb-3">
              <Sparkles className="w-4 h-4 text-purple-400" /> Add New Table to Floor Plan
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-400 font-bold mb-1">Table Number</label>
                <input
                  type="number"
                  value={newTableNo}
                  onChange={(e) => setNewTableNo(e.target.value)}
                  className="w-full p-3 bg-[#0F1115] border border-[#2A2F3D] rounded-xl text-white outline-none font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Capacity (Seats)</label>
                <select
                  value={newSeats}
                  onChange={(e) => setNewSeats(e.target.value)}
                  className="w-full p-3 bg-[#0F1115] border border-[#2A2F3D] rounded-xl text-white outline-none font-bold"
                >
                  <option value="2">2 Seater Small Dining</option>
                  <option value="4">4 Seater Regular Table</option>
                  <option value="6">6 Seater Family Table</option>
                  <option value="8">8 Seater Large Group Table</option>
                  <option value="12">12 Seater VIP Banquet Table</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1">Initial Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full p-3 bg-[#0F1115] border border-[#2A2F3D] rounded-xl text-white outline-none font-bold"
                >
                  <option value="AVAILABLE">AVAILABLE 🟢</option>
                  <option value="OCCUPIED">OCCUPIED 🔴</option>
                  <option value="RESERVED">RESERVED 🟣</option>
                  <option value="CLEANING">CLEANING 🟡</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-2xl shadow-xl transition-all text-xs"
            >
              Add Table #{newTableNo} to Floor Matrix
            </button>
          </form>
        )}

        {/* Table Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tables.map((t) => (
            <div key={t.id} className="bg-[#181C23] border border-[#2A2F3D] p-5 rounded-3xl space-y-4 shadow-xl text-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-black text-sm">
                    #{t.tableNumber}
                  </span>
                  <div>
                    <h3 className="font-extrabold text-sm text-white">Table #{t.tableNumber}</h3>
                    <p className="text-[11px] text-gray-400 font-semibold">{t.seats} Seats Capacity</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteTable(t.id)}
                  className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                  title="Remove Table"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1.5">
                <p className="text-[10px] text-gray-400 font-extrabold uppercase">Toggle Live Status:</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['AVAILABLE', 'OCCUPIED', 'RESERVED', 'CLEANING'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(t.id, st)}
                      className={`text-[10px] font-black py-2 rounded-xl border transition-all ${
                        t.status === st
                          ? st === 'AVAILABLE'
                            ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-md shadow-emerald-500/20'
                            : st === 'OCCUPIED'
                            ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/20'
                            : st === 'RESERVED'
                            ? 'bg-purple-500 text-white border-purple-500 shadow-md shadow-purple-500/20'
                            : 'bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/20'
                          : 'bg-[#0F1115] border-[#2A2F3D] text-gray-400 hover:text-white'
                      }`}
                    >
                      {st === 'AVAILABLE' ? '🟢 AVAILABLE' : st === 'OCCUPIED' ? '🔴 OCCUPIED' : st === 'RESERVED' ? '🟣 RESERVED' : '🟡 CLEANING'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AuthGuard>
  );
}
