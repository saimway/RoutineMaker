import React from 'react';

export const GraduationCapIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c0 1.7.8 3.2 2.2 4.2" />
    <path d="M15.8 21.2c1.4-1 2.2-2.5 2.2-4.2v-5" />
    <path d="M12 12v9" />
  </svg>
);