import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  }, [onFileUpload]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  return (
    <div className="w-full flex flex-col items-center animate-fade-in">
        <label
            htmlFor="file-upload"
            className={`w-full max-w-lg cursor-pointer flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-xl transition-all duration-300 ${isDragging ? 'border-cyan-400 bg-slate-700/50 scale-105' : 'border-slate-600 hover:border-cyan-500 hover:bg-slate-700/30'}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
        >
            <UploadIcon className="w-12 h-12 text-slate-400 mb-4" />
            <p className="text-lg font-semibold text-slate-300">
                <span className="text-cyan-400">Click to upload</span> or drag and drop
            </p>
            <p className="text-sm text-slate-500">Image or PDF of your syllabus (JPG, PNG, PDF)</p>
            <input
                id="file-upload"
                type="file"
                className="hidden"
                accept="image/png, image/jpeg, application/pdf"
                onChange={handleFileChange}
            />
        </label>
        <div className="mt-6 text-center text-slate-400 text-sm max-w-md">
            <p className="font-bold mb-2">Next Steps:</p>
            <ol className="list-decimal list-inside text-left space-y-1">
                <li>Upload an image or PDF of your book's table of contents or course syllabus.</li>
                <li>Our AI will extract all the chapters or topics for you.</li>
                <li>Check off the chapters you've already completed.</li>
                <li>Get a custom 8-hour study plan for the remaining topics!</li>
            </ol>
        </div>
    </div>
  );
};

export default FileUpload;