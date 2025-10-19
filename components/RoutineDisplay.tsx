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
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPdf = () => {
    if (isExporting) return;
    setIsExporting(true);
    const { jsPDF } = jspdf;

    try {
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const PAGE_WIDTH = pdf.internal.pageSize.getWidth();
      const PAGE_HEIGHT = pdf.internal.pageSize.getHeight();
      const MARGIN = 12;
      const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
      let y = MARGIN;

      const dayHeaderColors = ['#22d3ee', '#34d399', '#fbbf24', '#38bdf8', '#818cf8', '#fb7185', '#c084fc'];

      const checkAndAddPage = (requiredHeight: number) => {
        if (y + requiredHeight > PAGE_HEIGHT - MARGIN) {
          pdf.addPage();
          y = MARGIN;
        }
      };
      
      // Main Title
      pdf.setFontSize(22);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor('#E2E8F0'); // slate-200
      pdf.text(`Your ${routine.length}-Day Study Plan`, PAGE_WIDTH / 2, y + 5, { align: 'center' });
      y += 20;

      routine.forEach((dayPlan, index) => {
        const dayHeaderHeight = 15;
        checkAndAddPage(dayHeaderHeight);

        // Day Header
        pdf.setFillColor(dayHeaderColors[index % dayHeaderColors.length]);
        pdf.roundedRect(MARGIN, y, CONTENT_WIDTH, 10, 3, 3, 'F');
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor('#FFFFFF');
        pdf.text(dayPlan.day, MARGIN + 4, y + 6.5);
        y += 12;

        dayPlan.slots.forEach(slot => {
          pdf.setFontSize(8);
          const topicLines = pdf.splitTextToSize(slot.topic, CONTENT_WIDTH - 20);
          const activityLines = pdf.splitTextToSize(slot.activity, CONTENT_WIDTH - 20);
          
          const slotHeight = 8 + (topicLines.length * 4) + (activityLines.length * 3.5) + 4;
          
          checkAndAddPage(slotHeight);

          // Slot background
          pdf.setFillColor('#1E293B'); // slate-800
          pdf.setDrawColor('#334155'); // slate-700
          pdf.roundedRect(MARGIN + 2, y, CONTENT_WIDTH - 4, slotHeight - 2, 2, 2, 'FD');

          let textY = y + 5;

          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor('#22d3ee'); // cyan-400
          pdf.text(slot.time, MARGIN + 5, textY);
          textY += 6;

          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor('#E2E8F0'); // slate-200
          pdf.text(topicLines, MARGIN + 5, textY);
          textY += topicLines.length * 4;

          pdf.setFontSize(8);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor('#94A3B8'); // slate-400
          pdf.text(activityLines, MARGIN + 5, textY);

          y += slotHeight;
        });
        y += 5; // Space between days
      });
      
      pdf.save(`study-plan-${routine.length}-days.pdf`);

    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Sorry, there was an error creating the PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const dayColors = [
    'border-t-cyan-400', 'border-t-emerald-400', 'border-t-amber-400', 
    'border-t-sky-400', 'border-t-indigo-400', 'border-t-rose-400', 'border-t-purple-400'
  ];

  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in">
      <div className="text-center mb-8 px-4">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">Your {routine.length}-Day Study Plan</h2>
        <p className="text-slate-400">A detailed, day-by-day schedule to keep you on track. Good luck!</p>
      </div>
      
      <div className="p-2 sm:p-4 bg-slate-900/50 rounded-lg border border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-h-[60vh] overflow-y-auto p-4">
          {routine.map((dayPlan, index) => (
            <div key={index} className={`flex flex-col bg-slate-800/70 rounded-lg border border-slate-700 border-t-4 ${dayColors[index % dayColors.length]}`}>
              <h3 className="text-xl font-bold text-center text-slate-100 py-3 px-2 border-b border-slate-700">{dayPlan.day}</h3>
              <div className="p-3 space-y-3">
                {dayPlan.slots.map((slot, slotIndex) => (
                  <div key={slotIndex} className="bg-slate-900/50 p-3 rounded-md">
                    <p className="font-semibold text-cyan-400 text-xs">{slot.time}</p>
                    <h4 className="font-medium text-slate-200 text-sm">{slot.topic}</h4>
                    <p className="text-slate-400 text-xs mt-1">{slot.activity}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-10">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleExportPdf}
            disabled={isExporting}
            className="w-full sm:w-auto bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
          >
            <DownloadIcon className="w-5 h-5" />
            {isExporting ? 'Exporting...' : 'Export as PDF'}
          </button>
          <button
            onClick={onReset}
            className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <RestartIcon className="w-5 h-5" />
            Create Another Routine
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoutineDisplay;
