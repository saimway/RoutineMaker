import React, { useState } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { CalendarIcon } from './icons/CalendarIcon';

interface DurationSelectorProps {
  onConfirm: (days: number) => void;
}

const DurationSelector: React.FC<DurationSelectorProps> = ({ onConfirm }) => {
  const [duration, setDuration] = useState(30);

  return (
    <div className="w-full max-w-lg mx-auto animate-fade-in text-center">
      <div className="bg-slate-900/50 p-8 rounded-lg border border-slate-700">
        <CalendarIcon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-200 mb-2">Set Your Study Timeline</h2>
        <p className="text-slate-400 mb-8">How many days do you have to prepare?</p>
        
        <div className="my-6">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-400">7 Days</span>
                <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">{duration} Days</span>
                <span className="text-sm font-medium text-slate-400">90 Days</span>
            </div>
            <input
                type="range"
                min="7"
                max="90"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer range-lg [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
            />
        </div>
        
        <button
          onClick={() => onConfirm(duration)}
          className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 mx-auto"
        >
          <SparklesIcon className="w-5 h-5" />
          Generate Full Study Plan
        </button>
      </div>
    </div>
  );
};

export default DurationSelector;