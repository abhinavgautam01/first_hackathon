export async function fetchTimings(from = '', to = ''){
  const res = await fetch('/mock/timings.json')
  if(!res.ok) throw new Error('Failed to load mock timings')
  const data = await res.json()
  const qFrom = (from || '').toLowerCase().trim()
  const qTo = (to || '').toLowerCase().trim()

  // simple filter: check that both from and to strings appear in the record
  return data.filter(item => {
    const itemFrom = (item.from || '').toLowerCase()
    const itemTo = (item.to || '').toLowerCase()
    const fromMatch = qFrom === '' || itemFrom.includes(qFrom)
    const toMatch = qTo === '' || itemTo.includes(qTo)
    return fromMatch && toMatch
  })
}
