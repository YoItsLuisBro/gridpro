import { useMemo, useRef, useState } from 'react'

export default function CodePanel({ containerCss, areaNames }){
  const [copiedCss, setCopiedCss] = useState(false)
  const [copiedHtml, setCopiedHtml] = useState(false)
  const cssRef = useRef(null)
  const htmlRef = useRef(null)

  const cssText = useMemo(() => {
    const lines = [
      `.grid {`,
      `  display: grid;`,
      `  grid-template-columns: ${containerCss.gridTemplateColumns};`,
      `  grid-template-rows: ${containerCss.gridTemplateRows};`,
      `  gap: ${containerCss.gap};`,
      `  justify-items: ${containerCss.justifyItems};`,
      `  align-items: ${containerCss.alignItems};`,
      `  justify-content: ${containerCss.justifyContent};`,
      `  align-content: ${containerCss.alignContent};`,
    ]
    if (containerCss.areas){
      lines.push(`  grid-template-areas:\n        ${containerCss.areas};`)
    }
    lines.push(`}`)
    if (areaNames.length){
      lines.push('')
      areaNames.forEach(name => {
        lines.push(`.${name} { grid-area: ${name}; }`)
      })
    }
    return lines.join('\n')
  }, [containerCss, areaNames])

  const htmlText = useMemo(() => {
    if (areaNames.length){
      // Create one element per unique area
      const items = areaNames.map(n => `  <div class="${n}">${n}</div>`).join('\n')
      return `<div class="grid">\n${items}\n</div>`
    }
    // Fallback: generic cells
    return `<div class="grid">\n  <div>item 1</div>\n  <div>item 2</div>\n  <div>item 3</div>\n</div>`
  }, [areaNames])

  const copy = async (text, which) => {
    try{
      await navigator.clipboard.writeText(text)
      which === 'css' ? setCopiedCss(true) : setCopiedHtml(true)
      setTimeout(() => which === 'css' ? setCopiedCss(false) : setCopiedHtml(false), 1200)
    }catch(e){
      // Fallback
      const el = which === 'css' ? cssRef.current : htmlRef.current
      if (el){
        const range = document.createRange()
        range.selectNodeContents(el)
        const sel = window.getSelection()
        sel.removeAllRanges()
        sel.addRange(range)
      }
    }
  }

  const downloadCss = () => {
    const blob = new Blob([cssText], { type: 'text/css' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'grid.css'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <h3>Generated CSS</h3>
      <pre ref={cssRef}><code>{cssText}</code></pre>
      <div className="copy-footer">
        <button className="btn" onClick={() => copy(cssText, 'css')}>Copy CSS</button>
        <button className="btn accent" onClick={downloadCss}>Download .css</button>
        <span className={`copy-ok ${copiedCss ? 'show':''}`}>Copied!</span>
      </div>

      <h3>Sample HTML</h3>
      <pre ref={htmlRef}><code>{htmlText}</code></pre>
      <div className="copy-footer">
        <button className="btn" onClick={() => copy(htmlText, 'html')}>Copy HTML</button>
        <span className={`copy-ok ${copiedHtml ? 'show':''}`}>Copied!</span>
      </div>
    </>
  )
}
