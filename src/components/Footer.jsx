import React from 'react'

export default function Footer(){
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer" role="contentinfo" aria-label="Site footer">
      <div className="footer-inner">
        <div className="left">
          <img src="/src/assets/logo.svg" alt="GridPro logo" width="18" height="18" />
          <strong>Luis Fonseca</strong>
          <span className="sep">•</span>
          <span className="muted">GridPro - CSS Grid Generator</span>
        </div>
        <div className="right">
          <span className="muted">© {year}</span>
        </div>
      </div>
    </footer>
  )
}
