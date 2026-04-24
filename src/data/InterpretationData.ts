export interface DetailInfo {
  name: string;
  nature: 'Cát' | 'Hung' | 'Bình';
  description: string;
  advice: string;
}

export const DOOR_DETAILS: Record<string, DetailInfo> = {
  'Hưu': {
    name: 'Hưu Môn',
    nature: 'Cát',
    description: 'Đại diện cho sự nghỉ ngơi, thư giãn, quý nhân phù trợ và các hoạt động hội họp, yến tiệc.',
    advice: 'Tốt cho việc cầu tài, cưới gả, xây cất và gặp gỡ quý nhân. Nên hòa hoãn, tránh tranh đấu.'
  },
  'Sinh': {
    name: 'Sinh Môn',
    nature: 'Cát',
    description: 'Đại diện cho sinh khí, tài lộc, sự phát triển và kinh doanh.',
    advice: 'Vô cùng cát lợi cho việc kinh doanh, mưu cầu tiền tài, hôn nhân và mọi sự khởi đầu mới.'
  },
  'Thương': {
    name: 'Thương Môn',
    nature: 'Hung',
    description: 'Đại diện cho sự tổn thương, xung đột, săn bắn hoặc đòi nợ.',
    advice: 'Chỉ tốt cho việc đi săn, đòi nợ hoặc bắt giữ. Tránh khởi tạo, cưới gả vì dễ mang lại điều tiếng.'
  },
  'Đỗ': {
    name: 'Đỗ Môn',
    nature: 'Bình',
    description: 'Đại diện cho sự bế tắc, ẩn náu, che giấu hoặc nghiên cứu bí mật.',
    advice: 'Tốt cho việc lánh đời, trốn tránh, giữ bí mật. Tránh các giao dịch công khai hoặc đi xa.'
  },
  'Cảnh': {
    name: 'Cảnh Môn',
    nature: 'Bình',
    description: 'Đại diện cho văn chương, tin tức, tiệc tùng hoặc các vấn đề thị phi.',
    advice: 'Tốt cho việc thi cử, làm tờ trình, truyền tin. Cần cẩn thận lời ăn tiếng nói kẻo vướng kiện tụng.'
  },
  'Tử': {
    name: 'Tử Môn',
    nature: 'Hung',
    description: 'Đại diện cho sự chết chóc, chấm dứt, tang ma hoặc đất đai cũ kỹ.',
    advice: 'Cực xấu cho mọi việc. Chỉ dùng được cho việc chôn cất hoặc phá dỡ cái cũ.'
  },
  'Kinh': {
    name: 'Kinh Môn',
    nature: 'Hung',
    description: 'Đại diện cho sự kinh hãi, lo lắng, quan tòa hoặc sự náo động.',
    advice: 'Tốt cho việc thưa kiện, bắt bớ. Bình thường nên giữ tâm an ổn, tránh bị lôi kéo vào vòng xoáy thị phi.'
  },
  'Khai': {
    name: 'Khai Môn',
    nature: 'Cát',
    description: 'Đại diện cho sự cởi mở, hanh thông, công danh và quan lộc.',
    advice: 'Rất tốt cho việc nhậm chức, thăng quan, thành lập doanh nghiệp và thực hiện các dự án lớn.'
  }
};

