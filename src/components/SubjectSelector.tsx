import React, { useState } from 'react';
import { Subject } from '../types';

interface SubjectSelectorProps {
  coreSubjects: Subject[];
  optionalSubjects: Subject[];
  onSubjectsSelect: (subjects: Subject[]) => void;
}

const SubjectSelector: React.FC<SubjectSelectorProps> = ({ coreSubjects, optionalSubjects, onSubjectsSelect }) => {
    const [selectedCore, setSelectedCore] = useState<Set<string>>(new Set(coreSubjects.map(s => s.id)));
    const [selectedOptional, setSelectedOptional] = useState<string>('');

    const handleCoreToggle = (subjectId: string) => {
        setSelectedCore(prev => {
            const next = new Set(prev);
            if (next.has(subjectId)) {
                next.delete(subjectId);
            } else {
                next.add(subjectId);
            }
            return next;
        });
    };

    const handleOptionalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOptional(e.target.value);
    };

    const handleSubmit = () => {
        const finalCoreSubjects = coreSubjects.filter(s => selectedCore.has(s.id));
        const finalOptionalSubject = optionalSubjects.find(s => s.id === selectedOptional);
        
        let allSelectedSubjects = [...finalCoreSubjects];
        if (finalOptionalSubject) {
            allSelectedSubjects.push(finalOptionalSubject);
        }

        if (allSelectedSubjects.length > 0) {
            onSubjectsSelect(allSelectedSubjects);
        }
    };
    
    const canProceed = selectedCore.size > 0;

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
        <h2 className="text-2xl font-bold text-center mb-1 text-slate-200">Choose Your Subjects</h2>
        <p className="text-center text-slate-400 mb-6">Select the subjects you are studying this term.</p>

        <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-cyan-400 mb-4">Core Subjects</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {coreSubjects.map(subject => (
                    <label
                        key={subject.id}
                        className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                        selectedCore.has(subject.id)
                            ? 'bg-cyan-500/20 border-cyan-500/30'
                            : 'bg-slate-800/50 border-slate-700 hover:bg-slate-700/50'
                        }`}
                    >
                        <input
                        type="checkbox"
                        checked={selectedCore.has(subject.id)}
                        onChange={() => handleCoreToggle(subject.id)}
                        className="h-5 w-5 rounded bg-slate-700 border-slate-600 text-cyan-500 focus:ring-cyan-600 focus:ring-offset-slate-800"
                        />
                        <span className="ml-3 text-slate-200">{subject.name}</span>
                    </label>
                ))}
            </div>

            <h3 className="text-lg font-semibold text-purple-400 my-4 pt-4 border-t border-slate-700">Optional: Religious Studies</h3>
            <select
                value={selectedOptional}
                onChange={handleOptionalChange}
                className="w-full sm:w-1/2 bg-slate-800 border border-slate-600 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-2.5"
            >
                <option value="">None</option>
                {optionalSubjects.map(subject => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))}
            </select>
        </div>

        <div className="mt-8 text-center">
            <button
                onClick={handleSubmit}
                disabled={!canProceed}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
                Continue to Upload
            </button>
        </div>
    </div>
  );
};

export default SubjectSelector;