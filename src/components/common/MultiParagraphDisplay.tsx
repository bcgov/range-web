import React from 'react';

interface MultiParagraphDisplayProps {
  value: string | number;
  className?: string;
  'aria-label'?: string;
  [key: string]: any;
}

const MultiParagraphDisplay: React.FC<MultiParagraphDisplayProps> = ({ value, className, ...props }) => (
  <>
    <input type="hidden" value={value} aria-label={props['aria-label']} />
    <div className={className}>
      {value
        .toString()
        .split('\n')
        .map((line, i) => (
          <p key={i}>{line}</p>
        ))}
    </div>
  </>
);

export default MultiParagraphDisplay;
