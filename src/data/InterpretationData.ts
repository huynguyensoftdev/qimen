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
    description: 'Đại diện cho sự nghỉ ngơi, thái bình, hòa hợp. Là cửa của sự thư giãn và quý nhân phù trợ.',
    advice: 'Rất tốt cho việc cầu tài, cưới gả, xây dựng và gặp gỡ quý nhân. Nên giữ thái độ hòa hoãn, tránh tranh đấu gay gắt.'
  },
  'Sinh': {
    name: 'Sinh Môn',
    nature: 'Cát',
    description: 'Cửa của sự sinh sôi, nảy nở, tài lộc dồi dào. Đại diện cho sự phát triển bền vững và thành công.',
    advice: 'Vô cùng cát lợi cho kinh doanh, mưu cầu tiền tài, hôn nhân và mọi sự khởi đầu mới. Là cửa tốt nhất trong Bát Môn.'
  },
  'Thương': {
    name: 'Thương Môn',
    nature: 'Hung',
    description: 'Đại diện cho sự tổn thương, xung đột, tổn hao. Tượng trưng cho việc đòi nợ, săn bắn hoặc tai nạn.',
    advice: 'Chỉ nên dùng cho việc đòi nợ, bắt giữ hoặc thi đấu thể thao. Tuyệt đối tránh khởi tạo, cưới gả hay đi xa.'
  },
  'Đỗ': {
    name: 'Đỗ Môn',
    nature: 'Bình',
    description: 'Cửa của sự bế tắc, ẩn giấu, nội tâm. Thích hợp cho việc giấu kín bí mật hoặc nghiên cứu kỹ thuật.',
    advice: 'Tốt cho việc lánh đời, trốn tránh, giữ bí mật hoặc nghiên cứu khoa học. Tránh các giao dịch công khai hoặc du lịch.'
  },
  'Cảnh': {
    name: 'Cảnh Môn',
    nature: 'Bình',
    description: 'Đại diện cho văn chương, tin tức, vẻ hào nhoáng bên ngoài. Có thể mang lại danh tiếng nhưng cũng dễ gây thị phi.',
    advice: 'Tốt cho thi cử, lập tờ trình, truyền tin. Cần cẩn trọng lời nói để tránh kiện tụng.'
  },
  'Tử': {
    name: 'Tử Môn',
    nature: 'Hung',
    description: 'Đại diện cho sự ngưng trệ, chấm dứt, bất hạnh. Tượng trưng cho tang ma, đất đai cũ kỹ và sự bế tắc.',
    advice: 'Cực xấu cho mọi việc đại sự. Chỉ thích hợp cho việc chôn cất, phá dỡ cái cũ hoặc đi săn.'
  },
  'Kinh': {
    name: 'Kinh Môn',
    nature: 'Hung',
    description: 'Đại diện cho sự kinh hãi, lo âu, náo động. Tượng trưng cho quan tòa, sự tranh chấp và tin đồn thất thiệt.',
    advice: 'Có lợi cho việc thưa kiện, bắt bớ hoặc phá án. Tránh đi xa hay làm việc lớn vì dễ gặp bất an, lo sợ.'
  },
  'Khai': {
    name: 'Khai Môn',
    nature: 'Cát',
    description: 'Cửa của sự hanh thông, công danh, sự nghiệp mở rộng. Tượng trưng cho sự khởi đầu rực rỡ và quyền lực.',
    advice: 'Rất tốt cho việc nhậm chức, thăng quan, thành lập doanh nghiệp, đi xa và thực hiện các dự án quy mô lớn.'
  }
};

