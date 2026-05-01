import { TimeContext } from './TimeEngine';
import { translateJieQi } from './I18nMapping';
import { 
  JIEQI_JU_MAP, SAN_QI_LIU_YI, TIAN_GAN, DI_ZHI,
  XUN_SHOU_MAP, BASE_STARS, BASE_DOORS, PALACE_RING_CLOCKWISE, BRANCH_ARRAY, EIGHT_DEITIES,
  XUN_VOID_MAP, HORSE_MAP, BRANCH_PALACE_MAP, BASE_DOORS_FEI, NINE_DEITIES_FEI
} from './QimenConstants';

export enum QimenMethod {
  CHAI_BU = 'CHAI_BU',   // Sái Bổ
  ZHI_RUN = 'Zhi_Run',   // Nhuận Kỳ
  PHI_CUNG = 'PHI_CUNG', // Phi Cung
}

export interface QimenJu {
  type: 'YANG' | 'YIN'; // Âm Cục hay Dương Cục
  number: number;       // Cục số (1-9)
  yuan: number;         // Nguyên: 1 (Thượng), 2 (Trung), 3 (Hạ)
  method: QimenMethod;
}

export interface Palace {
  index: number; // 1-9
  diPan: string; // Địa bàn 
  tianPan: string; // Thiên bàn (Cửu tinh)
  renPan: string; // Nhân bàn (Bát môn)
  shenPan: string; // Thần bàn (Bát thần)
  tianGan: string; // Thiên Can của Thiên Bàn
}

export interface QimenPan {
  ju: QimenJu;
  palaces: Record<number, Palace>; 
  zhiFu: string; // Tên Trực Phù
  zhiShi: string; // Tên Trực Sử
  voidPalaces: number[]; // Các cung bị Tuần Không
  horsePalace: number;   // Cung có Dịch Mã
}

import { Solar } from 'lunar-javascript';

export class QimenEngine {
  
  public static calculateJu(method: QimenMethod, timeContext: TimeContext): QimenJu | null {
    if (method === QimenMethod.CHAI_BU) return this.calculateChaiBu(timeContext);
    if (method === QimenMethod.ZHI_RUN) return this.calculateZhiRun(timeContext);
    
    return this.calculateChaiBu(timeContext); // Fallback cho Phi Cung nếu cần
  }

  private static calculateYuan(dayGan: string, dayZhi: string): number {
    const ganIdx = TIAN_GAN.indexOf(dayGan);
    const zhiIdx = DI_ZHI.indexOf(dayZhi);
    if (ganIdx === -1 || zhiIdx === -1) return 1;

    // Tính chỉ số ngày trong vòng 60 hoa giáp (0-59)
    // Công thức: index = (CanIndex - ChiIndex + 12) % 12 / 2 * 10 + CanIndex
    const day60Idx = ((ganIdx - zhiIdx + 12) % 12) / 2 * 10 + ganIdx;
    
    // Mỗi chu kỳ 15 ngày chia làm 3 Nguyên (Thượng, Trung, Hạ), mỗi Nguyên 5 ngày.
    // Phù đầu (Giáp Tý, Kỷ Mão, Giáp Ngọ, Kỷ Dậu) luôn chia hết cho 15 dư 0.
    const yuanIdx = day60Idx % 15;

    if (yuanIdx < 5) return 1;  // Thượng Nguyên (0-4)
    if (yuanIdx < 10) return 2; // Trung Nguyên (5-9)
    return 3;                   // Hạ Nguyên (10-14)
  }

  private static calculateChaiBu(timeContext: TimeContext): QimenJu | null {
    const dayGan = timeContext.bazi.day.gan;
    const dayZhi = timeContext.bazi.day.zhi;
    const jieQiName = timeContext.jieQi.current.name;

    const jqData = JIEQI_JU_MAP[jieQiName];
    if (!jqData) return null;

    const yuan = this.calculateYuan(dayGan, dayZhi); 

    let juNumber = 1;
    if (yuan === 1) juNumber = jqData.upper;
    else if (yuan === 2) juNumber = jqData.middle;
    else if (yuan === 3) juNumber = jqData.lower;

    return {
      type: jqData.type,
      number: juNumber,
      yuan: yuan,
      method: QimenMethod.CHAI_BU
    };
  }

