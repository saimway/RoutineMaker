
import React from 'react';

interface LoaderProps {
    message: string;
}

const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-400"></div>
      <h3 className="mt-6 text-xl font-semibold text-slate-200">{message}</h3>
      <p className="text-slate-400 mt-2">This may take a moment...</p>
    </div>
  );
};

export default Loader;