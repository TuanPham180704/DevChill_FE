import { useState, useEffect } from "react";
import { FaLock, FaUnlock } from "react-icons/fa";

export default function LockModal({ isOpen, onClose, user, onConfirm }) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* HEADER */}
        <div className="px-6 pt-8 pb-4 text-center">
          <div
            className={`w-16 h-16 mx-auto flex items-center justify-center mb-4 rounded-xl shadow-sm ${
              isLocked
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {isLocked ? <FaUnlock size={22} /> : <FaLock size={22} />}
          </div>

          <h3 className="font-semibold text-lg">
            {isLocked ? "Mở khóa tài khoản" : "Khóa tài khoản"}
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            {isLocked ? "Mở khóa cho" : "Khóa tài khoản"}{" "}
            <span className="font-medium text-gray-700">{user.username}</span>
          </p>
        </div>

        {/* BODY */}
        <div className="px-6 pb-6 space-y-4">
          {/* Reason */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Lý do</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do..."
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              rows={3}
            />
          </div>

          {/* Lock options */}
          {!isLocked && (
            <>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPermanent}
                  onChange={(e) => setIsPermanent(e.target.checked)}
                  className="accent-red-500"
                />
                Khóa vĩnh viễn
              </label>

              {!isPermanent && (
                <input
                  type="date"
                  value={lockUntil}
                  onChange={(e) => setLockUntil(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              )}
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex gap-3 px-6 py-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border bg-white hover:bg-gray-100 transition"
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
              onClose();
            }}
            className={`flex-1 py-2 rounded-lg text-white shadow transition ${
              isLocked
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {isLocked ? "Mở khóa" : "Khóa"}
          </button>
        </div>
      </div>
    </div>
  );
}