  /**
   * Tính cục theo phương pháp Nhuận Kỳ (Zhi Run)
   * Thuật toán Chính Thụ - Siêu Thần - Tiếp Khí - Nhuận Kỳ
   */
  private static calculateZhiRun(timeContext: TimeContext): QimenJu | null {
    const targetDate = timeContext.solarDate;
    
    // 1. Tìm Thượng Nguyên Phù Đầu (Jia/Ji + Zi/Wu/Mao/You) của ngày hiện tại
    let upperFuTouDate = new Date(targetDate.getTime());
    let daysDiff = 0;
    for (let i = 0; i < 15; i++) {
        const testDate = new Date(targetDate.getTime() - i * 24 * 60 * 60 * 1000);
        const testBazi = Solar.fromDate(testDate).getLunar().getEightChar();
        const tGan = testBazi.getDayGan(), tZhi = testBazi.getDayZhi();
        if ((tGan === '甲' || tGan === '己') && ['子', '午', '卯', '酉'].includes(tZhi)) {
            upperFuTouDate = testDate;
            daysDiff = i;
            break;
        }
    }
    const yuan = Math.floor(daysDiff / 5) + 1;

    // 2. Tìm Tiết Khí Chốt (Đại Tuyết hoặc Mang Chủng) gần nhất trong quá khứ
    let tempLunar = Solar.fromDate(upperFuTouDate).getLunar();
    let pivotJieQi = null;
    let safety = 0;
    
    // Tìm lùi về quá khứ
    while (safety < 25) {
        const prev = tempLunar.getPrevJieQi(true);
        if (prev.getName() === '芒种' || prev.getName() === '大雪') {
            pivotJieQi = prev;
            break;
        }
        const pSolar = prev.getSolar();
        const pDate = new Date(pSolar.getYear(), pSolar.getMonth() - 1, pSolar.getDay() - 1);
        tempLunar = Solar.fromDate(pDate).getLunar();
        safety++;
    }

    if (!pivotJieQi) return this.calculateChaiBu(timeContext);

    // 3. Tìm Phù Đầu của Tiết Khí Chốt
    const pSolar = pivotJieQi.getSolar();
    const pivotDate = new Date(pSolar.getYear(), pSolar.getMonth() - 1, pSolar.getDay());
    let pivotFuTouDate = new Date(pivotDate.getTime());
    
    for (let i = 0; i <= 15; i++) {
        const testDate = new Date(pivotDate.getTime() - i * 24 * 60 * 60 * 1000);
        const testBazi = Solar.fromDate(testDate).getLunar().getEightChar();
        const tGan = testBazi.getDayGan(), tZhi = testBazi.getDayZhi();
        if ((tGan === '甲' || tGan === '己') && ['子', '午', '卯', '酉'].includes(tZhi)) {
            pivotFuTouDate = testDate;
            break;
        }
    }

    // 4. Kiểm tra Nhuận tại chốt
    // Nếu Phù Đầu đến trước tiết khí >= 9 ngày (Siêu Thần >= 9)
    const distToPivot = Math.round((pivotDate.getTime() - pivotFuTouDate.getTime()) / 86400000);
    const isRun = distToPivot >= 9;

    // 5. Đếm số block 15 ngày từ Phù Đầu chốt đến Phù Đầu hiện tại
    const blocksPassed = Math.round((upperFuTouDate.getTime() - pivotFuTouDate.getTime()) / (15 * 86400000));
    
    // 6. Ánh xạ sang danh sách Tiết Khí
    const SEQ_MANG_ZHONG = [
      'Mang chủng', 'Hạ chí', 'Tiểu thử', 'Đại thử', 'Lập thu', 'Xử thử', 'Bạch lộ', 'Thu phân', 'Hàn lộ', 'Sương giáng', 'Lập đông', 'Tiểu tuyết', 'Đại tuyết'
    ];
    const SEQ_DA_XUE = [
      'Đại tuyết', 'Đông chí', 'Tiểu hàn', 'Đại hàn', 'Lập xuân', 'Vũ thủy', 'Kinh trập', 'Xuân phân', 'Thanh minh', 'Cốc vũ', 'Lập hạ', 'Tiểu mãn', 'Mang chủng'
    ];

    const isMangZhong = pivotJieQi.getName() === '芒种';
    const sequence = isMangZhong ? SEQ_MANG_ZHONG : SEQ_DA_XUE;

    // Nếu có nhuận, block 1 sẽ lặp lại tiết khí chốt (index 0)
    let jieQiIndex = isRun ? Math.max(0, blocksPassed - 1) : blocksPassed;
    
    // Tránh vượt quá mảng (rất hiếm, nhưng để an toàn)
    if (jieQiIndex >= sequence.length) jieQiIndex = sequence.length - 1;

    const assignedJieQiName = sequence[jieQiIndex];
    const jqData = JIEQI_JU_MAP[assignedJieQiName];
    if (!jqData) return this.calculateChaiBu(timeContext);

    let juNumber = yuan === 1 ? jqData.upper : yuan === 2 ? jqData.middle : jqData.lower;

    return {
      type: jqData.type,
      number: juNumber,
      yuan: yuan,
      method: QimenMethod.ZHI_RUN
    };
  }

