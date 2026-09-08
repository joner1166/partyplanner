import { useState, useEffect } from 'react'
import './splash.css'

// Salón — rota entre las fotos del restaurante y eventos de catering
const HERO = [
  { src: '/slide/1000087723.webp',   alt: 'Salón de Lindo Michoacán preparado para un evento',         caption: 'Large rooms for your event' },
  { src: '/slide/lindo_DI_005.webp', alt: 'Comedor de Lindo Michoacán',                                 caption: 'Comfortable dining, any occasion' },
  { src: '/slide/1000087146.webp',   alt: 'Buffet de catering con el logo de Lindo Michoacán',           caption: 'Professional staff, every event' },
  { src: '/slide/1000087721.webp',   alt: 'Catering de Lindo Michoacán en un evento corporativo',        caption: 'Corporate & private catering' },
  { src: '/slide/1000087722.webp',   alt: 'Catering de Lindo Michoacán con decoración de papel picado',  caption: 'Full-service catering setup' },
  { src: '/slide/banquets-1.webp',   alt: 'Mesa de banquete de Lindo Michoacán servida al aire libre',   caption: 'Full setup & delivery, anywhere' },
  { src: '/slide/lindo fondo.webp',  alt: 'Fachada del restaurante Lindo Michoacán',                     caption: 'The Original Lindo Michoacán' },
]

// Platillos — dos mosaicos que van cambiando de plato
const DISH_A = [
  { src: '/images/chicken/pollosarandeado.webp', name: 'Pollo Sarandeado' },
  { src: '/images/shrimp/camrajas.webp',         name: 'Camarones con Rajas' },
  { src: '/images/pork/cochinitahabanero.webp',  name: 'Cochinito Habanero' },
]
const DISH_B = [
  { src: '/images/steak/stk fajitas.webp',  name: 'Steak Fajitas' },
  { src: '/images/steak/tacosasada.webp',   name: 'Tacos de Carne Asada' },
  { src: '/images/chicken/pollomojo.webp',  name: 'Pollo al Mojo de Ajo' },
]

const TICK = 4200 // ms entre cambios

// Pila de imágenes con cross-fade: solo monta la activa + la siguiente
function PhotoStack({ items, index, kenBurns = false }) {
  const nextIndex = (index + 1) % items.length
  return items.map((item, i) => {
    if (i !== index && i !== nextIndex) return null
    return (
      <img
        key={item.src}
        src={item.src}
        alt={item.alt || item.name}
        loading={i === index ? 'eager' : 'lazy'}
        className={`sp-stack-img${kenBurns ? ' sp-kb' : ''}`}
        style={{ opacity: i === index ? 1 : 0 }}
      />
    )
  })
}

export function SplashPage({ onStart }) {
  const [tick, setTick]     = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), TICK)
    return () => clearInterval(id)
  }, [])

  const handleStart = () => {
    setFading(true)
    setTimeout(onStart, 700)
  }

  // Escalonados: el salón cambia cada tick, cada mosaico cada dos
  const heroIndex = tick % HERO.length
  const indexA    = Math.floor(tick / 2) % DISH_A.length
  const indexB    = Math.floor((tick + 1) / 2) % DISH_B.length

  return (
    <div className={`sp-root${fading ? ' sp-fade' : ''}`}>

      {/* ── Columna de texto ── */}
      <div className="sp-panel">
        <div className="sp-band">
          <img
            className="sp-logo"
            src="/logolindo.png"
            alt="The Original Lindo Michoacán — gourmet mexican cuisine, Las Vegas Nevada"
          />
        </div>

        <div className="sp-content">
          <div>
            <div className="sp-eyebrow">
              <span className="sp-rule" />
              Party &amp; Event Planner
            </div>
            <h1 className="sp-title">Your celebration,<br />cooked seriously.</h1>
            <p className="sp-lede">
              Reserve our dining room, full-service catering, or delivery — for 20 to 100 guests.
              Choose your date, your dishes, and get an estimated quote.
            </p>
          </div>

          <div className="sp-cta-wrap">
            <button type="button" className="sp-cta" onClick={handleStart} disabled={fading}>
              Start planning your event
              <span className="sp-arrow" aria-hidden="true">→</span>
            </button>
            <div className="sp-reassure">Free quote · no payment now · we answer within 24 hours</div>
          </div>

          <div className="sp-trust">
            <span>Since 1990</span>
            <span className="sp-dot" />
            <span>Las Vegas, Nevada</span>
          </div>
        </div>
      </div>

      {/* ── Mosaico de fotos ── */}
      <div className="sp-photos">
        <div className="sp-mosaic">
          <div className="sp-cell sp-cell-hero">
            <PhotoStack items={HERO} index={heroIndex} kenBurns />
            <div className="sp-hero-caption">
              <div className="sp-hero-title">{HERO[heroIndex].caption}</div>
            </div>
          </div>

          <div className="sp-cell">
            <PhotoStack items={DISH_A} index={indexA} />
            <div className="sp-dish-caption">{DISH_A[indexA].name}</div>
          </div>

          <div className="sp-cell">
            <PhotoStack items={DISH_B} index={indexB} />
            <div className="sp-dish-caption">{DISH_B[indexB].name}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
