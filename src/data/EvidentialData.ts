export interface EvidentialOccurrence {
  type: string;
  occurrence: string;
  meaning: string;
}

export const EVIDENTIAL_MAP: Record<string, EvidentialOccurrence[]> = {
  "Hưu": [
    { type: "Nhìn thấy", occurrence: "Người mặc áo đen hoặc xanh thẫm đi qua", meaning: "Dấu hiệu quẻ Hưu Môn đang ứng, sự việc sẽ bình an." },
    { type: "Nghe thấy", occurrence: "Tiếng nước chảy hoặc tiếng mưa rơi", meaning: "Vận trình thuận lợi, có quý nhân giúp đỡ ngầm." }
  ],
  "Sinh": [
    { type: "Nhìn thấy", occurrence: "Người bế trẻ em hoặc người mang theo cây cảnh", meaning: "Dấu hiệu sinh khí đang vượng, tài lộc sắp đến." },
    { type: "Nhìn thấy", occurrence: "Chim bay từ hướng Đông Nam lại", meaning: "Cơ hội kinh doanh đang mở ra, hãy nắm bắt ngay." }
  ],
  "Khai": [
    { type: "Nhìn thấy", occurrence: "Người cưỡi ngựa hoặc lái xe sang trọng", meaning: "Dấu hiệu sự nghiệp thăng tiến, khởi đầu mới tốt đẹp." },
    { type: "Nghe thấy", occurrence: "Tiếng chuông hoặc tiếng kim loại va chạm", meaning: "Mọi bế tắc sẽ được khai thông." }
  ],
  "Cảnh": [
    { type: "Nhìn thấy", occurrence: "Người mặc áo đỏ hoặc mang theo vật dụng màu sáng", meaning: "Dấu hiệu danh tiếng tăng cao, có tin vui từ xa." }
  ],
  "Tử": [
    { type: "Nhìn thấy", occurrence: "Người mặc đồ tang hoặc tiếng khóc", meaning: "Dấu hiệu hung hiểm, nên dừng lại hoặc thay đổi kế hoạch." }
  ],
  "Kinh": [
    { type: "Nghe thấy", occurrence: "Tiếng chó sủa vang hoặc tiếng cãi vã", meaning: "Cẩn thận thị phi, lo âu không đáng có." }
  ],
  "Thương": [
    { type: "Nhìn thấy", occurrence: "Người bị thương hoặc xe hỏng bên đường", meaning: "Dấu hiệu tổn thất, cần đề phòng tai nạn." }
  ],
  "Đỗ": [
    { type: "Nhìn thấy", occurrence: "Người cầm ô hoặc người trốn tránh", meaning: "Sự việc đang bị ngăn trở, cần kiên nhẫn chờ đợi." }
  ]
};
