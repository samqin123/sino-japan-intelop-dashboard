
import React from 'react';
import { Activity, AlertTriangle, ShieldCheck, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { RiskIndexData } from '../types';

interface ConflictIndexProps {
  data: RiskIndexData;
  lang: 'zh' | 'en';
}

const ConflictIndex: React.FC<ConflictIndexProps> = ({ data, lang }) => {
  const t = {
    en: {
      title: "SJM-CRI 2.0 Risk Index",
      subtitle: "Sino-Japanese Military Conflict Risk Index (30-Day Rolling)",
      score: "Composite Risk Score",
      multiplier: "Risk Multiplier",
      drivers: "Risk Drivers (Escalation)",
      mitigators: "Risk Mitigators (Stabilization)",
      indices: {
        ts: "Taiwan Strait (35%)",
        ecs: "East China Sea (20%)",
        sur: "Sino-US Relations (15%)",
        ips: "Internal Politics (15%)",
        tpi: "3rd Party Influence (15%)"
      }
    },
    zh: {
      title: "SJM-CRI 2.0 军事冲突风险指数",
      subtitle: "中日军事冲突风险评估模型 (30天滚动)",
      score: "综合风险评分",
      multiplier: "风险乘数 (M)",
      drivers: "风险驱动因素 (升级)",
      mitigators: "风险缓和因素 (维稳)",
      indices: {
        ts: "台海稳定性 (35%)",
        ecs: "东海对抗度 (20%)",
        sur: "中美关系 (15%)",
        ips: "国内政治舆情 (15%)",
        tpi: "第三方影响力 (15%)"
      }
    }
  }[lang];

  // Color logic for score
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-red-500 border-red-500';
    if (score >= 6) return 'text-orange-500 border-orange-500';
    if (score >= 4) return 'text-yellow-500 border-yellow-500';
    return 'text-green-500 border-green-500';
  };

  const getBarColor = (score: number) => {
     if (score >= 8) return 'bg-red-600';
     if (score >= 6) return 'bg-orange-500';
     if (score >= 4) return 'bg-yellow-500';
     return 'bg-green-500';
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
        <Activity size={200} />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-8 relative z-10">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-3">
            <span className="bg-red-900/50 text-red-400 text-xs font-mono py-1 px-2 rounded border border-red-900/50">LIVE</span>
            {t.title}
          </h2>
          <p className="text-slate-400 text-sm mt-1">{t.subtitle}</p>
        </div>
        <div className={`px-4 py-2 rounded-lg border ${getScoreColor(data.totalScore)} bg-slate-900/80`}>
          <span className="text-xs font-mono uppercase tracking-widest block opacity-70">Status</span>
          <span className="text-xl font-bold">{data.riskLevel}</span>
        </div>
      </div>

      {/* Main Score Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
        
        {/* Left: Big Score */}
        <div className="md:col-span-4 flex flex-col items-center justify-center bg-slate-900/50 rounded-xl border border-slate-800 p-6">
          <div className={`relative w-40 h-40 rounded-full border-8 flex items-center justify-center ${getScoreColor(data.totalScore)}`}>
             <div className="text-center">
                <span className="text-5xl font-bold text-white block">{data.totalScore.toFixed(2)}</span>
                <span className="text-xs text-slate-400 uppercase">/ 10.0</span>
             </div>
          </div>
          <p className="mt-4 text-sm font-medium text-slate-300">{t.score}</p>
          
          <div className="mt-6 w-full bg-slate-800/50 rounded p-3 border border-slate-700 flex items-center justify-between">
             <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-slate-300">{t.multiplier}</span>
             </div>
             <span className="font-mono font-bold text-blue-400 text-lg">x{data.riskMultiplier.value}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 text-center px-2 leading-tight">
             {data.riskMultiplier.reason}
          </p>
        </div>

        {/* Right: Sub-Indices */}
        <div className="md:col-span-8 grid grid-cols-1 gap-4">
          {[
            { label: t.indices.ts, val: data.indices.taiwanStrait },
            { label: t.indices.ecs, val: data.indices.eastChinaSea },
            { label: t.indices.sur, val: data.indices.sinoUsRelation },
            { label: t.indices.ips, val: data.indices.internalPolitics },
            { label: t.indices.tpi, val: data.indices.thirdParty },
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-900/30 rounded p-3 border border-slate-800/50">
               <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-slate-300">{item.label}</span>
                  <span className={`font-mono font-bold ${getScoreColor(item.val).split(' ')[0]}`}>{item.val.toFixed(1)}</span>
               </div>
               <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getBarColor(item.val)} transition-all duration-1000`} 
                    style={{ width: `${(item.val / 10) * 100}%` }}
                  ></div>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* Drivers vs Mitigators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Drivers */}
        <div className="bg-red-950/10 border border-red-900/30 rounded-xl p-5">
           <h3 className="text-red-400 font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
             <TrendingUp className="w-4 h-4" /> {t.drivers}
           </h3>
           <ul className="space-y-2">
             {data.drivers.map((driver, i) => (
               <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                 <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                 <div dangerouslySetInnerHTML={{ __html: driver }} className="prose prose-invert prose-sm max-w-none prose-p:m-0" />
               </li>
             ))}
           </ul>
        </div>

        {/* Mitigators */}
        <div className="bg-green-950/10 border border-green-900/30 rounded-xl p-5">
           <h3 className="text-green-400 font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
             <ShieldCheck className="w-4 h-4" /> {t.mitigators}
           </h3>
           <ul className="space-y-2">
             {data.mitigators.map((mit, i) => (
               <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                 <TrendingDown className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                 <div dangerouslySetInnerHTML={{ __html: mit }} className="prose prose-invert prose-sm max-w-none prose-p:m-0" />
               </li>
             ))}
           </ul>
        </div>
      </div>

    </div>
  );
};

export default ConflictIndex;
