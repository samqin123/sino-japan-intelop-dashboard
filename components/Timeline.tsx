import React from 'react';
import { TimelineEvent, EventCategory } from '../types';
import { MessageSquare, ShieldAlert, Globe2 } from 'lucide-react';

interface TimelineProps {
  events: TimelineEvent[];
  lang: 'zh' | 'en';
}

const Timeline: React.FC<TimelineProps> = ({ events, lang }) => {
  const getIcon = (category: EventCategory) => {
    switch (category) {
      case EventCategory.MILITARY:
        return <ShieldAlert className="w-5 h-5 text-red-500" />;
      case EventCategory.DIPLOMATIC:
        return <Globe2 className="w-5 h-5 text-blue-400" />;
      case EventCategory.PUBLIC_OPINION:
        return <MessageSquare className="w-5 h-5 text-yellow-500" />;
      default:
        return <Globe2 className="w-5 h-5 text-gray-400" />;
    }
  };

  const getColor = (category: EventCategory) => {
    switch (category) {
      case EventCategory.MILITARY:
        return 'border-red-900/50 bg-red-900/10 text-red-200';
      case EventCategory.DIPLOMATIC:
        return 'border-blue-900/50 bg-blue-900/10 text-blue-200';
      case EventCategory.PUBLIC_OPINION:
        return 'border-yellow-900/50 bg-yellow-900/10 text-yellow-200';
      default:
        return 'border-gray-800 bg-gray-800/50';
    }
  };

  const categoryLabels = {
    en: {
      [EventCategory.DIPLOMATIC]: 'Diplomatic',
      [EventCategory.MILITARY]: 'Military',
      [EventCategory.PUBLIC_OPINION]: 'Public Opinion',
    },
    zh: {
      [EventCategory.DIPLOMATIC]: '外交',
      [EventCategory.MILITARY]: '军事',
      [EventCategory.PUBLIC_OPINION]: '舆论',
    }
  };

  return (
    <div className="relative py-8">
      <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-700 transform -translate-x-1/2"></div>
      
      <div className="space-y-12">
        {events.map((event, index) => {
          const isLeft = index % 2 === 0;
          return (
            <div key={index} className={`relative flex items-center justify-between md:justify-normal ${isLeft ? 'md:flex-row-reverse' : ''}`}>
              
              {/* Spacer for desktop layout to push content to side */}
              <div className="hidden md:block w-5/12" />

              {/* Center Node */}
              <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-slate-800 border-4 border-slate-900 z-10 flex items-center justify-center">
                {getIcon(event.category)}
              </div>

              {/* Content Card */}
              <div className={`w-full md:w-5/12 pl-20 md:pl-0 ${isLeft ? 'md:pr-12 text-left' : 'md:pl-12 text-left'}`}>
                <div className={`p-4 rounded-lg border ${getColor(event.category)} transition-all hover:bg-opacity-20`}>
                  <span className="text-xs font-mono opacity-70 uppercase tracking-wider mb-1 block">{event.date}</span>
                  <h3 className="text-lg font-serif font-bold mb-2 leading-tight">{event.title}</h3>
                  <p className="text-sm opacity-80 leading-relaxed">
                    {event.summary}
                  </p>
                  <div className="mt-3 flex gap-2">
                     <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 uppercase tracking-widest">
                        {categoryLabels[lang][event.category]}
                     </span>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;