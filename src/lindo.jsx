import { useState, useEffect, useRef } from 'react'

// ─────────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────────
const PEOPLE_OPTIONS = [20, 25, 30, 35, 40, 45, 50, 55, 60, 70, 80, 90, 100]

// Pricing rules:
//  Dine In  Mon–Thu lunch $25/pp, dinner $35/pp
//  Dine In  Fri–Sun lunch $30/pp, dinner $40/pp
//  Dine In  >70 guests → $50/pp (overrides all above)
//  Catering Full Service: $200 flat + $25/pp
//  Delivery Only: $25/pp

const SERVICE_LABELS = {
  dinein:   'Dine In',
  catering: 'Catering Full Service',
  delivery: 'Delivery Only',
}

const LUNCH_TIMES  = ['11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '3:30 PM']
const DINNER_TIMES = ['4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM']

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// ── Menu data — add real photo files to public/images/[category]/
export const MENU_DATA = {
  chicken: {
    label: 'Chicken', icon: '🍗',
    items: [
      { name: 'Pollo Sarandeado',        desc: 'Grilled chicken breast basted with Sarandeado sauce, a selection of dried chiles, secret spices and blended with a touch of mayonnaise.',                                          emoji: '🔥', img: '/images/chicken/pollosarandeado.jpg' },
      { name: 'Pollo con Rajas y Crema', desc: 'Grilled chicken breast, sautéed in a little olive oil, onions and fresh roasted pasilla strips in a cream sauce.',                                                                   emoji: '🍗', img: '/images/chicken/pollorajas.jpg'      },
      { name: 'Chicken Fajitas',         desc: 'Chicken breast stir-fried with green, yellow and red peppers, onions, cilantro and tomato.',                                                                                          emoji: '🌮', img: '/images/chicken/chickenfajitas.jpg'   },
      { name: 'Pollo al Mojo de Ajo',    desc: 'Chicken breast cooked in olive oil, wine, fresh garlic and slices of Guajillo peppers.',                                                                                              emoji: '🧄', img: '/images/chicken/pollomojo.jpg'        },
    ],
  },
  steak: {
    label: 'Steak', icon: '🥩',
    items: [
      { name: 'Steak Fajitas',    desc: 'Marinated beef stir-fried with green, yellow and red peppers, onions, cilantro and spices.',                                                              emoji: '🥩', img: '/images/steak/stk fajitas.jpg'       },
      { name: 'Chile Colorado',   desc: 'Steak in small chunks, sautéed in red sauce, made with dried chile de arbol, Guajillo, fresh tomato and spices.',                                        emoji: '🌶️', img: '/images/steak/chilecolorado.jpg' },
      { name: 'Carne Asada Tacos',desc: 'Broiled and diced steak cooked with pico de gallo and served with avocado sauce.',                                                                        emoji: '🌮', img: '/images/steak/tacosasada.jpg'    },
    ],
  },
  pork: {
    label: 'Pork', icon: '🐷',
    items: [
      { name: 'Carnitas',               desc: 'Lean pork, marinated with fresh oranges and spices. Slowly cooked in its own juices until tender. Served with chiles toreados and avocado salsa.',              emoji: '🐷', img: '/images/pork/carnitas.jpg'             },
      { name: 'Carnitas a la Mexicana', desc: 'Lean pork sauteed with onions, tomatoes, jalapeños and cilantro.',                                                                                                    emoji: '🍅', img: '/images/pork/carnitasmexicana.jpg'    },
      { name: 'Chile Verde',            desc: 'Lean pork simmered in our delicious green salsa made with tomatillos, green peppers, onions, cilantro, fresh garlic and different spices.',                           emoji: '🫕', img: '/images/pork/chileverde.jpg'           },
      { name: 'Cochinito Habanero',     desc: 'Lean pork sauteed with onions, tomatoes, habanero, jalapeños and cilantro with a touch of Blue Agave tequila for a special taste.',                                  emoji: '🌶️', img: '/images/pork/cochinitahabanero.jpg'    },
    ],
  },
  shrimp: {
    label: 'Shrimp', icon: '🦐',
    items: [
      { name: 'Camarones a la Diabla',      desc: 'Large fresh Mexican Gulf shrimp sautéed in a red sauce made with a combination of dried chiles, tomato and bit of ketchup.',                                                              emoji: '🔥', img: '/images/shrimp/camaronesdiabla.jpg'      },
      { name: 'Camarones Sarandeados',      desc: 'Large fresh Mexican Gulf shrimp basted in sarandeado sauce with a selection of dried chiles, and secret spices blended with a touch of mayonnaise.',                                   emoji: '🍤', img: '/images/shrimp/camaronessarandeados.jpg' },
      { name: 'Camarones con Rajas y Crema',desc: 'Large fresh Mexican Gulf shrimp sautéed in a little olive oil, and fresh roasted pasilla strips in a cream sauce.',                                                                    emoji: '🦐', img: '/images/shrimp/camrajas.jpg'      },
      { name: 'Shrimp Fajitas',             desc: 'Large fresh Mexican Gulf shrimp stir-fried with green, yellow and red peppers, onions, cilantro, tomatoes and spices.',                                                                emoji: '🌮', img: '/images/shrimp/shrimpfajitas.jpg' },
    ],
  },
}

// ─────────────────────────────────────────────
//  SUB-COMPONENTS
// ─────────────────────────────────────────────

function DishCard({ dish, selected, onToggle }) {
  const [imgFailed, setImgFailed] = useState(false)
  return (
    <div className={`dish-card${selected ? ' selected' : ''}`} onClick={onToggle}>
      <div className="dish-check">✓</div>
      <div className="dish-img-wrap">
        {!imgFailed ? (
          <img
            src={dish.img}
            alt={dish.name}
            className="dish-img"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <span className="dish-emoji">{dish.emoji}</span>
        )}
      </div>
      <div className="dish-name">{dish.name}</div>
      <div className="dish-desc">{dish.desc}</div>
    </div>
  )
}

function Calendar({ selectedDate, onSelectDate }) {
  const [viewDate, setViewDate] = useState(() => {
    const d = new Date(); d.setDate(1); return d
  })
  const today    = new Date()
  const todayStr = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
  const year     = viewDate.getFullYear()
  const month    = viewDate.getMonth()
  const firstDay    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const changeMonth = (dir) => {
    const d = new Date(viewDate)
    d.setMonth(d.getMonth() + dir)
    setViewDate(d)
  }

  return (
    <div className="calendar">
      <div className="cal-header">
        <button className="cal-nav" onClick={() => changeMonth(-1)}>‹</button>
        <span>{MONTHS[month]} {year}</span>
        <button className="cal-nav" onClick={() => changeMonth(1)}>›</button>
      </div>
      <div className="cal-grid">
        {DAYS.map(d => <div key={d} className="cal-day-name">{d}</div>)}
        {Array.from({ length: firstDay }, (_, i) => <div key={`e${i}`} className="cal-day empty" />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const d        = i + 1
          const ts       = new Date(year, month, d).getTime()
          const isPast   = ts < todayStr
          const isToday  = ts === todayStr
          const isSel    = selectedDate &&
            selectedDate.getFullYear() === year &&
            selectedDate.getMonth()    === month &&
            selectedDate.getDate()     === d
          const cls = ['cal-day', isPast && 'past', isToday && 'today', isSel && 'selected']
            .filter(Boolean).join(' ')
          return (
            <div
              key={d}
              className={cls}
              onClick={isPast ? undefined : () => onSelectDate(new Date(year, month, d))}
            >{d}</div>
          )
        })}
      </div>
    </div>
  )
}

