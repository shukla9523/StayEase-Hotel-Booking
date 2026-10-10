import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, Trash2, MapPin, RefreshCw, Loader2 } from 'lucide-react';
import adminService from '../../services/paymentService';
import ConfirmDialog from '../../components/common/ConfirmDialog';

export const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [notice, setNotice] = useState(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await adminService.adminService.getReviews();
      if (res.success) {
        setReviews(res.reviews || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!reviewToDelete) return;
    try {
      await adminService.adminService.deleteReview(reviewToDelete._id);
      setNotice('Review successfully moderated and removed.');
      setDeleteModalOpen(false);
      await fetchReviews();
    } catch (err) {
      alert(err.message || 'Failed to delete review.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Review Moderation</h1>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Monitor, approve, and moderate verified guest reviews across all hotel stays
            </p>
          </div>

          <button
            type="button"
            onClick={fetchReviews}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-teal-600" />
            <span>Refresh</span>
          </button>
        </div>

        {notice && (
          <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold flex items-center justify-between">
            <span>{notice}</span>
            <button type="button" onClick={() => setNotice(null)} className="text-teal-700">Dismiss</button>
          </div>
        )}

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-500 font-semibold">Loading reviews...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                    <th className="p-4">Hotel Property</th>
                    <th className="p-4">Guest</th>
                    <th className="p-4">Rating</th>
                    <th className="p-4">Review Comment</th>
                    <th className="p-4">Stay Date</th>
                    <th className="p-4 text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {reviews.map((rev) => (
                    <tr key={rev._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4">
                        <span className="font-bold text-slate-900 block">{rev.hotelId?.name}</span>
                        <span className="text-[10px] text-slate-400">{rev.hotelId?.city}</span>
                      </td>
                      <td className="p-4 font-bold text-slate-800">{rev.userName}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{rev.rating}/5</span>
                        </div>
                      </td>
                      <td className="p-4 max-w-sm">
                        {rev.title && <span className="font-bold block text-slate-900">{rev.title}</span>}
                        <p className="text-xs text-slate-600 line-clamp-2">{rev.comment}</p>
                      </td>
                      <td className="p-4 text-slate-500">
                        {new Date(rev.stayDate || rev.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setReviewToDelete(rev);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 text-slate-600 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                          title="Remove Review"
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

      <ConfirmDialog
        isOpen={deleteModalOpen}
        title="Remove Review?"
        message="Are you sure you want to delete this review? The hotel's average rating will automatically be recalculated."
        confirmText="Remove Review"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModalOpen(false)}
        isDangerous={true}
      />
    </div>
  );
};

export default AdminReviewsPage;