export const STAR_DETAILS: Record<string, DetailInfo> = {
  'Thiên Bồng': {
    name: 'Thiên Bồng Tinh',
    nature: 'Hung',
    description: 'Sao của trộm cướp, rủi ro và mưu lược mạo hiểm. Đại diện cho trí tuệ lớn nhưng dễ đi kèm nguy hiểm.',
    advice: 'Nên phòng thủ, quản lý tài chính chặt chẽ. Chỉ tốt cho việc dùng mưu lược thầm kín hoặc thực hiện việc khó khăn.'
  },
  'Thiên Nhuế': {
    name: 'Thiên Nhuế Tinh',
    nature: 'Hung',
    description: 'Sao của bệnh tật, sự tham lam và trì trệ. Cũng đại diện cho việc học hành, nghiên cứu và tôn giáo.',
    advice: 'Tốt cho việc học tập, nghiên cứu tâm linh và y thuật. Cần đặc biệt chú ý đến sức khỏe và tránh tham cầu quá độ.'
  },
  'Thiên Xung': {
    name: 'Thiên Xung Tinh',
    nature: 'Cát',
    description: 'Sao của sự mạnh mẽ, quyết đoán, hành động nhanh. Tượng trưng cho quân sự và tốc chiến tốc thắng.',
    advice: 'Tốt cho việc ra quân, tập luyện, hành động quyết liệt và nhanh chóng. Không nên chần chừ khi gặp sao này.'
  },
  'Thiên Phụ': {
    name: 'Thiên Phụ Tinh',
    nature: 'Cát',
    description: 'Sao của giáo dục, văn hóa, quý nhân và sự hòa nhã. Mang lại sự hỗ trợ từ cấp trên và người hiền đức.',
    advice: 'Rất tốt cho thi cử, xin việc, tìm thầy học đạo, nhờ người tư vấn hoặc thực hiện các việc văn hóa giáo dục.'
  },
  'Thiên Cầm': {
    name: 'Thiên Cầm Tinh',
    nature: 'Cát',
    description: 'Ngôi sao trung tâm, tôn quý nhất, hội tụ tinh hoa. Có khả năng hóa giải những hung tinh xung quanh.',
    advice: 'Đại cát đại lợi cho mọi việc. Thích hợp để thực hiện những kế hoạch mang tính bước ngoặt và hệ trọng.'
  },
  'Thiên Tâm': {
    name: 'Thiên Tâm Tinh',
    nature: 'Cát',
    description: 'Sao của sự thông thái, y thuật, quản lý và chiến lược. Tượng trưng cho trí tuệ minh mẫn và khả năng điều hành.',
    advice: 'Tốt cho việc chữa bệnh, lập kế hoạch quản trị, thăng quan tiến chức và thực hiện công vụ nhà nước.'
  },
  'Thiên Trụ': {
    name: 'Thiên Trụ Tinh',
    nature: 'Hung',
    description: 'Sao của sự tranh luận, tiếng vang và sự sụp đổ. Đại diện cho miệng tiếng, thị phi và nỗi sợ hãi.',
    advice: 'Nên thu liễm, tu sửa bản thân, giữ gìn lời nói. Tránh các cuộc tranh cãi và không nên mạo hiểm đầu tư.'
  },
  'Thiên Nhậm': {
    name: 'Thiên Nhậm Tinh',
    nature: 'Cát',
    description: 'Sao của sự bền bỉ, kiên trì, tích lũy. Đại diện cho đất đai, bất động sản và sự ổn định lâu dài.',
    advice: 'Rất tốt cho đầu tư dài hạn, mua bán nhà đất, xây dựng và những việc cần sự kiên nhẫn, bền chí.'
  },
  'Thiên Anh': {
    name: 'Thiên Anh Tinh',
    nature: 'Bình',
    description: 'Sao của lễ nghi, sự rực rỡ, vẻ ngoài và hỏa hoạn. Đại diện cho tin tức và sự hư ảo.',
    advice: 'Tốt cho truyền thông, quảng cáo, làm đẹp. Cần kiềm chế tính nóng vội và phòng tránh hỏa hoạn.'
  }
};

