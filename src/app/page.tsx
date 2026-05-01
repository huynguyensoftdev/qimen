"use client";

import { useState, useEffect } from "react";
import { TimeEngine, TimeContext } from "@/core/TimeEngine";
import { QimenEngine, QimenMethod, QimenJu, QimenPan } from "@/core/QimenEngine";
import { PatternEngine } from "@/core/PatternEngine";
import { PatternRule } from "@/data/PatternData";
import { PALACE_INFO, TIAN_GAN } from "@/core/QimenConstants";
import { DOOR_DETAILS, STAR_DETAILS, DEITY_DETAILS } from "@/data/InterpretationData";
import { Clock, Calendar as CalendarIcon, Moon, Sun, ArrowRight, Stars, MoveRight, X, Palette, BookOpen, LayoutGrid, Compass, User, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ThemeType = 'cyber' | 'zen' | 'light';
type TaskCategory = 'GENERAL' | 'WEALTH' | 'CAREER' | 'MARRIAGE' | 'HEALTH' | 'CONFLICT' | 'TRADING';

interface DirectionScore {
  index: number;
  score: number;
  label: string;
  reasons: string[];
}

const CATEGORY_LABELS: Record<TaskCategory, string> = {
  GENERAL: 'Tổng Quan',
  WEALTH: 'Cầu Tài Lộc',
  CAREER: 'Công Danh/Thi Cử',
  MARRIAGE: 'Hôn Nhân/Tình Cảm',
  HEALTH: 'Sức Khỏe/Cầu Y',
  CONFLICT: 'Tranh Chấp/Kiện Tụng',
  TRADING: 'Trading/Đầu Tư'
};

export default function Home() {
  const [dateStr, setDateStr] = useState<string>("");
  const [timeContext, setTimeContext] = useState<TimeContext | null>(null);
  const [method, setMethod] = useState<QimenMethod>(QimenMethod.CHAI_BU);
  const [qimenPan, setQimenPan] = useState<QimenPan | null>(null);
  const [patterns, setPatterns] = useState<Record<number, PatternRule[]>>({});
  const [selectedPalace, setSelectedPalace] = useState<number | null>(null);
  const [theme, setTheme] = useState<ThemeType>('zen'); 
  const [birthGan, setBirthGan] = useState<string>("Giáp");
  const [directionScores, setDirectionScores] = useState<DirectionScore[]>([]);
  const [activeCategory, setActiveCategory] = useState<TaskCategory>('GENERAL');

  useEffect(() => {
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000;
    const localISOTime = new Date(now.getTime() - tzOffset).toISOString().slice(0, 16);
    setDateStr(localISOTime);
    calculate(new Date(localISOTime), method);
  }, []);

  const calculateScores = (pan: QimenPan, currentPatterns: Record<number, PatternRule[]>, category: TaskCategory) => {
    const scores: DirectionScore[] = [];
    for (let i = 1; i <= 9; i++) {
      if (i === 5) continue;
      const p = pan.palaces[i];
      const pts = currentPatterns[i] || [];
      let score = 0;
      const reasons: string[] = [];

      // --- TRỌNG SỐ THEO VIỆC (TASK WEIGHTS) ---
      
      // Door weights
      const doorMap: Record<string, number> = {
        'Sinh': category === 'WEALTH' || category === 'TRADING' ? 6 : category === 'GENERAL' ? 3 : 2,
        'Khai': category === 'CAREER' || category === 'TRADING' ? 6 : category === 'GENERAL' ? 3 : 2,
        'Hưu': category === 'MARRIAGE' ? 6 : category === 'HEALTH' ? 5 : 3,
        'Cảnh': category === 'CAREER' || category === 'TRADING' ? 4 : 1,
        'Thương': category === 'CONFLICT' ? 5 : -3,
        'Kinh': category === 'CONFLICT' ? 4 : -3,
        'Tử': -10,
        'Đỗ': category === 'TRADING' ? -2 : 0 // Trading kỵ bế tắc/sideways
      };
      
      const dScore = doorMap[p.renPan] || 0;
      if (dScore !== 0) {
        score += dScore;
        reasons.push(`${p.renPan} Môn (${dScore > 0 ? '+' : ''}${dScore})`);
      }

      // Star weights
      const starMap: Record<string, number> = {
        'Thiên Tâm': category === 'HEALTH' ? 6 : category === 'CAREER' ? 4 : 2,
        'Thiên Phụ': category === 'CAREER' ? 5 : 2,
        'Thiên Nhậm': category === 'WEALTH' || category === 'TRADING' ? 5 : 2,
        'Thiên Xung': category === 'CONFLICT' || category === 'TRADING' ? 5 : 2, // Trading cần sự quyết đoán/xung lực
        'Thiên Nhuế': category === 'HEALTH' ? -5 : -2
      };
      const sScore = starMap[p.tianPan] || 0;
      if (sScore !== 0) {
        score += sScore;
        reasons.push(`${p.tianPan} Tinh (${sScore > 0 ? '+' : ''}${sScore})`);
      }

      // Deity weights
      const deityMap: Record<string, number> = {
        'Trực Phù': 4,
        'Lục Hợp': category === 'MARRIAGE' || category === 'TRADING' ? 6 : 3,
        'Cửu Thiên': category === 'TRADING' ? 5 : 3, // Giá tăng/uptrend
        'Cửu Địa': category === 'TRADING' ? 4 : 2, // Giá thấp/long term
        'Bạch Hổ': category === 'CONFLICT' ? 4 : category === 'TRADING' ? 2 : -4, // Trading chấp nhận volatility
        'Huyền Vũ': category === 'TRADING' ? -8 : -4 // Kỵ lừa đảo/scam
      };
      const deScore = deityMap[p.shenPan] || 0;
      if (deScore !== 0) {
        score += deScore;
        reasons.push(`${p.shenPan} Thần (${deScore > 0 ? '+' : ''}${deScore})`);
      }

      // Patterns
      pts.forEach(pt => {
        let pWeight = pt.severity === 'AUSPICIOUS' ? 5 : pt.severity === 'OMINOUS' ? -5 : 0;
        // Boost relevant patterns
        if ((category === 'WEALTH' || category === 'TRADING') && pt.id === 'thanh_long_phan_thu') pWeight += 5;
        if (category === 'TRADING' && pt.id === 'phi_dieu_diet_huyet') pWeight += 5;
        if (category === 'TRADING' && pt.id === 'phuc_ngam') pWeight -= 3; // Sideways
        
        score += pWeight;
        if (pWeight !== 0) reasons.push(`${pt.name} (${pWeight > 0 ? '+' : ''}${pWeight})`);
      });

      scores.push({ index: i, score, label: PALACE_INFO[i].direction, reasons });
    }
    setDirectionScores(scores.sort((a, b) => b.score - a.score));
  };

  const calculate = (d: Date, mMethod: QimenMethod, category: TaskCategory = activeCategory) => {
    try {
      const ctx = TimeEngine.calculateTimeContext(d);
      setTimeContext(ctx);
      const pan = QimenEngine.calculatePan(mMethod, ctx);
      setQimenPan(pan);
      if (pan) {
        const analyzedPatterns = PatternEngine.analyzePan(pan);
        setPatterns(analyzedPatterns);
        calculateScores(pan, analyzedPatterns, category);
      } else {
        setPatterns({});
        setDirectionScores([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCategoryChange = (cat: TaskCategory) => {
    setActiveCategory(cat);
    if (dateStr) calculate(new Date(dateStr), method, cat);
  };

  const adjustTime = (hours: number) => {
    const current = new Date(dateStr);
    const updated = new Date(current.getTime() + hours * 60 * 60 * 1000);
    const tzOffset = updated.getTimezoneOffset() * 60000;
    const localISOTime = new Date(updated.getTime() - tzOffset).toISOString().slice(0, 16);
    setDateStr(localISOTime);
    calculate(updated, method);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateStr(e.target.value);
    if (e.target.value) {
      calculate(new Date(e.target.value), method);
    }
  };

  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMethod = e.target.value as QimenMethod;
    setMethod(newMethod);
    if (dateStr) {
      calculate(new Date(dateStr), newMethod);
    }
  };

  if (!timeContext) return <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">Loading...</div>;

  return (
    <main className={`min-h-screen bg-background text-foreground font-sans selection:bg-accent-p/30 overflow-hidden flex flex-col lg:flex-row relative transition-colors duration-500 theme-${theme}`}>
      {/* Background Deep Glow - DYNAMIC */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[150px] transition-opacity duration-700 ${theme === 'light' ? 'opacity-0' : 'opacity-100'} ${theme === 'cyber' ? 'bg-purple-900/10' : 'bg-saffron/10'}`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[150px] transition-opacity duration-700 ${theme === 'light' ? 'opacity-0' : 'opacity-100'} ${theme === 'cyber' ? 'bg-blue-900/10' : 'bg-orange-900/10'}`} />
        <div className={`absolute top-[40%] left-[80%] w-[30%] h-[30%] rounded-full blur-[150px] transition-opacity duration-700 ${theme === 'light' ? 'opacity-0' : 'opacity-100'} ${theme === 'cyber' ? 'bg-emerald-900/10' : 'bg-red-900/10'}`} />
        
        {/* Lưới tọa độ chìm (Spiritual/Mandala or Cyber) */}
        <div className={`absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjUwLDIwNCw0OCwwLjA1KSIvPjwvc3ZnPg==')] ${theme === 'light' ? 'opacity-10' : 'opacity-30'}`}></div>
      </div>

      {/* --- CỘT 1: SIDEBAR ĐIỀU KHIỂN (Fixed width) --- */}
      <div className="lg:w-[320px] w-full shrink-0 flex flex-col h-full lg:h-screen overflow-y-auto border-r border-border-v bg-background/40 backdrop-blur-3xl z-20 shadow-2xl sidebar-hide-scrollbar">
        <div className="p-6 flex flex-col gap-6">
          <header className="flex justify-between items-start">
            <div className="group">
              <div className="inline-flex items-center gap-2 mb-1">
                <Stars className={`w-4 h-4 animate-pulse ${theme === 'cyber' ? 'text-accent-p' : 'text-gold'}`} />
                <span className="text-[10px] font-bold tracking-[0.2em] text-accent-t uppercase">Qimen OS</span>
              </div>
              <h1 className="text-2xl font-serif tracking-tight font-bold bg-gradient-to-r from-foreground to-accent-t bg-clip-text text-transparent">
                Kỳ Môn Độn Giáp
              </h1>
            </div>
            <div className="flex gap-2">

              <button 
                onClick={() => setTheme(prev => prev === 'cyber' ? 'zen' : prev === 'zen' ? 'light' : 'cyber')}
                className="p-2 rounded-full bg-accent-t/5 border border-border-v hover:bg-white/10 transition-all group relative"
                title="Đổi giao diện"
              >
                <Palette className="w-4 h-4 text-accent-s group-hover:scale-110 transition-transform" />
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] uppercase font-bold text-accent-t opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {theme === 'cyber' ? 'Huyền Bí' : theme === 'zen' ? 'Thiền' : 'Cổ Điển'}
                </span>
              </button>
            </div>
          </header>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-accent-t uppercase tracking-widest flex items-center gap-2 mb-2">
                <Clock className="w-3 h-3" /> Thời Gian
              </label>
              <input
                type="datetime-local"
                value={dateStr}
                onChange={handleDateChange}
                className="w-full bg-accent-p/5 border border-border-v rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent-p/50 transition-all font-mono"
              />
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button onClick={() => adjustTime(-2)} className="px-2 py-1.5 bg-accent-t/5 border border-border-v rounded-lg text-[9px] uppercase font-bold text-accent-t hover:bg-white/10 transition-colors">
                  -1 Canh
                </button>
                <button onClick={() => adjustTime(2)} className="px-2 py-1.5 bg-accent-t/5 border border-border-v rounded-lg text-[9px] uppercase font-bold text-accent-t hover:bg-white/10 transition-colors">
                  +1 Canh
                </button>
              </div>
            </div>
            
            <div className="p-3 rounded-xl bg-accent-p/5 border border-border-v flex items-center justify-between">
               <span className="text-[10px] font-bold text-accent-t uppercase tracking-widest flex items-center gap-2">
                <Moon className="w-3 h-3" /> Lịch Âm
               </span>
               <span className="text-xs font-mono text-foreground">
                  {timeContext.lunarDate.day}/{timeContext.lunarDate.month}/{timeContext.lunarDate.year}
               </span>
            </div>

            <div>
              <h2 className="text-[10px] font-bold text-accent-t uppercase tracking-widest flex items-center gap-2 mb-3">
                <Sun className="w-3 h-3" /> Bát Tự
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Giờ", data: timeContext.bazi.hour },
                  { label: "Ngày", data: timeContext.bazi.day },
                  { label: "Tháng", data: timeContext.bazi.month },
                  { label: "Năm", data: timeContext.bazi.year }
                ].map((pillar, i) => (
                  <div key={i} className="bg-accent-p/5 border border-border-v rounded-xl p-2.5 flex flex-col items-center">
                    <span className="text-[8px] text-accent-t uppercase mb-1">{pillar.label}</span>
                    <div className="flex gap-1.5 font-serif font-bold">
                      <span className="text-base text-foreground">{pillar.data.gan}</span>
                      <span className="text-base text-accent-t">{pillar.data.zhi}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-accent-p/20 to-accent-s/10 border border-accent-p/30 rounded-xl p-3 flex justify-between items-center group">
               <span className="text-[10px] text-accent-p uppercase tracking-wider font-bold">Tuần Thủ</span>
               <span className={`text-lg font-bold font-serif transition-colors ${theme === 'cyber' ? 'text-accent-p' : 'text-gold'}`}>{timeContext.xunShou}</span>
            </div>

            <div>
              <label className="text-[10px] font-bold text-accent-t uppercase tracking-widest flex items-center gap-2 mb-2">
                <LayoutGrid className="w-3 h-3" /> Lập Cục
              </label>
              <select
                value={method}
                onChange={handleMethodChange}
                className="w-full bg-accent-p/5 border border-border-v rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent-p/50 transition-all font-mono cursor-pointer"
              >
                <option value={QimenMethod.CHAI_BU} className="bg-neutral-900 text-white">Sái Bổ (Chai Bu)</option>
                <option value={QimenMethod.ZHI_RUN} className="bg-neutral-900 text-white">Nhuận Kỳ (Zhi Run)</option>
                <option value={QimenMethod.PHI_CUNG} className="bg-neutral-900 text-white">Phi Cung (Luo Shu Flight)</option>
              </select>
            </div>

            <div className="pt-4 border-t border-border-v">
              <label className="text-[10px] font-bold text-accent-t uppercase tracking-widest flex items-center gap-2 mb-3">
                <User className="w-3 h-3" /> Mệnh Chủ (Can Năm Sinh)
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {TIAN_GAN.map((gan) => (
                  <button
                    key={gan}
                    onClick={() => setBirthGan(gan)}
                    className={`py-1.5 text-[10px] rounded-lg border transition-all ${
                      birthGan === gan 
                        ? 'bg-accent-p/20 border-accent-p text-accent-p font-bold shadow-[0_0_10px_rgba(168,85,247,0.2)]' 
                        : 'bg-accent-t/5 border-border-v text-accent-t hover:border-white/20'
                    }`}
                  >
                    {gan}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* --- CỘT 2: TRUNG TÂM (Lạc Thư Grid) --- */}
      <div className="flex-1 flex flex-col h-full lg:h-screen relative z-10 overflow-y-auto">
        {qimenPan && (
          <div className="p-4 md:p-8 flex flex-col items-center">
            <div className="w-full max-w-2xl flex flex-col gap-4 mb-6">
               <div className="flex justify-between items-end">
                  <div>
                      <div className="text-[10px] font-bold tracking-widest text-accent-t uppercase mb-1">Thiết Lập</div>
                      <h2 className="text-2xl md:text-4xl font-bold font-serif text-foreground">
                        {qimenPan.ju.type === 'YANG' ? 'DƯƠNG ĐỘN' : 'ÂM ĐỘN'} {qimenPan.ju.number}
                      </h2>
                  </div>
                  <div className="flex gap-4 bg-black/40 border border-border-v rounded-xl p-3 backdrop-blur-md">
                    <div className="text-center">
                      <div className="text-[8px] text-accent-t uppercase mb-1">Trực Phù</div>
                      <div className="text-sm font-bold font-serif text-accent-s">{qimenPan.zhiFu}</div>
                    </div>
                    <div className="w-[1px] bg-white/10 h-6 my-auto"></div>
                    <div className="text-center">
                      <div className="text-[8px] text-accent-t uppercase mb-1">Trực Sử</div>
                      <div className="text-sm font-bold font-serif text-emerald-400">{qimenPan.zhiShi}</div>
                    </div>
                  </div>
               </div>
            </div>

            <motion.div 
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               className="grid grid-cols-3 gap-2 md:gap-4 w-full max-w-2xl aspect-square relative"
            >
              <AnimatePresence mode="popLayout">
              {[4, 9, 2, 3, 5, 7, 8, 1, 6].map((palaceIndex) => {
                const p = qimenPan.palaces[palaceIndex];
                const pPatterns = patterns[palaceIndex] || [];
                const isCenter = palaceIndex === 5;
                const isSelected = selectedPalace === palaceIndex;
                const isVoid = qimenPan.voidPalaces.includes(palaceIndex);
                const isHorse = qimenPan.horsePalace === palaceIndex;
                
                // Mệnh Cung: Thiên Can năm sinh nằm ở Địa bàn
                const isLifePalace = p.diPan === birthGan;

                // Kiểm tra Tam Thắng & Ngũ Bất
                const isVictory = pPatterns.some(pt => pt.isVictory);
                const isForbidden = pPatterns.some(pt => pt.isForbidden);
                
                return (
                  <motion.div 
                    layout
                    key={`${palaceIndex}-${dateStr}-${birthGan}`} 
                    onClick={() => setSelectedPalace(palaceIndex)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`relative w-full h-full cursor-pointer transition-all duration-300
                      ${isCenter ? 'bg-gradient-to-br from-accent-p/20 to-accent-s/10' : 'bg-white/[0.03]'} 
                      border ${isSelected ? 'border-accent-s ring-1 ring-accent-s/50 shadow-[0_0_20px_rgba(251,191,36,0.15)] z-10' : 
                               isLifePalace ? 'border-accent-p ring-1 ring-accent-p/30 bg-accent-p/5' :
                               isVictory ? 'border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.1)]' :
                               isForbidden ? 'border-rose-500/30 opacity-60 bg-rose-500/5' :
                               isVoid ? 'border-border-v opacity-40' : 'border-border-v shadow-lg'} 
                      rounded-xl md:rounded-2xl flex flex-col items-center justify-center backdrop-blur-md p-2`}
                  >
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 flex-wrap max-w-[80%]">
                       <span className="text-[8px] font-bold text-accent-t font-mono">{palaceIndex}</span>
                       {isVoid && <span className="text-[7px] bg-neutral-800 text-neutral-400 px-1 py-0.5 rounded uppercase font-bold tracking-tighter">Trống</span>}
                       {isHorse && <span className="text-[7px] bg-amber-500/20 text-amber-500 border border-amber-500/10 px-1 py-0.5 rounded uppercase font-bold tracking-tighter">Mã</span>}
                       {isLifePalace && <span className="text-[7px] bg-accent-p/20 text-accent-p border border-accent-p/10 px-1 py-0.5 rounded uppercase font-bold tracking-tighter">Mệnh</span>}
                       {isVictory && <span className="text-[7px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/10 px-1 py-0.5 rounded uppercase font-bold tracking-tighter">Thắng</span>}
                       {isForbidden && <span className="text-[7px] bg-rose-500/20 text-rose-400 border border-rose-500/10 px-1 py-0.5 rounded uppercase font-bold tracking-tighter">Kỵ</span>}
                    </div>

                    <div className="absolute top-8 left-2 flex flex-col gap-1">
                      {pPatterns.slice(0, 2).map(pattern => (
                        <div key={pattern.id} className={`px-1 py-0.5 rounded text-[7px] uppercase font-bold ${pattern.severity === 'AUSPICIOUS' ? 'text-emerald-400' : pattern.severity === 'OMINOUS' ? 'text-red-400' : 'text-neutral-400'}`}>{pattern.name}</div>
                      ))}
                    </div>

                    <div className={`absolute top-2 right-2 text-[8px] font-bold uppercase ${theme === 'light' ? 'text-rose-700' : 'text-rose-400/80'}`}>{p.shenPan}</div>
                    <div className={`absolute top-6 right-2 text-[8px] font-bold uppercase ${theme === 'light' ? 'text-blue-700' : 'text-blue-300/80'}`}>{p.tianPan}</div>
                    <div className={`absolute bottom-2 left-2 text-[9px] font-bold ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-400'}`}>{p.renPan}</div>
                    <div className="absolute bottom-2 right-2 text-xs text-accent-t opacity-60">{PALACE_INFO[palaceIndex].symbol}</div>

                    <div className="flex flex-col items-center justify-center">
                       {isCenter ? (
                         <div className="text-center">
                            <div className="text-[10px] font-bold text-accent-p uppercase mb-1">Trình Cục</div>
                            <div className="text-xl md:text-2xl font-bold font-serif text-foreground">
                               {qimenPan.ju.type === 'YANG' ? 'Dương' : 'Âm'} {qimenPan.ju.value} Cục
                            </div>
                         </div>
                       ) : (
                         <>
                            <span className="text-2xl md:text-4xl font-bold font-serif text-foreground">{p.tianGan}</span>
                            <span className="text-lg md:text-2xl font-bold font-serif text-accent-t drop-shadow-md">{p.diPan}</span>
                         </>
                       )}
                    </div>
                  </motion.div>
                );
              })}
              </AnimatePresence>
            </motion.div>
          </div>
        )}

      </div>

      {/* --- CỘT 3: CHI TIẾT PHÂN TÍCH (Seamless Right Sidebar) --- */}
      <div className="lg:w-[400px] w-full shrink-0 border-l border-border-v bg-background/20 backdrop-blur-2xl z-20 flex flex-col h-full lg:h-screen overflow-y-auto">
        <AnimatePresence mode="wait">
          {selectedPalace && qimenPan && qimenPan.palaces[selectedPalace] ? (
            <motion.div 
              key={selectedPalace}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 pb-20"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-accent-p uppercase block mb-1">Chi Tiết Không Gian</span>
                  <h3 className="text-3xl font-serif font-bold text-foreground">Cung {selectedPalace} ({PALACE_INFO[selectedPalace].symbol} {PALACE_INFO[selectedPalace].bagua})</h3>
                </div>
                <button onClick={() => setSelectedPalace(null)} className="p-1.5 hover:bg-accent-t/5 rounded-full transition-colors text-accent-t">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-6 text-[9px] font-bold">
                 {selectedPalace === 5 && <span className="bg-accent-p/10 border border-accent-p/20 text-accent-p px-2 py-1 rounded-lg uppercase">Trung Cung</span>}
                 {qimenPan.voidPalaces.includes(selectedPalace) && <span className="bg-neutral-800 text-neutral-400 px-2 py-1 rounded-lg uppercase">Tuần Không (Vô Lực)</span>}
                 {qimenPan.horsePalace === selectedPalace && <span className="bg-amber-500/10 border border-amber-500/20 text-amber-500 px-2 py-1 rounded-lg uppercase">Dịch Mã (Động)</span>}
                 <span className="bg-accent-t/5 border border-border-v text-accent-t px-2 py-1 rounded-lg uppercase">{PALACE_INFO[selectedPalace].direction} | {PALACE_INFO[selectedPalace].element}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-8">
                 {[
                   { label: 'Thiên (Tinh)', val: qimenPan.palaces[selectedPalace].tianPan, gan: qimenPan.palaces[selectedPalace].tianGan, color: 'text-blue-300', bg: 'bg-blue-400/5' },
                   { label: 'Địa (Can)', val: '-', gan: qimenPan.palaces[selectedPalace].diPan, color: 'text-accent-t', bg: 'bg-accent-p/5' },
                   { label: 'Nhân (Môn)', val: qimenPan.palaces[selectedPalace].renPan, gan: '', color: 'text-emerald-400', bg: 'bg-emerald-400/5' },
                   { label: 'Thần', val: qimenPan.palaces[selectedPalace].shenPan, gan: '', color: 'text-rose-400', bg: 'bg-rose-400/5' }
                 ].map((box, i) => (
                   <div key={i} className={`${box.bg} border border-border-v rounded-2xl p-4 text-center group transition-transform hover:scale-[1.02]`}>
                      <span className="text-[8px] font-bold text-accent-t uppercase block mb-2">{box.label}</span>
                      {box.gan && <div className="text-2xl font-serif font-bold text-foreground mb-1">{box.gan}</div>}
                      <div className={`text-[10px] font-bold font-serif ${box.color}`}>{box.val}</div>
                   </div>
                 ))}
              </div>

              {/* Luận giải Chi Tiết */}
              <div className="space-y-4">
                 <h4 className="text-[10px] font-bold text-accent-t uppercase tracking-widest border-b border-border-v pb-2 flex items-center gap-2">
                   <BookOpen className="w-3 h-3" /> Luận Giải Chi Tiết
                 </h4>
                 {[
                   { type: 'Môn', info: DOOR_DETAILS[qimenPan.palaces[selectedPalace].renPan] },
                   { type: 'Sao', info: STAR_DETAILS[qimenPan.palaces[selectedPalace].tianPan] },
                   { type: 'Thần', info: DEITY_DETAILS[qimenPan.palaces[selectedPalace].shenPan] }
                 ].map((item, idx) => item.info && (
                   <div key={idx} className="bg-accent-t/5 border border-border-v rounded-xl p-4 space-y-2">
                     <div className="flex justify-between items-center">
                       <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${item.info.nature === 'Cát' ? 'bg-emerald-500/20 text-emerald-400' : item.info.nature === 'Hung' ? 'bg-red-500/20 text-red-400' : 'bg-neutral-500/20 text-neutral-400'}`}>{item.info.nature}</span>
                       <span className="text-sm font-bold font-serif">{item.info.name}</span>
                     </div>
                     <p className="text-[11px] text-neutral-400 italic">"{item.info.description}"</p>
                     <div className="text-[11px] text-foreground/80 pt-2 border-t border-border-v">
                        <span className="text-[8px] font-bold text-accent-p uppercase block mb-0.5">Lời khuyên:</span>
                        {item.info.advice}
                     </div>
                   </div>
                 ))}

                 {/* Cách cục */}
                 {patterns[selectedPalace] && patterns[selectedPalace].length > 0 && (
                   <div className="space-y-3 pt-4">
                      <h4 className="text-[10px] font-bold text-accent-t uppercase tracking-widest border-b border-border-v pb-2">Cách Cục</h4>
                      {patterns[selectedPalace].map(pt => (
                        <div key={pt.id} className="bg-accent-p/5 border border-accent-p/10 rounded-xl p-3">
                           <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-serif font-bold text-foreground">{pt.name}</span>
                              <span className={`text-[8px] font-bold ${pt.severity === 'AUSPICIOUS' ? 'text-emerald-400' : 'text-red-400'}`}>{pt.severity === 'AUSPICIOUS' ? 'Cát' : 'Hung'}</span>
                           </div>
                           <p className="text-[10px] text-neutral-400 leading-relaxed">{pt.description}</p>
                        </div>
                      ))}
                   </div>
                 )}
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col p-6 overflow-y-auto sidebar-hide-scrollbar">
               {activeCategory === 'TRADING' && (
                 <motion.div 
                   initial={{ opacity: 0, y: -10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="mb-6 p-4 rounded-2xl bg-accent-s/10 border border-accent-s/20"
                 >
                    <div className="flex items-center gap-2 mb-2">
                       <Trophy className="w-4 h-4 text-accent-s" />
                       <h4 className="text-[9px] font-bold uppercase text-accent-s tracking-widest">Trading Insight</h4>
                    </div>
                    <p className="text-[10px] text-foreground leading-relaxed">
                      Ưu tiên Entry tại các hướng <b className="text-foreground">Khai/Sinh Môn</b>. Cảnh giác <b className="text-rose-400">Huyền Vũ</b> (Lừa đảo/Scam).
                    </p>
                 </motion.div>
               )}
               <div className="flex items-center gap-2 mb-4">
                  <Compass className="w-5 h-5 text-accent-s" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Gợi ý Chọn Hướng</h3>
               </div>

               {/* CATEGORY SELECTOR */}
               <div className="flex flex-wrap gap-2 mb-6">
                 {(Object.keys(CATEGORY_LABELS) as TaskCategory[]).map((cat) => (
                   <button
                     key={cat}
                     onClick={() => handleCategoryChange(cat)}
                     className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase border transition-all ${
                       activeCategory === cat
                         ? 'bg-accent-s/20 border-accent-s text-accent-s'
                         : 'bg-accent-t/5 border-border-v text-accent-t hover:border-white/20'
                     }`}
                   >
                     {CATEGORY_LABELS[cat]}
                   </button>
                 ))}
               </div>
               
               <div className="space-y-4">
                  {directionScores.slice(0, 3).map((dir, idx) => (
                    <motion.div 
                      key={dir.index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => setSelectedPalace(dir.index)}
                      className="bg-accent-t/5 border border-border-v rounded-2xl p-4 cursor-pointer hover:bg-white/10 transition-all group"
                    >
                      <div className="flex justify-between items-start mb-3">
                         <div>
                            <div className="text-[8px] font-bold text-accent-t uppercase mb-1">Hạng {idx + 1} - Cung {dir.index}</div>
                            <div className="text-xl font-serif font-bold text-foreground">{dir.label}</div>
                         </div>
                         <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-lg">
                            <Trophy className="w-3 h-3" />
                            <span className="text-xs font-mono font-bold">+{dir.score}</span>
                         </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                         {dir.reasons.slice(0, 3).map((r, i) => (
                           <span key={i} className="text-[9px] bg-black/30 text-accent-t px-2 py-1 rounded-md border border-border-v">{r}</span>
                         ))}
                      </div>
                    </motion.div>
                  ))}
               </div>

               <div className="mt-8 p-4 bg-accent-p/5 border border-accent-p/10 rounded-2xl">
                  <div className="flex items-center gap-2 mb-3">
                     <Stars className="w-4 h-4 text-accent-p" />
                     <h4 className="text-[10px] font-bold uppercase text-accent-p tracking-widest">Ghi chú Mệnh Chủ</h4>
                  </div>
                  <p className={`text-xs leading-relaxed ${theme === 'light' ? 'text-foreground font-medium' : 'text-neutral-400 italic'}`}>
                    "Mệnh chủ Can <span className="text-accent-p font-bold">{birthGan}</span> đang ngụ tại <span className="text-foreground font-bold">Cung {QimenEngine.findStemPalace(qimenPan, birthGan, 'DI')}</span> ({PALACE_INFO[QimenEngine.findStemPalace(qimenPan, birthGan, 'DI') || 1].bagua}). 
                    Hãy quan sát các cát tinh và môn tại cung này để biết vận trình cá nhân trong canh giờ hiện tại."
                  </p>
               </div>
            </div>
          )}
        </AnimatePresence>
      </div>

    </main>
  );
}
