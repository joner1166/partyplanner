import { useState, useEffect } from 'react'

const SLIDES = [
  '/slide/1000087142.webp',
  '/slide/1000087143.webp',
  '/slide/1000087146.webp',
  '/slide/1000087721.webp',
  '/slide/1000087722.webp',
  '/slide/1000087723.webp',
  '/slide/1000087724.webp',
  '/slide/lindo%20fondo.webp',
  '/slide/lindo_DI_005.webp',
]

function ImageCarousel() {
  const [index, setIndex] = useState(0)
  const nextIndex = (index + 1) % SLIDES.length

  useEffect(() => {
    const timer = setInterval(() => setIndex(i => (i + 1) % SLIDES.length), 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="splash-carousel">
      {SLIDES.map((src, i) => {
        if (i !== index && i !== nextIndex) return null
        return (
          <img
            key={src}
            src={src}
            alt={`restaurant photo ${i + 1}`}
            className="splash-carousel-img"
            style={{ opacity: i === index ? 1 : 0 }}
          />
        )
      })}
    </div>
  )
}

export function SplashPage({ onStart }) {
  const [fading, setFading] = useState(false)

  const handleStart = () => {
    setFading(true)
    setTimeout(onStart, 700)
  }

  return (
    <div className={`splash-page${fading ? ' splash-fade-out' : ''}`}>
      <div className="splash-glow" />
      <div className="splash-left">
        <img src="/logolindo.png" alt="Lindo Michoacán" className="splash-logo" />
        <h1 className="splash-title">Original Lindo Michoacán</h1>
        <p className="splash-subtitle">Party &amp; Event Planner</p>
        <button className="splash-btn" onClick={handleStart} disabled={fading}>
          ✨ Start Planning Your Event
        </button>
      </div>
      <ImageCarousel />
    </div>
  )
}
