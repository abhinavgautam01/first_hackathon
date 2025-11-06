import React, {useState, useEffect} from 'react'
import { fetchTimings } from '../api'

function TimingsCard({item}){
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-500">{item.mode}</div>
          <div className="font-semibold">{item.from} → {item.to}</div>
          <div className="text-xs text-slate-500 mt-1">Departs: {item.departure}</div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{item.duration}</div>
          <div className="text-sm text-slate-600">{item.price}</div>
          <div className="text-xs text-slate-500">ETA</div>
        </div>
      </div>
    </div>
  )
}

export default function Hero(){
  const [from, setFrom] = useState('Kathmandu')
  const [to, setTo] = useState('Pokhara')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function onSearch(){
    setLoading(true)
    setError(null)
    try{
      const data = await fetchTimings(from, to)
      setResults(data)
    }catch(err){
      setError(err.message || 'Failed to fetch')
    }finally{
      setLoading(false)
    }
  }

  return (
    <section className="bg-linear-to-r from-white to-slate-50 p-6 rounded-2xl shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold">Fast, reliable taxi & bus timings across the hills</h1>
          <p className="mt-3 text-slate-600">Search schedules, book taxis, and combine routes to travel smart on your next Pahadi trip.</p>

          <div className="mt-6 bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex gap-3 items-stretch sm:flex-row flex-col">
              <input
                value={from}
                onChange={e=>setFrom(e.target.value)}
                className="w-full sm:flex-1 px-4 h-12 rounded-lg border box-border appearance-none"
                placeholder="From"
              />
              <input
                value={to}
                onChange={e=>setTo(e.target.value)}
                className="w-full sm:flex-1 px-4 h-12 rounded-lg border box-border appearance-none"
                placeholder="To"
              />
              <button
                onClick={onSearch}
                className="w-full sm:w-auto h-12 shrink-0 inline-flex items-center justify-center px-4 bg-accent text-white rounded-lg shadow hover:shadow-md transition-transform duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-accent/50"
                aria-label="Search routes"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
                  <path fillRule="evenodd" d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.386a1 1 0 01-1.415 1.415l-4.386-4.387zM14 8a6 6 0 11-12 0 6 6 0 0112 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Search</span>
              </button>
            </div>

            <div className="mt-3">
              {loading && <div className="text-sm text-slate-500">Loading results…</div>}
              {error && <div className="text-sm text-red-500">{error}</div>}
              {!loading && !error && results.length === 0 && (
                <div className="text-sm text-slate-500 mt-2">No results yet. Try searching for a route and press Search.</div>
              )}

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.map(item => (
                  <TimingsCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="order-first md:order-last">
          <div className="w-full h-56 md:h-80 rounded-xl overflow-hidden shadow-inner relative">
            {/* Himachal buses carousel */}
            <CarouselImages />
          </div>
        </div>
      </div>
    </section>
  )
}

function CarouselImages(){
  // prefer local images (public/images/*.jpg); fall back to Unsplash URLs if local file is missing
  const images = [
    {
      local: '/images/bus1.jpg',
      remote: 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&w=1400&q=80',
      alt: 'Himachal Pradesh bus on mountain road'
    },
    {
      local: '/images/bus2.jpg',
      remote: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1400&q=80',
      alt: 'Scenic hill road with local bus'
    },
    {
      local: '/images/bus3.jpg',
      remote: 'https://images.unsplash.com/photo-1473625247510-8ceb1760943f?auto=format&fit=crop&w=1400&q=80',
      alt: 'Mountain village and a bus stop'
    }
  ]

  const [idx, setIdx] = useState(0)

  useEffect(()=>{
    const t = setInterval(()=>{
      setIdx(i => (i + 1) % images.length)
    }, 4500)
    return ()=> clearInterval(t)
  }, [])

  function prev(){ setIdx(i => (i - 1 + images.length) % images.length) }
  function next(){ setIdx(i => (i + 1) % images.length) }

  const [currentSrc, setCurrentSrc] = useState(images[0].local || images[0].remote)

  useEffect(()=>{
    // update currentSrc when idx changes
    setCurrentSrc(images[idx].local)
  }, [idx])

  return (
    <div className="w-full h-full relative">
      <img
        src={currentSrc}
        alt={images[idx].alt}
        onError={(e)=>{
          // fallback to remote if local missing
          if(e.target && images[idx].remote){
            e.target.onerror = null
            e.target.src = images[idx].remote
            setCurrentSrc(images[idx].remote)
          }
        }}
        className="w-full h-full object-cover transition-opacity duration-500"
      />

      <button onClick={prev} aria-label="Previous" className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full p-2 hover:bg-black/50">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
          <path fillRule="evenodd" d="M12.293 16.293a1 1 0 010-1.414L15.586 11H4a1 1 0 110-2h11.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </button>

      <button onClick={next} aria-label="Next" className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full p-2 hover:bg-black/50">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
          <path fillRule="evenodd" d="M7.707 3.707a1 1 0 010 1.414L4.414 9H16a1 1 0 110 2H4.414l3.293 3.293a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </button>

      <div className="absolute left-1/2 -translate-x-1/2 bottom-3 flex gap-2">
        {images.map((_, i) => (
          <button key={i} onClick={()=>setIdx(i)} aria-label={`Show image ${i+1}`} className={`w-2 h-2 rounded-full ${i===idx? 'bg-white':'bg-white/50'}`} />
        ))}
      </div>
    </div>
  )
}
