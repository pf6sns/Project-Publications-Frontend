import React from 'react';

export default function BlurText({ text, className = '' }) {
  return (
    <span className={`inline-flex flex-wrap ${className}`}>
      {text}
    </span>
  );
}
