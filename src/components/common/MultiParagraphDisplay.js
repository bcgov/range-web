import React from 'react';

const MultiParagraphDisplay = ({ value, className, ...props }) => (
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
