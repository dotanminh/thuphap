export type AspectRatio = '9:16' | '16:9';

export type Platform = 'Midjourney' | 'Nano Banana Pro';

export type ContentStyle = 'prose' | 'poetry';

export type TypographyStyle = 
  | 'Thư pháp cổ điển'
  | 'Thư pháp hiện đại'
  | 'Hand-drawn / Sketch'
  | 'Chữ viết tay thường'
  | 'Khắc gỗ'
  | 'Hán Nôm cổ điển'
  | 'Khác';

export type BackgroundStyle = 
  | 'Thủy mặc truyền thống'
  | 'Tranh dân gian Đông Hồ'
  | 'Sơn mài truyền thống'
  | 'Lụa tơ tằm'
  | 'Gốm sứ Bát Tràng'
  | 'Giấy trúc chỉ xuyên sáng'
  | 'Giấy gió mờ ảo'
  | 'Giấy dó cổ vàng'
  | 'Sumie Nhật Bản'
  | 'Lá sen khô'
  | 'Sketchbook giấy dày'
  | 'Gỗ cũ mộc mạc'
  | 'Tối giản hiện đại'
  | 'Khác';

export type InputMode = 'text' | 'image' | 'idea';

export interface PromptConfig {
  aspectRatio: AspectRatio;
  typography: TypographyStyle;
  customTypography?: string;
  background: BackgroundStyle;
  customBackground?: string;
  platform: Platform;
  signature: string;
  userSubject?: string;
  userTone?: string;
}

export interface PromptResult {
  text: string;
}

export interface GeminiError {
  message: string;
}

export interface VisualMeta {
  subject: string;
  context: string;
  tone: string;
  symbol: string;
}

// Key Manager Types
export enum AccountStatus {
  GOOD = 'good',
  QUOTA_EXCEEDED = 'quota_exceeded',
  DEAD = 'dead',
  UNKNOWN = 'unknown'
}

export interface StoredAccount {
  id: string;
  email: string; // Identifier (e.g. ULTRA_ABCD)
  apiKey: string;
  isActive: boolean;
  status: AccountStatus;
  tier: 'FREE' | 'ULTRA';
  lastActive: string;
  avatarColor: string;
  usage: {
    requestsToday: number;
    maxDailyRequests: number;
    lastResetDate: string;
    totalErrors: number;
  };
}