import { useState } from 'react';
import {
  FileText, AlertTriangle, CheckCircle, Clock, Plus, Eye, X,
  Search, Download, FileBadge2, Pencil, FileSignature, FolderOpen, ChevronDown
} from 'lucide-react';
import Pagination from '../../components/Admin/Pagination';

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CFG = {
  draft:    { label: 'Nháp',         bg: '#F8FAFC', color: '#64748B', border: '#CBD5E1', icon: FileBadge2 },
  active:   { label: 'Hoạt động',   bg: '#ECFDF5', color: '#10B981', border: '#6EE7B7', icon: CheckCircle },
  expired:  { label: 'Đã hết hạn',  bg: '#FFFBEB', color: '#F59E0B', border: '#FCD34D', icon: Clock },
  violated: { label: 'Đã bị hủy',   bg: '#FEF2F2', color: '#EF4444', border: '#FCA5A5', icon: AlertTriangle },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '---';

const getFilename = (url) => url.split('/').pop() ?? url;

const shortName = (name) =>
  name.replace(/^Hợp đồng phim\s+/i, '').replace(/^Hợp đồng\s+/i, '');

const shortFile = (url) => {
  const f = url.split('/').pop() ?? url;
  return f.length > 22 ? f.slice(0, 20) + '…' : f;
};

const getDaysLeft = (endIso) =>
  Math.floor((new Date(endIso).getTime() - Date.now()) / 86400000);

const BLANK_FORM = {
  name: '', file_url: '', start_date: '', end_date: '', status: 'draft',
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function AdminContractsPage() {
  const [contracts, setContracts] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  const [detailContract, setDetailContract] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState(BLANK_FORM);

  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState(BLANK_FORM);

  const filtered = contracts.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    return true;
  });

  const openDetail = (c) => {
    setDetailContract(c);
    setIsEdit(false);
    setForm({ name: c.name, file_url: c.file_url, start_date: c.start_date.slice(0, 10), end_date: c.end_date.slice(0, 10), status: c.status });
  };

  const closeDetail = () => { setDetailContract(null); setIsEdit(false); };

  const handleEdit = () => {
    if (!detailContract) return;
    const updated = {
      ...detailContract,
      name: form.name,
      file_url: form.file_url,
      start_date: new Date(form.start_date).toISOString(),
      end_date: new Date(form.end_date).toISOString(),
      status: form.status,
      updated_at: new Date().toISOString(),
    };
    setContracts(prev => prev.map(c => c.id === updated.id ? updated : c));
    setDetailContract(updated);
    setIsEdit(false);
  };

  const handleAdd = () => {
    const now = new Date().toISOString();
    setContracts(prev => [{
      id: Math.max(...prev.map(c => c.id), 0) + 1,
      name: addForm.name,
      file_url: addForm.file_url || `/uploads/contracts/${Date.now()}.pdf`,
      start_date: addForm.start_date ? new Date(addForm.start_date).toISOString() : now,
      end_date: addForm.end_date ? new Date(addForm.end_date).toISOString() : now,
      status: addForm.status,
      created_by: 1,
      created_at: now,
      updated_at: now,
    }, ...prev]);
    setShowAdd(false);
    setAddForm(BLANK_FORM);
  };

  const stats = Object.entries(STATUS_CFG).map(([key, cfg]) => ({
    key, cfg, count: contracts.filter(c => c.status === key).length,
  }));

  return (
    <div className="flex flex-col h-full">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
          <FileText size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý Hợp đồng</h1>
          <p className="text-gray-500 text-sm font-medium">Quản lý và theo dõi các hợp đồng bản quyền</p>
        </div>
        <button onClick={() => setShowAdd(true)} 
          className="ml-auto flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 uppercase tracking-wide">
          <Plus size={18} />
          Tạo hợp đồng
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.map(({ key, cfg, count }) => (
          <div key={key} className="bg-white p-4 rounded-2xl border transition-all hover:shadow-md flex items-center gap-3" style={{ borderColor: '#E2E8F0' }}>
            <div className="p-2.5 rounded-xl" style={{ background: cfg.bg }}>
              <cfg.icon size={20} style={{ color: cfg.color }} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">{cfg.label}</p>
              <p className="text-2xl font-bold text-gray-900">{count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="bg-white p-4 rounded-2xl border mb-6 flex items-center gap-4" style={{ borderColor: '#E2E8F0' }}>
        <div className="relative w-80 group">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="search"
            placeholder="Tìm kiếm hợp đồng..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-500 focus:shadow-md focus:shadow-blue-500/5 outline-none transition-all"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        <div className="relative">
          <select
            value={filterStatus}
            onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
            className="appearance-none pl-3 pr-8 py-2 bg-gray-50 border border-transparent rounded-xl text-sm font-semibold text-gray-600 focus:bg-white focus:border-blue-500 outline-none cursor-pointer transition-all"
            style={{ borderColor: '#E2E8F0' }}>
            <option value="all">Tất cả trạng thái</option>
            <option value="draft">Nháp</option>
            <option value="active">Hoạt động</option>
            <option value="expired">Đã hết hạn</option>
            <option value="violated">Đã bị hủy</option>
          </select>
          <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
            <ChevronDown size={14} className="text-gray-400" />
          </div>
        </div>

      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border flex-1 flex flex-col overflow-hidden shadow-sm min-h-0" style={{ borderColor: '#E2E8F0' }}>
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-10 bg-[#F8FAFC]">
              <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                <th className="w-10 px-4 py-3"><input type="checkbox" className="rounded border-gray-300" /></th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap uppercase tracking-wider">Tên hợp đồng</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap uppercase tracking-wider">File hợp đồng</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap uppercase tracking-wider">Ngày bắt đầu</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap uppercase tracking-wider">Ngày kết thúc</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap uppercase tracking-wider">Trạng thái</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: '#F1F5F9' }}>
              {filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map(c => {
                const sc = STATUS_CFG[c.status];
                const daysLeft = getDaysLeft(c.end_date);
                return (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 text-center"><input type="checkbox" className="rounded border-gray-300" /></td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono text-gray-400">#{c.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold text-gray-700 truncate max-w-[200px]" title={shortName(c.name)}>
                        {shortName(c.name)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <a href={c.file_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 group" title={getFilename(c.file_url)}>
                        <FileText size={13} className="text-blue-400 shrink-0" />
                        <span className="text-xs text-blue-500 group-hover:underline truncate max-w-[150px]">{shortFile(c.file_url)}</span>
                        <Download size={11} className="text-gray-300 group-hover:text-blue-400 shrink-0" />
                      </a>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap font-medium">{fmtDate(c.start_date)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="text-sm text-gray-500 font-medium">{fmtDate(c.end_date)}</p>
                      {c.status === 'active' && daysLeft > 0 && daysLeft < 90 && (
                        <p className="text-[10px] text-red-500 font-bold mt-0.5 animate-pulse italic">⚠️ Hết hạn sau {daysLeft} ngày</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <sc.icon size={13} style={{ color: sc.color }} />
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold border"
                          style={{ background: sc.bg, color: sc.color, borderColor: sc.border }}>{sc.label}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => openDetail(c)} title="Xem chi tiết"
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-all">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-400">
                    Không có hợp đồng nào phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(filtered.length / PAGE_SIZE)}
          itemsPerPage={PAGE_SIZE}
          totalItems={filtered.length}
          onPageChange={p => setPage(p)}
          itemName="hợp đồng"
        />
      </div>

      {/* ══════════════════════════════════════════════════════════════
          DETAIL + EDIT MODAL
      ══════════════════════════════════════════════════════════════ */}
      {detailContract && (() => {
        const sc = STATUS_CFG[detailContract.status];
        const scForm = STATUS_CFG[form.status];
        return (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closeDetail}>
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>

              {/* Modal Header */}
              <div className="flex items-center gap-4 px-6 py-4 border-b" style={{ borderColor: '#F1F5F9' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'linear-gradient(135deg, #EFF6FF, #EDE9FE)' }}>
                  <FileSignature size={20} className="text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-gray-800 truncate">Chi tiết hợp đồng</h3>
                  <p className="text-xs text-gray-400">Quản lý thông tin & chỉnh sửa hợp đồng</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!isEdit ? (
                    <button onClick={() => setIsEdit(true)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all"
                      style={{ background: 'linear-gradient(135deg, #EFF6FF, #EDE9FE)', color: '#3B82F6', border: '1.5px solid #BFDBFE' }}>
                      <Pencil size={13} />Chỉnh sửa
                    </button>
                  ) : (
                    <span className="px-3 py-1.5 rounded-xl text-xs font-bold text-blue-600 animate-pulse"
                      style={{ background: '#EFF6FF', border: '1.5px solid #BFDBFE' }}>
                      ✏️ Đang chỉnh sửa
                    </span>
                  )}
                  <button onClick={closeDetail}
                    className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors">
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="flex gap-0">
                {/* LEFT */}
                <div className="w-48 shrink-0 p-5 border-r flex flex-col items-center text-center gap-3"
                  style={{ borderColor: '#F1F5F9', background: '#FAFBFF' }}>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%)' }}>
                    <FileSignature size={28} className="text-white" />
                  </div>
                  <p className="text-xs font-mono text-gray-400">ID #{detailContract.id}</p>

                  <div className="w-full rounded-xl p-3 text-center"
                    style={{ background: sc.bg, border: `1px solid ${sc.border}` }}>
                    <div className="flex items-center justify-center gap-1.5">
                      <sc.icon size={13} style={{ color: sc.color }} />
                      <span className="text-xs font-bold" style={{ color: sc.color }}>{sc.label}</span>
                    </div>
                  </div>

                  <div className="w-full rounded-xl p-3 text-left" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <p className="text-xs font-semibold text-blue-500 mb-2 uppercase tracking-wide">Thời hạn</p>
                    <div className="space-y-1.5">
                      <div>
                        <p className="text-[10px] text-gray-400">Bắt đầu</p>
                        <p className="text-xs font-bold text-gray-700">{fmtDate(detailContract.start_date)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400">Kết thúc</p>
                        <p className="text-xs font-bold text-gray-700">{fmtDate(detailContract.end_date)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full rounded-xl p-3 text-left" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <p className="text-xs font-semibold text-orange-400 mb-2 uppercase tracking-wide">Meta</p>
                    <div className="space-y-1">
                      <div>
                        <p className="text-[10px] text-gray-400">Tạo bởi</p>
                        <p className="text-xs font-bold text-gray-700">Admin #{detailContract.created_by}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400">Ngày tạo</p>
                        <p className="text-xs font-bold text-gray-700">{fmtDate(detailContract.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400">Cập nhật</p>
                        <p className="text-xs font-bold text-gray-700">{fmtDate(detailContract.updated_at)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex-1 p-5 space-y-4">
                  {/* Tên hợp đồng */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Tên hợp đồng</p>
                    {isEdit ? (
                      <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-xl text-sm outline-none text-gray-800 transition-all duration-200"
                        style={{ background: '#fff', border: '2px solid #93C5FD', boxShadow: '0 0 0 3px #DBEAFE' }} />
                    ) : (
                      <div className="px-3 py-2.5 rounded-xl text-sm text-gray-700"
                        style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                        {detailContract.name}
                      </div>
                    )}
                  </div>

                  {/* File PDF */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">File hợp đồng (PDF)</p>
                    {isEdit ? (
                      <div>
                        <input id="file-picker-edit" type="file" accept=".pdf" className="hidden"
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) setForm(f => ({ ...f, file_url: `/uploads/contracts/${file.name}` }));
                          }} />
                        <button type="button" onClick={() => document.getElementById('file-picker-edit')?.click()}
                          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-left transition-all duration-200 group"
                          style={{ background: '#fff', border: '2px solid #93C5FD', boxShadow: '0 0 0 3px #DBEAFE' }}>
                          <FolderOpen size={15} className="text-blue-400 shrink-0 group-hover:text-blue-600 transition-colors" />
                          <span className={`flex-1 truncate ${form.file_url ? 'text-gray-700' : 'text-gray-400 italic'}`}>
                            {form.file_url ? getFilename(form.file_url) : 'Nhấn để chọn file PDF...'}
                          </span>
                          <span className="text-xs text-blue-400 shrink-0 font-semibold">Chọn file</span>
                        </button>
                      </div>
                    ) : (
                      <a href={detailContract.file_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm group"
                        style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                        <FileText size={14} className="text-blue-400 shrink-0" />
                        <span className="text-blue-500 group-hover:underline truncate text-xs">{getFilename(detailContract.file_url)}</span>
                        <Download size={12} className="text-gray-300 group-hover:text-blue-400 ml-auto shrink-0" />
                      </a>
                    )}
                  </div>

                  {/* Ngày */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Ngày bắt đầu</p>
                      {isEdit ? (
                        <input type="date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}
                          className="w-full px-3 py-2.5 rounded-xl text-sm outline-none text-gray-800 transition-all duration-200"
                          style={{ background: '#fff', border: '2px solid #93C5FD', boxShadow: '0 0 0 3px #DBEAFE' }} />
                      ) : (
                        <div className="px-3 py-2.5 rounded-xl text-sm text-gray-700"
                          style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                          {fmtDate(detailContract.start_date)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Ngày kết thúc</p>
                      {isEdit ? (
                        <input type="date" value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))}
                          className="w-full px-3 py-2.5 rounded-xl text-sm outline-none text-gray-800 transition-all duration-200"
                          style={{ background: '#fff', border: '2px solid #93C5FD', boxShadow: '0 0 0 3px #DBEAFE' }} />
                      ) : (
                        <div className="px-3 py-2.5 rounded-xl text-sm text-gray-700"
                          style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                          {fmtDate(detailContract.end_date)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Trạng thái */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Trạng thái</p>
                    {isEdit ? (
                      <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-xl text-sm outline-none text-gray-800 transition-all duration-200"
                        style={{ background: '#fff', border: '2px solid #93C5FD', boxShadow: '0 0 0 3px #DBEAFE' }}>
                        {Object.entries(STATUS_CFG).map(([k, v]) => (
                          <option key={k} value={k}>{v.label}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                        style={{ background: sc.bg, border: `1.5px solid ${sc.border}` }}>
                        <sc.icon size={14} style={{ color: sc.color }} />
                        <span className="text-sm font-bold" style={{ color: sc.color }}>{sc.label}</span>
                      </div>
                    )}
                  </div>

                  {isEdit && form.status !== detailContract.status && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs"
                      style={{ background: scForm.bg, border: `1px dashed ${scForm.border}` }}>
                      <scForm.icon size={13} style={{ color: scForm.color }} />
                      <span style={{ color: scForm.color }}>Trạng thái mới: <strong>{scForm.label}</strong></span>
                    </div>
                  )}

                  {detailContract.status === 'expired' && !isEdit && (
                    <div className="p-3 rounded-xl" style={{ background: '#FFFBEB', border: '1px solid #FCD34D' }}>
                      <p className="text-xs text-yellow-700">⚠️ Phim liên kết đã tự động ẩn do hợp đồng hết hạn</p>
                    </div>
                  )}
                  {detailContract.status === 'violated' && !isEdit && (
                    <div className="p-3 rounded-xl" style={{ background: '#FEF2F2', border: '1px solid #FCA5A5' }}>
                      <p className="text-xs text-red-700">🚫 Phim đã bị gỡ khỏi hệ thống do vi phạm hợp đồng</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t" style={{ borderColor: '#F1F5F9', background: '#FAFBFF' }}>
                <button
                  onClick={() => {
                    if (isEdit) {
                      setIsEdit(false);
                      setForm({ name: detailContract.name, file_url: detailContract.file_url, start_date: detailContract.start_date.slice(0, 10), end_date: detailContract.end_date.slice(0, 10), status: detailContract.status });
                    } else { closeDetail(); }
                  }}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border transition-colors hover:bg-gray-50"
                  style={{ borderColor: '#E2E8F0' }}>
                  {isEdit ? 'Hủy' : 'Đóng'}
                </button>
                <button
                  disabled={!isEdit || !form.name || !form.start_date || !form.end_date}
                  onClick={handleEdit}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: isEdit ? 'linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%)' : '#CBD5E1' }}>
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ══════════════════════════════════════════════════════
          Add Modal
      ══════════════════════════════════════════════════════ */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 px-6 py-4 border-b" style={{ borderColor: '#F1F5F9' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #EFF6FF, #EDE9FE)' }}>
                <Plus size={16} className="text-blue-500" />
              </div>
              <div>
                <h3 className="font-black text-gray-800">Thêm hợp đồng mới</h3>
                <p className="text-xs text-gray-400">Điền đầy đủ thông tin hợp đồng</p>
              </div>
              <button onClick={() => setShowAdd(false)} className="ml-auto p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={18} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Tên hợp đồng <span className="text-red-500">*</span></label>
                <input value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="VD: Hợp đồng phim Tên Phim"
                  className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none text-gray-700"
                  style={{ background: '#F5F7FA', borderColor: '#E2E8F0' }} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">File hợp đồng (PDF)</label>
                <input id="file-picker-add" type="file" accept=".pdf" className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) setAddForm(f => ({ ...f, file_url: `/uploads/contracts/${file.name}` }));
                  }} />
                <button type="button" onClick={() => document.getElementById('file-picker-add')?.click()}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-left border transition-colors hover:border-blue-300 group"
                  style={{ background: '#F5F7FA', borderColor: '#E2E8F0' }}>
                  <FolderOpen size={15} className="text-blue-400 shrink-0 group-hover:text-blue-600 transition-colors" />
                  <span className={`flex-1 truncate ${addForm.file_url ? 'text-gray-700' : 'text-gray-400 italic'}`}>
                    {addForm.file_url ? addForm.file_url.split('/').pop() : 'Nhấn để chọn file PDF...'}
                  </span>
                  <span className="text-xs text-blue-400 shrink-0 font-semibold whitespace-nowrap">Chọn file</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Ngày bắt đầu <span className="text-red-500">*</span></label>
                  <input type="date" value={addForm.start_date} onChange={e => setAddForm(f => ({ ...f, start_date: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none text-gray-700"
                    style={{ background: '#F5F7FA', borderColor: '#E2E8F0' }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Ngày kết thúc <span className="text-red-500">*</span></label>
                  <input type="date" value={addForm.end_date} onChange={e => setAddForm(f => ({ ...f, end_date: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none text-gray-700"
                    style={{ background: '#F5F7FA', borderColor: '#E2E8F0' }} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Trạng thái</label>
                <select value={addForm.status} onChange={e => setAddForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none text-gray-700"
                  style={{ background: '#F5F7FA', borderColor: '#E2E8F0' }}>
                  {Object.entries(STATUS_CFG).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t" style={{ borderColor: '#F1F5F9', background: '#FAFBFF' }}>
              <button onClick={() => setShowAdd(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border"
                style={{ borderColor: '#E2E8F0' }}>Hủy</button>
              <button disabled={!addForm.name || !addForm.start_date || !addForm.end_date}
                onClick={handleAdd}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%)' }}>
                Thêm hợp đồng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}