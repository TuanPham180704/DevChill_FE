/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { X, Send, Clock, ShieldCheck, FileImage } from "lucide-react";
import { toast } from "react-toastify";
import {
  getTicketDetailClient,
  replyTicketClient,
} from "../../../api/supportUserApi";

export default function SupportClientModal({
  isOpen,
  ticketId,
  onClose,
  onReload,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // States cho Form Reply
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState([]); // Thêm state chứa ảnh đính kèm

  useEffect(() => {
    if (isOpen && ticketId) fetchDetail();
  }, [isOpen, ticketId]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await getTicketDetailClient(ticketId);
      setData(res?.data || res);

      // Reset form khi load vé mới
      setReplyContent("");
      setPreviewImages([]);
    } catch (err) {
      toast.error("Lỗi tải chi tiết vé!");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý convert ảnh sang Base64 cho User
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length + previewImages.length > 3) {
      return toast.warning("Chỉ tải lên tối đa 3 ảnh đính kèm!");
    }

    const promises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    });

    try {
      const base64Images = await Promise.all(promises);
      setPreviewImages([...previewImages, ...base64Images]);
    } catch (error) {
      toast.error("Lỗi khi đọc ảnh!");
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim() && previewImages.length === 0) {
      return toast.warning("Vui lòng nhập nội dung hoặc đính kèm ảnh!");
    }

    try {
      setIsSubmitting(true);
      await replyTicketClient(ticketId, {
        content_response: replyContent,
        attachments: previewImages, // Đẩy mảng Base64 lên Backend
      });
      toast.success("Đã phản hồi thành công!");
      fetchDetail(); // Reload lại chat ngay lập tức
      if (onReload) onReload(); // Cập nhật trạng thái ở trang gốc
    } catch (err) {
      toast.error("Lỗi gửi tin nhắn!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl bg-[#FCFDFE] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh]">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-white shrink-0">
          <div>
            <h3 className="text-lg font-extrabold text-slate-800">
              Mã vé #{data?.ticket_code || ticketId}
            </h3>
            <span className="text-[12px] font-bold text-blue-500 uppercase tracking-widest">
              {data?.category}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {loading || !data ? (
          <div className="p-20 text-center flex flex-col items-center text-slate-500 font-medium">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-3"></div>
            Đang tải dữ liệu...
          </div>
        ) : (
          <div className="flex flex-col flex-1 overflow-hidden bg-slate-50/70">
            {/* Lịch sử Chat */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 hidden-scrollbar">
              {/* Tin nhắn đầu tiên của User (Yêu cầu gốc) */}
              <div className="flex w-full justify-end">
                <div className="max-w-[80%] bg-blue-600 text-white rounded-2xl rounded-tr-sm p-4 shadow-sm border border-blue-500">
                  <div className="flex justify-between items-center mb-2 gap-4">
                    <span className="font-bold text-[13px]">Bạn</span>
                    <span className="text-[10px] font-medium text-blue-200 flex items-center gap-1 shrink-0">
                      <Clock size={10} />{" "}
                      {new Date(data.created_at).toLocaleString("vi-VN")}
                    </span>
                  </div>
                  <div className="text-[14px] leading-relaxed whitespace-pre-wrap">
                    {data.description}
                  </div>
                  {/* Ảnh đính kèm của yêu cầu gốc */}
                  {data.attachments && data.attachments.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {data.attachments.map((img, i) => (
                        <a key={i} href={img} target="_blank" rel="noreferrer">
                          <img
                            src={img}
                            alt="đính kèm"
                            className="w-20 h-20 object-cover rounded-lg border border-blue-400 hover:opacity-80"
                            onError={(e) => (e.target.style.display = "none")}
                          />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Vòng lặp tin nhắn phản hồi (Admin / User rep thêm) */}
              {data.responses?.map((res) => (
                <div
                  key={res.id}
                  className={`flex w-full ${res.is_admin_reply ? "justify-start" : "justify-end"}`}
                >
                  {res.is_admin_reply ? (
                    // Bong bóng của Admin (Trái)
                    <div className="flex gap-3 max-w-[85%]">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-1">
                        <ShieldCheck size={16} />
                      </div>
                      <div className="bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-tl-sm p-4 shadow-sm">
                        <div className="flex items-center justify-between gap-6 mb-2">
                          <span className="font-bold text-[13px] text-emerald-600">
                            DevChill Support
                          </span>
                          <span className="text-[10px] font-medium text-slate-400 shrink-0">
                            <Clock size={10} className="inline mr-1" />{" "}
                            {new Date(res.created_at).toLocaleString("vi-VN")}
                          </span>
                        </div>
                        <div className="text-[14px] leading-relaxed whitespace-pre-wrap">
                          {res.content_response}
                        </div>
                        {/* ẢNH ĐÍNH KÈM CỦA ADMIN GỬI */}
                        {res.attachments && res.attachments.length > 0 && (
                          <div className="mt-3 flex gap-2 flex-wrap">
                            {res.attachments.map((url, idx) => (
                              <a
                                key={idx}
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <img
                                  src={url}
                                  alt="attachment admin"
                                  className="w-16 h-16 object-cover rounded-lg border border-slate-200 hover:opacity-80"
                                  onError={(e) =>
                                    (e.target.style.display = "none")
                                  }
                                />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    // Bong bóng của User (Phải)
                    <div className="max-w-[80%] bg-blue-600 text-white rounded-2xl rounded-tr-sm p-4 shadow-sm border border-blue-500">
                      <div className="flex justify-between items-center mb-2 gap-4">
                        <span className="font-bold text-[13px]">Bạn</span>
                        <span className="text-[10px] font-medium text-blue-200 flex items-center gap-1 shrink-0">
                          <Clock size={10} />{" "}
                          {new Date(res.created_at).toLocaleString("vi-VN")}
                        </span>
                      </div>
                      <div className="text-[14px] leading-relaxed whitespace-pre-wrap">
                        {res.content_response}
                      </div>
                      {/* ẢNH ĐÍNH KÈM CỦA USER KHI REP THÊM */}
                      {res.attachments && res.attachments.length > 0 && (
                        <div className="mt-3 flex gap-2 flex-wrap">
                          {res.attachments.map((url, idx) => (
                            <a
                              key={idx}
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <img
                                src={url}
                                alt="attachment user"
                                className="w-16 h-16 object-cover rounded-lg border border-blue-400 hover:opacity-80"
                                onError={(e) =>
                                  (e.target.style.display = "none")
                                }
                              />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Khung nhập Chat bên dưới */}
            {data.status !== "closed" ? (
              <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                <form
                  onSubmit={handleReplySubmit}
                  className="flex flex-col gap-2"
                >
                  {/* Hiển thị ảnh đang chọn để gửi đi */}
                  {previewImages.length > 0 && (
                    <div className="flex gap-2 flex-wrap mb-1 px-1">
                      {previewImages.map((src, i) => (
                        <div
                          key={i}
                          className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-200 shadow-sm"
                        >
                          <img
                            src={src}
                            className="w-full h-full object-cover"
                            alt="preview"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setPreviewImages(
                                previewImages.filter((_, idx) => idx !== i),
                              )
                            }
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-end gap-2">
                    {/* Nút Upload Ảnh */}
                    {previewImages.length < 3 && (
                      <label className="shrink-0 mb-1 p-3 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-blue-100">
                        <FileImage size={24} />
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}

                    {/* Ô nhập Text */}
                    <div className="relative flex-1">
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Nhập tin nhắn hoặc tải ảnh lên..."
                        className="w-full pl-5 pr-14 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all shadow-inner text-[14px] resize-none h-13 leading-tight overflow-hidden"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleReplySubmit(e);
                          }
                        }}
                      />
                      <button
                        type="submit"
                        disabled={
                          isSubmitting ||
                          (!replyContent.trim() && previewImages.length === 0)
                        }
                        className="absolute right-2 bottom-1.5 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                      >
                        {isSubmitting ? (
                          <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full block" />
                        ) : (
                          <Send size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              <div className="p-4 bg-slate-100 text-center text-[13px] font-medium text-slate-500 border-t border-slate-200 shrink-0">
                Vé hỗ trợ này đã được đóng lại. Bạn không thể phản hồi thêm.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
