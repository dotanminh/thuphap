import React from 'react';
import { BACKGROUND_STYLES, TYPOGRAPHY_STYLES, ASPECT_RATIOS, PLATFORMS } from '../constants';
import { BackgroundStyle, TypographyStyle, AspectRatio, Platform } from '../types';

interface ConfigSelectorProps {
  aspectRatio: AspectRatio;
  setAspectRatio: (val: AspectRatio) => void;
  typography: TypographyStyle;
  setTypography: (val: TypographyStyle) => void;
  customTypography: string;
  setCustomTypography: (val: string) => void;
  background: BackgroundStyle;
  setBackground: (val: BackgroundStyle) => void;
  customBackground: string;
  setCustomBackground: (val: string) => void;
  platform: Platform;
  setPlatform: (val: Platform) => void;
  signature: string;
  setSignature: (val: string) => void;
  userSubject: string;
  setUserSubject: (val: string) => void;
  userTone: string;
  setUserTone: (val: string) => void;
  isSmartSplit: boolean;
  setIsSmartSplit: (val: boolean) => void;
  count: number;
  setCount: (val: number) => void;
}

const SUBJECT_SUGGESTIONS = [
  "Hoa sen thanh khiết", "Chú tiểu ngộ nghĩnh", "Tượng Phật từ bi",
  "Phong thủy sông núi", "Cành mai vàng ngày Tết", "Cành đào thắm",
  "Con đò bến nước", "Tre trúc xanh tươi", "Mục đồng chăn trâu",
  "Cá chép hóa rồng", "Trống đồng Đông Sơn", "Đình chùa cổ kính",
  "Pháo hoa rực rỡ", "Cô gái áo dài", "Nón lá nghiêng che",
  "Đèn lồng phố cổ", "Ruộng bậc thang", "Chim hạc bay lượn",
  "Ấm trà đạo", "Ngọn nến lung linh", "Rồng thiêng",
  "Bánh chưng bánh tét", "Hoa cúc đại đóa"
];

const TONE_SUGGESTIONS = [
  "Vàng hoài cổ (Vintage)", "Đỏ rực may mắn (Tết)", "Trầm mặc u tịch",
  "Xanh mát thanh bình", "Sương khói mờ ảo", "Đen trắng tối giản",
  "Nắng sớm tinh khôi", "Huyền bí tâm linh", "Pastel nhẹ nhàng",
  "Ấm áp sum vầy", "Tím mộng mơ", "Xanh ngọc bích",
  "Ánh kim sang trọng", "Cinematic điện ảnh", "Rực rỡ lễ hội"
];

