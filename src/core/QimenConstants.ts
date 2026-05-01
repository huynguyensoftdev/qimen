/**
 * Dữ liệu hằng số cho Kỳ Môn Độn Giáp
 */

// Bảng Cục số cho Từng Tiết Khí [Thượng Nguyên, Trung Nguyên, Hạ Nguyên]
// Dương Cục (+) / Âm Cục (-)
export const JIEQI_JU_MAP: Record<string, { type: 'YANG' | 'YIN', upper: number, middle: number, lower: number }> = {
  // Dương Độn (Từ Đông Chí đến Mang Chủng)
  'Đông chí': { type: 'YANG', upper: 1, middle: 7, lower: 4 },
  'Tiểu hàn': { type: 'YANG', upper: 2, middle: 8, lower: 5 },
  'Đại hàn':  { type: 'YANG', upper: 3, middle: 9, lower: 6 },
  'Lập xuân': { type: 'YANG', upper: 8, middle: 5, lower: 2 },
  'Vũ thủy':  { type: 'YANG', upper: 9, middle: 6, lower: 3 },
  'Kinh trập':{ type: 'YANG', upper: 1, middle: 7, lower: 4 },
  'Xuân phân':{ type: 'YANG', upper: 3, middle: 9, lower: 6 },
  'Thanh minh':{ type: 'YANG', upper: 4, middle: 1, lower: 7 },
  'Cốc vũ':   { type: 'YANG', upper: 5, middle: 2, lower: 8 },
  'Lập hạ':   { type: 'YANG', upper: 4, middle: 1, lower: 7 },
  'Tiểu mãn': { type: 'YANG', upper: 5, middle: 2, lower: 8 },
  'Mang chủng':{ type: 'YANG', upper: 6, middle: 3, lower: 9 },

  // Âm Độn (Từ Hạ Chí đến Đại Tuyết)
  'Hạ chí':   { type: 'YIN', upper: 9, middle: 3, lower: 6 },
  'Tiểu thử': { type: 'YIN', upper: 8, middle: 2, lower: 5 },
  'Đại thử':  { type: 'YIN', upper: 7, middle: 1, lower: 4 },
  'Lập thu':  { type: 'YIN', upper: 2, middle: 5, lower: 8 },
  'Xử thử':   { type: 'YIN', upper: 1, middle: 4, lower: 7 },
  'Bạch lộ':  { type: 'YIN', upper: 9, middle: 3, lower: 6 },
  'Thu phân': { type: 'YIN', upper: 7, middle: 1, lower: 4 },
  'Hàn lộ':   { type: 'YIN', upper: 6, middle: 9, lower: 3 },
  'Sương giáng':{ type: 'YIN', upper: 5, middle: 8, lower: 2 },
  'Lập đông': { type: 'YIN', upper: 6, middle: 9, lower: 3 },
  'Tiểu tuyết':{ type: 'YIN', upper: 5, middle: 8, lower: 2 },
  'Đại tuyết': { type: 'YIN', upper: 4, middle: 7, lower: 1 },
};

// 10 Thiên Can
export const TIAN_GAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
// 12 Địa Chi
export const DI_ZHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

// Vòng cơ sở của Tam Kỳ Lục Nghi
export const SAN_QI_LIU_YI = ['Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý', 'Đinh', 'Bính', 'Ất'];

// Cửu Tinh (9 Sao)
export const NINE_STARS = ['Bồng', 'Nhuế', 'Xung', 'Phụ', 'Cầm', 'Tâm', 'Trụ', 'Nhậm', 'Anh'];
// Vị trí gốc Cửu Tinh ở Lạc Thư: Bồng(1), Nhuế(2), Xung(3), Phụ(4), Cầm(5), Tâm(6), Trụ(7), Nhậm(8), Anh(9)

// Bát Môn (8 Cửa)
export const EIGHT_DOORS = ['Hưu', 'Tử', 'Thương', 'Đỗ', 'Cảnh', 'Tử', 'Kinh', 'Khai'];
// Vị trí gốc Bát Môn: Hưu(1), Tử(2), Thương(3), Đỗ(4), Cảnh(9), Tử(2) (trùng tên tiếng Việt nhưng Hán tự khác: Tử(Chết)-cung 2 / Tử(Cảnh)-cung 9... wait, actually it's Sinh, Thương, Đỗ, Cảnh, Tử, Kinh, Khai, Hưu. Let's fix that)
export const EIGHT_DOORS_CORRECTED = ['Hưu', 'Tử', 'Thương', 'Đỗ', 'Trung', 'Khai', 'Kinh', 'Sinh', 'Cảnh']; // For strict mapping to 1-9
export const EIGHT_DOORS_RING = ['Hưu', 'Sinh', 'Thương', 'Đỗ', 'Cảnh', 'Tử', 'Kinh', 'Khai']; 
// Mảng vòng Bát Môn theo chiều kim đồng hồ (Khảm 1 -> Cấn 8 -> Chấn 3 -> Tốn 4 -> Ly 9 -> Khôn 2 -> Đoài 7 -> Càn 6)

// Cửu Môn (Phi Cung)
export const NINE_DOORS_FEI = ['Hưu', 'Tử', 'Thương', 'Đỗ', 'Trung', 'Khai', 'Kinh', 'Sinh', 'Cảnh'];

