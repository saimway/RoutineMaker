
import React, { useState } from 'react';
import { Chapter, SubjectWithChapters } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import { RestartIcon } from './icons/RestartIcon';

interface ChapterListProps {
  chaptersBySubject: SubjectWithChapters[];
  onConfirm: (remainingChapters: Chapter[]) => void;
  onReset: () => void;
  isSscFlow: boolean;
}

const ChapterList: React.FC<ChapterListProps> = ({ chaptersBySubject, onConfirm, onReset, isSscFlow }) => {
  
  const allChapters = chaptersBySubject.flatMap(s => s.chapters);
  const [completedChapters, setCompletedChapters] = useState<Set<string>>(new Set());

  const handleToggleChapter = (chapterId: string) => {
    setCompletedChapters(prev => {
      const next = new Set(prev);
      if (next.has(chapterId)) {
        next.delete(chapterId);
      } else {
        next.add(chapterId);
      }
      return next;
    });
  };

  const handleGenerateRoutine = () => {
    const remaining = allChapters.filter(c => !completedChapters.has(c.id));
    if (remaining.length > 0) {
      onConfirm(remaining);
    } else {
      alert("You've completed all chapters! Please select at least one chapter to study.");
    }
  };

  const remainingCount = allChapters.length - completedChapters.size;
  const buttonText = isSscFlow ? "Next: Plan Duration" : "Generate 7-Day Plan";

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <h2 className="text-2xl font-bold text-center mb-1 text-slate-200">Your Syllabus Chapters</h2>
      <p className="text-center text-slate-400 mb-6">Check off the chapters you have already completed.</p>

      <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700 max-h-[60vh] overflow-y-auto">
        {chaptersBySubject.length > 0 ? (
          <div className="space-y-8">
            {chaptersBySubject.map((subject) => (
              <div key={subject.id}>
                <h3 className="text-xl font-bold text-cyan-400 mb-4 border-b border-slate-700 pb-2">{subject.name}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {subject.chapters.map((chapter) => (
                    <label
                      key={chapter.id}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                        completedChapters.has(chapter.id)
                          ? 'bg-slate-700/50 border-slate-600 line-through text-slate-500'
                          : 'bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 hover:border-cyan-500/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={completedChapters.has(chapter.id)}
                        onChange={() => handleToggleChapter(chapter.id)}
                        className="h-5 w-5 rounded bg-slate-700 border-slate-600 text-cyan-500 focus:ring-cyan-600 focus:ring-offset-slate-800 flex-shrink-0"
                      />
                      <span className="ml-3 text-slate-200 text-sm">{chapter.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-400">No chapters found for the selected subjects. Please go back and try again.</p>
        )}
      </div>

      <div className="mt-8 text-center">
        <p className="text-slate-400 mb-4">{remainingCount} chapter(s) remaining for your study plan.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleGenerateRoutine}
              disabled={remainingCount === 0}
              className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
                <SparklesIcon className="w-5 h-5" />
                {buttonText}
            </button>
            <button
                onClick={onReset}
                className="w-full sm:w-auto bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
                <RestartIcon className="w-5 h-5" />
                Start Over
            </button>
        </div>
      </div>
    </div>
  );
};

export default ChapterList;