import { PatternRule, QIMEN_PATTERNS } from '../data/PatternData';
import { Palace, QimenPan } from './QimenEngine';
import { BASE_STARS, BASE_DOORS } from './QimenConstants';

export class PatternEngine {
  
  /**
   * Đánh giá và trả về danh sách các cách cục (Pattern) hiện hữu trong một Cung
   */
  public static analyzePalace(palace: Palace, pan: QimenPan): PatternRule[] {
    const matchedPatterns: PatternRule[] = [];

    for (const rule of QIMEN_PATTERNS) {
      if (this.evaluateRule(palace, rule, pan)) {
        matchedPatterns.push(rule);
      }
    }

    return matchedPatterns;
  }

  /**
   * Chạy engine cho toàn bộ Trận Đồ Cửu Cung
   */
  public static analyzePan(pan: QimenPan): Record<number, PatternRule[]> {
    const result: Record<number, PatternRule[]> = {};
    for (let i = 1; i <= 9; i++) {
       result[i] = this.analyzePalace(pan.palaces[i], pan);
    }
    return result;
  }

  /**
   * Lõi check từng điều kiện của một Rule trên một Cung cụ thể
   */
  private static evaluateRule(palace: Palace, rule: PatternRule, pan: QimenPan): boolean {
    // 1. Check Thiên Can Thiên Bàn
    if (rule.tianGan && rule.tianGan.length > 0) {
      if (!rule.tianGan.includes(palace.tianGan)) return false;
    }

    // 2. Check Thiên Can Địa Bàn
    if (rule.diPan && rule.diPan.length > 0) {
      if (!rule.diPan.includes(palace.diPan)) return false;
    }

    // 3. Check Bát Môn
    if (rule.door && rule.door.length > 0) {
      if (!rule.door.includes(palace.renPan)) return false;
    }

    // 4. Check Cung Trực Phù (Thiên Ất Phi Cung...)
    if (rule.isChiefPalace) {
      if (palace.tianPan !== pan.zhiFu) return false;
    }

    // 5. Check Phục Ngâm (Tinh, Môn tại bản cung)
    if (rule.isPhucNgam) {
      if (palace.index === 5) return false; // Thường không tính trung cung
      const originalStar = BASE_STARS[palace.index];
      const originalDoor = BASE_DOORS[palace.index];
      if (palace.tianPan !== originalStar && palace.renPan !== originalDoor) return false;
    }

    // 6. Check Phản Ngâm (Tinh, Môn tại cung đối diện cung gốc)
    if (rule.isPhanNgam) {
      if (palace.index === 5) return false;
      const oppositeIndex = 10 - palace.index;
      const originalStar = BASE_STARS[oppositeIndex];
      const originalDoor = BASE_DOORS[oppositeIndex];
      if (palace.tianPan !== originalStar && palace.renPan !== originalDoor) return false;
    }

    // 7. Check Tam Thắng Cung (Thần: Trực Phù, Cửu Thiên, Thái Âm)
    if (rule.isVictory) {
      const victoryDeities = ['Trực Phù', 'Cửu Thiên', 'Thái Âm'];
      if (!victoryDeities.includes(palace.shenPan)) return false;
    }

    // 8. Check Ngũ Bất Kích (Thần: Bạch Hổ, Huyền Vũ hoặc xung Trực Phù)
    if (rule.isForbidden) {
      const forbiddenDeities = ['Bạch Hổ', 'Huyền Vũ'];
      if (forbiddenDeities.includes(palace.shenPan)) return true;
      
      // Xung với Trực Phù
      const zhiFuPalace = pan.zhiFu ? PatternEngine.findStarPalace(pan, pan.zhiFu) : 0;
      if (zhiFuPalace > 0) {
        const oppositePalace = 10 - zhiFuPalace;
        if (palace.index === oppositePalace) return true;
      }
      return false;
    }

    return true;
  }

  /**
   * Helper tìm vị trí của một Sao trên bàn đồ
   */
  private static findStarPalace(pan: QimenPan, starName: string): number {
    for (let i = 1; i <= 9; i++) {
      if (pan.palaces[i].tianPan === starName) return i;
    }
    return 0;
  }
}
