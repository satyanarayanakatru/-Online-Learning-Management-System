import React, { useState } from 'react';
import { X, CheckCircle2, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';

export default function QuickActionModal({ action, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    email: '',
    category: 'Web Development',
    message: ''
  });

  if (!action) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success(`Action "${action.title}" executed successfully! 🎉`);
    if (onSuccess) onSuccess(action.id, formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="teal-glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative border border-emerald-500/30">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-emerald-500/20 pb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40">
              {action.badge}
            </span>
            <h3 className="text-xl font-black text-white">{action.title}</h3>
            <p className="text-xs text-emerald-200/70 font-semibold">{action.desc}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-emerald-300 hover:text-white rounded-xl hover:bg-emerald-500/20 transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Dynamic Form Input Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {action.id === 'add-course' && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Course Name</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Master React & Redux Toolkit"
                  className="w-full px-4 py-2.5 teal-input rounded-xl text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 teal-input rounded-xl text-sm bg-[#061923]"
                >
                  <option value="Web Development">Web Development</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Backend Architecture">Backend Architecture</option>
                  <option value="Data Science">Data Science</option>
                </select>
              </div>
            </>
          )}

          {(action.id === 'register-student' || action.id === 'add-instructor') && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Jane Doe"
                  className="w-full px-4 py-2.5 teal-input rounded-xl text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 teal-input rounded-xl text-sm"
                />
              </div>
            </>
          )}

          {action.id === 'announcement' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Announcement Message</label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Type your system-wide announcement here..."
                className="w-full px-4 py-2.5 teal-input rounded-xl text-sm"
              />
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-3 border-t border-emerald-500/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-emerald-300 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-black emerald-btn rounded-xl shadow-lg transition"
            >
              Submit Action
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
