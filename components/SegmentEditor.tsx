import React from 'react';

interface SegmentEditorProps {
  segments: string[];
  setSegments: (segments: string[]) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export const SegmentEditor: React.FC<SegmentEditorProps> = ({ 
  segments, 
  setSegments, 
  onConfirm, 
  onCancel 
}) => {
  
  const handleSegmentChange = (index: number, value: string) => {
    const newSegments = [...segments];
    newSegments[index] = value;
    setSegments(newSegments);
  };

  const removeSegment = (index: number) => {
    const newSegments = segments.filter((_, i) => i !== index);
    setSegments(newSegments);
  };

  const addSegment = () => {
    setSegments([...segments, '']);
  };

  return (
    <div className="w-full max-w-2xl mt-4 animate-fade-in-up">
      <div className="bg-white border-2 border-sepia/30 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-serif font-bold text-ink mb-2">Xem trước & Chỉnh sửa đoạn</h3>
        <p className="text-sm text-sepia mb-6 italic">
           Kiểm tra các đoạn văn đã chia bên dưới. Bạn có thể chỉnh sửa nội dung hoặc gộp đoạn nếu muốn. Mỗi ô sẽ tạo ra một prompt riêng.
        </p>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {segments.map((seg, idx) => (
            <div key={idx} className="relative group">
               <span className="absolute -left-3 -top-3 bg-ink text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm z-10">
                 {idx + 1}
               </span>
               <textarea
                 value={seg}
                 onChange={(e) => handleSegmentChange(idx, e.target.value)}
                 className="w-full p-3 rounded border border-sepia/20 bg-paper-dark/30 focus:bg-white focus:border-ink focus:ring-1 focus:ring-ink outline-none transition-colors text-sm font-body min-h-[80px]"
                 placeholder={`Nội dung đoạn ${idx + 1}...`}
               />
               <button 
                 onClick={() => removeSegment(idx)}
                 className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-white/80 rounded"
                 title="Xóa đoạn này"
               >
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                 </svg>
               </button>
            </div>
          ))}
          
          <button 
            onClick={addSegment}
            className="w-full py-2 border-2 border-dashed border-sepia/30 text-sepia hover:text-ink hover:border-ink rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2"
          >
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
             </svg>
             Thêm đoạn mới
          </button>
        </div>

        <div className="flex gap-4 mt-8 pt-4 border-t border-sepia/10">
           <button 
             onClick={onCancel}
             className="flex-1 py-3 px-4 text-ink font-bold hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200"
           >
             Hủy bỏ
           </button>
           <button 
             onClick={onConfirm}
             className="flex-1 py-3 px-4 bg-ink text-white font-bold rounded-lg shadow-md hover:bg-[#1a2530] transition-transform transform hover:-translate-y-0.5"
           >
             Xác nhận chia đoạn & Tạo Prompt
           </button>
        </div>
      </div>
    </div>
  );
};