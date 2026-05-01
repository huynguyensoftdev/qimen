import formationDetailsEn from './formation_details_en.json';
import formationDetailsVi from './formation_details.json';

export interface FormationDetail {
  tianGan: string;
  diPan: string;
  structure: string;
  doors: Record<string, string>;
}

/**
 * Dữ liệu luận giải chuyên sâu
 * Ưu tiên tiếng Việt, fallback sang tiếng Anh
 */
export const FORMATION_DETAILS_EN: Record<string, FormationDetail> = formationDetailsEn as any;
export const FORMATION_DETAILS_VI: Record<string, FormationDetail> = formationDetailsVi as any;

/**
 * Lấy đoạn luận giải chi tiết cho một cung cụ thể
 * @param tianGan Can Thiên Bàn
 * @param diPan Can Địa Bàn
 * @param door Tên Môn (Tiếng Việt: Hưu, Sinh, Thương, Đỗ, Cảnh, Tử, Kinh, Khai)
 */
export function getDetailedInterpretation(tianGan: string, diPan: string, door: string): { text: string; lang: 'vi' | 'en' } | null {
  const key = `${tianGan}_${diPan}`;
  
  // Thử lấy tiếng Việt trước
  const detailVi = FORMATION_DETAILS_VI[key];
  if (detailVi && detailVi.doors[door]) {
    return { text: detailVi.doors[door], lang: 'vi' };
  }
  
  // Fallback sang tiếng Anh
  const detailEn = FORMATION_DETAILS_EN[key];
  if (detailEn && detailEn.doors[door]) {
    return { text: detailEn.doors[door], lang: 'en' };
  }
  
  return null;
}
