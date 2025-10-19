import React from 'react';

export const ScienceIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M12 2a10 10 0 1 0 10 10" />
    <path d="M12 2a10 10 0 1 0-9.1 5.9" />
    <path d="M12 2a10 10 0 1 0 9.1 5.9" />
    <path d="m2.9 8.1 1.9 1.9" />
    <path d="m19.2 8.1-1.9 1.9" />
    <path d="m8.1 2.9 1.9 1.9" />
    <path d="m8.1 19.2-1.9-1.9" />
  </svg>
);