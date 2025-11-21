import React from 'react';
import { AlertTriangle, Target, Crosshair, TrendingUp, Globe, ExternalLink, BookOpen } from 'lucide-react';
import { AnalysisData } from '../types';

interface AnalysisSectionProps {
  data: AnalysisData;
  lang: 'zh' | 'en';
}

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; subtitle?: string }> = ({ icon, title, subtitle }) => (
  <div className="flex items-start gap-4 mb-4 border-b border-slate-700 pb-2">
    <div className="p-2 bg-slate-800 rounded-lg text-blue-400 shadow-sm shadow-black/50">
      {icon}
    </div>
    <div>
      <h2 className="text-xl font-bold font-serif text-slate-100">{title}</h2>
      {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
    </div>
  </div>
);

// Helper to render HTML content safely with proper styling
const HtmlContent: React.FC<{ content: string }> = ({ content }) => (
  <div 
    className="prose prose-invert prose-sm max-w-none 
      prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-4
      prose-headings:text-slate-100 prose-headings:font-serif prose-headings:font-bold prose-headings:mt-6 prose-headings:mb-3
      prose-h3:text-base prose-h3:uppercase prose-h3:tracking-wider prose-h3:text-blue-200
      prose-strong:text-red-300 prose-strong:font-bold
      prose-ul:list-disc prose-ul:pl-5 prose-ul:mb-4 
      prose-li:text-slate-300 prose-li:mb-1 prose-li:marker:text-slate-600"
    dangerouslySetInnerHTML={{ __html: content }} 
  />
);

const AnalysisSection: React.FC<AnalysisSectionProps> = ({ data, lang }) => {
  const t = {
    en: {
      sec1: "1. Motivation Analysis",
      sec1sub: "Impulse vs. Strategic Intent",
      impulseProb: "Impulse Probability",
      stratIntent: "Strategic Intent",
      sec2: "2. Strategic Hypothesis",
      sec2sub: "Confirmation of Militarization Intent",
      sec3: "3. Conflict Trajectory Prediction",
      sec4: "4. Tactical Risk Assessment",
      sec4sub: "Military Doctrine & Surprise Offensive Feasibility",
      deepOps: "Deep Operations Analysis",
      targets: "High Value Targets",
      sources: "Intelligence Sources",
      sourcesSub: "Official Gov (CN/JP/US) & Global Media"
    },
    zh: {
      sec1: "1. 动机分析",
      sec1sub: "冲动 vs 战略意图",
      impulseProb: "冲动概率",
      stratIntent: "战略意图",
      sec2: "2. 战略假设",
      sec2sub: "确认军事化意图",
      sec3: "3. 冲突轨迹预测",
      sec4: "4. 战术风险评估",
      sec4sub: "军事学说与突袭可行性",
      deepOps: "纵深作战分析",
      targets: "高价值目标",
      sources: "情报来源",
      sourcesSub: "官方政府 (中/日/美) & 全球媒体"
    }
  }[lang];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Card 1: Impulse vs Strategy */}
      <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
        <SectionHeader 
          icon={<TrendingUp className="w-6 h-6" />} 
          title={t.sec1} 
          subtitle={t.sec1sub}
        />
        <div className="flex items-center gap-4 mb-6 bg-slate-900/50 p-4 rounded-lg border border-slate-800">
          <div className="text-right flex-1">
            <span className="block text-xs text-slate-400 uppercase tracking-wider">{t.impulseProb}</span>
            <span className="text-2xl font-bold text-blue-400">{data.impulseProbability}%</span>
          </div>
          <div className="h-12 w-0.5 bg-slate-700"></div>
          <div className="flex-1">
             <span className="block text-xs text-slate-400 uppercase tracking-wider">{t.stratIntent}</span>
             <span className="text-2xl font-bold text-red-400">{100 - data.impulseProbability}%</span>
          </div>
        </div>
        <HtmlContent content={data.impulseAnalysis} />
      </div>

      {/* Card 2: Strategic Confirmation */}
      <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl border-l-4 border-l-red-600">
        <SectionHeader 
          icon={<AlertTriangle className="w-6 h-6 text-red-500" />} 
          title={t.sec2} 
          subtitle={t.sec2sub}
        />
        <HtmlContent content={data.strategicAnalysis} />
      </div>

      {/* Card 3: Future Prediction */}
      <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl lg:col-span-2">
        <SectionHeader 
          icon={<Crosshair className="w-6 h-6 text-yellow-500" />} 
          title={t.sec3} 
        />
        <HtmlContent content={data.futurePrediction} />
      </div>

      {/* Card 4: Surprise Attack Analysis */}
      <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl lg:col-span-2">
         <SectionHeader 
          icon={<Target className="w-6 h-6 text-red-500" />} 
          title={t.sec4} 
          subtitle={t.sec4sub}
        />
        <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-widest mb-3 border-b border-slate-700 pb-1 flex items-center gap-2">
                   <BookOpen className="w-4 h-4 text-slate-400"/> 
                   {t.deepOps}
                </h4>
                <HtmlContent content={data.surpriseAttackAnalysis} />
            </div>
            <div className="bg-red-950/20 border border-red-900/30 rounded-lg p-4 h-fit">
                <h4 className="text-sm font-bold text-red-400 uppercase tracking-widest mb-3">{t.targets}</h4>
                <ul className="space-y-3">
                    {data.potentialTargets.map((target, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-red-200">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
                            <span className="leading-tight">{target}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      </div>

      {/* Card 5: Intelligence Sources */}
      {data.sources && data.sources.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl lg:col-span-2">
           <SectionHeader 
            icon={<Globe className="w-6 h-6 text-blue-400" />} 
            title={t.sources} 
            subtitle={t.sourcesSub}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.sources.map((source, idx) => (
                <a 
                  key={idx} 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 transition-colors group"
                >
                    <div className="p-1.5 rounded bg-slate-800 text-slate-400 group-hover:text-blue-400 flex-shrink-0">
                        <ExternalLink className="w-3 h-3" />
                    </div>
                    <div className="min-w-0 overflow-hidden">
                        <h5 className="text-xs font-medium text-slate-300 truncate group-hover:text-blue-300" title={source.title}>{source.title}</h5>
                        <p className="text-[10px] text-slate-500 truncate">{source.uri}</p>
                    </div>
                </a>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default AnalysisSection;