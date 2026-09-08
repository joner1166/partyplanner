import { useState, useEffect } from 'react'

const SLIDES = [
  '/slide/1000087142.jpg',
  '/slide/1000087143.jpg',
  '/slide/1000087146.jpg',
  '/slide/1000087721.jpg',
  '/slide/1000087722.jpg',
  '/slide/1000087723.jpg',
  '/slide/1000087724.jpg',
  '/slide/lindo%20fondo.jpg',
  '/slide/lindo_DI_005.jpg',
]

function ImageCarousel() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setIndex(i => (i + 1) % SLIDES.length), 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="splash-carousel">
      {SLIDES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`restaurant photo ${i + 1}`}
          className="splash-carousel-img"
          style={{ opacity: i === index ? 1 : 0 }}
        />
      ))}
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
