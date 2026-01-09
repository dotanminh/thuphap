import React, { useState } from 'react';
import { Key, Plus, RefreshCw, Trash2, ShieldCheck, Star, AlertCircle } from 'lucide-react';
import { StoredAccount, AccountStatus } from '../types';
import { smartExtractCredentials, validateApiKey } from '../services/geminiService';

interface KeyManagerProps {
  accounts: StoredAccount[];
  onUpdateAccounts: (accounts: StoredAccount[]) => void;
}

const KeyManager: React.FC<KeyManagerProps> = ({ accounts, onUpdateAccounts }) => {
  const [newKeysText, setNewKeysText] = useState('');
  const [selectedTier, setSelectedTier] = useState<'FREE' | 'ULTRA'>('FREE');
  const [isCheckingKeys, setIsCheckingKeys] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [report, setReport] = useState({ success: 0, failed: 0, show: false, lastError: '' });

  const handleAddKeys = async () => {
    if (!newKeysText.trim()) return;
    setIsCheckingKeys(true);
    setReport({ success: 0, failed: 0, show: false, lastError: '' });

    const lines = newKeysText.split(/[\n\r]+/);
    const newAccounts: StoredAccount[] = [];
    let added = 0;
    let failed = 0;
    let lastErrorMsg = '';

    const existingKeys = new Set(accounts.map(a => a.apiKey));

    for (const line of lines) {
        const key = smartExtractCredentials(line.trim());
        if (key && !existingKeys.has(key)) {
            const validation = await validateApiKey(key);
            if (validation.status === AccountStatus.GOOD) {
                newAccounts.push({
                    id: Math.random().toString(36).substr(2, 9),
                    email: `${selectedTier}_${key.slice(-4)}`,
                    apiKey: key,
                    isActive: true,
                    status: AccountStatus.GOOD,
                    tier: selectedTier,
                    lastActive: new Date().toISOString(),
                    avatarColor: selectedTier === 'ULTRA' ? '#fbbf24' : '#6366f1',
                    usage: { requestsToday: 0, maxDailyRequests: 1500, lastResetDate: new Date().toISOString().split('T')[0], totalErrors: 0 }
                });
                added++;
            } else {
                failed++;
                lastErrorMsg = validation.error || 'Lỗi không xác định';
            }
        } else if (line.trim()) {
            failed++;
            lastErrorMsg = 'Định dạng Key không hợp lệ (Không tìm thấy AIza...)';
        }
    }
    if (added > 0) onUpdateAccounts([...accounts, ...newAccounts]);
    setNewKeysText('');
    setReport({ success: added, failed, show: true, lastError: lastErrorMsg });
    setIsCheckingKeys(false);
  };

  return (
    <div className="h-full flex flex-col gap-6 overflow-hidden bg-slate-900/95 text-white p-6 rounded-3xl backdrop-blur-md">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg">
                    <Key className="text-white" size={24} />
                </div>
                <h2 className="text-xl font-bold text-white">Quản Lý Key API</h2>
            </div>
            <button onClick={() => setShowComparison(!showComparison)} className="text-[10px] font-bold text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-xl border border-indigo-500/20 uppercase tracking-widest hover:bg-indigo-500/20 transition-colors">
                CHỌN API KEY
            </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-1 space-y-6">
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-yellow-300 uppercase flex items-center gap-2"><Plus size={18} /> Thêm Key Mới</h3>
                    <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
                        <button onClick={() => setSelectedTier('FREE')} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${selectedTier === 'FREE' ? 'bg-indigo-600 text-white' : 'text-gray-500'}`}>FREE TIER</button>
                        <button onClick={() => setSelectedTier('ULTRA')} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${selectedTier === 'ULTRA' ? 'bg-yellow-600 text-white' : 'text-gray-500'}`}>ULTRA TIER</button>
                    </div>
                </div>
                <textarea value={newKeysText} onChange={(e) => setNewKeysText(e.target.value)} placeholder="Dán danh sách Key (mỗi dòng 1 key)..." className="w-full bg-black/30 border border-white/10 rounded-2xl p-4 text-sm text-white h-32 outline-none focus:border-yellow-500/50 resize-none font-mono" />
                
                {report.show && (
                    <div className="mt-3 bg-black/40 p-3 rounded-xl border border-white/5 text-xs">
                        <div className="flex gap-4 font-bold mb-1">
                            <span className="text-green-400">Thêm thành công: {report.success}</span>
                            <span className="text-red-400">Lỗi/Trùng/Chết: {report.failed}</span>
                        </div>
                        {report.failed > 0 && (
                            <div className="text-red-300 italic flex items-start gap-1 mt-1">
                                <AlertCircle size={12} className="mt-0.5 shrink-0" /> 
                                <span>Chi tiết lỗi cuối: {report.lastError}</span>
                            </div>
                        )}
                    </div>
                )}

                <button onClick={handleAddKeys} disabled={isCheckingKeys} className="w-full mt-3 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-50">
                    {isCheckingKeys ? <RefreshCw className="animate-spin" /> : <ShieldCheck />} XÁC THỰC & THÊM VÀO POOL
                </button>
            </div>

            <div className="grid gap-3">
                {accounts.length === 0 && (
                    <p className="text-center text-gray-500 text-sm italic py-4">Chưa có Key nào. Hãy thêm Key để bắt đầu.</p>
                )}
                {accounts.map(acc => (
                    <div key={acc.id} className={`flex items-center justify-between p-4 rounded-2xl border ${acc.tier === 'ULTRA' ? 'bg-yellow-900/10 border-yellow-500/30' : 'bg-white/5 border-white/10'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${acc.tier === 'ULTRA' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-indigo-500/20 text-indigo-500'}`}>
                                {acc.tier === 'ULTRA' ? <Star size={20} /> : <Key size={20} />}
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white font-mono">...{acc.apiKey?.slice(-8)}</div>
                                <div className={`text-[10px] font-bold uppercase ${acc.tier === 'ULTRA' ? 'text-yellow-400' : 'text-indigo-400'}`}>{acc.tier} ACCOUNT</div>
                            </div>
                        </div>
                        <button onClick={() => onUpdateAccounts(accounts.filter(a => a.id !== acc.id))} className="text-gray-500 hover:text-red-400 transition-colors p-2"><Trash2 size={18} /></button>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default KeyManager;