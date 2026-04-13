// Static PACKAGES data for Premium pages
export const PACKAGES = [
  {
    id: 'basic',
    name: 'Premium Basic',
    price: 59000,
    duration: 1,
    color: '#3B82F6',
    popular: false,
    subscribers: 12450,
    features: [
      'Không quảng cáo',
      'Full HD 1080p',
      'Chat room',
      'Tải offline 2 phim',
      'AI gợi ý phim',
    ],
  },
  {
    id: 'pro',
    name: 'Premium Pro',
    price: 149000,
    duration: 1,
    color: '#00D4FF',
    popular: true,
    subscribers: 8920,
    features: [
      'Tất cả Basic',
      '4K Ultra HD',
      'Chat room VIP',
      'Không giới hạn tải offline',
      'Xem trước phim mới',
      'Công chiếu độc quyền',
      'AI ưu tiên',
    ],
  },
  {
    id: 'family',
    name: 'Family Pack',
    price: 199000,
    duration: 1,
    color: '#A855F7',
    popular: false,
    subscribers: 3210,
    features: [
      '6 tài khoản',
      'Full HD 1080p',
      'Mỗi tài khoản đầy đủ tính năng Pro',
      'Quản lý gia đình',
    ],
  },
  {
    id: 'annual',
    name: 'Annual Pro',
    price: 1290000,
    duration: 12,
    color: '#F59E0B',
    popular: false,
    subscribers: 2180,
    features: [
      'Tất cả Premium Pro',
      'Giảm 28% so với tháng',
      'Ưu tiên hỗ trợ 24/7',
      'Badge đặc biệt',
    ],
  },
];

export const getPackageById = (id) => PACKAGES.find((p) => p.id === id) || null;
