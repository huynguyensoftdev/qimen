import { Solar, Lunar, EightChar, JieQi } from 'lunar-javascript';
import { translateGanZhi, translateJieQi, GAN_ZH_TO_VI, ZHI_ZH_TO_VI } from './I18nMapping';

export interface BaziPillar {
  gan: string; // Thiên can
  zhi: string; // Địa chi
}

export interface FourPillars {
  year: BaziPillar;
  month: BaziPillar;
  day: BaziPillar;
  hour: BaziPillar;
}

export interface TimeContext {
  solarDate: Date;
  lunarDate: {
    year: number;
    month: number;
    day: number;
    isLeap: boolean; // Tháng nhuận
  };
  bazi: FourPillars;
  jieQi: {
    current: { name: string; date: Date };
    next: { name: string; date: Date };
  };
  xunShou: string; // Tuần thủ của giờ (VD: Giáp Tý)
}

/**
 * Lõi Thời Gian - TimeEngine
 * Chịu trách nhiệm tính toán lịch pháp, Tứ Trụ, Tiết Khí dựa trên Lunar-Javascript.
 */
export class TimeEngine {
  /**
   * Tính toán toàn bộ thông số thời gian từ một thời điểm Dương lịch
   * @param date Thời điểm Dương lịch
   */
  public static calculateTimeContext(date: Date): TimeContext {
    const solar = Solar.fromDate(date);
    const lunar = solar.getLunar();
    const baZi = lunar.getEightChar();

    return {
      solarDate: date,
      lunarDate: {
        year: lunar.getYear(),
        month: lunar.getMonth(),
        day: lunar.getDay(),
        isLeap: lunar.getMonth() < 0, // Trong lunar-javascript, tháng nhuận mang dấu âm
      },
      bazi: {
        year: { gan: GAN_ZH_TO_VI[baZi.getYearGan()] || baZi.getYearGan(), zhi: ZHI_ZH_TO_VI[baZi.getYearZhi()] || baZi.getYearZhi() },
        month: { gan: GAN_ZH_TO_VI[baZi.getMonthGan()] || baZi.getMonthGan(), zhi: ZHI_ZH_TO_VI[baZi.getMonthZhi()] || baZi.getMonthZhi() },
        day: { gan: GAN_ZH_TO_VI[baZi.getDayGan()] || baZi.getDayGan(), zhi: ZHI_ZH_TO_VI[baZi.getDayZhi()] || baZi.getDayZhi() },
        hour: { gan: GAN_ZH_TO_VI[baZi.getTimeGan()] || baZi.getTimeGan(), zhi: ZHI_ZH_TO_VI[baZi.getTimeZhi()] || baZi.getTimeZhi() },
      },
      jieQi: this.getCurrentAndNextJieQi(lunar),
      xunShou: translateGanZhi(baZi.getTimeXun()), // Tuần thủ (vd: Giáp Tý, Giáp Tuất)
    };
  }

  /**
   * Tính toán tiết khí hiện tại và tiết khí tiếp theo
   */
  private static getCurrentAndNextJieQi(lunar: any): {
    current: { name: string; date: Date };
    next: { name: string; date: Date };
  } {
    const prevJieQi = lunar.getPrevJieQi(true);
    const nextJieQi = lunar.getNextJieQi(true);

    const prevSolar = prevJieQi.getSolar();
    const nextSolar = nextJieQi.getSolar();

    return {
      current: {
        name: translateJieQi(prevJieQi.getName()),
        date: new Date(prevSolar.getYear(), prevSolar.getMonth() - 1, prevSolar.getDay(), prevSolar.getHour(), prevSolar.getMinute(), prevSolar.getSecond()),
      },
      next: {
        name: translateJieQi(nextJieQi.getName()),
        date: new Date(nextSolar.getYear(), nextSolar.getMonth() - 1, nextSolar.getDay(), nextSolar.getHour(), nextSolar.getMinute(), nextSolar.getSecond()),
      },
    };
  }

  /**
   * Quy đổi Dương lịch sang Bát Tự (Tứ Trụ) dưới dạng mảng Can, Chi
   */
  public static getBaziArray(date: Date): [string, string, string, string, string, string, string, string] {
    const context = this.calculateTimeContext(date);
    return [
      context.bazi.year.gan, context.bazi.year.zhi,
      context.bazi.month.gan, context.bazi.month.zhi,
      context.bazi.day.gan, context.bazi.day.zhi,
      context.bazi.hour.gan, context.bazi.hour.zhi
    ];
  }

  /**
   * Tính Cục Số (Ju) theo quy luật Kỳ Môn cơ bản (Tính thử nghiệm cho Sái Bổ)
   * Phụ thuộc vào Tiết Khí và Can Chi Ngày.
   * Để có Sái Bổ/Nhuận Kỳ/Phi Cung chi tiết sẽ cần module QimenEngine riêng,
   * nhưng ở cấp TimeEngine chúng ta cung cấp đủ biến số (JieQi + Day GanZhi) cho module đó.
   */
}
