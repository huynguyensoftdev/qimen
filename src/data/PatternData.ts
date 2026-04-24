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
  
  // --- TỨ ĐẠI HUNG CỤC ---
  {
    id: 'thai_bach_nhap_huynh',
    name: 'Thái Bạch Nhập Huỳnh',
    severity: 'OMINOUS',
    description: 'Canh gia Bính. Hình tượng sao Thái Bạch rớt vào Hỏa cục. Phòng ngừa mất trộm, phá tài, hao tổn.',
    tianGan: ['Canh'],
    diPan: ['Bính']
  },
  {
    id: 'huynh_hoac_boi_thiet',
    name: 'Huỳnh Hoặc Bội Thiết',
    severity: 'OMINOUS',
    description: 'Bính gia Canh. Sao Huỳnh Hoặc áp chế Canh kim. Cẩn thận hao tài tốn của, xung đột.',
    tianGan: ['Bính'],
    diPan: ['Canh']
  },
  {
    id: 'thanh_long_dao_tau',
    name: 'Thanh Long Đào Tẩu',
    severity: 'OMINOUS',
    description: 'Ất gia Tân. Mộc bị Kim khắc. Tượng rồng bỏ chạy. Không nên hành động mạo hiểm, kỵ đi xa.',
    tianGan: ['Ất'],
    diPan: ['Tân']
  },
  {
    id: 'bach_ho_xuong_cuong',
    name: 'Bạch Hổ Xương Cuồng',
    severity: 'OMINOUS',
    description: 'Tân gia Ất. Kim xông vào Khắc Mộc. Hung họa rình rập, kỵ cưới hỏi, kinh doanh.',
    tianGan: ['Tân'],
    diPan: ['Ất']
  },
  {
    id: 'dang_xa_yeu_kieu',
    name: 'Đằng Xà Yểu Kiều',
    severity: 'OMINOUS',
    description: 'Quý gia Đinh. Thủy khắc Hỏa. Tiểu nhân quấy phá, đề phòng kiện tụng, tranh chấp.',
    tianGan: ['Quý'],
    diPan: ['Đinh']
  },
  {
    id: 'chu_tuoc_dau_giang',
    name: 'Chu Tước Đầu Giang',
    severity: 'OMINOUS',
    description: 'Đinh gia Quý. Hỏa lao xuống Thủy. Thị phi khẩu thiệt, hao tốn tâm trí.',
    tianGan: ['Đinh'],
    diPan: ['Quý']
  },

  // --- CÁC CỤC ĐẶC BIỆT KHÁC ---
  {
    id: 'tam_ky_dac_su',
    name: 'Tam Kỳ Đắc Sử',
    severity: 'AUSPICIOUS',
    description: 'Tam Kỳ (Ất, Bính, Đinh) gặp cát môn. Thuận lợi thăng tiến, làm việc hanh thông, gặp hung hóa cát.',
    tianGan: ['Ất', 'Bính', 'Đinh'],
    door: ['Khai', 'Hưu', 'Sinh']
  }
];