export const ConfigSelector: React.FC<ConfigSelectorProps> = ({
  aspectRatio,
  setAspectRatio,
  typography,
  setTypography,
  customTypography,
  setCustomTypography,
  background,
  setBackground,
  customBackground,
  setCustomBackground,
  platform,
  setPlatform,
  signature,
  setSignature,
  userSubject,
  setUserSubject,
  userTone,
  setUserTone,
  isSmartSplit,
  setIsSmartSplit,
  count,
  setCount
}) => {
  return (
    <div className="w-full max-w-2xl mb-8 space-y-8 animate-fade-in">
      
      {/* Signature & Format Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-ink font-serif font-bold mb-2 block text-sm uppercase tracking-wide">Tên ký / Thương hiệu</label>
          <input 
            type="text"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            placeholder="Minh Đỗ"
            className="w-full p-3 bg-white border border-sepia/30 rounded-lg focus:border-ink outline-none text-ink font-serif shadow-sm"
          />
        </div>
        <div>
          <label className="text-ink font-serif font-bold mb-2 block text-sm uppercase tracking-wide">Khổ ảnh</label>
          <div className="relative">
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
              className="w-full appearance-none bg-white border border-sepia/30 text-ink py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:border-ink transition-colors font-body cursor-pointer shadow-sm"
            >
              {ASPECT_RATIOS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-ink">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Style Section */}
      <div className="bg-paper-dark/30 p-6 rounded-xl border border-sepia/20 space-y-6">
        {/* Typography */}
        <div className="flex flex-col">
          <label className="text-ink font-serif font-bold mb-2 block text-sm uppercase tracking-wide">1. Kiểu chữ chính</label>
          <div className="relative mb-2">
            <select
              value={typography}
              onChange={(e) => setTypography(e.target.value as TypographyStyle)}
              className="w-full appearance-none bg-white border border-sepia/30 text-ink py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:border-ink transition-colors font-body cursor-pointer shadow-sm"
            >
              {TYPOGRAPHY_STYLES.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-ink">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
          {typography === 'Khác' && (
            <input 
              type="text"
              value={customTypography}
              onChange={(e) => setCustomTypography(e.target.value)}
              placeholder="Mô tả kiểu chữ bạn muốn (ví dụ: thư pháp vàng óng, chữ neon...)"
              className="w-full p-3 bg-white border border-sepia/30 rounded-lg focus:border-ink outline-none text-sm text-ink font-body animate-fade-in"
            />
          )}
        </div>

        {/* Background */}
        <div className="flex flex-col">
          <label className="text-ink font-serif font-bold mb-2 block text-sm uppercase tracking-wide">2. Phong cách nền & hình minh họa</label>
          <div className="relative mb-2">
            <select
              value={background}
              onChange={(e) => setBackground(e.target.value as BackgroundStyle)}
              className="w-full appearance-none bg-white border border-sepia/30 text-ink py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:border-ink transition-colors font-body cursor-pointer shadow-sm"
            >
              {BACKGROUND_STYLES.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-ink">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
          {background === 'Khác' && (
             <div className="animate-fade-in space-y-2">
               <input 
                 type="text"
                 value={customBackground}
                 onChange={(e) => setCustomBackground(e.target.value)}
                 placeholder="Mô tả phong cách nền bạn muốn (ví dụ: nền tranh sơn dầu...)"
                 className="w-full p-3 bg-white border border-sepia/30 rounded-lg focus:border-ink outline-none text-sm text-ink font-body"
               />
               <div className="flex flex-wrap gap-2 items-center">
                 <span className="text-xs text-sepia italic">Gợi ý:</span>
                 {['Nền tranh sơn dầu', 'Nền đêm sao lung linh', 'Nền lụa đỏ thắm', 'Nền hoa sen cách điệu', 'Phong cách Cyberpunk'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setCustomBackground(s)}
                      className="text-xs bg-white border border-sepia/20 px-2 py-1 rounded-full text-ink/80 hover:bg-sepia hover:text-white transition-colors"
                    >
                      {s}
                    </button>
                 ))}
               </div>
             </div>
          )}
        </div>
      </div>

      {/* Visual Customization (Enhanced) */}
      <div className="bg-white p-6 rounded-xl border border-sepia/20 shadow-sm space-y-6">
         <div className="flex justify-between items-center border-b border-sepia/10 pb-3">
             <h4 className="font-serif font-bold text-ink uppercase tracking-wide text-sm">Tùy chỉnh nâng cao (Không bắt buộc)</h4>
             <span className="text-[10px] bg-sepia/10 text-sepia px-2 py-1 rounded font-bold uppercase cursor-help" title="Để trống sẽ do AI tự quyết định">AI Tự động</span>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Subject Column */}
            <div className="flex flex-col gap-3">
              <label className="text-ink font-bold text-sm block">Chủ thể hình ảnh chính</label>
              <textarea 
                value={userSubject}
                onChange={(e) => setUserSubject(e.target.value)}
                placeholder="VD: hoa sen, con đò, ngọn núi..."
                className="w-full p-3 bg-paper rounded-lg border border-sepia/20 focus:border-ink outline-none text-sm resize-none"
                rows={3}
              />
              <div className="flex flex-wrap gap-2">
                 <span className="text-xs text-sepia italic mr-1 flex items-center">Gợi ý:</span>
                 {SUBJECT_SUGGESTIONS.map((s) => (
                   <button
                     key={s}
                     onClick={() => setUserSubject(s)}
                     className="text-xs bg-paper-dark border border-sepia/10 px-3 py-1.5 rounded-full text-ink hover:bg-sepia hover:text-white transition-colors"
                   >
                     {s}
                   </button>
                 ))}
              </div>
            </div>

            {/* Tone Column */}
            <div className="flex flex-col gap-3">
              <label className="text-ink font-bold text-sm block">Màu sắc & Cảm xúc</label>
              <textarea 
                value={userTone}
                onChange={(e) => setUserTone(e.target.value)}
                placeholder="VD: vàng ấm, buồn man mác..."
                className="w-full p-3 bg-paper rounded-lg border border-sepia/20 focus:border-ink outline-none text-sm resize-none"
                rows={3}
              />
               <div className="flex flex-wrap gap-2">
                 <span className="text-xs text-sepia italic mr-1 flex items-center">Gợi ý:</span>
                 {TONE_SUGGESTIONS.map((s) => (
                   <button
                     key={s}
                     onClick={() => setUserTone(s)}
                     className="text-xs bg-paper-dark border border-sepia/10 px-3 py-1.5 rounded-full text-ink hover:bg-sepia hover:text-white transition-colors"
                   >
                     {s}
                   </button>
                 ))}
              </div>
            </div>
         </div>
      </div>

      {/* Smart Split Checkbox */}
      <div className="flex items-center space-x-3 p-2">
        <input
          id="smart-split"
          type="checkbox"
          checked={isSmartSplit}
          onChange={(e) => setIsSmartSplit(e.target.checked)}
          className="h-5 w-5 text-ink focus:ring-sepia border-gray-300 rounded cursor-pointer accent-ink"
        />
        <label htmlFor="smart-split" className="text-ink font-body cursor-pointer select-none">
          <span className="font-bold">Tự động chia đoạn thông minh</span>
          <p className="text-xs text-sepia mt-0.5">Tự động chia nội dung để đủ số lượng tranh.</p>
        </label>
      </div>
    </div>
  );
};