function Modal({ title, icon, closeLabel, onClose, children }) {
  return (
    <div
      className="modal-overlay show"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <div className="modal-header">
          <span className="modal-icon">{icon}</span>
          <h2>{title}</h2>
        </div>
        {children}
        <button className="close-btn" onClick={onClose}>{closeLabel}</button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
//  MAIN APP
// ─────────────────────────────────────────────
export default function App({ onHome }) {

  // ── Booking state ──
  const [service,        setService]        = useState(null)
  const [people,         setPeople]         = useState(null)
  const [date,           setDate]           = useState(null)
  const [time,           setTime]           = useState(null)
  const [timePeriod,     setTimePeriod]     = useState(null)
  const [menuSelections, setMenuSelections] = useState([])
  const [menuConfirmed,  setMenuConfirmed]  = useState(false)
  const [activeCategory, setActiveCategory] = useState('chicken')

  // ── Contact form ──
  const [fname,    setFname]    = useState('')
  const [lname,    setLname]    = useState('')
  const [phone,    setPhone]    = useState('')
  const [email,    setEmail]    = useState('')
  const [comments, setComments] = useState('')

  // ── Policy & UI ──
  const [privacyOk,  setPrivacyOk]  = useState(false)
  const [termsOk,    setTermsOk]    = useState(false)
  const [modal,      setModal]      = useState(null)   // 'privacy' | 'terms' | 'thankyou'
  const [submitting, setSubmitting] = useState(false)

  const menuRef    = useRef(null)
  const contactRef = useRef(null)

  const s2done = !!(service && people && date && time)

  // Auto-scroll to menu when step 2 completes
  useEffect(() => {
    if (s2done && menuRef.current) {
      setTimeout(() => menuRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150)
    }
  }, [s2done])

  // Auto-scroll to contact when menu confirmed
  useEffect(() => {
    if (menuConfirmed && contactRef.current) {
      setTimeout(() => contactRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150)
    }
  }, [menuConfirmed])

  // ── Pricing ──
  const calcPrice = () => {
    if (!service || !people) return null
    if (service === 'catering') return 200 + people * 25
    if (service === 'delivery') return people * 25
    // dinein requires a selected time and date
    if (!timePeriod || !date) return null
    if (people > 70) return people * 50
    const dow = date.getDay() // 0=Sun,1=Mon,…,6=Sat
    const isWeekend = dow === 0 || dow === 5 || dow === 6
    const rate = isWeekend
      ? (timePeriod === 'lunch' ? 30 : 40)
      : (timePeriod === 'lunch' ? 25 : 35)
    return people * rate
  }
  const total = calcPrice()

  // ── Menu helpers ──
  const maxDishes = people <= 50 ? 3 : 4

  const toggleDish = (cat, idx) => {
    const dish = MENU_DATA[cat].items[idx]
    setMenuSelections(prev => {
      const exists = prev.findIndex(s => s.category === cat && s.name === dish.name)
      if (exists >= 0) return prev.filter((_, i) => i !== exists)
      if (prev.length >= maxDishes) {
        alert(`For ${people} guests you can select up to ${maxDishes} dishes. Remove one before adding another.`)
        return prev
      }
      return [...prev, { category: cat, name: dish.name, price: dish.price }]
    })
  }

  // ── Submit to Netlify Forms ──
  const handleSubmit = async () => {
    if (!fname.trim() || !lname.trim()) { alert('Please enter your first and last name.'); return }
    if (!phone.trim())                   { alert('Please enter your phone number.'); return }

    const fullName = `${fname.trim()} ${lname.trim()}`
    const ds       = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    const period   = timePeriod === 'lunch' ? 'Lunch (Special Pricing)' : 'Dinner (Regular Pricing)'
    const menuText = menuSelections.length > 0
      ? menuSelections.map(s => s.name).join(' | ')
      : 'No specific menu selected'

    setSubmitting(true)

    // In local dev Netlify Forms isn't available — skip the network call
    if (import.meta.env.DEV) {
      setTimeout(() => { setSubmitting(false); setModal('thankyou') }, 600)
      return
    }

    const body = new URLSearchParams({
      'form-name':       'event-booking',
      'customer-name':   fullName,
      'phone':           phone.trim(),
      'email':           email.trim() || 'Not provided',
      'service-type':    SERVICE_LABELS[service],
      'guests':          String(people),
      'event-date':      ds,
      'event-time':      `${time} — ${period}`,
      'menu-selections':  menuText,
      'estimated-quote':  total ? `$${total.toLocaleString()}` : 'TBD',
      'comments':         comments.trim() || 'None',
    })

    try {
      const res = await fetch('/', {
        method:  'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body:    body.toString(),
      })
      // Netlify returns 200 on success (it processes the form at CDN edge)
      if (res.ok) {
        setModal('thankyou')
      } else {
        throw new Error(`HTTP ${res.status}`)
      }
    } catch (err) {
      console.error('Netlify Forms error:', err)
      alert('There was a problem sending your request. Please try again or call us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Reset ──
  const resetForm = () => {
    setService(null); setPeople(null); setDate(null)
    setTime(null); setTimePeriod(null)
    setMenuSelections([]); setMenuConfirmed(false)
    setActiveCategory('chicken')
    setFname(''); setLname(''); setPhone(''); setEmail(''); setComments('')
    setPrivacyOk(false); setTermsOk(false)
    setModal(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ── Progress ──
  const progSteps = [
    { label: 'Service', done: !!service },
    { label: 'Details', done: s2done },
    { label: 'Menu',    done: menuConfirmed },
    { label: 'Contact', done: false },
  ]

  // ─────────────────────────────────────────────
  //  RENDER
  // ─────────────────────────────────────────────
  return (
    <>
      {/* ── HEADER ── */}
      <header className="header">
        <div className="header-logo">
          <img
            src="/logolindo.png"
            alt="Lindo Michoacán"
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block' }}
          />
          <span className="logo-fallback" style={{ display: 'none' }}>☀️</span>
        </div>
        <div className="header-text">
          <h1>Original Lindo Michoacán Party Planner</h1>
          <p>Reserve your Dine In, Catering, or Delivery event with us</p>
        </div>
        <button className="home-btn" onClick={() => { resetForm(); onHome?.() }}>🏠 <span>HOME</span></button>
      </header>

      <div className="container">

        {/* ── PROGRESS BAR ── */}
        <div className="progress-bar">
          {progSteps.map((s, i) => {
            const prevDone = i === 0 || progSteps[i - 1].done
            const cls = `progress-step${s.done ? ' done' : prevDone ? ' active' : ''}`
            return (
              <div key={s.label} style={{ display: 'contents' }}>
                <div className={cls}>
                  <div className="dot">{s.done ? '✓' : i + 1}</div>
                  &nbsp;{s.label}
                </div>
                {i < progSteps.length - 1 && (
                  <div className={`progress-line${s.done ? ' done' : ''}`} />
                )}
              </div>
            )
          })}
        </div>

        {/* ── STEP 1: SERVICE ── */}
        <div className="step-label">STEP 1: SELECT SERVICE TYPE</div>
        <div className="service-cards">
          {[
            { id: 'dinein',   icon: '🪑',  title: 'DINE IN' },
            { id: 'catering', icon: '🍽️', title: 'CATERING', sub: 'FULL SERVICE' },
            { id: 'delivery', icon: '🚚',  title: 'DELIVERY ONLY' },
          ].map(s => (
            <div
              key={s.id}
              className={`service-card${service === s.id ? ' active' : ''}`}
              onClick={() => setService(s.id)}
            >
              <div className="card-icon">{s.icon}</div>
              <div className="card-title">{s.title}</div>
              {s.sub && <div className="card-sub">{s.sub}</div>}
            </div>
          ))}
        </div>

        {/* ── STEP 2: EVENT DETAILS ── */}
        <div className="step-label" style={{ marginTop: 14 }}>STEP 2: EVENT DETAILS</div>
        <div className="event-section">
          <div className="event-grid">
            {/* LEFT: People + Calendar */}
            <div className="event-left">
              <div>
                <div className="field-label">
                  Number of People
                  {people && <span className="people-selected-label">{people} guests</span>}
                </div>
                <div className="people-grid">
                  {PEOPLE_OPTIONS.map(n => (
                    <button
                      key={n}
                      className={`people-btn${n === people ? ' active' : ''}`}
                      onClick={() => setPeople(n)}
                    >{n}</button>
                  ))}
                </div>
              </div>
              <div>
                <div className="field-label">DATE</div>
                <Calendar selectedDate={date} onSelectDate={setDate} />
              </div>
            </div>

            {/* RIGHT: Time */}
            <div className="event-right">
              <div>
                <div className="field-label">
                  TIME &nbsp;
                  <span style={{ color: '#888', fontWeight: 'normal', fontSize: '0.75rem' }}>
                    (Available 11:00 AM – 10:00 PM)
                  </span>
                </div>
                <div className="time-slots-wrap">
                  <div className="time-group-header lunch">
                    🌞 LUNCH <span>(Special Pricing)</span>
                  </div>
                  <div className="time-slots">
                    {LUNCH_TIMES.map(t => (
                      <div
                        key={t}
                        className={`time-slot${time === t ? ' selected' : ''}`}
                        onClick={() => { setTime(t); setTimePeriod('lunch') }}
                      >{t}</div>
                    ))}
                  </div>
                  <div className="time-group-header dinner">
                    🌙 DINNER <span>(Regular Pricing)</span>
                  </div>
                  <div className="time-slots">
                    {DINNER_TIMES.map(t => (
                      <div
                        key={t}
                        className={`time-slot${time === t ? ' selected' : ''}`}
                        onClick={() => { setTime(t); setTimePeriod('dinner') }}
                      >{t}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── STEP 3: MENU ── */}
        {s2done && (
          <div ref={menuRef}>
            <div className="step-label" style={{ marginTop: 14 }}>
              STEP 3: MENU SELECTION{' '}
              <span style={{ fontWeight: 'normal', fontSize: '0.82rem' }}>(Optional)</span>
            </div>
            <div className="menu-section-box">

              {/* Category tabs */}
              <div className="menu-category-tabs">
                {Object.entries(MENU_DATA).map(([cat, data]) => (
                  <button
                    key={cat}
                    className={`menu-tab${activeCategory === cat ? ' active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {data.icon} {data.label}
                  </button>
                ))}
              </div>

              {/* Dish grid */}
              <div className="menu-category-panel">
                {MENU_DATA[activeCategory].items.map((dish, i) => {
                  const selected = menuSelections.some(
                    s => s.category === activeCategory && s.name === dish.name
                  )
                  return (
                    <DishCard
                      key={dish.name}
                      dish={dish}
                      selected={selected}
                      onToggle={() => toggleDish(activeCategory, i)}
                    />
                  )
                })}
              </div>

              {/* Selection summary */}
              {menuSelections.length > 0 && (
                <div className="menu-summary">
                  <div className="menu-summary-title">
                    ✅ Selected Dishes: <span style={{ color: menuSelections.length >= maxDishes ? '#8B2000' : '#555', fontWeight: 'normal', fontSize: '0.82rem' }}>({menuSelections.length}/{maxDishes} max)</span>
                  </div>
                  <ul className="menu-summary-list">
                    {menuSelections.map(s => (
                      <li key={`${s.category}-${s.name}`}>
                        <span>{s.name}</span>
                        <span>${s.price}/pp</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="menu-continue-wrap">
                <button className="menu-continue-btn" onClick={() => setMenuConfirmed(true)}>
                  Continue to Contact →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4: CONTACT ── */}
        {menuConfirmed && (
          <div ref={contactRef}>
            <div className="step-label" style={{ marginTop: 14 }}>
              STEP 4: YOUR CONTACT INFORMATION
            </div>
            <div className="contact-form-box">

              <div className="contact-grid">
                <div className="form-group">
                  <label>First Name *</label>
                  <input type="text" placeholder="Maria" value={fname} onChange={e => setFname(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input type="text" placeholder="Garcia" value={lname} onChange={e => setLname(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input type="tel" placeholder="(555) 123-4567" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" placeholder="maria@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
              </div>

              <div className="comments-full">
                <div className="field-label">COMMENTS OR SPECIAL REQUESTS</div>
                <textarea
                  placeholder="Dietary restrictions, decorations, special arrangements, accessibility needs..."
                  value={comments}
                  onChange={e => setComments(e.target.value)}
                />
              </div>

              <div className="policy-checks">
                <div className="policy-row">
                  <input
                    type="checkbox" id="chkPrivacy"
                    checked={privacyOk}
                    onChange={e => setPrivacyOk(e.target.checked)}
                  />
                  <label htmlFor="chkPrivacy">
                    I have read and agree to the{' '}
                    <a onClick={() => setModal('privacy')}>Privacy Policy</a>
                  </label>
                </div>
                <div className="policy-row">
                  <input
                    type="checkbox" id="chkTerms"
                    checked={termsOk}
                    onChange={e => setTermsOk(e.target.checked)}
                  />
                  <label htmlFor="chkTerms">
                    I have read and agree to the{' '}
                    <a onClick={() => setModal('terms')}>Terms &amp; Conditions</a>
                  </label>
                </div>
              </div>

              <div className="submit-wrap">
                <button
                  className="submit-btn"
                  disabled={!privacyOk || !termsOk || submitting}
                  onClick={handleSubmit}
                >
                  {submitting ? 'Sending…' : 'SUBMIT'}
                </button>
              </div>

            </div>
          </div>
        )}


      </div>{/* /container */}

      <footer>
        © 2026 The Original Lindo Michoacán &nbsp;|&nbsp; Event Booking Webapp &nbsp;|&nbsp; Available 11:00 AM – 10:00 PM
      </footer>

      {/* ── MODALS ── */}
      {modal === 'privacy' && (
        <Modal title="Privacy Policy" icon="🔒" closeLabel="I Understand – Close"
          onClose={() => { setModal(null); setPrivacyOk(true) }}>
          <p><strong>The Original Lindo Michoacán</strong> is committed to protecting your personal information.</p>
          <p><strong>What we collect:</strong></p>
          <ul>
            <li>Your name and contact details (phone / email)</li>
            <li>Event details: date, time, guests, service type, menu preferences</li>
            <li>Any special requests you provide</li>
          </ul>
          <p><strong>How we use it:</strong></p>
          <ul>
            <li>Your information is used <em>exclusively</em> to plan and coordinate your event.</li>
            <li>We will contact you to confirm your booking and provide a final quote.</li>
            <li>We do <strong>not</strong> sell, share, or distribute your information to any third party.</li>
            <li>Your data will not be used for marketing without your explicit consent.</li>
          </ul>
          <p><strong>Data retention:</strong> Kept up to 12 months after your event, then securely deleted.</p>
        </Modal>
      )}

      {modal === 'terms' && (
        <Modal title="Terms & Conditions" icon="📋" closeLabel="I Agree – Close"
          onClose={() => { setModal(null); setTermsOk(true) }}>
          <p><strong>Event Booking Terms – The Original Lindo Michoacán</strong></p>
          <ul>
            <li><strong>Quote Requests:</strong> Submitting this form is a quote request, not a confirmed reservation.</li>
            <li><strong>Confirmation:</strong> Your event is confirmed only after written or verbal confirmation from our team.</li>
            <li><strong>Deposit:</strong> A deposit may be required to hold your event date.</li>
            <li><strong>Cancellations:</strong> Cancellations less than 72 hours before the event may incur a fee.</li>
            <li><strong>Guest Count:</strong> Final counts must be confirmed 48 hours before the event.</li>
            <li><strong>Availability:</strong> Service hours are 11:00 AM – 10:00 PM, subject to availability.</li>
            <li><strong>Menu:</strong> Menu selections are preferences; final menu confirmed upon booking.</li>
            <li><strong>Pricing:</strong> Estimates may change based on final menu and confirmed guest count.</li>
          </ul>
          <p>By submitting you authorize The Original Lindo Michoacán to contact you about your event.</p>
        </Modal>
      )}

      {modal === 'thankyou' && (() => {
        const fullName  = `${fname} ${lname}`
        const ds        = date?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
        const period    = timePeriod === 'lunch' ? 'Lunch (Special Pricing)' : 'Dinner (Regular Pricing)'
        const quoteText = total ? `$${total.toLocaleString()} (estimated base)` : 'TBD'
        const menuText  = menuSelections.length > 0
          ? menuSelections.map(s => s.name).join(', ')
          : 'No specific menu selected'
        const rows = [
          ['Service',  SERVICE_LABELS[service]],
          ['Date',     ds],
          ['Time',     `${time} — ${period}`],
          ['Guests',   `${people} people`],
          ['Menu',     menuText],
          ['Quote',    quoteText],
          ['Phone',    phone],
          ...(email    ? [['Email',  email]]    : []),
          ...(comments ? [['Notes',  comments]] : []),
        ]
        return (
          <div
            className="modal-overlay show"
            onClick={e => { if (e.target === e.currentTarget) { setModal(null); resetForm() } }}
          >
            <div className="modal thankyou-modal">
              <div className="big-check">🎉</div>
              <h2>Thank You!</h2>
              <div className="customer-name">Hello, {fullName}!</div>
              <div className="summary-box">
                {rows.map(([k, v]) => (
                  <div key={k} className="summary-row">
                    <span>{k}</span><span>{v}</span>
                  </div>
                ))}
              </div>
              <div className="tax-note">* Tax and gratuity not included in estimate</div>
              <div className="contact-banner">
                <div className="contact-banner-icon">📞</div>
                <div className="contact-banner-text">
                  <strong>We'll be in touch shortly!</strong>
                  <span>A team member will contact you within 24 hours to confirm your event details and provide a final quote.</span>
                </div>
              </div>
              <button className="close-btn" onClick={() => { setModal(null); resetForm() }}>
                Close &amp; Start Over
              </button>
            </div>
          </div>
        )
      })()}
    </>
  )
}
