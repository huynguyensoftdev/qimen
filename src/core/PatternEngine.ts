import { PatternRule, QIMEN_PATTERNS } from '../data/PatternData';
import { Palace, QimenPan } from './QimenEngine';

export class PatternEngine {
  
  /**
   * Đánh giá và trả về danh sách các cách cục (Pattern) hiện hữu trong một Cung
   */
  public static analyzePalace(palace: Palace): PatternRule[] {
    const matchedPatterns: PatternRule[] = [];

    // Lọc qua toàn bộ CSDL Rules
    for (const rule of QIMEN_PATTERNS) {
      if (this.evaluateRule(palace, rule)) {
        matchedPatterns.push(rule);
      }
    }

    return matchedPatterns;
  }

  /**
   * Chạy engine cho toàn bộ Trận Đồ Cửu Cung
   * Gắn danh sách cách cục vào output map
   */
  public static analyzePan(pan: QimenPan): Record<number, PatternRule[]> {
    const result: Record<number, PatternRule[]> = {};
    for (let i = 1; i <= 9; i++) {
       result[i] = this.analyzePalace(pan.palaces[i]);
    }
    return result;
  }

  /**
   * Lõi check từng điều kiện của một Rule trên một Cung cụ thể
   */
  private static evaluateRule(palace: Palace, rule: PatternRule): boolean {
    // Nếu rule yêu cầu Can Thiên Bàn
    if (rule.tianGan && rule.tianGan.length > 0) {
      if (!rule.tianGan.includes(palace.tianGan)) return false;
    }

    // Nếu rule yêu cầu Can Địa Bàn
    if (rule.diPan && rule.diPan.length > 0) {
      if (!rule.diPan.includes(palace.diPan)) return false;
    }

    // Nếu rule yêu cầu Bát Môn
    if (rule.door && rule.door.length > 0) {
      if (!rule.door.includes(palace.renPan)) return false;
    }

    // Pass all defined conditions => MATCH!
    return true;
  }
}
