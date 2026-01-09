import { GoogleGenAI, Type } from "@google/genai";
import { VisualMeta, AspectRatio, ContentStyle, StoredAccount, AccountStatus } from "../types";

let accountPool: StoredAccount[] = [];

// Helper to safely get env vars without crashing if process is undefined (common in Vite/Browser)
const getEnvKey = () => {
  try {
    return (typeof process !== 'undefined' && process.env) ? (process.env.API_KEY || '') : '';
  } catch {
    return '';
  }
};

// Allow updating the pool from App.tsx
export const setApiKeyPool = (accounts: StoredAccount[]) => {
  accountPool = accounts.filter(acc => acc.isActive && acc.status === AccountStatus.GOOD);
};

// Regex to extract API Key - Loosened as requested to support broader matching
export const smartExtractCredentials = (text: string): string | null => {
  // Regex looks for "AIza" followed by at least 30 alphanumeric/special chars
  const regex = /AIza[0-9A-Za-z\-_]{30,}/;
  const match = text.match(regex);
  return match ? match[0] : null;
};

// Validate API Key using gemini-3-flash-preview
export const validateApiKey = async (apiKey: string): Promise<{ status: AccountStatus; error?: string }> => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    // Minimal request to check validity
    await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { text: "Hi" }
    });
    return { status: AccountStatus.GOOD };
  } catch (error: any) {
    console.error("[Key Validation Error]", error);
    const msg = error.message?.toLowerCase() || '';
    
    if (msg.includes('quota') || msg.includes('429')) {
      return { status: AccountStatus.QUOTA_EXCEEDED, error: error.message };
    }
    // Assume dead/invalid for other errors (400, 403, 404, etc)
    return { status: AccountStatus.DEAD, error: error.message };
  }
};

// Client Rotation Logic
const getAIClient = () => {
  // Strictly usage from pool
  let selectedKey = '';
  
  if (accountPool.length > 0) {
    // Simple random rotation
    const randomIndex = Math.floor(Math.random() * accountPool.length);
    selectedKey = accountPool[randomIndex].apiKey;
  }

  if (!selectedKey) {
    // Fallback logic removed to enforce user input
    throw new Error("Vui lòng nhập API Key trong phần Cài đặt (Biểu tượng bánh răng).");
  }

  return new GoogleGenAI({ apiKey: selectedKey });
};

// Client for Paid Image Generation (requires Key Selection or falls back to pool)
const getPaidAIClient = async () => {
  const win = window as any;
  // If we have our own pool, prefer it over the forced selection dialog unless strictly needed
  if (accountPool.length > 0) {
     return getAIClient();
  }

  if (win.aistudio) {
    const hasKey = await win.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await win.aistudio.openSelectKey();
    }
    // Safe env access
    return new GoogleGenAI({ apiKey: getEnvKey() }); 
  }
  return getAIClient();
};

export const extractTextFromImage = async (base64Image: string): Promise<string> => {
  try {
    const ai = getAIClient();
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/png', data: cleanBase64 } },
          { text: "Hãy nhìn vào bức ảnh này. Trích xuất CHÍNH XÁC và ĐẦY ĐỦ nội dung chữ (câu thơ, triết lý, lời chúc) có trong ảnh. Chỉ trả về đúng nội dung chữ đó, không thêm bất kỳ lời dẫn nào. Nếu ảnh không có chữ, trả về 'NO_TEXT_FOUND'." }
        ]
      }
    });

    const text = response.text?.trim();
    if (!text || text === 'NO_TEXT_FOUND') throw new Error("Không tìm thấy chữ trong ảnh.");
    return text;
  } catch (error: any) {
    console.error("Gemini Vision Error:", error);
    throw new Error(error.message || "Lỗi khi phân tích ảnh.");
  }
};