export const DEITY_DETAILS: Record<string, DetailInfo> = {
  'Trực Phù': {
    name: 'Trực Phù Thần',
    nature: 'Cát',
    description: 'Vị thần đứng đầu (Thiên Ất Quý Nhân), mang lại sự che chở, bảo hộ và uy tín tuyệt đối.',
    advice: 'Vạn sự đều cát, thích hợp cầu cứu quý nhân, nhậm chức hoặc thực hiện các công việc chính nghĩa.'
  },
  'Đằng Xà': {
    name: 'Đằng Xà Thần',
    nature: 'Hung',
    description: 'Thần của sự biến hóa khôn lường, lo âu, ác mộng và ảo giác. Gây ra sự bất an và nhầm lẫn.',
    advice: 'Phòng ngừa bị lừa dối, ác mộng hoặc lo âu vô cớ. Cần giữ tâm thế tỉnh táo, không tin vào vẻ ngoài.'
  },
  'Thái Âm': {
    name: 'Thái Âm Thần',
    nature: 'Cát',
    description: 'Thần của sự âm thầm, kín đáo, phước lành từ bóng tối. Đại diện cho sự giúp đỡ từ phụ nữ và bí mật.',
    advice: 'Thích hợp cho các kế hoạch thầm kín, nghiên cứu sâu hoặc nhờ sự trợ giúp tế nhị từ phái nữ.'
  },
  'Lục Hợp': {
    name: 'Lục Hợp Thần',
    nature: 'Cát',
    description: 'Thần của sự hòa hợp, môi giới, giao dịch và đoàn tụ. Tượng trưng cho đám đông và sự kết nối.',
    advice: 'Rất tốt cho ký kết hợp đồng, môi giới, hôn nhân, hội họp và các hoạt động mang tính cộng đồng.'
  },
  'Bạch Hổ': {
    name: 'Bạch Hổ Thần',
    nature: 'Hung',
    description: 'Thần của uy lực, sát phạt, tai nạn và xung đột mạnh mẽ. Đại diện cho sức mạnh cơ bắp và máu huyết.',
    advice: 'Cần tránh mạo hiểm, va chạm hay đi xa. Tốt cho việc thực thi pháp luật, kỷ luật thép hoặc tập luyện cường độ cao.'
  },
  'Huyền Vũ': {
    name: 'Huyền Vũ Thần',
    nature: 'Hung',
    description: 'Thần của sự mờ ám, trộm cắp, lừa đảo và thất thoát. Tượng trưng cho tiểu nhân và sự không minh bạch.',
    advice: 'Phòng ngừa mất mát tài sản, bị tiểu nhân hãm hại hoặc lừa đảo. Tránh đầu tư vào những việc không rõ ràng.'
  },
  'Cửu Địa': {
    name: 'Cửu Địa Thần',
    nature: 'Cát',
    description: 'Thần của sự tĩnh lặng, bền vững, đất đai sâu thẳm. Tượng trưng cho sự bảo tồn và che giấu.',
    advice: 'Thích hợp cho tích lũy, xây dựng nền móng, mai táng hoặc các việc cần sự ổn định tuyệt đối.'
  },
  'Cửu Thiên': {
    name: 'Cửu Thiên Thần',
    nature: 'Cát',
    description: 'Thần của sự cao xa, thăng tiến, bay bổng và hành động mạnh mẽ. Đại diện cho tầm nhìn rộng lớn.',
    advice: 'Rất tốt cho việc cầu danh tiếng, xuất hành xa, quảng bá và thực hiện các ý tưởng đột phá.'
  },
  'Thái Xung Thiên Mã': {
    name: 'Thái Xung Thiên Mã',
    nature: 'Cát',
    description: 'Vị thần mang lại tốc độ cực nhanh, giúp giải quyết dứt điểm các bế tắc kéo dài.',
    advice: 'Rất tốt cho việc đi xa, truyền tin, hoặc cần hoàn thành công việc trong thời gian ngắn nhất.'
  },
  'Địa Tư Môn': {
    name: 'Địa Tư Môn',
    nature: 'Cát',
    description: 'Cửa bí mật của đất, dùng để ẩn mình và thực hiện các kế hoạch thầm lặng.',
    advice: 'Tốt cho việc giữ bí mật, nghiên cứu, hoặc né tránh sự chú ý của đối thủ.'
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
