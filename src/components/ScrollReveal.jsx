import React from 'react';

export default function ScrollReveal({ children, textClassName = '', className = '' }) {
  return (
    <div className={`${textClassName} ${className}`}>
      {children}
    </div>
  );
}
