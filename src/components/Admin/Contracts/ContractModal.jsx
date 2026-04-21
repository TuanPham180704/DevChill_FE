/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { X, Pencil } from "lucide-react";

export default function ContractModal({
  isOpen,
  onClose,
  contract,
  onSave,
  isEditMode: initialEditMode = false,
}) {
  const [isEditMode, setIsEditMode] = useState(initialEditMode);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("draft");
  const [file, setFile] = useState(null);
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");

  useEffect(() => {
    if (contract) {
      setName(contract.name || "");
      setStartDate(contract.start_date ? contract.start_date.slice(0, 10) : "");
      setEndDate(contract.end_date ? contract.end_date.slice(0, 10) : "");
      setStatus(contract.status || "draft");
      setFile(null);
      setCreatedAt(contract.created_at ? contract.created_at.slice(0, 10) : "");
      setUpdatedAt(contract.updated_at ? contract.updated_at.slice(0, 10) : "");
    } else {
      setName("");
      setStartDate("");
      setEndDate("");
      setStatus("draft");
      setFile(null);
      setCreatedAt("");
      setUpdatedAt("");
    }
    setIsEditMode(initialEditMode);
  }, [contract, initialEditMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, start_date: startDate, end_date: endDate, status, file });
    setIsEditMode(false);
  };

  if (!isOpen) return null;
  const baseInputStyle =
    "w-full h-11 px-4 text-[13.5px] font-medium rounded-xl outline-none transition-all duration-200 border";
  const activeInputStyle =
    "bg-white border-slate-200 text-slate-700 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10";
  const disabledStyle =
    "bg-slate-50 border-transparent text-slate-500 cursor-not-allowed";
  const labelStyle = "text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2 block pl-1";
  const fileInputStyle = `w-full text-[13.5px] font-medium text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-[13px] file:font-bold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 transition-all ${!isEditMode ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      <div className="relative w-full max-w-2xl bg-[#FCFDFE] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-screen">
        <div className="flex justify-between items-center px-8 py-5 border-b border-slate-100 bg-white">
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">
            {contract
              ? isEditMode
                ? "Chỉnh sửa hợp đồng"
                : "Chi tiết hợp đồng"
              : "Tạo hợp đồng mới"}
          </h2>
          <div className="flex items-center gap-2">
            {contract && !isEditMode && (
              <button
                onClick={() => setIsEditMode(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all"
                title="Chỉnh sửa"
              >
                <Pencil size={14} strokeWidth={2.5} />
                Chỉnh sửa
              </button>
            )}
            {contract && !isEditMode && <div className="w-px h-5 bg-slate-200 mx-1"></div>}
            
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-8 py-6 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="md:col-span-2">
              <label className={labelStyle}>
                Tên hợp đồng
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                readOnly={!isEditMode}
                required
                placeholder="Nhập tên hợp đồng..."
                className={`${baseInputStyle} ${isEditMode ? activeInputStyle : disabledStyle}`}
              />
            </div>
            
            <div>
              <label className={labelStyle}>
                Ngày bắt đầu
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                readOnly={!isEditMode}
                required
                className={`${baseInputStyle} ${isEditMode ? activeInputStyle : disabledStyle} ${!startDate && !isEditMode ? "text-transparent" : ""}`}
              />
            </div>
            
            <div>
              <label className={labelStyle}>
                Ngày kết thúc
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                readOnly={!isEditMode}
                className={`${baseInputStyle} ${isEditMode ? activeInputStyle : disabledStyle} ${!endDate && !isEditMode ? "text-transparent" : ""}`}
              />
            </div>
            
            <div>
              <label className={labelStyle}>
                Trạng thái
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={!isEditMode}
                className={`${baseInputStyle} cursor-pointer appearance-none ${isEditMode ? activeInputStyle : disabledStyle}`}
              >
                <option value="draft">Bản nháp (Draft)</option>
                <option value="active">Đang hiệu lực (Active)</option>
                <option value="expired">Đã hết hạn (Expired)</option>
                <option value="cancelled">Đã hủy (Cancelled)</option>
              </select>
            </div>
            
            <div>
              <label className={labelStyle}>
                Tập tin đính kèm (PDF)
              </label>
              <div className={`flex items-center h-11 px-1 rounded-xl ${isEditMode ? "border border-slate-200 bg-white" : "bg-slate-50 border border-transparent"}`}>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                  disabled={!isEditMode}
                  className={fileInputStyle}
                />
              </div>
            </div>

          </div>

          {contract && (
            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100 mt-2">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ngày tạo</span>
                <span className="text-[13px] font-semibold text-slate-600">{createdAt || "Chưa xác định"}</span>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div className="flex flex-col text-right">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Cập nhật lần cuối</span>
                <span className="text-[13px] font-semibold text-slate-600">{updatedAt || "Chưa cập nhật"}</span>
              </div>
            </div>
          )}
        </form>
        {isEditMode && (
          <div className="flex justify-end gap-3 px-8 py-5 border-t border-slate-100 bg-white">
            <button
              type="button"
              onClick={() => setIsEditMode(false)}
              className="px-5 h-10 text-[13.5px] font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 hover:text-slate-700 rounded-xl transition-all"
            >
              Hủy bỏ
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 h-10 text-[13.5px] font-bold text-white bg-slate-800 hover:bg-slate-700 shadow-md shadow-slate-200 rounded-xl transition-all"
            >
              Lưu thay đổi
            </button>
          </div>
        )}
      </div>
    </div>
  );
}