export const STAR_DETAILS: Record<string, DetailInfo> = {
  'Thiên Bồng': {
    name: 'Thiên Bồng Tinh',
    nature: 'Hung',
    description: 'Sao của trộm cướp, đại diện cho mưu trí nhưng cũng nhiều rủi ro.',
    advice: 'Nên phòng thủ, cẩn trọng trong tài chính. Tốt cho việc dùng mưu lược thầm kín.'
  },
  'Thiên Nhuế': {
    name: 'Thiên Nhuế Tinh',
    nature: 'Hung',
    description: 'Sao của bệnh tật, học hành và sự tham lam.',
    advice: 'Tốt cho việc học tập, nghiên cứu tâm linh. Cần lưu tâm đến sức khỏe bản thân.'
  },
  'Thiên Xung': {
    name: 'Thiên Xung Tinh',
    nature: 'Cát',
    description: 'Sao của sự mạnh mẽ, quyết đoán, dũng cảm và tốc chiến tốc thắng.',
    advice: 'Tốt cho việc ra quân, tập thể thao hoặc thực hiện các hành động cần sự nhanh chóng.'
  },
  'Thiên Phụ': {
    name: 'Thiên Phụ Tinh',
    nature: 'Cát',
    description: 'Sao của giáo dục, quý nhân và sự hòa nhã.',
    advice: 'Thích hợp cho việc thi cử, xin việc, tìm kiếm người tư vấn hoặc cố vấn.'
  },
  'Thiên Cầm': {
    name: 'Thiên Cầm Tinh',
    nature: 'Cát',
    description: 'Ngôi sao trung tâm, hội tụ tinh hoa, tôn quý nhất trong 9 sao.',
    advice: 'Cực kỳ cát lợi cho mọi việc, đặc biệt là các việc lớn tầm vóc hệ trọng.'
  },
  'Thiên Tâm': {
    name: 'Thiên Tâm Tinh',
    nature: 'Cát',
    description: 'Sao của sự thông thái, y thuật, quản lý và quân chức.',
    advice: 'Tốt cho việc chữa bệnh, lập kế hoạch quản trị và thực hiện nhiệm vụ công.'
  },
  'Thiên Trụ': {
    name: 'Thiên Trụ Tinh',
    nature: 'Hung',
    description: 'Sao của sự sụp đổ, tranh luận và các vấn đề về miệng tiếng.',
    advice: 'Nên thu liễm, tu sửa bản thân. Tránh các cuộc tranh cãi không cần thiết.'
  },
  'Thiên Nhậm': {
    name: 'Thiên Nhậm Tinh',
    nature: 'Cát',
    description: 'Sao của sự bền bỉ, tích lũy, đất đai và nông nghiệp.',
    advice: 'Tốt cho việc đầu tư dài hạn, mua bán nhà đất hoặc các dự án cần sự kiên nhẫn.'
  },
  'Thiên Anh': {
    name: 'Thiên Anh Tinh',
    nature: 'Bình',
    description: 'Sao của lễ nghi, rạng rỡ nhưng nóng vội.',
    advice: 'Tốt cho việc làm đẹp, truyền thông. Cần kiềm chế tính nóng nảy.'
  }
};

export const DEITY_DETAILS: Record<string, DetailInfo> = {
  'Trực Phù': {
    name: 'Trực Phù Thần',
    nature: 'Cát',
    description: 'Thần đứng đầu, đại diện cho quý nhân cấp cao, sự bảo hộ và uy tín.',
    advice: 'Mọi sự đều được che chở, thích hợp cầu cứu quý nhân.'
  },
  'Đằng Xà': {
    name: 'Đằng Xà Thần',
    nature: 'Hung',
    description: 'Thần của sự hư thực, ảo giác, lo âu và quái lạ.',
    advice: 'Cẩn thận bị lừa dối hoặc lo âu vô cớ. Cần giữ cái đầu tỉnh táo.'
  },
  'Thái Âm': {
    name: 'Thái Âm Thần',
    nature: 'Cát',
    description: 'Thần của sự kín đáo, phước lành thầm lặng và phụ nữ.',
    advice: 'Thích hợp cho các kế hoạch thầm kín, nghiên cứu hoặc nhờ vả phái nữ.'
  },
  'Lục Hợp': {
    name: 'Lục Hợp Thần',
    nature: 'Cát',
    description: 'Thần của sự hòa hợp, môi giới, hôn nhân và đông đúc.',
    advice: 'Rất tốt cho việc thỏa thuận, ký hợp đồng, làm mai mối.'
  },
  'Bạch Hổ': {
    name: 'Bạch Hổ Thần',
    nature: 'Hung',
    description: 'Thần của uy quyền, sát phạt, tai nạn và sự mạnh bạo.',
    advice: 'Tránh các hành động mạo hiểm, va chạm. Tốt cho việc thực thi kỷ luật.'
  },
  'Huyền Vũ': {
    name: 'Huyền Vũ Thần',
    nature: 'Hung',
    description: 'Thần của sự trộm cắp, mờ ám, thị phi và thất thoát.',
    advice: 'Phòng ngừa mất cắp, lừa đảo. Tránh tin lời đường mật.'
  },
  'Cửu Địa': {
    name: 'Cửu Địa Thần',
    nature: 'Cát',
    description: 'Thần của sự sậm lặng, bền vững, đất đai và bảo tồn.',
    advice: 'Thích hợp tích lũy, cất giữ hoặc làm các việc liên quan đến mộ trạch.'
  },
  'Cửu Thiên': {
    name: 'Cửu Thiên Thần',
    nature: 'Cát',
    description: 'Thần của sự cao xa, hành động quyết liệt, danh tiếng và bay bổng.',
    advice: 'Tốt cho việc cầu danh, quảng bá và du lịch phương xa.'
  }
};