// Bát Thần (8 Thần - Chuyển Bàn)
export const EIGHT_DEITIES = ['Trực Phù', 'Đằng Xà', 'Thái Âm', 'Lục Hợp', 'Bạch Hổ', 'Huyền Vũ', 'Cửu Địa', 'Cửu Thiên'];

// Cửu Thần (9 Thần - Phi Cung)
export const NINE_DEITIES_FEI = ['Trực Phù', 'Đằng Xà', 'Thái Âm', 'Lục Hợp', 'Câu Trận', 'Chu Tước', 'Cửu Địa', 'Cửu Thiên', 'Thái Thường'];

// Map Tuần Thủ -> Lục Nghi
export const XUN_SHOU_MAP: Record<string, string> = {
  'Giáp Tý': 'Mậu',
  'Giáp Tuất': 'Kỷ',
  'Giáp Thân': 'Canh',
  'Giáp Ngọ': 'Tân',
  'Giáp Thìn': 'Nhâm',
  'Giáp Dần': 'Quý'
};

// Vị trí gốc Cửu Cung
export const BASE_STARS: Record<number, string> = {
  1: 'Bồng', 2: 'Nhuế', 3: 'Xung', 4: 'Phụ', 5: 'Cầm', 6: 'Tâm', 7: 'Trụ', 8: 'Nhậm', 9: 'Anh'
};

export const BASE_DOORS: Record<number, string> = {
  1: 'Hưu', 2: 'Tử', 3: 'Thương', 4: 'Đỗ', 5: 'Tử', // Cung 5 kí cung 2
  6: 'Khai', 7: 'Kinh', 8: 'Sinh', 9: 'Cảnh'
};

export const BASE_DOORS_FEI: Record<number, string> = {
  1: 'Hưu', 2: 'Tử', 3: 'Thương', 4: 'Đỗ', 5: 'Trung', 
  6: 'Khai', 7: 'Kinh', 8: 'Sinh', 9: 'Cảnh'
};

// Vòng quanh ngoại vi (8 cung từ 1 theo chiều kim đồng hồ) - Dùng để xoay Tinh, Môn, Thần
export const PALACE_RING_CLOCKWISE = [1, 8, 3, 4, 9, 2, 7, 6];

// Danh sách Địa Chi dùng để xoay Trực Sử
export const BRANCH_ARRAY = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

// Thông số Cửu Cung Lạc Thư
export const PALACE_INFO: Record<number, { bagua: string; symbol: string; element: string; direction: string }> = {
  1: { bagua: 'Khảm', symbol: '☵', element: 'Thủy', direction: 'Chính Bắc' },
  2: { bagua: 'Khôn', symbol: '☷', element: 'Thổ', direction: 'Tây Nam' },
  3: { bagua: 'Chấn', symbol: '☳', element: 'Mộc', direction: 'Chính Đông' },
  4: { bagua: 'Tốn', symbol: '☴', element: 'Mộc', direction: 'Đông Nam' },
  5: { bagua: 'Trung Cung', symbol: '☯', element: 'Thổ', direction: 'Trung Tâm' },
  6: { bagua: 'Càn', symbol: '☰', element: 'Kim', direction: 'Tây Bắc' },
  7: { bagua: 'Đoài', symbol: '☱', element: 'Kim', direction: 'Chính Tây' },
  8: { bagua: 'Cấn', symbol: '☶', element: 'Thổ', direction: 'Đông Bắc' },
  9: { bagua: 'Ly', symbol: '☲', element: 'Hỏa', direction: 'Chính Nam' }
};

// Tuần Không (Dựa vào Tuần Thủ)
export const XUN_VOID_MAP: Record<string, string[]> = {
  'Giáp Tý': ['Tuất', 'Hợi'],
  'Giáp Tuất': ['Thân', 'Dậu'],
  'Giáp Thân': ['Ngọ', 'Mùi'],
  'Giáp Ngọ': ['Thìn', 'Tỵ'],
  'Giáp Thìn': ['Dần', 'Mão'],
  'Giáp Dần': ['Tý', 'Sửu'],
};

// Dịch Mã (Dựa vào Địa Chi: Dần/Ngọ/Tuất -> Thân...)
export const HORSE_MAP: Record<string, string> = {
  'Dần': 'Thân', 'Ngọ': 'Thân', 'Tuất': 'Thân',
  'Thân': 'Dần', 'Tý': 'Dần', 'Thìn': 'Dần',
  'Hợi': 'Tỵ', 'Mão': 'Tỵ', 'Mùi': 'Tỵ',
  'Tỵ': 'Hợi', 'Dậu': 'Hợi', 'Sửu': 'Hợi'
};

// Ánh xạ Địa Chi vào Cửu Cung
export const BRANCH_PALACE_MAP: Record<string, number> = {
  'Tý': 1,
  'Sửu': 8, 'Dần': 8,
  'Mão': 3,
  'Thìn': 4, 'Tỵ': 4,
  'Ngọ': 9,
  'Mùi': 2, 'Thân': 2,
  'Dậu': 7,
  'Tuất': 6, 'Hợi': 6
};
