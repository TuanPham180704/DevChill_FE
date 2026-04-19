import { useState, useEffect } from "react";
import { FaLock, FaUnlock } from "react-icons/fa";

export default function LockModal({
  isOpen,
  onClose,
  user,
  onConfirm,
  loading,
}) {
  const [reason, setReason] = useState("");
  const [lockUntil, setLockUntil] = useState("");
  const [isPermanent, setIsPermanent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReason("");
      setLockUntil("");
      setIsPermanent(false);
    }
  }, [isOpen]);

  if (!isOpen || !user) return null;

  const isLocked = user.is_locked;

  const inputStyle =
    "w-full h-10 px-3 text-sm border rounded-md outline-none focus:ring-2 focus:ring-indigo-400";
  const labelStyle = "text-xs font-medium text-gray-600 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
        <div className="px-6 py-6 text-center border-b">
          <div
            className={`w-14 h-14 mx-auto flex items-center justify-center rounded-lg mb-3 ${
              isLocked
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {isLocked ? <FaUnlock size={18} /> : <FaLock size={18} />}
          </div>

          <h3 className="text-base font-semibold">
            {isLocked ? "Mở khóa tài khoản" : "Khóa tài khoản"}
          </h3>

          <p className="text-xs text-gray-500 mt-1">
            {isLocked ? "Mở khóa cho" : "Khóa tài khoản"}{" "}
            <span className="font-medium text-gray-700">{user.username}</span>
          </p>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className={labelStyle}>Lý do</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do..."
              rows={3}
              className="w-full p-3 text-sm border rounded-md outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
          </div>
          {!isLocked && (
            <>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={isPermanent}
                  onChange={(e) => setIsPermanent(e.target.checked)}
                  className="accent-red-500"
                />
                Khóa vĩnh viễn
              </label>

              {!isPermanent && (
                <div>
                  <label className={labelStyle}>Thời gian khóa</label>
                  <input
                    type="date"
                    value={lockUntil}
                    onChange={(e) => setLockUntil(e.target.value)}
                    className={inputStyle}
                  />
                </div>
              )}
            </>
          )}
        </div>
        <div className="p-4 border-t bg-gray-50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-10 text-sm border rounded-md hover:bg-gray-100"
          >
            Hủy
          </button>

          <button
            onClick={() => {
              if (isLocked) {
                onConfirm(user.id);
              } else {
                onConfirm(user.id, {
                  block_reason: reason,
                  lock_until: isPermanent ? null : lockUntil,
                });
              }
            }}
            disabled={loading}
            className={`flex-1 h-10 text-sm rounded-md text-white transition ${
              isLocked
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang xử lý...</span>
              </div>
            ) : isLocked ? (
              "Mở khóa"
            ) : (
              "Khóa"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