export const ACTION_ADVICE: Record<string, string> = {
  'Hưu': 'Hành động nhẹ nhàng, hội họp, ký kết hòa bình. Không nên gây hấn.',
  'Sinh': 'Khai trương, cầu tài, khởi công, cưới hỏi. Mọi việc đều thuận.',
  'Thương': 'Đòi nợ, bắt giữ, săn bắn. Tránh khai trương hoặc đi xa.',
  'Đỗ': 'Ẩn náu, nghiên cứu, giữ bí mật. Tránh các hoạt động công khai.',
  'Cảnh': 'Viết lách, thi cử, truyền thông. Cẩn thận thị phi, quan tụng.',
  'Tử': 'Chôn cất, dọn dẹp đồ cũ. Tuyệt đối không làm việc đại sự.',
  'Kinh': 'Kiện tụng, thưa gửi. Tránh đi xa vì dễ gặp lo âu, kinh sợ.',
  'Khai': 'Nhậm chức, mở cửa hàng, ký kết hợp đồng lớn. Rất hanh thông.'
};

export const FENGSHUI_APPLICATIONS: Record<string, { bed: string; desk: string }> = {
  'Hưu': {
    bed: 'Rất tốt. Mang lại giấc ngủ sâu, hồi phục sức khỏe và tình cảm vợ chồng hòa hợp.',
    desk: 'Bình thường. Phù hợp cho những công việc mang tính nghiên cứu, thư giãn, ít áp lực.'
  },
  'Sinh': {
    bed: 'Cực tốt. Tăng cường sinh lực, hỗ trợ cầu con cái và vận thế phát triển.',
    desk: 'Tuyệt vời. Thúc đẩy tài lộc, sự sáng tạo và năng lượng làm việc dồi dào.'
  },
  'Thương': {
    bed: 'Xấu. Dễ gây trằn trọc, ác mộng hoặc các bệnh về gân cốt, chấn thương.',
    desk: 'Kém. Dễ xảy ra tranh cãi với đồng nghiệp hoặc gặp áp lực lớn từ cấp trên.'
  },
  'Đỗ': {
    bed: 'Bình thường. Thích hợp cho việc ẩn dật, nhưng không tốt cho người cần mở rộng quan hệ.',
    desk: 'Tốt cho nghiên cứu sâu, lập thuật toán hoặc các công việc cần sự bảo mật tuyệt đối.'
  },
  'Cảnh': {
    bed: 'Hơi kém. Dễ gây hưng phấn quá độ, khó ngủ hoặc các vấn đề về huyết áp, tim mạch.',
    desk: 'Tốt cho người làm nghệ thuật, truyền thông, marketing hoặc cần danh tiếng.'
  },
  'Tử': {
    bed: 'Cực xấu. Tuyệt đối tránh. Gây suy kiệt năng lượng, bệnh tật triền miên.',
    desk: 'Rất kém. Công việc bế tắc, không có lối thoát và dễ nảy sinh ý định bỏ cuộc.'
  },
  'Kinh': {
    bed: 'Xấu. Gây bất an, giật mình, dễ vướng vào các vấn đề phiền muộn, lo âu.',
    desk: 'Hơi kém. Phù hợp cho luật sư, người giải quyết tranh chấp, nhưng áp lực tâm lý rất lớn.'
  },
  'Khai': {
    bed: 'Tốt. Mang lại sự minh mẫn và hanh thông cho khởi đầu ngày mới.',
    desk: 'Đại cát. Thăng tiến công danh, mở rộng quan hệ và ký kết hợp đồng thuận lợi.'
  }
};
