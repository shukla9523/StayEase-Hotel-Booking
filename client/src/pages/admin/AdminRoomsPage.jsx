import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Pencil,
  Trash2,
  Building2,
  Users,
  Bed,
  CheckCircle,
  X,
  Loader2,
} from 'lucide-react';
import adminService from '../../services/paymentService';
import ConfirmDialog from '../../components/common/ConfirmDialog';

export const AdminRoomsPage = () => {
  const [hotels, setHotels] = useState([]);
  const [selectedHotelId, setSelectedHotelId] = useState('');
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    roomType: 'Deluxe',
    bedType: '1 King Bed',
    roomSizeSqFt: 380,
    adults: 2,
    children: 1,
    totalInventory: 5,
    pricePerNight: 5500,
    discountPercentage: 0,
    mealPlan: 'Free Breakfast Included',
    cancelBeforeHours: 24,
    images: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1000',
  });

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const res = await adminService.adminService.getHotels();
      if (res.success && res.hotels.length > 0) {
        setHotels(res.hotels);
        setSelectedHotelId(res.hotels[0]._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  // Update room list when selected hotel changes
  useEffect(() => {
    if (!selectedHotelId) return;
    const currentHotel = hotels.find((h) => h._id === selectedHotelId);
    if (currentHotel) {
      // Fetch full hotel with populated rooms
      adminService.adminService.getHotels().then((res) => {
        const found = res.hotels?.find((h) => h._id === selectedHotelId);
        // Also fetch from public single endpoint for populated virtuals
        fetch(`/api/hotels/${selectedHotelId}`)
          .then((r) => r.json())
          .then((d) => {
            if (d.success && d.hotel?.rooms) {
              setRooms(d.hotel.rooms);
            }
          });
      });
    }
  }, [selectedHotelId, hotels]);

  const handleOpenCreate = () => {
    setEditingRoom(null);
    setFormData({
      name: '',
      roomType: 'Deluxe',
      bedType: '1 King Bed',
      roomSizeSqFt: 380,
      adults: 2,
      children: 1,
      totalInventory: 5,
      pricePerNight: 5500,
      discountPercentage: 0,
      mealPlan: 'Free Breakfast Included',
      cancelBeforeHours: 24,
      images: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1000',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (r) => {
    setEditingRoom(r);
    setFormData({
      name: r.name,
      roomType: r.roomType || 'Deluxe',
      bedType: r.bedType || '1 King Bed',
      roomSizeSqFt: r.roomSizeSqFt || 380,
      adults: r.capacity?.adults || 2,
      children: r.capacity?.children || 1,
      totalInventory: r.totalInventory || 5,
      pricePerNight: r.pricePerNight || 5500,
      discountPercentage: r.discountPercentage || 0,
      mealPlan: r.mealPlan || 'Free Breakfast Included',
      cancelBeforeHours: r.cancellationPolicy?.cancelBeforeHours || 24,
      images: r.images?.[0]?.url || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1000',
    });
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        hotelId: selectedHotelId,
        name: formData.name,
        roomType: formData.roomType,
        bedType: formData.bedType,
        roomSizeSqFt: Number(formData.roomSizeSqFt),
        capacity: { adults: Number(formData.adults), children: Number(formData.children) },
        totalInventory: Number(formData.totalInventory),
        pricePerNight: Number(formData.pricePerNight),
        discountPercentage: Number(formData.discountPercentage),
        mealPlan: formData.mealPlan,
        cancellationPolicy: {
          isFreeCancellation: true,
          cancelBeforeHours: Number(formData.cancelBeforeHours),
          description: `Free cancellation up to ${formData.cancelBeforeHours}h before check-in.`,
        },
        images: [{ url: formData.images.trim(), caption: formData.name }],
      };

      if (editingRoom) {
        await adminService.adminService.updateRoom(editingRoom._id, payload);
        setNotice('Room updated successfully.');
      } else {
        await adminService.adminService.createRoom(payload);
        setNotice('Room type created successfully.');
      }

      setModalOpen(false);
      // Refresh rooms
      const d = await (await fetch(`/api/hotels/${selectedHotelId}`)).json();
      if (d.success && d.hotel?.rooms) setRooms(d.hotel.rooms);
    } catch (err) {
      alert(err.message || 'Operation failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!roomToDelete) return;
    try {
      await adminService.adminService.deleteRoom(roomToDelete._id);
      setNotice('Room removed.');
      setDeleteConfirmOpen(false);
      const d = await (await fetch(`/api/hotels/${selectedHotelId}`)).json();
      if (d.success && d.hotel?.rooms) setRooms(d.hotel.rooms);
    } catch (err) {
      alert(err.message || 'Failed to delete room.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Room Inventory</h1>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Manage room tiers, capacities, inventory allotments, and nightly rates
            </p>
          </div>

          <button
            type="button"
            id="add-new-room-btn"
            onClick={handleOpenCreate}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Room Type</span>
          </button>
        </div>

        {notice && (
          <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold flex items-center justify-between">
            <span>{notice}</span>
            <button type="button" onClick={() => setNotice(null)} className="text-teal-700">Dismiss</button>
          </div>
        )}

        {/* Hotel Selector Filter */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <Building2 className="w-5 h-5 text-teal-600 shrink-0" />
          <div className="flex-1">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
              Select Hotel Property to View Rooms
            </label>
            <select
              value={selectedHotelId}
              onChange={(e) => setSelectedHotelId(e.target.value)}
              className="w-full text-xs font-bold text-slate-900 bg-transparent focus:outline-hidden cursor-pointer"
            >
              {hotels.map((h) => (
                <option key={h._id} value={h._id}>
                  {h.name} — {h.city} ({h.propertyType})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Rooms Table */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Room Name & Type</th>
                  <th className="p-4">Capacity</th>
                  <th className="p-4">Bed Type</th>
                  <th className="p-4">Total Inventory</th>
                  <th className="p-4">Rate / Night</th>
                  <th className="p-4">Meal Plan</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {rooms.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-bold text-slate-900">
                      <span>{r.name}</span>
                      <span className="block text-[10px] text-teal-700">{r.roomType}</span>
                    </td>
                    <td className="p-4 font-semibold text-slate-800">
                      {r.capacity?.adults} Adults, {r.capacity?.children || 0} Kids
                    </td>
                    <td className="p-4 font-semibold text-slate-800">{r.bedType}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-black bg-teal-50 text-teal-800 border border-teal-200">
                        {r.totalInventory} units
                      </span>
                    </td>
                    <td className="p-4 font-black text-slate-900">
                      ₹{r.pricePerNight?.toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 text-slate-600">{r.mealPlan}</td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(r)}
                        className="p-1.5 text-slate-600 hover:text-teal-600 rounded-lg hover:bg-teal-50"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRoomToDelete(r);
                          setDeleteConfirmOpen(true);
                        }}
                        className="p-1.5 text-slate-600 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for Add / Edit Room */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xl font-black text-slate-900">
                {editingRoom ? 'Edit Room Type' : 'Add Room to Hotel'}
              </h3>
              <button type="button" onClick={() => setModalOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Room Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Deluxe Royal Courtyard Room"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                    Room Tier
                  </label>
                  <select
                    value={formData.roomType}
                    onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-hidden"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Executive">Executive</option>
                    <option value="Suite">Suite</option>
                    <option value="Presidential Suite">Presidential Suite</option>
                    <option value="Villa">Villa</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                    Bed Type
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.bedType}
                    onChange={(e) => setFormData({ ...formData, bedType: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                    Total Inventory *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.totalInventory}
                    onChange={(e) => setFormData({ ...formData, totalInventory: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                    Price/Night (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.pricePerNight}
                    onChange={(e) => setFormData({ ...formData, pricePerNight: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                    Discount %
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="90"
                    value={formData.discountPercentage}
                    onChange={(e) => setFormData({ ...formData, discountPercentage: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                    Adult Capacity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.adults}
                    onChange={(e) => setFormData({ ...formData, adults: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                    Meal Plan
                  </label>
                  <select
                    value={formData.mealPlan}
                    onChange={(e) => setFormData({ ...formData, mealPlan: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-hidden"
                  >
                    <option value="Room Only">Room Only</option>
                    <option value="Free Breakfast Included">Free Breakfast Included</option>
                    <option value="All-Inclusive">All-Inclusive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Room Image URL
                </label>
                <input
                  type="url"
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-xs font-bold text-slate-600 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  {saving ? 'Saving...' : editingRoom ? 'Save Changes' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Delete Room Type?"
        message={`Are you sure you want to remove "${roomToDelete?.name}"?`}
        confirmText="Delete Room"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirmOpen(false)}
        isDangerous={true}
      />
    </div>
  );
};

export default AdminRoomsPage;