  public static calculatePan(method: QimenMethod, timeContext: TimeContext): QimenPan | null {
    const ju = this.calculateJu(method, timeContext);
    if (!ju) return null;

    const palaces: Record<number, Palace> = {};
    for (let i = 1; i <= 9; i++) {
       palaces[i] = { index: i, diPan: '', tianPan: '', renPan: '', shenPan: '', tianGan: '' };
    }

    // 1. Địa Bàn (Di Pan)
    let currentPalace = ju.number;
    const isYang = ju.type === 'YANG';
    const step = isYang ? 1 : -1;

    for (let i = 0; i < SAN_QI_LIU_YI.length; i++) {
        palaces[currentPalace].diPan = SAN_QI_LIU_YI[i];
        currentPalace += step;
        if (currentPalace > 9) currentPalace = 1;
        if (currentPalace < 1) currentPalace = 9;
    }

    // 2. Tìm Trực Phù & Trực Sử
    // Tuần Thủ của giờ: (Ví dụ Giáp Tý)
    const xunShou = timeContext.xunShou;
    const liuYi = XUN_SHOU_MAP[xunShou]; // Hệ can tương ứng với tuần thủ
    
    // Tìm vị trí của Lục Nghi này trên Địa Bàn
    let xunPalace = 0;
    for (let i = 1; i <= 9; i++) {
      if (palaces[i].diPan === liuYi) {
        xunPalace = i;
        break;
      }
    }
    
    // Ký cung: Nếu tuần thủ rớt vào Trung Cung (Cung 5) -> Ký tại cung 2 (Khôn) cho Chuyển Bàn, giữ nguyên cho Phi Cung
    let actualXunPalace = (method === QimenMethod.PHI_CUNG) ? xunPalace : (xunPalace === 5 ? 2 : xunPalace);

    const zhiFu = BASE_STARS[actualXunPalace] || BASE_STARS[5];
    const zhiShi = (method === QimenMethod.PHI_CUNG) ? BASE_DOORS_FEI[actualXunPalace] : BASE_DOORS[actualXunPalace];

    // 3. Xoay Thiên Bàn (Cửu Tinh) & Can Thiên Bàn
    // Trực Phù (ZhiFu) chạy đến cung có chứa Can Giờ trên Địa Bàn
    const hourGan = timeContext.bazi.hour.gan;
    let targetZhiFuPalace = 0;
    
    if (hourGan === 'Giáp') {
      targetZhiFuPalace = xunPalace; // Giáp ẩn dưới Tuần thủ
    } else {
      for (let i = 1; i <= 9; i++) {
        if (palaces[i].diPan === hourGan) {
          targetZhiFuPalace = i;
          break;
        }
      }
    }
    if (method !== QimenMethod.PHI_CUNG && targetZhiFuPalace === 5) targetZhiFuPalace = 2; // Cung 5 ký cung 2 cho Chuyển Bàn

    if (method === QimenMethod.PHI_CUNG) {
      // 3. Phi Thiên Bàn (Cửu Tinh)
      const starStep = targetZhiFuPalace - actualXunPalace;
      for (let i = 1; i <= 9; i++) {
        const targetPalace = ((i + starStep - 1) % 9 + 9) % 9 + 1;
        palaces[targetPalace].tianPan = BASE_STARS[i];
        palaces[targetPalace].tianGan = palaces[i].diPan;
      }
      
      // 4. Phi Thần Bàn (Cửu Thần)
      for (let i = 0; i < 9; i++) {
        const targetPalace = ((targetZhiFuPalace - 1 + (isYang ? i : -i)) % 9 + 9) % 9 + 1;
        palaces[targetPalace].shenPan = NINE_DEITIES_FEI[i];
      }

      // 5. Phi Nhân Bàn (Cửu Môn)
      const xunZhiSplit = xunShou.split(' ')[1] || xunShou.substring(1, 2); 
      const hourZhi = timeContext.bazi.hour.zhi;
      const xunZhiIdx = BRANCH_ARRAY.indexOf(xunZhiSplit);
      const hourZhiIdx = BRANCH_ARRAY.indexOf(hourZhi);
      
      let hoursPassed = hourZhiIdx - xunZhiIdx;
      if (hoursPassed < 0) hoursPassed += 12;

      let currentShiPalace = ((actualXunPalace - 1 + step * hoursPassed) % 9 + 9) % 9 + 1;
      const doorStep = currentShiPalace - actualXunPalace;

      for (let i = 1; i <= 9; i++) {
        const targetPalace = ((i + doorStep - 1) % 9 + 9) % 9 + 1;
        palaces[targetPalace].renPan = BASE_DOORS_FEI[i];
      }

    } else {
      // CHUYỂN BÀN (ZHUA PAN) - Xoay vòng 8 cung biên
      const ring = PALACE_RING_CLOCKWISE;
      const startIdx = ring.indexOf(actualXunPalace);
      const targetIdx = ring.indexOf(targetZhiFuPalace);
      const shift = targetIdx - startIdx;

      for (let i = 0; i < 8; i++) {
        const originalPalace = ring[i];
        let newIdx = (i + shift) % 8;
        if (newIdx < 0) newIdx += 8;
        const targetPalaceForStar = ring[newIdx];
        
        palaces[targetPalaceForStar].tianPan = BASE_STARS[originalPalace];
        palaces[targetPalaceForStar].tianGan = palaces[originalPalace].diPan;
      }
      palaces[5].tianPan = 'Cầm';
      palaces[5].tianGan = palaces[5].diPan;

      const shenShiftStep = isYang ? 1 : -1;
      let currentShenIdx = targetIdx;
      for (let i = 0; i < 8; i++) {
        palaces[ring[currentShenIdx]].shenPan = EIGHT_DEITIES[i];
        currentShenIdx = (currentShenIdx + shenShiftStep) % 8;
        if (currentShenIdx < 0) currentShenIdx += 8;
      }

      const xunZhiSplit = xunShou.split(' ')[1] || xunShou.substring(1, 2); 
      const hourZhi = timeContext.bazi.hour.zhi;
      const xunZhiIdx = BRANCH_ARRAY.indexOf(xunZhiSplit);
      const hourZhiIdx = BRANCH_ARRAY.indexOf(hourZhi);
      
      let hoursPassed = hourZhiIdx - xunZhiIdx;
      if (hoursPassed < 0) hoursPassed += 12;

      let currentShiPalace = actualXunPalace;
      for (let i = 0; i < hoursPassed; i++) {
          currentShiPalace += step; 
          if (currentShiPalace > 9) currentShiPalace = 1;
          if (currentShiPalace < 1) currentShiPalace = 9;
      }
      
      const shiStartIdx = ring.indexOf(actualXunPalace);
      let shiTargetIdx = ring.indexOf(currentShiPalace); 
      if (currentShiPalace === 5) shiTargetIdx = ring.indexOf(2);
      
      const shiShift = shiTargetIdx - shiStartIdx;
      for (let i = 0; i < 8; i++) {
        const originalPalace = ring[i];
        let newIdx = (i + shiShift) % 8;
        if (newIdx < 0) newIdx += 8;
        const targetPalaceForDoor = ring[newIdx];
        palaces[targetPalaceForDoor].renPan = BASE_DOORS[originalPalace];
      }
      palaces[5].renPan = '';
    }

    // 6. Tính Tuần Không và Dịch Mã
    const voidBranches = XUN_VOID_MAP[xunShou] || [];
    const voidPalaces = voidBranches.map(b => BRANCH_PALACE_MAP[b]);
    
    const horseBranch = HORSE_MAP[timeContext.bazi.hour.zhi];
    const horsePalace = BRANCH_PALACE_MAP[horseBranch];

    return { ju, palaces, zhiFu, zhiShi, voidPalaces, horsePalace };
  }

  /**
   * Tìm cung chứa một Thiên Can cụ thể (Dùng cho xem Mệnh chủ hoặc tìm vị trí Can)
   */
  public static findStemPalace(pan: QimenPan, stem: string, plate: 'TIAN' | 'DI' = 'TIAN'): number {
    for (let i = 1; i <= 9; i++) {
      if (plate === 'TIAN' && pan.palaces[i].tianGan === stem) return i;
      if (plate === 'DI' && pan.palaces[i].diPan === stem) return i;
    }
    return 0;
  }
}
