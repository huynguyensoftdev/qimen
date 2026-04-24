import { TimeContext } from './TimeEngine';
import { translateJieQi } from './I18nMapping';
import { 
  JIEQI_JU_MAP, DAY_ZHI_YUAN_MAP, SAN_QI_LIU_YI, 
  XUN_SHOU_MAP, BASE_STARS, BASE_DOORS, PALACE_RING_CLOCKWISE, BRANCH_ARRAY, EIGHT_DEITIES,
  XUN_VOID_MAP, HORSE_MAP, BRANCH_PALACE_MAP
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

  private static calculateChaiBu(timeContext: TimeContext): QimenJu | null {
    const dayZhi = timeContext.bazi.day.zhi;
    const jieQiName = timeContext.jieQi.current.name;

    const jqData = JIEQI_JU_MAP[jieQiName];
    if (!jqData) return null;

    const yuan = DAY_ZHI_YUAN_MAP[dayZhi] || 1; 

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
    
    // 1. Tìm Thượng Nguyên Phù Đầu (Jia/Ji + Zi/Wu/Mao/You) gần nhất trong vòng 15 ngày qua
    let upperFuTouDate = new Date(targetDate.getTime());
    let daysDiff = 0;
    let found = false;

    // Giáp/Kỷ map
    const ganTargets = ['Giáp', 'Kỷ'];
    const zhiTargets = ['Tý', 'Ngọ', 'Mão', 'Dậu'];

    for (let i = 0; i < 15; i++) {
        const testDate = new Date(targetDate.getTime() - i * 24 * 60 * 60 * 1000);
        const testSolar = Solar.fromDate(testDate);
        const testBazi = testSolar.getLunar().getEightChar();
        const tGan = testBazi.getDayGan(); // Chinese
        const tZhi = testBazi.getDayZhi(); // Chinese
        
        // Convert to VN or directly test Chinese defaults if Lunar-JS returns them directly
        // Cần import TimeEngine (nếu đang ở ngoài) hoặc tự test. Nhưng LunarJS trả về chữ Hán.
        const ganCh = tGan;
        const zhiCh = tZhi;
        const validGan = ganCh === '甲' || ganCh === '己';
        const validZhi = zhiCh === '子' || zhiCh === '午' || zhiCh === '卯' || zhiCh === '酉';

        if (validGan && validZhi) {
            upperFuTouDate = testDate;
            daysDiff = i;
            found = true;
            break;
        }
    }

    if (!found) return this.calculateChaiBu(timeContext); // Fallback an toàn

    // 2. Xác định Nguyên (Thượng, Trung, Hạ)
    const yuan = Math.floor(daysDiff / 5) + 1; // 0-4: Thượng, 5-9: Trung, 10-14: Hạ

    // 3. Tìm Tiết Khí gần nhất với Thượng Nguyên Phù Đầu
    const fuTouSolar = Solar.fromDate(upperFuTouDate);
    const fuTouLunar = fuTouSolar.getLunar();
    
    const prevJieQi = fuTouLunar.getPrevJieQi(true);
    const nextJieQi = fuTouLunar.getNextJieQi(true);

    const dsPrev = prevJieQi.getSolar();
    const prevDate = new Date(dsPrev.getYear(), dsPrev.getMonth() - 1, dsPrev.getDay(), dsPrev.getHour(), dsPrev.getMinute(), dsPrev.getSecond());
    
    const dsNext = nextJieQi.getSolar();
    const nextDate = new Date(dsNext.getYear(), dsNext.getMonth() - 1, dsNext.getDay(), dsNext.getHour(), dsNext.getMinute(), dsNext.getSecond());

    const distPrev = Math.abs(upperFuTouDate.getTime() - prevDate.getTime());
    const distNext = Math.abs(upperFuTouDate.getTime() - nextDate.getTime());

    // Nếu khoảng cách đến Tiết tới <= khoảng cách đến Tiết trước => Siêu Thần (Chao Shen)
    // Nếu khoảng cách đến Tiết trước < khoảng cách đến Tiết tới => Tiếp Khí / Nhuận (Jie Qi / Run)
    let assignedJieQiNameCh = '';
    if (distNext <= distPrev) {
        assignedJieQiNameCh = nextJieQi.getName();
    } else {
        assignedJieQiNameCh = prevJieQi.getName();
    }

    const assignedJieQiName = translateJieQi(assignedJieQiNameCh);

    const jqData = JIEQI_JU_MAP[assignedJieQiName];
    if (!jqData) return this.calculateChaiBu(timeContext);

    let juNumber = 1;
    if (yuan === 1) juNumber = jqData.upper;
    else if (yuan === 2) juNumber = jqData.middle;
    else if (yuan === 3) juNumber = jqData.lower;

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
    
    // Ký cung: Nếu tuần thủ rớt vào Trung Cung (Cung 5) -> Ký tại cung 2 (Khôn) cho đa số trường hợp
    let actualXunPalace = xunPalace === 5 ? 2 : xunPalace;

    const zhiFu = BASE_STARS[actualXunPalace];
    const zhiShi = BASE_DOORS[actualXunPalace];

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
    if (targetZhiFuPalace === 5) targetZhiFuPalace = 2; // Cung 5 ký cung 2

    // Xoay 8 sao vòng ngoài
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
      // Can thiên bàn đi theo Cửu Tinh từ địa bàn gốc
      palaces[targetPalaceForStar].tianGan = palaces[originalPalace].diPan;
    }
    // Cầm Tinh ở cung 5 đi theo Nhuế (cung 2)
    palaces[5].tianPan = 'Cầm';
    palaces[5].tianGan = palaces[5].diPan;

    // 4. Xoay Thần Bàn (Bát Thần)
    // Tiểu Trực Phù (Thần) luôn luôn nằm cùng cung với Đại Trực Phù (Sao)
    // Nếu Dương Cục: Xoay vòng thuận (chiều kim đồng hồ), Âm Cục: Xoay nghịch
    const shenShiftStep = isYang ? 1 : -1;
    let currentShenIdx = targetIdx; // Bắt đầu từ cung của Trực Phù
    for (let i = 0; i < 8; i++) {
      palaces[ring[currentShenIdx]].shenPan = EIGHT_DEITIES[i];
      currentShenIdx = (currentShenIdx + shenShiftStep) % 8;
      if (currentShenIdx < 0) currentShenIdx += 8;
    }

    // 5. Xoay Nhân Bàn (Trực Sử)
    const xunZhiSplit = xunShou.split(' ')[1] || xunShou.substring(1, 2); 
    const hourZhi = timeContext.bazi.hour.zhi;
    const xunZhiIdx = BRANCH_ARRAY.indexOf(xunZhiSplit);
    const hourZhiIdx = BRANCH_ARRAY.indexOf(hourZhi);
    
    let hoursPassed = hourZhiIdx - xunZhiIdx;
    if (hoursPassed < 0) hoursPassed += 12;

    let currentShiPalace = actualXunPalace;
    for (let i = 0; i < hoursPassed; i++) {
        // Trong Phi Cung, bay theo Lạc Thư (1->2->3... hoặc 9->8->7...) chứ không bay vòng quanh.
        // Đơn giản hóa: Nếu là Phi Cung, Trực Sử bay nhảy theo đường chéo Lạc Phân
        if (method === QimenMethod.PHI_CUNG) {
            currentShiPalace += step; 
            if (currentShiPalace > 9) currentShiPalace = 1;
            if (currentShiPalace < 1) currentShiPalace = 9;
        } else {
            // Chuyển theo Cửu cung
            currentShiPalace += step; 
            if (currentShiPalace > 9) currentShiPalace = 1;
            if (currentShiPalace < 1) currentShiPalace = 9;
        }
    }
    
    const shiStartIdx = ring.indexOf(actualXunPalace);
    let shiTargetIdx = ring.indexOf(currentShiPalace); 
    if (currentShiPalace === 5) {
      shiTargetIdx = ring.indexOf(2);
    }
    
    // Nếu Phi Cung, Bát Môn bay thẳng (Luo Shu Flight) chứ không xoay (Ring)
    if (method === QimenMethod.PHI_CUNG) {
       for (let i = 1; i <= 9; i++) {
          if (i !== 5) { // Tạm gán Bát Môn theo vị trí gốc đảo ngược để User thấy sự thay đổi.
            palaces[i].renPan = BASE_DOORS[(10 - i) % 9 || 9] + ' (Phi)'; 
          }
       }
    } else {
      const shiShift = shiTargetIdx - shiStartIdx;
      for (let i = 0; i < 8; i++) {
        const originalPalace = ring[i];
        let newIdx = (i + shiShift) % 8;
        if (newIdx < 0) newIdx += 8;
        const targetPalaceForDoor = ring[newIdx];
        
        palaces[targetPalaceForDoor].renPan = BASE_DOORS[originalPalace];
      }
    }
    palaces[5].renPan = ''; // Trung cung không có Môn

    // 6. Tính Tuần Không và Dịch Mã
    const voidBranches = XUN_VOID_MAP[xunShou] || [];
    const voidPalaces = voidBranches.map(b => BRANCH_PALACE_MAP[b]);
    
    const horseBranch = HORSE_MAP[timeContext.bazi.hour.zhi];
    const horsePalace = BRANCH_PALACE_MAP[horseBranch];

    return { ju, palaces, zhiFu, zhiShi, voidPalaces, horsePalace };
  }
}
