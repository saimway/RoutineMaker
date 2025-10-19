import React, { useState } from 'react';
import { Subject } from '../types';
import { SSC_26_BOOKS } from '../constants/sscBooks';

interface SscBookSelectorProps {
  onBooksSelect: (books: Subject[]) => void;
}

const SscBookSelector: React.FC<SscBookSelectorProps> = ({ onBooksSelect }) => {
    const [selectedBooks, setSelectedBooks] = useState<Set<string>>(new Set());

    const handleToggleBook = (bookId: string) => {
        setSelectedBooks(prev => {
            const next = new Set(prev);
            if (next.has(bookId)) {
                next.delete(bookId);
            } else {
                next.add(bookId);
            }
            return next;
        });
    };

    const handleSubmit = () => {
        const finalBooks = SSC_26_BOOKS.filter(b => selectedBooks.has(b.id));
        if (finalBooks.length > 0) {
            onBooksSelect(finalBooks);
        } else {
            alert("Please select at least one subject.");
        }
    };
    
    const canProceed = selectedBooks.size > 0;

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in">
        <h2 className="text-2xl font-bold text-center mb-1 text-slate-200">Choose Your SSC-26 Subjects</h2>
        <p className="text-center text-slate-400 mb-6">Select the subjects you want to include in your study plan.</p>

        <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {SSC_26_BOOKS.map(book => (
                    <label
                        key={book.id}
                        className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                        selectedBooks.has(book.id)
                            ? 'bg-purple-500/20 border-purple-500/30'
                            : 'bg-slate-800/50 border-slate-700 hover:bg-slate-700/50'
                        }`}
                    >
                        <input
                        type="checkbox"
                        checked={selectedBooks.has(book.id)}
                        onChange={() => handleToggleBook(book.id)}
                        className="h-5 w-5 rounded bg-slate-700 border-slate-600 text-purple-500 focus:ring-purple-600 focus:ring-offset-slate-800"
                        />
                        <span className="ml-3 text-sm text-slate-200">{book.name}</span>
                    </label>
                ))}
            </div>
        </div>

        <div className="mt-8 text-center">
            <button
                onClick={handleSubmit}
                disabled={!canProceed}
                className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
                Select Chapters
            </button>
        </div>
    </div>
  );
};

export default SscBookSelector;
