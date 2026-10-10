import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Pencil,
  Trash2,
  Search,
  Star,
  MapPin,
  CheckCircle,
  X,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import adminService from '../../services/paymentService';
import ConfirmDialog from '../../components/common/ConfirmDialog';

export const AdminHotelsPage = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [hotelToDelete, setHotelToDelete] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    description: '',
    city: 'Jaipur',
    state: 'Rajasthan',
    address: '',
    starRating: 5,
    propertyType: 'Hotel',
    priceStartingFrom: 5000,
    amenities: 'Free Wi-Fi, Swimming Pool, Spa & Wellness, Restaurant',
    images: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200',
    featured: false,
  });

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const res = await adminService.adminService.getHotels();
      if (res.success) {
        setHotels(res.hotels || []);
      }
    } catch (err) {
      console.error('Error fetching admin hotels:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleOpenCreate = () => {
    setEditingHotel(null);
    setFormData({
      name: '',
      tagline: '',
      description: '',
      city: 'Jaipur',
      state: 'Rajasthan',
      address: '',
      starRating: 5,
      propertyType: 'Hotel',
      priceStartingFrom: 5000,
      amenities: 'Free Wi-Fi, Swimming Pool, Spa & Wellness, Restaurant',
      images: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200',
      featured: false,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (h) => {
    setEditingHotel(h);
    setFormData({
      name: h.name,
      tagline: h.tagline || '',
      description: h.description,
      city: h.city,
      state: h.state || '',
      address: h.address,
      starRating: h.starRating || 5,
      propertyType: h.propertyType || 'Hotel',
      priceStartingFrom: h.priceStartingFrom || 5000,
      amenities: (h.amenities || []).join(', '),
      images: h.images?.[0]?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200',
      featured: h.featured || false,
    });
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        amenities: formData.amenities.split(',').map((a) => a.trim()).filter(Boolean),
        images: [{ url: formData.images.trim(), caption: formData.name, isFeatured: true }],
      };

      if (editingHotel) {
        await adminService.adminService.updateHotel(editingHotel._id, payload);
        setNotice('Hotel details updated successfully.');
      } else {
        await adminService.adminService.createHotel(payload);
        setNotice('New hotel property created successfully.');
      }

      setModalOpen(false);
      await fetchHotels();
    } catch (err) {
      alert(err.message || 'Operation failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!hotelToDelete) return;
    try {
      await adminService.adminService.deleteHotel(hotelToDelete._id);
      setNotice('Hotel and rooms removed.');
      setDeleteConfirmOpen(false);
      await fetchHotels();
    } catch (err) {
      alert(err.message || 'Failed to delete hotel.');
    }
  };

  const filteredHotels = hotels.filter(
    (h) =>
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Hotel Properties</h1>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Manage inventory, add new luxury stays, and adjust pricing metadata
            </p>
          </div>

          <button
            type="button"
            id="add-new-hotel-btn"
            onClick={handleOpenCreate}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add New Hotel</span>
          </button>
        </div>

        {notice && (
          <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold flex items-center justify-between">
            <span>{notice}</span>
            <button type="button" onClick={() => setNotice(null)} className="text-teal-700">Dismiss</button>
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-2xs max-w-md">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search hotels by name or city..."
              className="w-full pl-9 pr-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Hotels Table */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-500 font-semibold">Loading hotel records...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                    <th className="p-4">Hotel Property</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Starting Rate</th>
                    <th className="p-4">Rating</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredHotels.map((h) => (
                    <tr key={h._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={h.images?.[0]?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100'}
                          alt={h.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">{h.name}</span>
                          <span className="text-[10px] text-slate-400 line-clamp-1">{h.tagline}</span>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-slate-800">{h.city}, {h.state}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px]">
                          {h.propertyType}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-900">₹{h.priceStartingFrom?.toLocaleString('en-IN')}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 font-bold text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{h.averageRating || 4.8}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(h)}
                          className="p-1.5 text-slate-600 hover:text-teal-600 rounded-lg hover:bg-teal-50"
                          title="Edit Hotel"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setHotelToDelete(h);
                            setDeleteConfirmOpen(true);
                          }}
                          className="p-1.5 text-slate-600 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                          title="Delete Hotel"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Create/Edit Hotel */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xl font-black text-slate-900">
                {editingHotel ? 'Edit Hotel Property' : 'Add New Hotel Property'}
              </h3>
              <button type="button" onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Hotel Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Tagline / Catchphrase
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Full Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                    Star Rating
                  </label>
                  <select
                    value={formData.starRating}
                    onChange={(e) => setFormData({ ...formData, starRating: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-hidden"
                  >
                    <option value={5}>5 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={3}>3 Stars</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                    Property Type
                  </label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-hidden"
                  >
                    <option value="Hotel">Hotel</option>
                    <option value="Resort">Resort</option>
                    <option value="Villa">Villa</option>
                    <option value="Heritage Haveli">Heritage Haveli</option>
                    <option value="Boutique">Boutique</option>
                    <option value="Palace">Palace</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                    Base Rate (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.priceStartingFrom}
                    onChange={(e) => setFormData({ ...formData, priceStartingFrom: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Amenities (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Main Image URL
                </label>
                <input
                  type="url"
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                  Description *
                </label>
                <textarea
                  rows="3"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured-checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-teal-600 accent-teal-600 rounded-md"
                />
                <label htmlFor="featured-checkbox" className="text-xs font-bold text-slate-800">
                  Feature this property on the home page showcase
                </label>
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
                  {saving ? 'Saving...' : editingHotel ? 'Save Changes' : 'Create Hotel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Delete Hotel Property?"
        message={`Are you sure you want to permanently delete "${hotelToDelete?.name}"? All associated room types and inventory will also be deleted.`}
        confirmText="Delete Hotel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirmOpen(false)}
        isDangerous={true}
      />
    </div>
  );
};

export default AdminHotelsPage;
