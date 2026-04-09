/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { FaTimes, FaPen } from "react-icons/fa";

export default function ContractModal({
  isOpen,
  onClose,
  contract,
  onSave,
  isEditMode: initialEditMode = false, // chế độ ban đầu
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
    setIsEditMode(false); // trở lại xem chi tiết sau khi lưu
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 relative">
        {/* Nút đóng */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <FaTimes />
        </button>

        {/* Icon cây bút để bật chế độ edit nếu đang xem chi tiết */}
        {contract && !isEditMode && (
          <button
            className="absolute top-4 right-12 text-gray-500 hover:text-gray-700"
            onClick={() => setIsEditMode(true)}
            title="Chỉnh sửa"
          >
            <FaPen />
          </button>
        )}

        <h2 className="text-xl font-bold mb-4">
          {contract
            ? isEditMode
              ? "Chỉnh sửa hợp đồng"
              : "Xem chi tiết hợp đồng"
            : "Tạo hợp đồng mới"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tên hợp đồng
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              readOnly={!isEditMode}
              className={`mt-1 block w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none ${
                !isEditMode ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Ngày bắt đầu
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                readOnly={!isEditMode}
                className={`mt-1 block w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none ${
                  !isEditMode ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Ngày kết thúc
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                readOnly={!isEditMode}
                className={`mt-1 block w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none ${
                  !isEditMode ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Trạng thái
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={!isEditMode}
              className={`mt-1 block w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none ${
                !isEditMode ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              File hợp đồng (PDF)
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              disabled={!isEditMode}
              className={`mt-1 block w-full text-sm text-gray-700 ${
                !isEditMode ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>

          {/* Trường created_at & updated_at */}
          {contract && (
            <div className="flex gap-4 text-sm text-gray-500 mt-2">
              <div>
                <span className="font-medium">Ngày tạo:</span>{" "}
                {createdAt || "-"}
              </div>
              <div>
                <span className="font-medium">Cập nhật:</span>{" "}
                {updatedAt || "-"}
              </div>
            </div>
          )}

          {/* Nút lưu/hủy chỉ hiện khi edit */}
          {isEditMode && (
            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => setIsEditMode(false)}
                className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
              >
                Lưu
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
