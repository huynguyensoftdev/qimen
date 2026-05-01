export interface DetailedEvidence {
  star?: string;
  door?: string;
  hour?: string;
  palace?: string;
  occurrence: string; // Dấu hiệu nhìn thấy/nghe thấy
  result: string;     // Kết quả dự đoán
}

export const STAR_HOUR_EVIDENCE: Record<string, Record<string, DetailedEvidence>> = {
  "TianPeng": {
    "Zi": {
      hour: "Tý (23:00 - 00:59)",
      occurrence: "Nghe tiếng gà gáy, chó sủa, chim hót hoặc tiếng động lạ trong rừng. Thấy chim bay đột ngột về hướng Bắc.",
      result: "Bất lợi khi vào nhà, dễ gặp kiện tụng. Sau 60 ngày có người môi mỏng đến, tin tức về gà đẻ ra con thay vì trứng. Sau đó mọi việc sẽ tốt dần lên."
    },
    "Chou": {
      hour: "Sửu (01:00 - 02:59)",
      occurrence: "Thấy bão lớn, mưa nặng hạt, sấm chớp. Gió mạnh thổi mất kiểm soát. Cây đổ làm người bị thương.",
      result: "Trong 7 ngày thấy gà đẻ trứng ngỗng, chó leo lên mái nhà, người già tóc bạc tụng kinh. Đây là dấu hiệu đại cát, tài lộc bùng nổ bất ngờ."
    },
    "Yin": {
      hour: "Dần (03:00 - 04:59)",
      occurrence: "Thấy đứa trẻ mặc áo xanh cầm hoa, hoặc nhà sư quấn khăn ở hướng Bắc. Thấy phụ nữ mặc váy dài đi về phía mình.",
      result: "Trong 60 ngày có rắn vào nhà. Sau 3 năm tài sản tăng gấp 4 lần."
    },
    "Mao": {
      hour: "Mão (05:00 - 06:59)",
      occurrence: "Mây vàng bao phủ, phụ nữ cầm vật bằng kim loại, hoặc rắn lớn bò ngang đường.",
      result: "Trong 7 ngày có người tặng quà. Trong 60 ngày phụ nữ gặp rắc rối với kẻ trộm. Sau 100 ngày tài lộc tự tìm đến nhà."
    }
  }
  // Sẽ bổ sung đầy đủ 9 sao và 8 cửa dựa trên trích xuất từ dongiap-cn3.txt
};
