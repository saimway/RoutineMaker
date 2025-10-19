import React from 'react';
import { BookIcon } from './icons/BookIcon';
import { GraduationCapIcon } from './icons/GraduationCapIcon';

interface CurriculumSelectorProps {
  onSelect: (type: 'general' | 'ssc-26') => void;
}

const CurriculumSelector: React.FC<CurriculumSelectorProps> = ({ onSelect }) => {
  return (
    <div className="w-full flex flex-col items-center animate-fade-in">
      <h2 className="text-2xl font-bold text-center mb-8 text-slate-200">How would you like to create your routine?</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <button
          onClick={() => onSelect('general')}
          className="flex flex-col items-center justify-center p-8 bg-slate-800/50 border border-slate-700 rounded-xl text-center hover:bg-slate-700/50 hover:border-cyan-500 transition-all duration-300 transform hover:-translate-y-1"
        >
          <BookIcon className="w-12 h-12 mb-4 text-cyan-400" />
          <h3 className="text-xl font-bold text-slate-100">General Routine Creator</h3>
          <p className="text-sm text-slate-400 mt-2">Upload any syllabus or chapter list and get a study plan.</p>
        </button>
        <button
          onClick={() => onSelect('ssc-26')}
          className="flex flex-col items-center justify-center p-8 bg-slate-800/50 border border-slate-700 rounded-xl text-center hover:bg-slate-700/50 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-1"
        >
          <GraduationCapIcon className="w-12 h-12 mb-4 text-purple-400" />
          <h3 className="text-xl font-bold text-slate-100">SSC-26 Syllabus Planner</h3>
          <p className="text-sm text-slate-400 mt-2">Select your specific SSC-26 subjects for a tailored experience.</p>
        </button>
      </div>
    </div>
  );
};

export default CurriculumSelector;