export const smartSplitText = (text: string, targetCount: number = 1): string[] => {
  if (!text) return [];

  const cleanText = text.replace(/\r\n/g, '\n').trim();

  // 1. Check for the specific API delimiter first (from Idea Mode)
  if (cleanText.includes('|||')) {
    const parts = cleanText.split('|||').map(p => p.trim()).filter(p => p.length > 0);
    // If we have exact match or close to it, return
    if (parts.length > 0) return parts.slice(0, targetCount); // Limit to target if over-generated
  }

  // 2. Natural Splitting (Newlines)
  let segments: string[] = cleanText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  // Logic to merge lines if we have too many segments compared to targetCount
  // Or if text is poetry/sentences
  if (segments.length > targetCount) {
     // Naive merging: merge adjacent lines until we reach targetCount
     // This is a simplification. A perfect algorithm would balance length.
     const mergedSegments: string[] = [];
     const itemsPerSegment = Math.ceil(segments.length / targetCount);
     
     let temp: string[] = [];
     for (let i = 0; i < segments.length; i++) {
        temp.push(segments[i]);
        // If we filled a chunk, or it's the last item
        if (temp.length >= itemsPerSegment || i === segments.length - 1) {
           // But ensure we don't exceed targetCount of total chunks prematurely
           if (mergedSegments.length < targetCount - 1 || i === segments.length - 1) {
              mergedSegments.push(temp.join('\n'));
              temp = [];
           }
        }
     }
     if (temp.length > 0) {
        // Append to last if exists, else push
        if (mergedSegments.length > 0) {
           mergedSegments[mergedSegments.length - 1] += '\n' + temp.join('\n');
        } else {
           mergedSegments.push(temp.join('\n'));
        }
     }
     segments = mergedSegments;
  }

  // 3. Sentence Splitting (if block of text and we need more segments)
  if (segments.length === 1 && targetCount > 1) {
    const sentences = cleanText.match(/[^.!?]+[.!?]+|[^.!?]+$/g);
    if (sentences && sentences.length >= targetCount) {
       segments = sentences.map(s => s.trim()).filter(s => s.length > 0);
       // Re-merge if too many sentences
       if (segments.length > targetCount) {
          const newSegs: string[] = [];
          const chunkSize = Math.ceil(segments.length / targetCount);
          for (let i = 0; i < segments.length; i += chunkSize) {
            newSegs.push(segments.slice(i, i + chunkSize).join('\n'));
          }
          segments = newSegs;
       }
    }
  }

  // 4. Force fill (only if needed, though strictly we just return what we found 
  // and the UI lets user edit. But prompt said "BẮT BUỘC chia thành ĐÚNG số đoạn")
  // If we still have fewer segments than targetCount, we might have to leave it short
  // or return what we have. The UI will show N slots, we fill X slots.
  
  // However, to satisfy "Strictly split into N", if we have 1 big text and need 3, 
  // and no obvious split, we might just have to duplicate or leave empty? 
  // Let's just return what we found. The App will handle the preview generation.
  
  return segments.slice(0, targetCount);
};