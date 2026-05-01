"use client";

import { useState, useEffect } from "react";
import { TimeEngine, TimeContext } from "@/core/TimeEngine";
import { QimenEngine, QimenMethod, QimenJu, QimenPan, QimenChartType } from "@/core/QimenEngine";
import { PatternEngine } from "@/core/PatternEngine";
import { PatternRule } from "@/data/PatternData";
import { PALACE_INFO, TIAN_GAN, XUN_SHOU_MAP } from "@/core/QimenConstants";
import { DOOR_DETAILS, STAR_DETAILS, DEITY_DETAILS } from "@/data/InterpretationData";
import { getDetailedInterpretation } from "@/data/FormationDetailData";
import { EVIDENTIAL_MAP } from "@/data/EvidentialData";
import starHourEvidence from "@/data/star_hour_evidence_vi.json";
import { Clock, Calendar as CalendarIcon, Moon, Sun, ArrowRight, Stars, MoveRight, X, Palette, BookOpen, LayoutGrid, Compass, User, Trophy, FileText, Eye } from "lucide-react";
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
  WEALTH: 'Tài Lộc',
  CAREER: 'Sự Nghiệp',
  MARRIAGE: 'Hôn Nhân',
  HEALTH: 'Sức Khỏe',
  CONFLICT: 'Cạnh Tranh',
  TRADING: 'Giao Dịch'
};

const STAR_ID_MAP: Record<string, string> = {
  'Bồng': 'TianPeng',
  'Nhuế': 'TianRui',
  'Xung': 'TianChong',
  'Phụ': 'TianFu',
  'Cầm': 'TianQin',
  'Tâm': 'TianXin',
  'Trụ': 'TianZhu',
  'Nhậm': 'TianRen',
  'Anh': 'TianYing'
};

const BRANCH_EN_MAP: Record<string, string> = {
  'Tý': 'Zi', 'Sửu': 'Chou', 'Dần': 'Yin', 'Mão': 'Mao', 'Thìn': 'Chen', 'Tỵ': 'Si',
  'Ngọ': 'Wu', 'Mùi': 'Wei', 'Thân': 'Shen', 'Dậu': 'You', 'Tuất': 'Xu', 'Hợi': 'Hai'
};

