export default function Controls({ state, onChange, effectiveRows, effectiveCols, hasAreas }){
  const change = (k) => (e) => {
    const v = e.target.type === 'number' ? Number(e.target.value) : e.target.value
    onChange({ [k]: v })
  }

  return (
    <>
      <h3>Tracks</h3>
      <div className="control-row">
        <div className="control">
          <label htmlFor="cols">Columns</label>
          <input id="cols" type="number" min="1" value={state.cols} onChange={change('cols')} disabled={hasAreas} />
        </div>
        <div className="control">
          <label htmlFor="rows">Rows</label>
          <input id="rows" type="number" min="1" value={state.rows} onChange={change('rows')} disabled={hasAreas} />
        </div>
      </div>
      <div className="control-row">
        <div className="control">
          <label htmlFor="colSize">Column size (track)</label>
          <input id="colSize" placeholder="1fr, 200px, minmax(120px, 1fr)" value={state.colSize} onChange={change('colSize')} />
        </div>
        <div className="control">
          <label htmlFor="rowSize">Row size (track)</label>
          <input id="rowSize" placeholder="1fr, auto, 120px" value={state.rowSize} onChange={change('rowSize')} />
        </div>
      </div>

      <div className="row">
        <div className="control">
          <label htmlFor="gap">Gap (px)</label>
          <input id="gap" type="number" min="0" value={state.gap} onChange={change('gap')} />
        </div>
      </div>

      <h3>Alignment</h3>
      <div className="control-row">
        <div className="control">
          <label htmlFor="justifyItems">justify-items</label>
          <select id="justifyItems" value={state.justifyItems} onChange={change('justifyItems')}>
            <option>stretch</option><option>start</option><option>center</option><option>end</option>
          </select>
        </div>
        <div className="control">
          <label htmlFor="alignItems">align-items</label>
          <select id="alignItems" value={state.alignItems} onChange={change('alignItems')}>
            <option>stretch</option><option>start</option><option>center</option><option>end</option>
          </select>
        </div>
      </div>
      <div className="control-row">
        <div className="control">
          <label htmlFor="justifyContent">justify-content</label>
          <select id="justifyContent" value={state.justifyContent} onChange={change('justifyContent')}>
            <option>start</option><option>center</option><option>end</option><option>space-between</option><option>space-around</option><option>space-evenly</option>
          </select>
        </div>
        <div className="control">
          <label htmlFor="alignContent">align-content</label>
          <select id="alignContent" value={state.alignContent} onChange={change('alignContent')}>
            <option>start</option><option>center</option><option>end</option><option>space-between</option><option>space-around</option><option>space-evenly</option>
          </select>
        </div>
      </div>

      <h3>Areas (optional)</h3>
      <div className="row">
        <div className="control">
          <label htmlFor="areasInput">grid-template-areas (use . for empty)</label>
          <textarea
            id="areasInput"
            spellCheck="false"
            value={state.areasInput}
            onChange={change('areasInput')}
          />
          <div className="small">
            Tips: Each line is a row. Separate area names by spaces. Example: <code>header header header</code>
          </div>
        </div>
      </div>

      <div className="btns">
        <button className="btn secondary" onClick={() => onChange({ showNumbers: !state.showNumbers })}>
          {state.showNumbers ? 'Hide' : 'Show'} cell numbers
        </button>
        <button className="btn" onClick={() => onChange({ areasInput: '' })}>
          Clear areas
        </button>
        <button
          className="btn accent"
          onClick={() =>
            onChange({
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
            })
          }
        >
          Reset example
        </button>
      </div>

      <div className="small" style={{marginTop:8}}>
        Effective grid: {effectiveCols} × {effectiveRows} {hasAreas ? '(from areas)' : ''}
      </div>
    </>
  )
}
