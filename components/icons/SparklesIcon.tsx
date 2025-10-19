
import React from 'react';

export const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2z" />
    <path d="M20 2L19 4" />
    <path d="M4 2L5 4" />
    <path d="M2 20L4 19" />
    <path d="M22 20L20 19" />
    <path d="M12 22v-2" />
    <path d="M12 2v2" />
    <path d="M2 12h2" />
    <path d="M22 12h-2" />
  </svg>
);