const CelestialBackground = ({ theme }: { theme: ThemeType }) => (
  <div className={`absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden ${theme === 'light' ? 'opacity-5' : 'opacity-[0.15]'} mix-blend-screen`}>
    <svg viewBox="0 0 1000 1000" className={`w-[150vw] h-[150vw] lg:w-[120vh] lg:h-[120vh] animate-[spin_240s_linear_infinite] ${theme === 'cyber' ? 'text-accent-p' : 'text-gold'}`}>
       {/* Outer rings */}
       <circle cx="500" cy="500" r="480" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5,15" />
       <circle cx="500" cy="500" r="450" fill="none" stroke="currentColor" strokeWidth="1.5" />
       
       {/* 24 Mountains / Sectors */}
       {Array.from({length: 24}).map((_, i) => (
         <line key={`tick-${i}`} x1="500" y1="50" x2="500" y2="80" transform={`rotate(${i * 15} 500 500)`} stroke="currentColor" strokeWidth="1" />
       ))}
       
       {/* 64 Hexagram marks */}
       {Array.from({length: 64}).map((_, i) => (
         <line key={`hex-${i}`} x1="500" y1="90" x2="500" y2="110" transform={`rotate(${i * (360/64)} 500 500)`} stroke="currentColor" strokeWidth="0.5" />
       ))}

       <circle cx="500" cy="500" r="380" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2,6" />
       
       {/* 8 Trigram directional lines */}
       {Array.from({length: 8}).map((_, i) => (
         <g key={`tri-${i}`} transform={`rotate(${i * 45} 500 500)`}>
           <line x1="500" y1="120" x2="500" y2="380" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
           <text x="500" y="140" fill="currentColor" fontSize="12" textAnchor="middle" opacity="0.5">☯</text>
         </g>
       ))}

       {/* Constellations (Big Dipper / Bắc Đẩu) */}
       <g opacity="0.6" stroke="currentColor" strokeWidth="1.5" fill="currentColor">
         <polyline points="280,320 340,260 420,280 470,350 560,330 630,400 720,360" fill="none" strokeDasharray="4,4" />
         <circle cx="280" cy="320" r="4" />
         <circle cx="340" cy="260" r="4" />
         <circle cx="420" cy="280" r="4" />
         <circle cx="470" cy="350" r="5" />
         <circle cx="560" cy="330" r="5" />
         <circle cx="630" cy="400" r="6" />
         <circle cx="720" cy="360" r="7" />
       </g>
       
       {/* Nam Đẩu Thất Tinh */}
       <g opacity="0.4" stroke="currentColor" strokeWidth="1" fill="currentColor" transform="rotate(140 500 500)">
         <polyline points="300,500 350,560 400,650 480,700 550,680 600,750" fill="none" strokeDasharray="2,4" />
         <circle cx="300" cy="500" r="3" />
         <circle cx="350" cy="560" r="3" />
         <circle cx="400" cy="650" r="4" />
         <circle cx="480" cy="700" r="4" />
         <circle cx="550" cy="680" r="3" />
         <circle cx="600" cy="750" r="3" />
       </g>

       {/* Inner sacred geometry (Octagram / Star) */}
       <circle cx="500" cy="500" r="220" fill="none" stroke="currentColor" strokeWidth="0.5" />
       {Array.from({length: 2}).map((_, i) => (
         <rect key={`sq-${i}`} x="344.5" y="344.5" width="311" height="311" fill="none" stroke="currentColor" strokeWidth="0.5" transform={`rotate(${i * 45} 500 500)`} />
       ))}
       
       {/* Center point */}
       <circle cx="500" cy="500" r="10" fill="currentColor" opacity="0.5" />
       <circle cx="500" cy="500" r="60" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4,4" />
    </svg>
    <svg viewBox="0 0 1000 1000" className={`absolute w-[100vw] h-[100vw] lg:w-[80vh] lg:h-[80vh] animate-[spin_120s_linear_infinite_reverse] ${theme === 'cyber' ? 'text-accent-s' : 'text-saffron'}`}>
        {/* Counter-rotating inner rings */}
        <circle cx="500" cy="500" r="400" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="10,20" />
        {Array.from({length: 12}).map((_, i) => (
         <g key={`moon-${i}`} transform={`rotate(${i * 30} 500 500)`}>
           <circle cx="500" cy="100" r="4" fill="currentColor" opacity="0.6" />
           <line x1="500" y1="104" x2="500" y2="120" stroke="currentColor" strokeWidth="1" opacity="0.4" />
         </g>
       ))}
       {/* Ancient magical text/runes abstract representations */}
       {Array.from({length: 8}).map((_, i) => (
         <text key={`rune-${i}`} x="500" y="50" transform={`rotate(${i * 45 + 22.5} 500 500)`} fill="currentColor" fontSize="16" textAnchor="middle" opacity="0.4" fontFamily="serif">篆</text>
       ))}
    </svg>
  </div>
);

