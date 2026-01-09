import React, { useState, useRef, useEffect } from 'react';
import { extractTextFromImage, generateContentFromTopic, expandContent, generateVisualMetaphors, setApiKeyPool } from './services/geminiService';
import { ConfigSelector } from './components/ConfigSelector';
import { ResultSection } from './components/ResultSection';
import { SegmentEditor } from './components/SegmentEditor';
import KeyManager from './components/KeyManager';
import { TypographyStyle, BackgroundStyle, AspectRatio, InputMode, Platform, VisualMeta, ContentStyle, StoredAccount, AccountStatus } from './types';
import { ASPECT_RATIOS, TOPICS, BACKGROUND_DESCRIPTIONS } from './constants';
import { smartSplitText } from './utils/textProcessor';
import { Settings } from 'lucide-react';

const App: React.FC = () => {
  // --- STATE ---
  const [inputMode, setInputMode] = useState<InputMode>('text');
  
  // API Keys Management
  const [showKeyManager, setShowKeyManager] = useState(false);
  const [accounts, setAccounts] = useState<StoredAccount[]>(() => {
    try {
      const saved = localStorage.getItem('gemini_accounts');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // Sync accounts to Service & LocalStorage
  useEffect(() => {
    localStorage.setItem('gemini_accounts', JSON.stringify(accounts));
    setApiKeyPool(accounts);
  }, [accounts]);

  // Inputs
  const [textInput, setTextInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState(TOPICS[0]);
  const [customTopic, setCustomTopic] = useState('');
  const [contentStyle, setContentStyle] = useState<ContentStyle>('poetry');
  
  // Config
  const [count, setCount] = useState(3);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  
  // Styles
  const [typography, setTypography] = useState<TypographyStyle>('Thư pháp cổ điển');
  const [customTypography, setCustomTypography] = useState('');
  
  const [background, setBackground] = useState<BackgroundStyle>('Thủy mặc truyền thống');
  const [customBackground, setCustomBackground] = useState('');
  
  const [platform, setPlatform] = useState<Platform>('Midjourney');
  const [signature, setSignature] = useState('Minh Đỗ');
  
  // Visual Overrides
  const [userSubject, setUserSubject] = useState('');
  const [userTone, setUserTone] = useState('');

  const [isSmartSplit, setIsSmartSplit] = useState(true);

  // Workflow & Processing
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingPrompts, setIsGeneratingPrompts] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showShortWarning, setShowShortWarning] = useState(false);
  const [pendingContent, setPendingContent] = useState(''); 

  const [segments, setSegments] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [generatedPrompts, setGeneratedPrompts] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check valid keys for UI feedback
  const hasValidKeys = accounts.some(a => a.status === AccountStatus.GOOD);

  // --- HANDLERS ---

  const handleModeChange = (mode: InputMode) => {
    setInputMode(mode);
    setError(null);
    resetWorkflow();
  };

  const resetWorkflow = () => {
    setSegments([]);
    setShowPreview(false);
    setGeneratedPrompts([]);
    setShowShortWarning(false);
    setPendingContent('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError("Vui lòng chỉ upload file ảnh.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setError(null);
        resetWorkflow();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRandomTopic = () => {
    const available = TOPICS.filter(t => t !== 'Khác');
    const random = available[Math.floor(Math.random() * available.length)];
    setSelectedTopic(random);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- CORE LOGIC ---

  const buildPrompt = (content: string, meta: VisualMeta) => {
    const ratioConf = ASPECT_RATIOS.find(r => r.value === aspectRatio);
    const orientation = ratioConf ? ratioConf.textDesc : 'dọc';
    const signName = signature.trim() || "Minh Đỗ";

    // 1. Resolve Typography
    const finalTypography = typography === 'Khác' ? customTypography : typography;

    // 2. Resolve Background
    let bgName = '';
    let bgDescBlock = '';

    if (background === 'Khác') {
      bgName = customBackground;
      // No detailed description block for custom
    } else {
      bgName = background;
      const desc = BACKGROUND_DESCRIPTIONS[background];
      if (desc) {
        bgDescBlock = `<<MÔ TẢ CHI TIẾT NỀN & HÌNH>>
- ${background}: ${desc}`;
      }
    }

    // 3. Resolve Visuals (Subject, Tone) - Priority: User Input > AI Meta
    const finalSubject = userSubject.trim() ? userSubject : meta.subject;
    const finalTone = userTone.trim() ? userTone : meta.tone;
    // Context and Symbol always come from AI meta as they are generative fields
    const finalContext = meta.context; 
    const finalSymbol = meta.symbol;

    // 4. Construct Prompt
    return `[Tạo một bức tranh infographic định dạng ${orientation}, nghệ thuật cao cấp dành cho người lớn, không khí trầm lắng, sâu sắc, suy tư.

Kiểu chữ chính: ${finalTypography} – nét đẹp, đậm nhạt tự nhiên, bố trí chính giữa, chữ lớn nổi bật:
"${content}"

Phong cách nền và hình minh họa: ${bgName}
${bgDescBlock}

<<HÌNH MINH HỌA BIỂU TƯỢNG RIÊNG CHO NỘI DUNG>>
Chủ thể chính: ${finalSubject}
Bối cảnh: ${finalContext}
Tông màu & Cảm xúc: ${finalTone}
Biểu tượng: ${finalSymbol}

Bên trái dọc theo chiều đứng, ghi nhỏ: ${signName}

Kèm dấu triện mộc đỏ truyền thống nhỏ gần tên.

Toàn bộ tông màu ${finalTone || "đơn sắc hoặc gần đơn sắc"}, nghệ thuật cao, sâu lắng triết lý.

--ar ${aspectRatio} --stylize 700 --q 2
]`;
  };

  // Phase 1: Get Content
  const handleGenerateClick = async () => {
    setError(null);

    // STRICT API KEY CHECK
    const validAccounts = accounts.filter(a => a.status === AccountStatus.GOOD);
    if (validAccounts.length === 0) {
       setError("⚠️ Bạn chưa nhập API Key! Vui lòng thêm Key để sử dụng.");
       setShowKeyManager(true);
       return;
    }

    setGeneratedPrompts([]);
    resetWorkflow();
    
    let content = '';

    try {
      if (inputMode === 'text') {
        if (!textInput.trim()) { setError("Vui lòng nhập nội dung."); return; }
        content = textInput.trim();
      } else if (inputMode === 'image') {
        if (!selectedImage) { setError("Vui lòng chọn ảnh."); return; }
        setIsAnalyzing(true);
        setLoadingMessage('Đang phân tích ảnh...');
        try {
          content = await extractTextFromImage(selectedImage);
        } catch (e: any) {
          setError(e.message); setIsAnalyzing(false); return;
        }
        setIsAnalyzing(false);
      } else if (inputMode === 'idea') {
        const topic = selectedTopic === 'Khác' ? customTopic.trim() : selectedTopic;
        if (!topic) { setError("Vui lòng nhập chủ đề."); return; }
        setIsAnalyzing(true);
        setLoadingMessage(`Đang suy nghĩ ${count} ý tưởng theo phong cách ${contentStyle === 'poetry' ? 'Thơ' : 'Văn xuôi'}...`);
        try {
          content = await generateContentFromTopic(topic, count, contentStyle);
        } catch (e: any) {
          setError(e.message); setIsAnalyzing(false); return;
        }
        setIsAnalyzing(false);
      }

      // Check Content Length vs Requested Count
      if (isSmartSplit) {
         const rawSegments = smartSplitText(content, 999);
         if (rawSegments.length < count && inputMode !== 'idea') {
            setPendingContent(content);
            setShowShortWarning(true);
            setIsAnalyzing(false);
            return; 
         }
         
         proceedToSplit(content, count);
      } else {
         // Even if split is OFF, we treat it as 1 segment to run the analyzer
         proceedToSplit(content, 1);
      }
      
      setIsAnalyzing(false);

    } catch (err) {
      setError("Đã có lỗi xảy ra. " + (err instanceof Error ? err.message : ""));
      setIsAnalyzing(false);
    }
  };

  // Phase 2: Handle Warning Choice
  const handleExpandContent = async () => {
    setShowShortWarning(false);
    setIsAnalyzing(true);
    setLoadingMessage(`Đang sáng tạo thêm cho đủ ${count} biến thể...`);
    try {
       const expandedText = await expandContent(pendingContent, count);
       setIsAnalyzing(false);
       proceedToSplit(expandedText, count);
    } catch (e) {
       setError("Không thể mở rộng nội dung.");
       setIsAnalyzing(false);
    }
  };

  const handleReduceCount = () => {
    setShowShortWarning(false);
    proceedToSplit(pendingContent, count);
  };

  // Phase 3: Split & Preview
  const proceedToSplit = (content: string, targetCount: number) => {
    const splitSegments = smartSplitText(content, targetCount);
    // Force fill to match targetCount
    const finalSegments = [...splitSegments];
    while(finalSegments.length < targetCount) finalSegments.push("");
    
    setSegments(finalSegments.slice(0, targetCount));
    setShowPreview(true);
  };

  // Phase 4: Async Visual Analysis & Final Generation
  const executeFinalGeneration = async (confirmedSegments: string[]) => {
    setShowPreview(false);
    setIsGeneratingPrompts(true);
    setLoadingMessage("Đang phân tích ý nghĩa từng bức tranh...");
    
    try {
      const promptPromises = confirmedSegments.map(async (seg) => {
        // Only analyze if segment is not empty
        if (!seg.trim()) return buildPrompt("...", { subject: "Trừu tượng", context: "Mờ ảo", tone: "Tĩnh lặng", symbol: "Hư không" });
        
        // AI analyzes logic based on content + optional user overrides
        const visualMeta = await generateVisualMetaphors(seg, userSubject, userTone);
        return buildPrompt(seg, visualMeta);
      });

      const results = await Promise.all(promptPromises);
      setGeneratedPrompts(results);
    } catch (err) {
      setError("Lỗi khi phân tích hình ảnh. Vui lòng thử lại.");
    } finally {
      setIsGeneratingPrompts(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 flex flex-col items-center pb-20 relative">
      {/* Settings Button */}
      <button 
        onClick={() => setShowKeyManager(true)}
        className={`absolute top-4 right-4 md:top-8 md:right-8 p-3 bg-white/50 backdrop-blur hover:bg-white rounded-full shadow-sm border border-sepia/20 transition-all z-40 ${!hasValidKeys ? 'animate-bounce border-red-400 text-red-500 shadow-red-200' : 'text-sepia hover:text-ink'}`}
        title="Quản lý API Key"
      >
        <Settings size={24} />
        {!hasValidKeys && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>}
      </button>

      {/* Key Manager Modal */}
      {showKeyManager && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-lg h-[80vh] relative">
            <button 
              onClick={() => setShowKeyManager(false)}
              className="absolute -top-3 -right-3 z-50 bg-white text-ink p-2 rounded-full shadow-lg font-bold border border-sepia/20 hover:scale-110 transition-transform"
            >
              ✕
            </button>
            <KeyManager accounts={accounts} onUpdateAccounts={setAccounts} />
          </div>
        </div>
      )}

      <header className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-ink mb-2 tracking-wide">Thư Pháp AI</h1>
        <div className="h-1 w-24 bg-accent mx-auto mb-3 rounded-full"></div>
        <p className="text-sepia font-body italic">fb/dotanminh</p>
      </header>

      <main className="w-full max-w-3xl bg-paper shadow-xl border border-sepia/20 rounded-xl p-4 md:p-8 relative overflow-hidden">
        {/* Corners */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-sepia/30 rounded-tl-xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-sepia/30 rounded-br-xl pointer-events-none"></div>

        {/* Warning Modal */}
        {showShortWarning && (
           <div className="absolute inset-0 z-50 bg-paper/95 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
              <h3 className="text-xl font-bold text-ink mb-3">Nội dung hơi ngắn 🤔</h3>
              <p className="text-sepia mb-6 max-w-md">
                Bạn muốn tạo <strong>{count}</strong> bức tranh, nhưng nội dung hiện tại có vẻ chưa đủ để chia thành {count} ý riêng biệt đẹp mắt.
              </p>
              <div className="flex flex-col gap-3 w-full max-w-xs">
                <button onClick={handleExpandContent} className="w-full bg-ink text-white py-3 px-4 rounded-lg font-bold hover:bg-ink-light transition-colors">
                   ✨ Có, sáng tạo thêm biến thể
                </button>
                <button onClick={handleReduceCount} className="w-full bg-white border border-sepia text-sepia py-3 px-4 rounded-lg font-bold hover:bg-sepia hover:text-white transition-colors">
                   Không, giữ nguyên
                </button>
              </div>
           </div>
        )}

        {/* Tabs */}
        {!showPreview && !generatedPrompts.length && !isGeneratingPrompts && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
            {[
              { id: 'text', label: '1. Nhập nội dung của tôi' },
              { id: 'image', label: '2. Upload ảnh chứa chữ' },
              { id: 'idea', label: '3. Tôi bí ý tưởng quá, hihi' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleModeChange(tab.id as InputMode)}
                className={`py-3 px-2 rounded-lg font-bold font-serif transition-all duration-200 border-2 text-center text-sm md:text-base ${
                  inputMode === tab.id 
                    ? 'bg-ink text-white border-ink shadow-md transform -translate-y-0.5' 
                    : 'bg-white text-sepia border-sepia/20 hover:border-sepia/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Loading State for Prompt Generation */}
        {isGeneratingPrompts && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
             <div className="w-16 h-16 border-4 border-sepia/30 border-t-ink rounded-full animate-spin mb-6"></div>
             <h3 className="text-xl font-bold text-ink mb-2">{loadingMessage}</h3>
             <p className="text-sepia italic text-sm">Đang vẽ nên linh hồn cho từng bức tranh...</p>
          </div>
        )}

        {/* Inputs */}
        {!showPreview && !generatedPrompts.length && !isGeneratingPrompts && (
          <div className="animate-fade-in">
            <div className="mb-8 space-y-6">
              {inputMode === 'text' && (
                <div>
                  <label className="block text-ink font-serif font-bold mb-2">Nhập triết lý hoặc lời chúc của bạn</label>
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Ví dụ: Phúc như đông hải..."
                    className="w-full p-4 rounded-lg border-2 border-sepia/30 bg-white focus:border-ink outline-none min-h-[120px] font-body"
                  />
                </div>
              )}

              {inputMode === 'image' && (
                <div>
                  <label className="block text-ink font-serif font-bold mb-2">Upload ảnh chứa nội dung triết lý/lời chúc</label>
                  {!selectedImage ? (
                    <div className="border-2 border-dashed border-sepia/40 rounded-lg p-10 text-center hover:bg-paper-dark cursor-pointer group bg-white/60" onClick={() => fileInputRef.current?.click()}>
                      <span className="text-ink font-bold block">Chọn ảnh để tải lên</span>
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </div>
                  ) : (
                    <div className="relative rounded-lg overflow-hidden border-2 border-sepia/30 bg-black/5">
                       <img src={selectedImage} alt="Uploaded" className="max-h-64 w-full object-contain mx-auto" />
                       <button onClick={handleRemoveImage} className="absolute top-2 right-2 bg-white text-red-600 rounded-full p-2 shadow-md hover:scale-105">✕</button>
                    </div>
                  )}
                </div>
              )}

              {inputMode === 'idea' && (
                <div className="bg-paper-dark/30 p-6 rounded-lg border border-sepia/20">
                   {/* TOPIC SELECTOR */}
                   <div className="mb-5">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-ink font-serif font-bold uppercase tracking-wide text-sm">Chủ đề muốn viết</label>
                      </div>
                      <div className="flex gap-2">
                        <select
                          value={selectedTopic}
                          onChange={(e) => { setSelectedTopic(e.target.value); if(e.target.value !== 'Khác') setCustomTopic(''); }}
                          className="flex-1 bg-white border border-sepia/30 text-ink py-3 px-4 rounded-lg focus:border-ink cursor-pointer outline-none shadow-sm"
                        >
                          {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <button onClick={handleRandomTopic} className="bg-white hover:bg-gray-50 text-ink border border-sepia/30 px-4 rounded-lg font-bold shadow-sm transition-colors text-xl" title="Random Chủ Đề">
                           🎲
                        </button>
                      </div>
                      {selectedTopic === 'Khác' && (
                        <input type="text" value={customTopic} onChange={(e) => setCustomTopic(e.target.value)} placeholder="Nhập chủ đề..." className="w-full p-3 bg-white border border-sepia/30 rounded-lg focus:border-ink mt-2 outline-none" />
                      )}
                   </div>

                   {/* STYLE SELECTOR */}
                   <div className="mb-5">
                      <label className="text-ink font-serif font-bold uppercase tracking-wide text-sm mb-3 block">Phong cách nội dung</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          onClick={() => setContentStyle('prose')}
                          className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center transition-all duration-200 ${
                            contentStyle === 'prose' 
                              ? 'border-sepia bg-paper shadow-md scale-[1.02]' 
                              : 'border-sepia/20 bg-white/50 text-sepia hover:border-sepia/40'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                             <span className="text-xl">📝</span>
                             <span className="font-serif font-bold text-ink">Văn Xuôi</span>
                          </div>
                          <span className="text-xs text-sepia/80">(Lời hay ý đẹp, Tản văn)</span>
                        </button>

                        <button
                          onClick={() => setContentStyle('poetry')}
                          className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center transition-all duration-200 ${
                            contentStyle === 'poetry' 
                              ? 'border-ink bg-white shadow-md scale-[1.02] ring-1 ring-ink/10' 
                              : 'border-sepia/20 bg-white/50 text-sepia hover:border-sepia/40'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                             <span className="text-xl">📜</span>
                             <span className="font-serif font-bold text-ink">Thơ / Câu Đối</span>
                          </div>
                          <span className="text-xs text-sepia/80">(Lục bát, Vần điệu)</span>
                        </button>
                      </div>
                   </div>
                   
                   {/* COUNT */}
                   <div className="border-t border-sepia/10 pt-4 flex items-center justify-between">
                      <label className="text-ink font-serif font-bold text-sm uppercase tracking-wide">Số lượng tranh</label>
                      <div className="flex flex-col items-end">
                        <input 
                          type="number" 
                          min="1" 
                          max="5"
                          value={count}
                          onChange={(e) => {
                            const v = parseInt(e.target.value);
                            if(v >= 1 && v <= 5) setCount(v);
                          }}
                          className="w-20 p-2 text-center bg-white text-ink font-bold text-lg rounded-lg border border-sepia/30 focus:border-ink outline-none shadow-sm"
                        />
                      </div>
                   </div>
                </div>
              )}
            </div>

            <div className="border-t border-sepia/10 pt-8">
              <ConfigSelector 
                aspectRatio={aspectRatio} setAspectRatio={setAspectRatio}
                typography={typography} setTypography={setTypography}
                customTypography={customTypography} setCustomTypography={setCustomTypography}
                background={background} setBackground={setBackground}
                customBackground={customBackground} setCustomBackground={setCustomBackground}
                platform={platform} setPlatform={setPlatform}
                signature={signature} setSignature={setSignature}
                userSubject={userSubject} setUserSubject={setUserSubject}
                userTone={userTone} setUserTone={setUserTone}
                isSmartSplit={isSmartSplit} setIsSmartSplit={setIsSmartSplit}
                count={count} setCount={setCount}
              />

              {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm text-center">{error}</div>}

              <button
                onClick={handleGenerateClick}
                disabled={isAnalyzing}
                className="w-full md:w-auto px-12 py-4 bg-ink hover:bg-[#1a2530] text-white font-serif font-bold text-xl rounded-xl shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-70 flex items-center justify-center gap-2 mx-auto block"
              >
                {isAnalyzing ? <span className="animate-pulse">{loadingMessage || "Đang xử lý..."}</span> : "Generate Prompt(s)"}
              </button>
            </div>
          </div>
        )}

        {showPreview && !isGeneratingPrompts && (
          <SegmentEditor 
            segments={segments} setSegments={setSegments}
            onConfirm={() => executeFinalGeneration(segments)}
            onCancel={() => setShowPreview(false)}
          />
        )}

        {!showPreview && generatedPrompts.length > 0 && !isGeneratingPrompts && (
           <div className="w-full">
             <div className="flex justify-between items-center mb-4">
                <button onClick={resetWorkflow} className="text-sepia underline text-sm hover:text-ink">← Quay lại chỉnh sửa</button>
             </div>
             <ResultSection prompts={generatedPrompts} aspectRatio={aspectRatio} />
           </div>
        )}

      </main>
      <footer className="mt-10 text-center text-gray-400 text-sm pb-10">&copy; {new Date().getFullYear()} fb/dotanminh</footer>
    </div>
  );
};

export default App;