import React from 'react'

const MultiParagraphDisplay = ({ value }) => (
  <>
    <input type="hidden" value={value} />
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
