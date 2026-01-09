import { BackgroundStyle, TypographyStyle, AspectRatio, Platform } from "./types";

export const ASPECT_RATIOS: { value: AspectRatio; label: string; textDesc: string }[] = [
  { value: '9:16', label: 'Dọc (9:16) - Điện thoại', textDesc: 'dọc' },
  { value: '16:9', label: 'Ngang (16:9) - PC/TV', textDesc: 'ngang' },
];

export const PLATFORMS: { value: Platform; label: string }[] = [
  { value: 'Midjourney', label: 'Midjourney' },
  { value: 'Nano Banana Pro', label: 'Nano Banana Pro' },
];

export const TYPOGRAPHY_STYLES: { value: TypographyStyle; label: string }[] = [
  { value: 'Thư pháp cổ điển', label: 'Thư pháp cổ điển' },
  { value: 'Thư pháp hiện đại', label: 'Thư pháp hiện đại' },
  { value: 'Hand-drawn / Sketch', label: 'Hand-drawn / Sketch (Nghệ thuật)' },
  { value: 'Chữ viết tay thường', label: 'Chữ viết tay thường (Calligraphy)' },
  { value: 'Khắc gỗ', label: 'Khắc gỗ (Chạm khắc)' },
  { value: 'Hán Nôm cổ điển', label: 'Hán Nôm cổ điển' },
  { value: 'Khác', label: 'Khác (Tự mô tả)' },
];

export const BACKGROUND_STYLES: { value: BackgroundStyle; label: string }[] = [
  { value: 'Thủy mặc truyền thống', label: 'Thủy mặc truyền thống' },
  { value: 'Tranh dân gian Đông Hồ', label: 'Tranh dân gian Đông Hồ (Mới)' },
  { value: 'Sơn mài truyền thống', label: 'Sơn mài truyền thống (Sang trọng)' },
  { value: 'Lụa tơ tằm', label: 'Lụa tơ tằm (Mơ mộng)' },
  { value: 'Gốm sứ Bát Tràng', label: 'Gốm sứ Bát Tràng (Men lam)' },
  { value: 'Giấy trúc chỉ xuyên sáng', label: 'Giấy trúc chỉ xuyên sáng' },
  { value: 'Giấy gió mờ ảo', label: 'Giấy gió mờ ảo' },
  { value: 'Giấy dó cổ vàng', label: 'Giấy dó cổ vàng' },
  { value: 'Sumie Nhật Bản', label: 'Sumie Nhật Bản (Tối giản thiền)' },
  { value: 'Lá sen khô', label: 'Lá sen khô (Rustic)' },
  { value: 'Sketchbook giấy dày', label: 'Sketchbook giấy dày' },
  { value: 'Gỗ cũ mộc mạc', label: 'Gỗ cũ mộc mạc' },
  { value: 'Tối giản hiện đại', label: 'Tối giản hiện đại (Flat)' },
  { value: 'Khác', label: 'Khác (Tự mô tả)' },
];

export const BACKGROUND_DESCRIPTIONS: Record<string, string> = {
  'Thủy mặc truyền thống': 'nền giấy dó cũ kỹ vết ố vàng, sợi giấy lộ; hình minh họa mực nho loang dịu dàng, núi non mờ sương, cây cổ thụ.',
  'Tranh dân gian Đông Hồ': 'nền giấy điệp lấp lánh (giấy quét vỏ sò); đường nét to khỏe, mảng màu đơn giản, ấm cúng, đậm chất dân gian Việt Nam.',
  'Sơn mài truyền thống': 'nền vóc đen bóng (then) hoặc đỏ son sâu thẳm; họa tiết thếp vàng, thếp bạc sang trọng, đài các, hiệu ứng chiều sâu lộng lẫy, bóng bẩy.',
  'Lụa tơ tằm': 'nền lụa tơ tằm mềm mại, óng ả, xuyên thấu nhẹ; nét vẽ loang màu watercolor nhẹ nhàng, mơ màng, nữ tính và lãng mạn.',
  'Gốm sứ Bát Tràng': 'nền men rạn ngà hoặc men trắng xanh cổ điển; họa tiết men lam (blue and white pottery), đường nét thanh thoát, tinh tế như gốm sứ.',
  'Sumie Nhật Bản': 'nền washi tinh tế; hình minh họa vài nét bút mực đen tối giản cực độ (Zen), nhiều khoảng trắng (negative space), không gian thiền.',
  'Giấy trúc chỉ xuyên sáng': 'nền giấy trúc chỉ với xơ giấy lộ rõ, hiệu ứng ánh sáng vàng ấm áp xuyên qua từ phía sau (backlit); hình minh họa tạo hình bằng độ dày mỏng của giấy, tâm linh, huyền ảo.',
  'Giấy gió mờ ảo': 'nền giấy gió mỏng manh, texture gợn sóng nhẹ; hình minh họa phiêu lãng, mờ ảo như trong giấc mơ, nét vẽ sương khói.',
  'Lá sen khô': 'nền texture lá sen khô nhăn nheo, màu nâu đất tự nhiên, gân lá rõ ràng; phong cách mộc mạc (Rustic), thô sơ nhưng tinh tế, gần gũi thiên nhiên.',
  'Sketchbook giấy dày': 'nền giấy vẽ chuyên dụng (Cold press) texture sần rõ; hình minh họa sketch chì than (charcoal) hoặc bút sắt chi tiết, shading tinh tế, nghệ thuật phương Tây.',
  'Gỗ cũ mộc mạc': 'nền gỗ nâu trầm vân rõ, vết thời gian nứt nẻ; hình minh họa khắc chìm hoặc vẽ mộc, bóng đổ sâu tạo khối 3D.',
  'Tối giản hiện đại': 'nền màu đơn sắc (solid color) hoặc gradient pastel nhẹ nhàng; hình minh họa vector flat design hoặc line art mảnh mai, hiện đại.',
  'Giấy dó cổ vàng': 'nền giấy dó vàng óng cổ kính, viền cháy nhẹ; hình minh họa mang hơi hướng cung đình hoặc sớ táo quân, trang trọng.'
};

export const TOPICS = [
  "Chúc mừng năm mới (Tết)",
  "Triết lý cuộc sống",
  "Tôn sư trọng đạo (Thầy Cô)",
  "Công cha nghĩa mẹ (Chữ Hiếu)",
  "Khai trương & Kinh doanh (Tài Lộc)",
  "Chữ Tâm & Chữ Nhẫn (Tu thân)",
  "Bình an & Buông bỏ (Thiền)",
  "Tình yêu & Duyên phận",
  "Gia đình & Tổ ấm",
  "Vợ chồng nghĩa tình",
  "Động lực & Thành công",
  "Sức khỏe & Trường thọ",
  "Tình bạn & Tri kỷ",
  "Thưởng trà & Phong cảnh",
  "Ca dao tục ngữ Việt Nam",
  "Hài hước & Yêu đời",
  "Cà phê & Suy ngẫm",
  "Lý tưởng tuổi trẻ",
  "Khác"
];