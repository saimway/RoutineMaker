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

// A helper function to strip non-English characters for PDF generation
const cleanupTextForPdf = (text: string): string => {
    // Removes text in parentheses (often used for Bengali script)
    // and any other non-ASCII characters to prevent font corruption in the PDF.
    // e.g., "Shuva (সুভা)" -> "Shuva"
    return text.replace(/\s\(.*\)/, '').replace(/[^\x00-\x7F]/g, "").trim();
};

const RoutineDisplay: React.FC<RoutineDisplayProps> = ({ routine, onReset }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPdf = () => {
    setIsDownloading(true);
    try {
        const { jsPDF } = jspdf;
        const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

        const pageHeight = doc.internal.pageSize.getHeight();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 10;
        let y = 20;

        // Title
        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(30, 41, 59); // slate-800
        doc.text("Your Personalized Study Routine", margin, y);
        y += 15;

        routine.forEach((dayPlan) => {
            // Check for page break before adding a new day header
            // 10 for header + 7 for table header + 10 for first row (estimate)
            if (y > pageHeight - 30) { 
                doc.addPage();
                y = 20;
            }

            // Day Header
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(255, 255, 255); // white
            doc.setFillColor(6, 182, 212); // cyan-500
            doc.rect(margin, y - 5, pageWidth - (margin * 2), 10, 'F');
            doc.text(cleanupTextForPdf(dayPlan.day), margin + 3, y);
            y += 10;

            // Table Header
            const tableHeaderY = y;
            doc.setFontSize(10);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(51, 65, 85); // slate-700
            doc.text("Time", margin, tableHeaderY);
            doc.text("Topic / Subject", margin + 35, tableHeaderY);
            doc.text("Suggested Activity", margin + 110, tableHeaderY);
            doc.setDrawColor(226, 232, 240); // slate-200
            doc.line(margin, tableHeaderY + 2, pageWidth - margin, tableHeaderY + 2);
            y += 7;

            // Table Rows
            dayPlan.slots.forEach((slot, slotIndex) => {
                const isEven = slotIndex % 2 === 0;
                
                const timeText = slot.time;
                const topicText = doc.splitTextToSize(cleanupTextForPdf(slot.topic), 70); // 70mm width
                const activityText = doc.splitTextToSize(cleanupTextForPdf(slot.activity), 75); // 75mm width
                
                const rowHeight = Math.max(topicText.length, activityText.length) * 5 + 6; // Dynamic row height

                // Check for page break before adding a new row
                if (y + rowHeight > pageHeight - 15) {
                    doc.addPage();
                    y = 20;
                    // Redraw day header and table header on new page
                    doc.setFontSize(14);
                    doc.setFont(undefined, 'bold');
                    doc.setTextColor(255, 255, 255);
                    doc.setFillColor(6, 182, 212);
                    doc.rect(margin, y - 5, pageWidth - (margin * 2), 10, 'F');
                    doc.text(cleanupTextForPdf(dayPlan.day) + " (cont.)", margin + 3, y);
                    y += 10;
                    doc.setFontSize(10);
                    doc.setFont(undefined, 'bold');
                    doc.setTextColor(51, 65, 85);
                    doc.text("Time", margin, y);
                    doc.text("Topic / Subject", margin + 35, y);
                    doc.text("Suggested Activity", margin + 110, y);
                    doc.setDrawColor(226, 232, 240);
                    doc.line(margin, y + 2, pageWidth - margin, y + 2);
                    y += 7;
                }

                if (isEven) {
                    doc.setFillColor(241, 245, 249); // slate-100
                    doc.rect(margin, y - 5, pageWidth - (margin * 2), rowHeight, 'F');
                }
                
                doc.setFontSize(9);
                doc.setFont(undefined, 'normal');
                doc.setTextColor(71, 85, 105); // slate-600

                doc.text(timeText, margin, y);
                doc.text(topicText, margin + 35, y);
                doc.text(activityText, margin + 110, y);

                y += rowHeight;
            });

            y += 5; // Space between days
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
              <h3 className="text-xl sm:text-2xl font-bold text-cyan-400 mb-4 border-b-2 border-slate-700 pb-2 sticky top-0 bg-slate-900 backdrop-blur-sm py-2 px-2 -mx-2 z-10">
                {dayPlan.day}
              </h3>
              <ul className="space-y-4">
                {dayPlan.slots.map((slot, index) => {
                    const isBreak = slot.topic.toLowerCase().includes('break') || slot.topic.toLowerCase().includes('lunch');
                    return (
                        <li key={index} className="flex items-start gap-4 p-4 rounded-lg bg-slate-800/60 transition-all hover:bg-slate-800/90 border-l-4"
                            style={{ borderColor: isBreak ? '#f59e0b' : '#22d3ee' }} // amber-500 or cyan-400
                        >
                            <div className="flex-shrink-0 w-full sm:w-36">
                                <p className="font-mono text-sm text-purple-300">{slot.time}</p>
                            </div>
                            <div className="flex-grow">
                                <p className={`font-bold ${isBreak ? 'text-amber-300' : 'text-slate-100'}`}>{slot.topic}</p>
                                <p className="text-sm text-slate-400 mt-1">{slot.activity}</p>
                            </div>
                        </li>
                    );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoutineDisplay;
