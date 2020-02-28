import React from 'react'

const MultiParagraphDisplay = ({ value, ...props }) => (
  <>
    <input type="hidden" value={value} aria-label={props['aria-label']} />
    <div>
      {value
        .toString()
        .split('\n')
        .map((line, i) => (
          <p key={i}>{line}</p>
        ))}
    </div>
  </>
)

export default MultiParagraphDisplay