const AncientCorners = () => (
  <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
    <svg className="absolute top-0 left-0 w-16 h-16 md:w-24 md:h-24 text-accent-t" viewBox="0 0 100 100">
      <path d="M10,90 L10,10 L90,10" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M20,80 L20,20 L80,20" fill="none" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="20" cy="20" r="3" fill="currentColor" />
      <path d="M10,30 L30,30 M30,10 L30,30" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
    <svg className="absolute top-0 right-0 w-16 h-16 md:w-24 md:h-24 text-accent-t transform rotate-90" viewBox="0 0 100 100">
      <path d="M10,90 L10,10 L90,10" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M20,80 L20,20 L80,20" fill="none" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="20" cy="20" r="3" fill="currentColor" />
      <path d="M10,30 L30,30 M30,10 L30,30" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
    <svg className="absolute bottom-0 right-0 w-16 h-16 md:w-24 md:h-24 text-accent-t transform rotate-180" viewBox="0 0 100 100">
      <path d="M10,90 L10,10 L90,10" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M20,80 L20,20 L80,20" fill="none" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="20" cy="20" r="3" fill="currentColor" />
      <path d="M10,30 L30,30 M30,10 L30,30" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
    <svg className="absolute bottom-0 left-0 w-16 h-16 md:w-24 md:h-24 text-accent-t transform -rotate-90" viewBox="0 0 100 100">
      <path d="M10,90 L10,10 L90,10" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M20,80 L20,20 L80,20" fill="none" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="20" cy="20" r="3" fill="currentColor" />
      <path d="M10,30 L30,30 M30,10 L30,30" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  </div>
);
export default function Home() {
  const [dateStr, setDateStr] = useState<string>("");
  const [timeContext, setTimeContext] = useState<TimeContext | null>(null);
  const [method, setMethod] = useState<QimenMethod>(QimenMethod.CHAI_BU);
  const [chartType, setChartType] = useState<QimenChartType>(QimenChartType.HOUR);
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
    const ctx = TimeEngine.calculateTimeContext(now);
    setTimeContext(ctx);
  }, []);

  useEffect(() => {
    if (timeContext) {
      const pan = QimenEngine.calculatePan(method, timeContext, chartType);
      setQimenPan(pan);
      if (pan) {
        const analyzedPatterns = PatternEngine.analyzePan(pan);
        setPatterns(analyzedPatterns);
        calculateScores(pan, analyzedPatterns, activeCategory);
      }
    }
  }, [timeContext, method, chartType, activeCategory]);

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

  const calculate = (d: Date, mMethod: QimenMethod, category: TaskCategory = activeCategory, cType: QimenChartType = chartType) => {
    try {
      const ctx = TimeEngine.calculateTimeContext(d);
      setTimeContext(ctx);
      const pan = QimenEngine.calculatePan(mMethod, ctx, cType);
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

  const handleChartTypeChange = (newType: QimenChartType) => {
    setChartType(newType);
    if (dateStr) {
      calculate(new Date(dateStr), method, activeCategory, newType);
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
        
        <CelestialBackground theme={theme} />
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

          {/* Chart Type Selector - NEW */}
          <div className="flex bg-neutral-900/50 p-1 rounded-2xl border border-border-v w-full">
            {[
              { id: QimenChartType.HOUR, label: 'Thời Bàn' },
              { id: QimenChartType.DAY, label: 'Nhật Bàn' }
            ].map(type => (
              <button
                key={type.id}
                onClick={() => handleChartTypeChange(type.id)}
                className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${chartType === type.id ? 'bg-accent-s text-white shadow-lg' : 'text-neutral-500 hover:text-neutral-300'}`}
              >
                {type.label}
              </button>
            ))}
          </div>

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

            <div className="relative w-full max-w-2xl aspect-square">
               <AncientCorners />
               <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="grid grid-cols-3 gap-2 md:gap-4 w-full h-full relative z-10"
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
                       {isVoid && <span className={`text-[7px] px-1 py-0.5 rounded uppercase font-bold tracking-tighter ${theme === 'light' ? 'bg-stone-200 text-stone-600' : 'bg-neutral-800 text-neutral-400'}`}>Trống</span>}
                       {isHorse && <span className={`text-[7px] px-1 py-0.5 rounded uppercase font-bold tracking-tighter border ${theme === 'light' ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-amber-500/20 text-amber-500 border-amber-500/10'}`}>Mã</span>}
                       {isLifePalace && <span className={`text-[7px] px-1 py-0.5 rounded uppercase font-bold tracking-tighter border ${theme === 'light' ? 'bg-purple-100 text-purple-800 border-purple-300' : 'bg-accent-p/20 text-accent-p border-accent-p/10'}`}>Mệnh</span>}
                       {isVictory && <span className={`text-[7px] px-1 py-0.5 rounded uppercase font-bold tracking-tighter border ${theme === 'light' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/10'}`}>Thắng</span>}
                       {isForbidden && <span className={`text-[7px] px-1 py-0.5 rounded uppercase font-bold tracking-tighter border ${theme === 'light' ? 'bg-red-100 text-red-800 border-red-300' : 'bg-rose-500/20 text-rose-400 border-rose-500/10'}`}>Kỵ</span>}
                    </div>

                    <div className="absolute top-8 left-2 flex flex-col gap-1">
                      {pPatterns
                        .filter(pt => pt.name !== 'Phản Ngâm' && pt.name !== 'Phục Ngâm')
                        .slice(0, 2)
                        .map(pattern => (
                        <div key={pattern.id} className={`px-1 py-0.5 rounded text-[7px] uppercase font-bold ${pattern.severity === 'AUSPICIOUS' ? (theme === 'light' ? 'text-emerald-800 bg-emerald-800/10' : 'text-emerald-400') : pattern.severity === 'OMINOUS' ? (theme === 'light' ? 'text-red-800 bg-red-800/10' : 'text-red-400') : (theme === 'light' ? 'text-stone-700 bg-stone-700/10' : 'text-neutral-400')}`}>{pattern.name}</div>
                      ))}
                    </div>

                    <div className={`absolute top-2 right-2 text-[8px] font-bold uppercase ${theme === 'light' ? 'text-rose-900' : 'text-rose-400/80'}`}>{p.shenPan}</div>
                    <div className={`absolute top-6 right-2 text-[8px] font-bold uppercase ${theme === 'light' ? 'text-blue-900' : 'text-blue-300/80'}`}>{p.tianPan}</div>
                    <div className={`absolute bottom-2 left-2 text-[9px] font-bold ${theme === 'light' ? 'text-emerald-900' : 'text-emerald-400'}`}>{p.renPan}</div>
                    <div className="absolute bottom-2 right-2 text-xs text-accent-t opacity-60">{PALACE_INFO[palaceIndex].symbol}</div>

                    <div className="flex flex-col items-center justify-center">
                       <span className="text-2xl md:text-4xl font-bold font-serif text-foreground">{p.tianGan}</span>
                       <span className="text-lg md:text-2xl font-bold font-serif text-accent-t drop-shadow-md">{p.diPan}</span>
                       
                       {isCenter && (
                         <div className="text-center mt-1">
                            <div className="text-[10px] md:text-xs font-bold font-serif text-foreground/80">
                               {qimenPan.ju.type === 'YANG' ? 'Dương' : 'Âm'} {qimenPan.ju.number} Cục
                            </div>
                         </div>
                       )}
                    </div>
                  </motion.div>
                );
              })}
              </AnimatePresence>
            </motion.div>
            </div>
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
                   { label: 'Thiên (Tinh)', val: qimenPan.palaces[selectedPalace].tianPan, gan: qimenPan.palaces[selectedPalace].tianGan, color: theme === 'light' ? 'text-blue-900' : 'text-blue-300', bg: theme === 'light' ? 'bg-blue-900/5 border-blue-900/10' : 'bg-blue-400/5' },
                   { label: 'Địa (Can)', val: '-', gan: qimenPan.palaces[selectedPalace].diPan, color: 'text-accent-t', bg: 'bg-accent-p/5 border-accent-p/10' },
                   { label: 'Nhân (Môn)', val: qimenPan.palaces[selectedPalace].renPan, gan: '', color: theme === 'light' ? 'text-emerald-900' : 'text-emerald-400', bg: theme === 'light' ? 'bg-emerald-900/5 border-emerald-900/10' : 'bg-emerald-400/5' },
                   { label: 'Thần', val: qimenPan.palaces[selectedPalace].shenPan, gan: '', color: theme === 'light' ? 'text-rose-900' : 'text-rose-400', bg: theme === 'light' ? 'bg-rose-900/5 border-rose-900/10' : 'bg-rose-400/5' }
                 ].map((box, i) => (
                   <div key={i} className={`${box.bg} border rounded-2xl p-4 text-center group transition-transform hover:scale-[1.02] ${theme !== 'light' ? 'border-border-v' : ''}`}>
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

                  {/* Luận giải Chuyên sâu từ Cổ thư (100 Formations) */}
                  {(() => {
                    const p = qimenPan.palaces[selectedPalace];
                    const interpretation = getDetailedInterpretation(p.tianGan, p.diPan, p.renPan);
                    if (!interpretation) return null;
                    
                    return (
                      <div className="mt-6 pt-4 border-t border-border-v space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="text-[10px] font-bold text-accent-s uppercase tracking-widest flex items-center gap-2">
                            <FileText className="w-3 h-3" /> Luận Giải Chuyên Sâu
                          </h4>
                        </div>
                        <div className="bg-accent-s/5 border border-accent-s/20 rounded-xl p-4">
                           <div className="text-[9px] text-accent-s font-bold mb-2 uppercase tracking-tighter">Sự phối hợp: {p.tianGan} + {p.diPan} + {p.renPan} Môn</div>
                           <p className="text-[11px] leading-relaxed text-foreground/90 font-medium">
                             {interpretation.text}
                           </p>
                           <div className="mt-3 text-[8px] text-neutral-500 uppercase flex justify-between items-center">
                              <span>Nguồn: Kinh điển Kỳ Môn</span>
                              <span className="text-accent-s">Chiến lược thực thi</span>
                           </div>
                        </div>

                        {/* Dấu hiệu ứng nghiệm (Evidential Occurrences) - NEW */}
                        {EVIDENTIAL_MAP[p.renPan] && (
                          <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4">
                            <h5 className="text-[9px] font-bold text-amber-500 uppercase mb-3 flex items-center gap-2">
                              <Stars className="w-3 h-3" /> Dấu hiệu kiểm chứng (Ứng nghiệm)
                            </h5>
                            <div className="space-y-3">
                              {EVIDENTIAL_MAP[p.renPan].map((ev, i) => (
                                <div key={i} className="flex gap-3 items-start">
                                  <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500 mt-1" />
                                  <div>
                                    <div className="text-[10px] text-amber-200/80 font-bold">{ev.type}: {ev.occurrence}</div>
                                    <div className="text-[9px] text-neutral-500 leading-relaxed">{ev.meaning}</div>
                                  </div>
                                </div>
                              ))}
                              {/* Dấu hiệu đắc ứng kinh điển (Joey Yap Compendium) - NEW */}
                         {(() => {
                           const starId = STAR_ID_MAP[p.tianPan];
                           const hourBranch = timeContext.bazi.hour.zhi;
                           const hourKey = BRANCH_EN_MAP[hourBranch];
                           const evidence = (starHourEvidence as any)[starId]?.[hourKey];
                           
                           if (!evidence) return null;
                           
                           return (
                            <div className="bg-purple-500/5 border border-purple-500/10 rounded-xl p-4 mt-3">
                              <h5 className="text-[9px] font-bold text-purple-400 uppercase mb-3 flex items-center gap-2">
                                <Eye className="w-3 h-3" /> Dấu hiệu đắc ứng kinh điển (Pháp Kỳ Môn)
                              </h5>
                              <div className="text-[11px] leading-relaxed text-purple-100/90 italic">
                                "{evidence}"
                              </div>
                              <div className="mt-3 text-[8px] text-neutral-600 uppercase flex justify-between items-center">
                                <span>Nguồn: Joey Yap Compendium</span>
                                <span className="text-purple-500/50 italic">* Nên hiểu theo nghĩa hiện đại</span>
                              </div>
                            </div>
                           );
                         })()}
                       </div>
                            <div className="mt-3 py-2 px-3 bg-amber-500/10 rounded-lg text-[8px] text-amber-500/70 italic">
                              * Nếu thấy các dấu hiệu trên trong vòng 15-30 phút sau khi khởi sự, quẻ đang ứng nghiệm cực mạnh.
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                 {patterns[selectedPalace] && patterns[selectedPalace].filter(pt => pt.name !== 'Phản Ngâm' && pt.name !== 'Phục Ngâm').length > 0 && (
                   <div className="space-y-3 pt-4">
                      <h4 className="text-[10px] font-bold text-accent-t uppercase tracking-widest border-b border-border-v pb-2">Cách Cục</h4>
                      {patterns[selectedPalace].filter(pt => pt.name !== 'Phản Ngâm' && pt.name !== 'Phục Ngâm').map(pt => (
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
             (() => {
               if (!qimenPan || !timeContext) return null;
               const searchGan = birthGan === 'Giáp' ? XUN_SHOU_MAP[timeContext.xunShou] : birthGan;
               const lifePalaceIdx = QimenEngine.findStemPalace(qimenPan, searchGan, 'DI') || 1;
               return (
                <div className="flex-1 flex flex-col p-6 overflow-y-auto sidebar-hide-scrollbar">
                  {activeCategory === 'TRADING' && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 rounded-2xl bg-accent-s/10 border border-accent-s/20"
                    >
                        <div className="flex items-center gap-2 mb-2">
                          <Trophy className="w-4 h-4 text-accent-s" />
                          <h4 className="text-[9px] font-bold uppercase text-accent-s tracking-widest">Kinh Doanh Insight</h4>
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
                        "Mệnh chủ Can <span className="text-accent-p font-bold">{birthGan}</span> đang ngụ tại <span className="text-foreground font-bold">Cung {lifePalaceIdx}</span> ({PALACE_INFO[lifePalaceIdx].bagua}). 
                        Hãy quan sát các cát tinh và môn tại cung này để biết vận trình cá nhân trong canh giờ hiện tại."
                      </p>
                  </div>
                </div>
               );
             })()
          )}
        </AnimatePresence>
      </div>

    </main>
  );
}
