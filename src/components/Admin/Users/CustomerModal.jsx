import { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaEdit } from 'react-icons/fa';

export default function CustomerModal({ isOpen, onClose, user, onSave }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    birth_date: '',
    gender: 'unknown',
    role: 'user',
    avatar_url: '',
    is_premium: false,
    is_active: true
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        ...user,
        birth_date: user.birth_date ? new Date(user.birth_date).toISOString().split('T')[0] : ''
      });
      setIsEditing(false);
    } else {
      setFormData({
        username: '',
        email: '',
        password: '',
        birth_date: '',
        gender: 'unknown',
        role: 'user',
        avatar_url: '',
        is_premium: false,
        is_active: true
      });
      setIsEditing(false);
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (onSave) {
      onSave({
          ...formData,
          created_at: formData.created_at || new Date().toISOString()
      });
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-800">
            THÔNG TIN CHI TIẾT NGƯỜI DÙNG
          </h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsEditing(!isEditing)} 
              title={isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa thông tin"}
              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
                isEditing 
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' 
                : 'hover:bg-gray-200 text-gray-500 hover:text-indigo-600'
              }`}
            >
              <FaEdit size={16} />
            </button>
            <button 
              onClick={onClose} 
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 text-gray-500 transition-colors"
            >
              <FaTimes size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          <div className="flex flex-col md:flex-row gap-8 mb-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-3">
               <div className="w-24 h-24 rounded-full cursor-pointer bg-gray-100 border-2 border-gray-200 flex items-center justify-center text-gray-400 relative overflow-hidden">
                  {formData.avatar_url ? (
                      <img src={formData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                      <div className="w-full h-full bg-indigo-500 flex items-center justify-center text-white font-bold text-2xl">
                          {formData.username
                            ? formData.username.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase()
                            : <FaUser size={32} />
                          }
                      </div>
                  )}
               </div>
            </div>
            
            {/* Main Info */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Tên người dùng <span className="text-red-500">*</span></label>
                    <input 
                        type="text" 
                        value={formData.username} 
                        disabled
                        className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 text-sm cursor-not-allowed focus:outline-none transition-all placeholder-gray-400 opacity-70" 
                        placeholder="VD: Nguyễn Văn A"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Email <span className="text-red-500">*</span></label>
                    <input 
                        type="email" 
                        value={formData.email} 
                        disabled={!isEditing}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className={`w-full px-4 py-2 border rounded-lg text-sm transition-all placeholder-gray-400 outline-none ${
                            isEditing 
                            ? 'bg-white border-indigo-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-800' 
                            : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'
                        }`} 
                        placeholder="VD: email@example.com"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Mật khẩu <span className="text-red-500">*</span></label>
                    <input 
                        type="password" 
                        value={formData.password} 
                        disabled={!isEditing}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        className={`w-full px-4 py-2 border rounded-lg text-sm transition-all placeholder-gray-400 outline-none ${
                            isEditing 
                            ? 'bg-white border-indigo-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-800' 
                            : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'
                        }`} 
                        placeholder="Nhập để đổi mật khẩu mới"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Ngày sinh</label>
                    <input 
                        type="date" 
                        value={formData.birth_date} 
                        disabled
                        className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 text-sm cursor-not-allowed focus:outline-none transition-all opacity-70" 
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Giới tính</label>
                    <select 
                        value={formData.gender} 
                        disabled
                        className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 text-sm cursor-not-allowed focus:outline-none transition-all font-medium opacity-70"
                    >
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                        <option value="other">Khác</option>
                        <option value="unknown">Không rõ</option>
                    </select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Vai trò (Role)</label>
                    <select 
                        value={formData.role} 
                        disabled={!isEditing}
                        onChange={e => setFormData({...formData, role: e.target.value})}
                        className={`w-full px-4 py-2 border rounded-lg text-sm transition-all font-medium outline-none appearance-none ${
                            isEditing 
                            ? 'bg-white border-indigo-200 focus:border-indigo-500 text-gray-800 cursor-pointer' 
                            : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        <option value="user">Khách hàng (User)</option>
                        <option value="admin">Quản trị viên (Admin)</option>
                    </select>
                </div>
            </div>
          </div>

          <hr className="border-gray-100 my-6" />

          <div className="w-full">
              <div className={`flex items-center justify-between p-4 rounded-lg border transition-all ${isEditing ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                 <div>
                    <h4 className={`text-sm font-bold ${isEditing ? 'text-amber-900' : 'text-gray-500'}`}>Gói Premium</h4>
                    <p className={`text-xs mt-0.5 ${isEditing ? 'text-amber-700/70' : 'text-gray-400'}`}>Kích hoạt đặc quyền hội viên</p>
                 </div>
                 <label className={`relative inline-flex items-center ${isEditing ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                    <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={formData.is_premium} 
                        disabled={!isEditing}
                        onChange={e => setFormData({...formData, is_premium: e.target.checked})} 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                 </label>
              </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-gray-600 font-medium hover:bg-gray-200 transition-colors text-sm"
          >
            Hủy bỏ
          </button>
          <button 
            onClick={handleSave}
            disabled={!isEditing}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all text-sm ${
                isEditing 
                ? 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-sm shadow-indigo-500/30' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
            }`}
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}