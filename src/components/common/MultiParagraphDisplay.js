import React from 'react'

const MultiParagraphDisplay = ({ value }) =>
  value
    .toString()
    .split('\n')
    .map((line, i) => <p key={i}>{line}</p>)

export default MultiParagraphDisplay
