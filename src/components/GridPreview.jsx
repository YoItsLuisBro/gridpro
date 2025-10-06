import { useMemo } from 'react'

function hashColor(name){
  // Simple deterministic pastel from name
  let h = 0
  for (let i=0;i<name.length;i++) h = (h*31 + name.charCodeAt(i)) >>> 0
  const hue = h % 360
  return `hsl(${hue}deg 70% 85%)`
}

export default function GridPreview({ style, rows, cols, areas, showNumbers }){
  const areaMatrix = areas && areas.length ? areas : null

  const cells = useMemo(() => {
    const out = []
    const rCount = rows
    const cCount = cols
    for(let r=0;r<rCount;r++){
      for(let c=0;c<cCount;c++){
        const idx = r*cCount + c + 1
        const area = areaMatrix?.[r]?.[c]
        out.push({ idx, r, c, area })
      }
    }
    return out
  }, [rows, cols, areaMatrix])

  const containerStyle = { ...style }
  if (areaMatrix){
    // Add template areas for visual fidelity
    containerStyle.gridTemplateAreas = areaMatrix.map(row => `"${row.join(' ')}"`).join(' ')
  }

  return (
    <div className="preview" style={containerStyle}>
      {cells.map(cell => {
        const hasArea = cell.area && cell.area !== '.'
        const bg = hasArea ? hashColor(cell.area) : undefined
        return (
          <div
            key={cell.idx}
            className="cell"
            data-area={hasArea ? cell.area : undefined}
            style={{
              background: hasArea ? bg : undefined
            }}
          >
            <div style={{display:'grid', placeItems:'center', gap:4}}>
              {showNumbers && <div>#{cell.idx}</div>}
              {hasArea && <div className="tag">{cell.area}</div>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
