
import React, { useState } from 'react';
import { DailyPlan } from '../types';
import { RestartIcon } from './icons/RestartIcon';
import { DownloadIcon } from './icons/DownloadIcon';

// TypeScript declarations for libraries loaded via CDN
declare const jspdf: any;

interface RoutineDisplayProps {
  routine: DailyPlan[];
  onReset: () => void;
}

const RoutineDisplay: React.FC<RoutineDisplayProps> = ({ routine, onReset }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPdf = () => {
    setIsDownloading(true);
    try {
      const { jsPDF } = jspdf;
      const doc = new jsPDF();
      
      doc.setFontSize(18);
      doc.text("Your Personalized Study Routine", 14, 22);

      let y = 30;

      routine.forEach((dayPlan) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }

        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(dayPlan.day, 14, y);
        y += 7;
        
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);

        dayPlan.slots.forEach(slot => {
            if (y > 280) {
              doc.addPage();
              y = 20;
            }
            const timeText = `${slot.time}:`;
            const topicText = `${slot.topic}`;
            const activityText = `(${slot.activity})`;

            doc.text(timeText, 16, y);
            doc.text(topicText, 45, y);
            doc.text(activityText, 47, y + 4);
            y += 10;
        });

        y += 5; // Add space between days
      });

      doc.save("study_routine.pdf");
    } catch (error) {
        console.error("Failed to generate PDF:", error);
        alert("Sorry, there was an error creating the PDF. Please try again.");
    } finally {
        setIsDownloading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in">
      <h2 className="text-3xl font-bold text-center mb-2 text-slate-100">Your Personalized Study Plan</h2>
      <p className="text-center text-slate-400 mb-8">Follow this schedule to ace your exams. Good luck!</p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
        <button
          onClick={onReset}
          className="w-full sm:w-auto bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
        >
          <RestartIcon className="w-5 h-5" />
          Start Over
        </button>
        <button
          onClick={handleDownloadPdf}
          disabled={isDownloading}
          className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <DownloadIcon className="w-5 h-5" />
          {isDownloading ? 'Generating PDF...' : 'Download as PDF'}
        </button>
      </div>

      <div className="bg-slate-900/50 p-4 sm:p-6 rounded-lg border border-slate-700 max-h-[65vh] overflow-y-auto">
        <div className="space-y-8">
          {routine.map((dayPlan) => (
            <div key={dayPlan.day}>
              <h3 className="text-xl sm:text-2xl font-bold text-cyan-400 mb-4 border-b-2 border-slate-700 pb-2 sticky top-0 bg-slate-900/50 backdrop-blur-sm py-2 px-2 -mx-2">
                {dayPlan.day}
              </h3>
              <ul className="space-y-4">
                {dayPlan.slots.map((slot, index) => (
                  <li key={index} className="flex flex-col sm:flex-row gap-2 sm:gap-4 p-4 rounded-lg bg-slate-800/60 border border-slate-700/50">
                    <div className="flex-shrink-0 w-full sm:w-40">
                      <p className="font-semibold text-purple-300">{slot.time}</p>
                    </div>
                    <div className="flex-grow">
                      <p className="font-bold text-slate-100">{slot.topic}</p>
                      <p className="text-sm text-slate-400 mt-1">{slot.activity}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoutineDisplay;