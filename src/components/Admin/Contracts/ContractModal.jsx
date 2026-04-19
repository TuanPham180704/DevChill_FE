/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { FaTimes, FaPen } from "react-icons/fa";

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

  const inputStyle =
    "w-full h-9 px-3 text-sm border rounded-md outline-none focus:ring-2 focus:ring-blue-400";
  const disabledStyle = "bg-gray-100 cursor-not-allowed";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-base font-semibold">
            {contract
              ? isEditMode
                ? "Chỉnh sửa hợp đồng"
                : "Chi tiết hợp đồng"
              : "Tạo hợp đồng"}
          </h2>
          <div className="flex items-center gap-3">
            {contract && !isEditMode && (
              <FaPen
                onClick={() => setIsEditMode(true)}
                className="cursor-pointer text-gray-500 hover:text-gray-700 text-sm"
                title="Chỉnh sửa"
              />
            )}
            <FaTimes
              onClick={onClose}
              className="cursor-pointer text-gray-500 hover:text-red-500 text-sm"
            />
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-auto px-5 py-4 space-y-5"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                Tên hợp đồng
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                readOnly={!isEditMode}
                required
                className={`${inputStyle} ${!isEditMode ? disabledStyle : ""}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                Ngày bắt đầu
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                readOnly={!isEditMode}
                required
                className={`${inputStyle} ${!isEditMode ? disabledStyle : ""}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                Ngày kết thúc
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                readOnly={!isEditMode}
                className={`${inputStyle} ${!isEditMode ? disabledStyle : ""}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                Trạng thái
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={!isEditMode}
                className={`${inputStyle} ${!isEditMode ? disabledStyle : ""}`}
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                File PDF
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
                disabled={!isEditMode}
                className={`text-sm w-full ${!isEditMode ? disabledStyle : ""}`}
              />
            </div>
          </div>
          {contract && (
            <div className="flex gap-6 text-xs text-gray-500 pt-2 border-t">
              <div>
                <span className="font-medium text-gray-600">Ngày tạo:</span>{" "}
                {createdAt || "-"}
              </div>
              <div>
                <span className="font-medium text-gray-600">Cập nhật:</span>{" "}
                {updatedAt || "-"}
              </div>
            </div>
          )}
        </form>
        {isEditMode && (
          <div className="flex justify-end gap-2 px-5 py-4 border-t">
            <button
              type="button"
              onClick={() => setIsEditMode(false)}
              className="px-4 h-9 text-sm border rounded-md hover:bg-gray-100"
            >
              Hủy
            </button>

            <button
              type="submit"
              onClick={handleSubmit}
              className="px-4 h-9 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Lưu
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
