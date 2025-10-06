import { useEffect, useMemo, useState } from 'react'
import Controls from './components/Controls.jsx'
import GridPreview from './components/GridPreview.jsx'
import CodePanel from './components/CodePanel.jsx'
import Footer from './components/Footer.jsx'

const DEFAULTS = {
  cols: 4,
  rows: 3,
  colSize: '1fr',
  rowSize: '1fr',
  gap: 12,
  justifyItems: 'stretch',
  alignItems: 'stretch',
  justifyContent: 'start',
  alignContent: 'start',
  showNumbers: true,
  areasInput: `header header header header
sidebar main   main   main
footer footer  footer  footer`
}

const STORAGE_KEY = 'gridpro@v1'

export default function App(){
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : DEFAULTS
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const { parsedAreas, areaNames, dimsFromAreas } = useMemo(() => {
    const lines = (state.areasInput || '').trim().split('\n').filter(Boolean)
    const grid = lines.map(l => l.replaceAll('"','').trim().split(/\s+/))
    const names = new Set()
    grid.forEach(r => r.forEach(c => { if(c !== '.') names.add(c) }))
    const dims = { rows: grid.length || null, cols: grid[0]?.length || null }
    return { parsedAreas: grid, areaNames: Array.from(names), dimsFromAreas: dims }
  }, [state.areasInput])

  const effectiveCols = dimsFromAreas.cols || state.cols
  const effectiveRows = dimsFromAreas.rows || state.rows

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${effectiveCols}, ${state.colSize})`,
    gridTemplateRows: `repeat(${effectiveRows}, ${state.rowSize})`,
    gap: `${state.gap}px`,
    justifyItems: state.justifyItems,
    alignItems: state.alignItems,
    justifyContent: state.justifyContent,
    alignContent: state.alignContent
  }

  const areasCss = useMemo(() => {
    if (!parsedAreas.length) return ''
    return parsedAreas.map(row => `"${row.join(' ')}"`).join('\n        ')
  }, [parsedAreas])

  const handleUpdate = patch => setState(s => ({ ...s, ...patch }))

  return (
    <div className="app">
      <header className="header">
        <div className="logo" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="4" fill="#CADCAE" stroke="#EDA35A" strokeWidth="1.5"/>
            <path d="M9 4.5v15M15 4.5v15M4.5 9h15M4.5 15h15" stroke="#EDA35A" strokeWidth="1.25"/>
          </svg>
        </div>
        <div className="title">GridPro</div>
        <div className="badge">CSS Grid Generator</div>
      </header>

      <div className="grid">
        <section className="panel controls" aria-label="Controls">
          <Controls
            state={state}
            effectiveRows={effectiveRows}
            effectiveCols={effectiveCols}
            hasAreas={!!parsedAreas.length}
            onChange={handleUpdate}
          />
        </section>

        <section className="panel preview-wrap" aria-label="Preview">
          <div className="preview-head">
            <div className="preview-label">Preview</div>
            <div className="kv small">
              {effectiveCols} × {effectiveRows} | gap: {state.gap}px
            </div>
          </div>
          <GridPreview
            style={gridStyle}
            rows={effectiveRows}
            cols={effectiveCols}
            areas={parsedAreas}
            showNumbers={state.showNumbers}
          />
        </section>
      </div>

      <section className="panel code" aria-label="Code">
        <CodePanel
          containerCss={{
            gridTemplateColumns: gridStyle.gridTemplateColumns,
            gridTemplateRows: gridStyle.gridTemplateRows,
            gap: gridStyle.gap,
            justifyItems: state.justifyItems,
            alignItems: state.alignItems,
            justifyContent: state.justifyContent,
            alignContent: state.alignContent,
            areas: areasCss
          }}
          areaNames={areaNames}
        />
      </section>

      <Footer />
    </div>
  )
}
