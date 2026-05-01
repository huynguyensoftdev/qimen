export type PatternSeverity = 'AUSPICIOUS' | 'OMINOUS' | 'NEUTRAL';

export interface PatternRule {
  id: string;
  name: string;
  severity: PatternSeverity;
  description: string;
  
  // Điều kiện để kích hoạt (Null = không bắt buộc)
  tianGan?: string[]; // Thiên Can của Thiên Bàn (nếu mảng có nhiều, là OR)
  diPan?: string[];   // Can của Địa Bàn
  door?: string[];    // Bát Môn (Nhân Bàn)

  // Các flag đặc biệt cho engine
  isChiefPalace?: boolean; // Cung có Trực Phù
  isPhucNgam?: boolean;    // Cung đang ở trạng thái Phục Ngâm
  isPhanNgam?: boolean;    // Cung đang ở trạng thái Phản Ngâm
  
  // Các flag cho Tam Thắng & Ngũ Bất
  isVictory?: boolean;     // Cung thuộc Tam Thắng (Thắng lợi)
  isForbidden?: boolean;   // Cung thuộc Ngũ Bất (Cấm kỵ tấn công)
}

export const QIMEN_PATTERNS: PatternRule[] = [
  // --- TỨ ĐẠI CÁT CỤC ---
  {
    id: 'thanh_long_phan_thu',
    name: 'Thanh Long Phản Thủ',
    severity: 'AUSPICIOUS',
    description: 'Mậu gia Bính. Tôn trưởng chiếu cố, làm việc đại cát lợi, cầu tài tiến lộc.',
    tianGan: ['Mậu'],
    diPan: ['Bính']
  },
  {
    id: 'phi_dieu_diet_huyet',
    name: 'Phi Điểu Điệt Huyệt',
    severity: 'AUSPICIOUS',
    description: 'Bính gia Mậu. Chim bay về tổ. Rất tốt cho việc xây dựng, động thổ, bình an.',
    tianGan: ['Bính'],
    diPan: ['Mậu']
  },
  
  // --- CÁC CÁCH CỤC PHỔ BIẾN TỪ TÀI LIỆU ---
  {
    id: 'thien_at_phi_cung',
    name: 'Thiên Ất Phi Cung',
    severity: 'OMINOUS',
    description: 'Trực Phù gặp Canh. Đại diện cho sự cản trở, không nên tiến công hay thay đổi.',
    tianGan: ['Canh'],
    isChiefPalace: true // Một flag mới để engine nhận diện cung có Trực Phù
  },
  {
    id: 'phuc_ngam',
    name: 'Phục Ngâm',
    severity: 'NEUTRAL',
    description: 'Tinh, Môn ở tại cung gốc. Mọi sự đình trệ, bất động, nên giữ nguyên trạng.',
    isPhucNgam: true
  },
  {
    id: 'phan_ngam',
    name: 'Phản Ngâm',
    severity: 'OMINOUS',
    description: 'Tinh, Môn ở tại cung đối diện cung gốc. Biến động cực lớn, phản trắc, thay đổi chóng mặt.',
    isPhanNgam: true
  },
  {
    id: 'thai_bach_nhap_huynh',
    name: 'Thái Bạch Nhập Huỳnh',
    severity: 'OMINOUS',
    description: 'Canh gia Bính. Thái Bạch (Canh) rớt vào lửa (Bính). Phòng trộm cướp, tổn thất bất ngờ từ bên ngoài.',
    tianGan: ['Canh'],
    diPan: ['Bính']
  },
  {
    id: 'huynh_hoac_nhap_thai_bach',
    name: 'Huỳnh Hoặc Nhập Thái Bạch',
    severity: 'OMINOUS',
    description: 'Bính gia Canh. Lửa rớt vào Kim. Đề phòng mất của, hỏa hoạn hoặc tai ương thình lình.',
    tianGan: ['Bính'],
    diPan: ['Canh']
  },
  // --- THẬP CAN KHẮC ỨNG (CÁT CỤC) ---
  {
    id: 'at_binh',
    name: 'Kỳ Nghi Tá Quý',
    severity: 'AUSPICIOUS',
    description: 'Ất gia Bính. Cát tinh chiếu diệu, mọi sự hanh thông, quý nhân phù trợ.',
    tianGan: ['Ất'],
    diPan: ['Bính']
  },
  {
    id: 'at_dinh',
    name: 'Kỳ Nghi Tương Tá',
    severity: 'AUSPICIOUS',
    description: 'Ất gia Đinh. Ngọc nữ giúp đỡ, văn thư thông suốt, hôn nhân tốt đẹp.',
    tianGan: ['Ất'],
    diPan: ['Đinh']
  },
  {
    id: 'binh_at',
    name: 'Nhật Thăng Phù Hải',
    severity: 'AUSPICIOUS',
    description: 'Bính gia Ất. Nhật nguyệt cùng rạng rỡ, cầu tài đắc lợi, danh tiếng vang xa.',
    tianGan: ['Bính'],
    diPan: ['Ất']
  },
  {
    id: 'dinh_at',
    name: 'Ngọc Nữ Ký Cung',
    severity: 'AUSPICIOUS',
    description: 'Đinh gia Ất. Mọi sự cát lợi, đặc biệt tốt cho văn chương, thi cử và phụ nữ.',
    tianGan: ['Đinh'],
    diPan: ['Ất']
  },

  // --- THẬP CAN KHẮC ỨNG (HUNG CỤC) ---
  {
    id: 'canh_quy',
    name: 'Đại Cách',
    severity: 'OMINOUS',
    description: 'Canh gia Quý. Tượng người đi không về, xe đổ ngựa quỵ. Rất xấu cho xuất hành và kinh doanh.',
    tianGan: ['Canh'],
    diPan: ['Quý']
  },
  {
    id: 'thien_van_xuong_khi',
    name: 'Thiên Vận Xương Khí',
    severity: 'AUSPICIOUS',
    description: 'Đinh gia Ất. Quý nhân giúp đỡ, thăng quan tiến chức, tài lộc dồi dào, hôn nhân hạnh phúc.',
    tianGan: ['Đinh'],
    diPan: ['Ất']
  },
  {
    id: 'tinh_ky_thu_tro',
    name: 'Tinh Kỳ Thụ Trở',
    severity: 'OMINOUS',
    description: 'Đinh gia Canh. Tin tức bị nghẽn, đi lại gặp trở ngại, mọi việc bất nhất, khó thông suốt.',
    tianGan: ['Đinh'],
    diPan: ['Canh']
  },
  {
    id: 'thai_bach_nhap_vong',
    name: 'Thái Bạch Nhập Vọng',
    severity: 'OMINOUS',
    description: 'Canh gia Nhâm. Tranh chấp, thị phi, đề phòng kiện tụng hoặc bị vây hãm trong lưới pháp luật.',
    tianGan: ['Canh'],
    diPan: ['Nhâm']
  },
  {
    id: 'phi_can_sat',
    name: 'Phi Can Sát',
    severity: 'OMINOUS',
    description: 'Canh gia Ất. Tượng bị trừng phạt, mọi việc nên thận trọng, không nên manh động.',
    tianGan: ['Canh'],
    diPan: ['Ất']
  },
  {
    id: 'canh_nham',
    name: 'Tiểu Cách',
    severity: 'OMINOUS',
    description: 'Canh gia Nhâm. Trở ngại tầng tầng, đề phòng tiểu nhân hãm hại hoặc mất mát dọc đường.',
    tianGan: ['Canh'],
    diPan: ['Nhâm']
  },
  {
    id: 'quy_canh',
    name: 'Thái Bạch Nhập Vọng',
    severity: 'OMINOUS',
    description: 'Quý gia Canh. Tranh chấp kịch liệt, thị phi khó tránh, không nên can thiệp vào việc người khác.',
    tianGan: ['Quý'],
    diPan: ['Canh']
  },
  {
    id: 'tan_nham',
    name: 'Hung Xà Nhập Ngục',
    severity: 'OMINOUS',
    description: 'Tân gia Nhâm. Sai lầm chồng chất, khó lòng cứu vãn, đề phòng kiện tụng kéo dài.',
    tianGan: ['Tân'],
    diPan: ['Nhâm']
  },

  // --- CÁC CÁCH CỤC ĐẶC BIỆT TỪ CẨM NANG ---
  {
    id: 'song_moc_thanh_lam',
    name: 'Song Mộc Thành Lâm',
    severity: 'NEUTRAL',
    description: 'Giáp (Mậu) gia Giáp (Mậu). Tượng rừng rậm che lối, sự nghiệp vững nhưng hay gặp trì trệ, khó đột phá.',
    tianGan: ['Mậu'],
    diPan: ['Mậu']
  },
  {
    id: 'thanh_long_hop_linh',
    name: 'Thanh Long Hợp Linh',
    severity: 'AUSPICIOUS',
    description: 'Giáp (Mậu) gia Ất. Mọi sự bình an, có sự hợp tác tốt đẹp nhưng cần quyết đoán hơn.',
    tianGan: ['Mậu'],
    diPan: ['Ất']
  },


  {
    id: 'tam_thang_cung',
    name: 'Tam Thắng Cung',
    severity: 'AUSPICIOUS',
    description: 'Vị trí nắm chắc phần thắng theo binh pháp. (Trực Phù, Cửu Thiên hoặc Thái Âm)',
    isVictory: true
  },
  {
    id: 'ngu_bat_kich',
    name: 'Ngũ Bất Kích',
    severity: 'OMINOUS',
    description: 'Hướng kỵ tấn công hoặc khởi sự mạnh mẽ, dễ chuốc lấy thất bại (Bạch Hổ, Huyền Vũ hoặc cung xung Trực Phù).',
    isForbidden: true
  }
];
