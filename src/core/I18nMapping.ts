export const GAN_ZH_TO_VI: Record<string, string> = {
  '甲': 'Giáp', '乙': 'Ất', '丙': 'Bính', '丁': 'Đinh', '戊': 'Mậu',
  '己': 'Kỷ', '庚': 'Canh', '辛': 'Tân', '壬': 'Nhâm', '癸': 'Quý'
};

export const ZHI_ZH_TO_VI: Record<string, string> = {
  '子': 'Tý', '丑': 'Sửu', '寅': 'Dần', '卯': 'Mão', '辰': 'Thìn', '巳': 'Tỵ',
  '午': 'Ngọ', '未': 'Mùi', '申': 'Thân', '酉': 'Dậu', '戌': 'Tuất', '亥': 'Hợi'
};

export const JIEQI_ZH_TO_VI: Record<string, string> = {
  '冬至': 'Đông chí', '小寒': 'Tiểu hàn', '大寒': 'Đại hàn',
  '立春': 'Lập xuân', '雨水': 'Vũ thủy', '惊蛰': 'Kinh trập',
  '春分': 'Xuân phân', '清明': 'Thanh minh', '谷雨': 'Cốc vũ',
  '立夏': 'Lập hạ', '小满': 'Tiểu mãn', '芒种': 'Mang chủng',
  '夏至': 'Hạ chí', '小暑': 'Tiểu thử', '大暑': 'Đại thử',
  '立秋': 'Lập thu', '处暑': 'Xử thử', '白露': 'Bạch lộ',
  '秋分': 'Thu phân', '寒露': 'Hàn lộ', '霜降': 'Sương giáng',
  '立冬': 'Lập đông', '小雪': 'Tiểu tuyết', '大雪': 'Đại tuyết'
};

export function translateGanZhi(text: string): string {
  if (!text) return '';
  let result = '';
  // Convert 2 characters (e.g., 甲子 -> Giáp Tý)
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (GAN_ZH_TO_VI[char]) {
      result += GAN_ZH_TO_VI[char] + ' ';
    } else if (ZHI_ZH_TO_VI[char]) {
      result += ZHI_ZH_TO_VI[char] + ' ';
    } else {
      result += char + ' ';
    }
  }
  return result.trim();
}

export function translateJieQi(text: string): string {
  return JIEQI_ZH_TO_VI[text] || text;
}
