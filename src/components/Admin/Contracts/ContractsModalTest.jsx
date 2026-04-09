import { useState } from 'react';
import { 
  X, FileSignature, FolderOpen, CheckCircle, 
  Clock, AlertTriangle, FileBadge2, FileText 
} from 'lucide-react';

// Cấu hình trạng thái dùng chung
export const STATUS_CFG = {
  draft:    { label: 'Nháp',        bg: '#F1F5F9', color: '#64748B', border: '#CBD5E1', icon: FileBadge2 },
  active:   { label: 'Hoạt động',   bg: '#F0FDF4', color: '#16A34A', border: '#BBF7D0', icon: CheckCircle },
  expired:  { label: 'Hết hạn',     bg: '#FFFBEB', color: '#D97706', border: '#FDE68A', icon: Clock },
  violated: { label: 'Bị hủy',      bg: '#FEF2F2', color: '#DC2626', border: '#FECACA', icon: AlertTriangle },
};

export const StatusBadge = ({ status }) => {
  const cfg = STATUS_CFG[status] || STATUS_CFG.draft;
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border"
      style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.border }}>
      <cfg.icon size={12} /> {cfg.label}
    </div>
  );
};

export function DetailModal({ contract, isEdit, form, setForm, onClose, onEditToggle, onSave }) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="px-8 py-6 border-b flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-500 border border-slate-100">
              <FileSignature size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800">Chi tiết hợp đồng</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">ID: #{contract.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onEditToggle} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isEdit ? 'bg-orange-100 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
              {isEdit ? 'Hủy bỏ' : 'Sửa đổi'}
            </button>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20}/></button>
          </div>
        </div>

        <div className="p-8 grid grid-cols-12 gap-8">
          <div className="col-span-4 space-y-4 text-center">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center gap-2">
              <StatusBadge status={isEdit ? form.status : contract.status} />
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">Cập nhật lúc</p>
              <p className="text-xs font-bold text-slate-600">{new Date(contract.updated_at).toLocaleTimeString('vi-VN')}</p>
            </div>
          </div>

          <div className="col-span-8 space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Tên phim / Hợp đồng</label>
              {isEdit ? (
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-blue-100 focus:border-blue-500 outline-none font-bold text-slate-700 transition-all" />
              ) : (
                <p className="px-4 py-3 rounded-xl bg-slate-50 font-bold text-slate-700 border border-transparent">{contract.name}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Ngày bắt đầu</label>
                <input type="date" disabled={!isEdit} value={form.start_date} 
                  onChange={e => setForm({...form, start_date: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-transparent outline-none font-bold text-slate-700 focus:border-blue-500 disabled:opacity-60 transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Ngày kết thúc</label>
                <input type="date" disabled={!isEdit} value={form.end_date} 
                  onChange={e => setForm({...form, end_date: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-transparent outline-none font-bold text-slate-700 focus:border-blue-500 disabled:opacity-60 transition-all" />
              </div>
            </div>

            {isEdit && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Cập nhật trạng thái</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-blue-100 outline-none font-bold text-slate-700">
                  {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
            )}
          </div>
        </div>

        {isEdit && (
          <div className="px-8 py-5 bg-slate-50 border-t flex justify-end">
            <button onClick={onSave} className="px-8 py-3 rounded-2xl bg-slate-800 text-white font-black text-sm hover:bg-black transition-all shadow-lg active:scale-95">
              LƯU THAY ĐỔI
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function AddModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState({ name: '', start_date: '', end_date: '', status: 'draft' });

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl p-8" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-100">
            <FolderOpen size={28} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800">Tạo hợp đồng</h3>
            <p className="text-sm font-medium text-slate-400">Thiết lập bản quyền phim mới</p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Tên phim / Hợp đồng</label>
            <input placeholder="VD: Avengers: Endgame"
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-blue-500 outline-none font-bold text-slate-700 transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Ngày bắt đầu</label>
              <input type="date" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-blue-500 outline-none font-bold text-slate-700" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Ngày kết thúc</label>
              <input type="date" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-blue-500 outline-none font-bold text-slate-700" />
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button onClick={onClose} className="flex-1 py-3.5 rounded-2xl bg-slate-100 text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-slate-200">Hủy</button>
          <button onClick={() => onAdd(formData)} disabled={!formData.name || !formData.start_date || !formData.end_date}
            className="flex-[2] py-3.5 rounded-2xl bg-blue-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100 disabled:opacity-50">
            Tạo ngay
          </button>
        </div>
      </div>
    </div>
  );
}