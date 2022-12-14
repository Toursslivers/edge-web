import React from 'react'
const TYPE_MAP = {
  note: {
    // color: '#8792a2',
  },
  caution: {
    // color: '#d97917',
  },
  check: {
    // color: '#000000',
  },
  warning: {
    // color: '#ed5f74',
  },
}

export function Callout({ children, type, title }: any) {
  return (
    <div className="callout">
      <h3>{title}</h3>
      {children}
    </div>
  )
}
