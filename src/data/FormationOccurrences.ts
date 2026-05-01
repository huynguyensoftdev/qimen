export interface FormationOccurrence {
  combination: string;
  name: string;
  occurrence: string; // Dấu hiệu thực tế/Sự kiện
  action: string;     // Hành động khuyên dùng
}

export const FORMATION_OCCURRENCES: Record<string, FormationOccurrence> = {
  "Jia_Bing": {
    combination: "Giáp + Bính",
    name: "Thanh Long Phản Thủ",
    occurrence: "Gặp gỡ quý nhân bất ngờ, kẻ thù bỗng nhiên đổi ý muốn hợp tác. Các trở ngại tự nhiên biến thành cơ hội.",
    action: "Chủ động tấn công, cầu tài hoặc thăng tiến đều đại cát."
  },
  "Bing_Jia": {
    combination: "Bính + Giáp",
    name: "Phi Điểu Điệp Huyệt",
    occurrence: "Cơ hội tự tìm đến cửa giống như chim bay vào lưới. Có tin vui về tài chính hoặc phần thưởng bất ngờ.",
    action: "Ngồi yên chờ đợi cơ hội chín muồi, không cần vất vả tìm kiếm."
  },
  "Yi_Ji": {
    combination: "Ất + Kỷ",
    name: "Nhật Kỳ Nhập Vụ",
    occurrence: "Cảm thấy mơ hồ, như đi trong sương mù. Các việc công cộng sẽ lấn át mục tiêu cá nhân.",
    action: "Nên giữ nguyên vị trí, không nên mạo hiểm khởi sự việc lớn."
  },
  "Ji_Wu": {
    combination: "Kỷ + Mậu",
    name: "Minh Đường Tòng Lộc",
    occurrence: "Nhận được sự ủng hộ mạnh mẽ từ cấp trên hoặc người có quyền lực. Công sức bỏ ra bắt đầu có thành quả.",
    action: "Tận dụng sự giúp đỡ của bề trên để hoàn thành mục tiêu."
  },
  "Wu_Ren": {
    combination: "Mậu + Nhâm",
    name: "Long Nhập Thiên Lao",
    occurrence: "Cảm thấy bị gò bó, tù túng. Có sự can thiệp từ bên ngoài làm xáo trộn các mối quan hệ.",
    action: "Nên giữ tinh thần thấp, tránh thu hút sự chú ý không cần thiết."
  },
  "Ding_Bing": {
    combination: "Đinh + Bính",
    name: "Tinh Tùy Nguyệt Chuyển",
    occurrence: "Có sự thăng tiến hoặc thay đổi vị trí công việc theo hướng tốt hơn. Xuất hiện dòng thu nhập phụ.",
    action: "Chấp nhận sự thay đổi, đây là thời điểm vàng để thăng tiến."
  },
  "Xin_Gui": {
    combination: "Tân + Quý",
    name: "Thiên Lao Hoa Cái",
    occurrence: "Cảm thấy như có bẫy đang đợi sẵn. Các mối quan hệ gia đình hoặc với trưởng bối có sự bất hòa.",
    action: "Thận trọng trong từng bước đi, tránh đi xa hoặc du lịch lúc này."
  },
  "Geng_Ding": {
    combination: "Canh + Đinh",
    name: "Đình Đình Chi Cách",
    occurrence: "Dễ nảy sinh lòng tham dẫn đến rắc rối pháp lý hoặc kiện tụng. Cảm thấy tinh thần đi xuống.",
    action: "Tránh tham lam lợi nhỏ, giữ vững đạo đức để vượt qua hạn."
  }
};
