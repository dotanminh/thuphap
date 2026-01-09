import React, { useState } from 'react';
import { generateArtImage } from '../services/geminiService';
import { AspectRatio } from '../types';

interface ResultSectionProps {
  prompts: string[];
  aspectRatio: AspectRatio;
}

export const ResultSection: React.FC<ResultSectionProps> = ({ prompts, aspectRatio }) => {
  const [images, setImages] = useState<Record<number, string>>({});
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  if (!prompts || prompts.length === 0) return null;

  const handleGenerateImages = async () => {
    setIsGeneratingImages(true);
    setImageError(null);
    const newImages = { ...images };

    try {
      // Generate one by one to respect concurrency limits and show progress
      for (let i = 0; i < prompts.length; i++) {
        if (newImages[i]) continue; // Skip if already generated

        try {
          const base64Image = await generateArtImage(prompts[i], aspectRatio);
          newImages[i] = base64Image;
          setImages({ ...newImages }); // Update state incrementally
        } catch (err: any) {
          console.error(err);
          // If quota exceeded or error, stop and show message
          setImageError("Quota Nano Banana Pro tạm hết hoặc có lỗi, bạn copy prompt sang Gemini chat để tạo ảnh nhé!");
          break;
        }
      }
    } finally {
      setIsGeneratingImages(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mt-10 animate-fade-in-up">
       <div className="flex items-center justify-between mb-6">
         <h3 className="text-2xl font-serif font-bold text-ink">Kết quả Prompt ({prompts.length})</h3>
         <span className="text-sm text-sepia italic bg-paper-dark px-3 py-1 rounded-full">
            Đã tạo {prompts.length} prompt
         </span>
       </div>

       <div className="space-y-12">
         {prompts.map((prompt, index) => (
           <div key={index}>
             <SinglePrompt prompt={prompt} index={index} />
             
             {/* Image Display Area */}
             <div className="mt-4">
                {images[index] ? (
                  <div className="relative rounded-lg overflow-hidden border-2 border-ink shadow-lg animate-fade-in">
                    <div className="absolute top-2 left-2 bg-ink text-white text-xs font-bold px-2 py-1 rounded z-10 shadow">
                      Ảnh #{index + 1}
                    </div>
                    <img src={images[index]} alt={`Generated Art ${index + 1}`} className="w-full h-auto block" />
                    <a 
                      href={images[index]} 
                      download={`ThuPhapAI_${index + 1}.png`}
                      className="absolute bottom-2 right-2 bg-white text-ink hover:bg-sepia hover:text-white font-bold py-2 px-4 rounded shadow-lg transition-colors flex items-center gap-2 text-sm"
                    >
                      <span>⬇ Tải ảnh</span>
                    </a>
                  </div>
                ) : (
                  isGeneratingImages && !imageError && (
                    <div className="h-64 bg-black/5 rounded-lg border-2 border-dashed border-sepia/20 flex flex-col items-center justify-center animate-pulse">
                       <span className="text-3xl mb-2">🍌</span>
                       <p className="text-sepia font-serif italic">Đang vẽ tranh #{index + 1}...</p>
                    </div>
                  )
                )}
             </div>
           </div>
         ))}
       </div>

       {imageError && (
         <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg text-center font-body">
           {imageError}
         </div>
       )}

       <div className="mt-8 text-center">
         {!isGeneratingImages && Object.keys(images).length < prompts.length && (
           <button
             onClick={handleGenerateImages}
             className="bg-yellow-400 hover:bg-yellow-500 text-ink font-bold text-lg py-4 px-8 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 mx-auto"
           >
             <span className="text-2xl">🍌</span>
             Tạo ảnh ngay bằng Nano Banana Pro
           </button>
         )}
         
         {isGeneratingImages && (
            <div className="flex items-center justify-center gap-3 text-sepia font-bold">
               <div className="w-5 h-5 border-2 border-sepia border-t-transparent rounded-full animate-spin"></div>
               Đang tạo ảnh bằng Nano Banana Pro, chờ tí nha bro...
            </div>
         )}

         <p className="text-xs text-gray-500 mt-6 italic">
          Nếu nút trên không hoạt động, hãy Copy nội dung prompt và dán vào Midjourney hoặc Gemini Chat.
        </p>
       </div>
    </div>
  );
};

const SinglePrompt: React.FC<{ prompt: string, index: number }> = ({ prompt, index }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
       <div className="flex justify-between items-end mb-2 px-1">
         <label className="text-ink font-bold text-sm uppercase tracking-wider">Prompt #{index + 1}</label>
         {copied && <span className="text-green-600 text-xs font-bold italic animate-pulse">Đã sao chép!</span>}
       </div>
       
       <div className="relative">
        <textarea
          readOnly
          value={prompt}
          className="w-full h-40 p-4 bg-white border-2 border-sepia/30 rounded-lg shadow-inner font-mono text-xs text-gray-600 resize-none focus:outline-none transition-colors hover:border-sepia/50"
        />
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 bg-paper-dark hover:bg-ink hover:text-white text-ink text-xs font-bold py-1.5 px-3 rounded border border-sepia/30 transition-colors shadow-sm"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
};