export const generateContentFromTopic = async (topic: string, count: number, style: ContentStyle): Promise<string> => {
  try {
    const ai = getAIClient();
    
    let styleInstruction = "";
    if (style === 'poetry') {
      styleInstruction = "Yêu cầu hình thức: BẮT BUỘC là THƠ (Lục bát, Song thất lục bát, Thơ 4 chữ...) hoặc CÂU ĐỐI. Phải có vần điệu, ngắn gọn, súc tích.";
    } else {
      styleInstruction = "Yêu cầu hình thức: BẮT BUỘC là VĂN XUÔI, Tản văn ngắn, Chiêm nghiệm hoặc Lời hay ý đẹp. Không viết thành thơ.";
    }

    const prompt = `Bạn là một nhà thư pháp và triết học am hiểu văn hóa Việt Nam. 
    Hãy sáng tạo đúng ${count} nội dung khác nhau về chủ đề: "${topic}".
    
    ${styleInstruction}
    
    Yêu cầu chung: Sâu sắc, giàu cảm xúc, thấm đẫm văn hóa Việt.
    Ngăn cách mỗi nội dung bằng dấu phân cách chính xác là: "|||"
    KHÔNG đánh số thứ tự, KHÔNG thêm lời dẫn.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { text: prompt }
    });

    const text = response.text?.trim();
    if (!text) throw new Error("Không thể sinh nội dung. Vui lòng thử lại.");
    return text;
  } catch (error: any) {
    throw new Error(error.message || "Lỗi khi sinh ý tưởng.");
  }
};

export const expandContent = async (originalText: string, targetCount: number): Promise<string> => {
  try {
    const ai = getAIClient();
    const prompt = `Tôi có nội dung gốc này: "${originalText}".
    Nội dung này hơi ngắn để tạo ${targetCount} bức tranh riêng biệt.
    Hãy giúp tôi sáng tạo thêm các biến thể hoặc câu ý nghĩa tương tự, sâu sắc, dựa trên ý gốc này để có đủ tổng cộng ${targetCount} nội dung khác nhau.
    Yêu cầu:
    1. Giữ nguyên ý nghĩa cốt lõi nhưng diễn đạt phong phú, thấm thía.
    2. Ngăn cách mỗi nội dung bằng dấu phân cách chính xác là: "|||"
    3. KHÔNG đánh số.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { text: prompt }
    });

    return response.text?.trim() || originalText;
  } catch (error: any) {
    throw new Error("Lỗi khi mở rộng nội dung.");
  }
};

export const generateVisualMetaphors = async (textSegment: string, userSubject?: string, userTone?: string): Promise<VisualMeta> => {
  try {
    const ai = getAIClient();
    
    // Construct instructions based on user overrides
    let constraint = "";
    if (userSubject) constraint += `\n- ƯU TIÊN TUYỆT ĐỐI Chủ thể chính là: "${userSubject}". Hãy xây dựng bối cảnh xung quanh chủ thể này.`;
    if (userTone) constraint += `\n- ƯU TIÊN TUYỆT ĐỐI Tông màu & Cảm xúc là: "${userTone}".`;

    const prompt = `Phân tích sâu sắc đoạn nội dung triết lý sau: "${textSegment}".
    Hãy tưởng tượng ra một bức tranh nghệ thuật (thủy mặc/trừu tượng) dành cho NGƯỜI LỚN để minh họa cho triết lý này.
    ${constraint}
    
    Hãy sinh ra các mô tả hình ảnh:
    1. Chủ thể chính (Subject): Vật thể hoặc hình tượng trung tâm (Nếu đã có yêu cầu ở trên, hãy dùng nó).
    2. Bối cảnh (Context): Môi trường hoặc nền phù hợp với chủ thể.
    3. Tông màu & Cảm xúc (Tone): Màu sắc và không khí (Nếu đã có yêu cầu ở trên, hãy dùng nó).
    4. Biểu tượng (Symbol): Ý nghĩa ẩn dụ của hình ảnh đó.

    Trả về kết quả dưới dạng JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { text: prompt },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            context: { type: Type.STRING },
            tone: { type: Type.STRING },
            symbol: { type: Type.STRING },
          },
          required: ["subject", "context", "tone", "symbol"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as VisualMeta;
    }
    
    return {
      subject: userSubject || "Hình ảnh trừu tượng tối giản",
      context: "Không gian mờ ảo sương khói",
      tone: userTone || "Trầm lắng, đơn sắc",
      symbol: "Sự tĩnh lặng của tâm hồn"
    };

  } catch (error) {
    console.error("Metaphor Gen Error", error);
    return {
      subject: userSubject || "Cành trúc hoặc hoa sen tối giản",
      context: "Nền giấy cũ kỹ",
      tone: userTone || "Hoài cổ, suy tư",
      symbol: "Vẻ đẹp của sự giản đơn"
    };
  }
};

// Helper to extract image from response parts
const extractImageFromResponse = (response: any): string | null => {
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
}

export const generateArtImage = async (prompt: string, aspectRatio: AspectRatio): Promise<string> => {
  const ai = await getPaidAIClient(); 
  
  // Try with Gemini 3 Pro Image (Nano Banana Pro) first
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
           imageSize: '1K',
           aspectRatio: aspectRatio
        }
      }
    });

    const img = extractImageFromResponse(response);
    if (img) return img;
    throw new Error("No image data in Pro response");

  } catch (error: any) {
    console.warn("Nano Banana Pro failed, falling back to Flash...", error.message);
    
    // Fallback to Gemini 2.5 Flash Image (Nano Banana)
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: {
          imageConfig: {
             aspectRatio: aspectRatio 
             // Note: 2.5 flash image might not support 'imageSize' param, so we omit it
          }
        }
      });

      const img = extractImageFromResponse(response);
      if (img) return img;
      
    } catch (fallbackError: any) {
       console.error("Fallback failed", fallbackError);
    }
    
    // Throw original error if fallback also fails or isn't tried successfully
    if (error.message?.includes("Requested entity was not found") && (window as any).aistudio) {
        // This usually means API key issue or project not linked
    }
    throw new Error(error.message || "Lỗi khi tạo ảnh với cả 2 model.");
  }
};