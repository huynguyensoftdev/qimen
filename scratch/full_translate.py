import json
import re

# Dictionary bản dịch cho các cụm từ phổ biến để đảm bảo tính thống nhất và tốc độ
TRANSLATION_MAP = {
    "Good fortune will follow you": "Vận may sẽ theo đuổi bạn",
    "Prosperity and good fortune": "Sự thịnh vượng và may mắn",
    "You do not have to worry": "Bạn không cần phải lo lắng",
    "An unlucky sign indeed": "Thực sự là một dấu hiệu không may mắn",
    "Many difficulties will come": "Nhiều khó khăn sẽ ập đến",
    "It is a time of great fortune": "Đây là thời điểm của vận may lớn",
    "You will be blessed": "Bạn sẽ được ban phước",
    "Unexpected setbacks": "Những trở ngại bất ngờ",
    "Success awaits you": "Thành công đang chờ đợi bạn",
    "Avoid gossip": "Tránh thị phi lời đồn",
    "Patience is key": "Kiên nhẫn là chìa khóa",
    "Mentors and helpful people": "Quý nhân và người giúp đỡ",
    "A bright future": "Một tương lai tươi sáng",
    "Take action now": "Hãy hành động ngay bây giờ",
    "Be cautious": "Hãy thận trọng",
}

# Tôi sẽ sử dụng script để cập nhật nhanh bản dịch cho các phần còn lại
# kết hợp với khả năng dịch thuật của tôi để phủ kín 100%

# ... (Logic cập nhật file JSON)
