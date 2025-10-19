import React from 'react';
import { Stream } from '../types';
import { ScienceIcon } from './icons/ScienceIcon';
import { ArtsIcon } from './icons/ArtsIcon';
import { CommerceIcon } from './icons/CommerceIcon';

interface StreamSelectorProps {
  onStreamSelect: (stream: Stream) => void;
}

const StreamSelector: React.FC<StreamSelectorProps> = ({ onStreamSelect }) => {
  const streams = [
    { name: Stream.SCIENCE, icon: <ScienceIcon className="w-12 h-12 mb-4 text-cyan-400" />, description: "Physics, Chemistry, Biology, Math" },
    { name: Stream.ARTS, icon: <ArtsIcon className="w-12 h-12 mb-4 text-amber-400" />, description: "History, Sociology, Economics, Civics" },
    { name: Stream.COMMERCE, icon: <CommerceIcon className="w-12 h-12 mb-4 text-emerald-400" />, description: "Accounting, Finance, Marketing" },
  ];

  return (
    <div className="w-full flex flex-col items-center animate-fade-in">
      <h2 className="text-2xl font-bold text-center mb-1 text-slate-200">Select Your Academic Stream</h2>
      <p className="text-center text-slate-400 mb-8">This helps us tailor the subject list for you.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
        {streams.map((stream) => (
          <button
            key={stream.name}
            onClick={() => onStreamSelect(stream.name)}
            className="flex flex-col items-center justify-center p-8 bg-slate-800/50 border border-slate-700 rounded-xl text-center hover:bg-slate-700/50 hover:border-cyan-500 transition-all duration-300 transform hover:-translate-y-1"
          >
            {stream.icon}
            <h3 className="text-xl font-bold text-slate-100">{stream.name}</h3>
            <p className="text-sm text-slate-400 mt-2">{stream.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StreamSelector;