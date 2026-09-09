import { useState, useMemo, useRef } from 'react'
import './planner.css'

/* ── Datos ── */
const SERVICES = [
  { id: 'dinein',   icon: '🪑', title: 'Dine In', note: 'In the restaurant',
    desc: 'Your party in our dining room — we set the tables, serve and clean up.' },
  { id: 'catering', icon: '🍽️', title: 'Catering', note: 'Full service · your place',
    desc: 'Full service at your venue: staff, chafing dishes, setup and breakdown.' },
  { id: 'delivery', icon: '🚚', title: 'Delivery / Pick Up', note: 'Drop-off or pick up',
    desc: "Trays hot and ready to serve — we drop them off, or you pick them up at the restaurant." },
]

const PRESETS = [20, 30, 40, 50, 60, 70, 80, 100]
const LUNCH   = ['11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '3:30 PM']
const DINNER  = ['4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM']
const MONTHS  = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS    = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

const CATS = [
  { id: 'chicken', icon: '🍗', label: 'Chicken' },
  { id: 'steak',   icon: '🥩', label: 'Steak' },
  { id: 'pork',    icon: '🐷', label: 'Pork' },
  { id: 'shrimp',  icon: '🦐', label: 'Shrimp' },
]

const MENU = {
  chicken: [
    { name: 'Pollo Sarandeado', img: '/images/chicken/pollosarandeado.webp', desc: 'Grilled chicken breast basted with Sarandeado sauce, a selection of dried chiles and secret spices.' },
    { name: 'Pollo con Rajas y Crema', img: '/images/chicken/pollorajas.webp', desc: 'Grilled chicken breast sautéed with onions and fresh roasted pasilla strips in a cream sauce.' },
    { name: 'Chicken Fajitas', img: '/images/chicken/chickenfajitas.webp', desc: 'Chicken breast stir-fried with green, yellow and red peppers, onions, cilantro and tomato.' },
    { name: 'Pollo al Mojo de Ajo', img: '/images/chicken/pollomojo.webp', desc: 'Chicken breast cooked in olive oil, wine, fresh garlic and slices of Guajillo peppers.' },
  ],
  steak: [
    { name: 'Steak Fajitas', img: '/images/steak/stk fajitas.webp', desc: 'Marinated beef stir-fried with green, yellow and red peppers, onions, cilantro and spices.' },
    { name: 'Chile Colorado', img: '/images/steak/chilecolorado.webp', desc: 'Steak in small chunks, sautéed in red sauce made with chile de árbol, Guajillo and fresh tomato.' },
    { name: 'Carne Asada Tacos', img: '/images/steak/tacosasada.webp', desc: 'Broiled and diced steak cooked with pico de gallo and served with avocado sauce.' },
  ],
  pork: [
    { name: 'Carnitas', img: '/images/pork/carnitas.webp', desc: 'Lean pork marinated with fresh oranges and spices, slowly cooked in its own juices until tender.' },
    { name: 'Carnitas a la Mexicana', img: '/images/pork/carnitasmexicana.webp', desc: 'Lean pork sautéed with onions, tomatoes, jalapeños and cilantro.' },
    { name: 'Chile Verde', img: '/images/pork/chileverde.webp', desc: 'Lean pork simmered in our green salsa of tomatillos, green peppers, onions, cilantro and garlic.' },
    { name: 'Cochinito Habanero', img: '/images/pork/cochinitahabanero.webp', desc: 'Lean pork sautéed with onions, tomatoes, habanero and cilantro with a touch of Blue Agave tequila.' },
  ],
  shrimp: [
    { name: 'Camarones a la Diabla', img: '/images/shrimp/camaronesdiabla.webp', desc: 'Large Mexican Gulf shrimp sautéed in a red sauce of dried chiles and tomato.' },
    { name: 'Camarones Sarandeados', img: '/images/shrimp/camaronessarandeados.webp', desc: 'Large Mexican Gulf shrimp basted in sarandeado sauce with dried chiles and secret spices.' },
    { name: 'Camarones con Rajas y Crema', img: '/images/shrimp/camrajas.webp', desc: 'Large Mexican Gulf shrimp sautéed with fresh roasted pasilla strips in a cream sauce.' },
    { name: 'Shrimp Fajitas', img: '/images/shrimp/shrimpfajitas.webp', desc: 'Large Mexican Gulf shrimp stir-fried with peppers, onions, cilantro, tomatoes and spices.' },
  ],
}

const PRIVACY = [
  'The Original Lindo Michoacán is committed to protecting your personal information.',
  'We collect your name, phone and email, plus the event details you choose here: date, time, guest count, service type and menu preferences.',
  'We use it only to plan and confirm your event. We will call or email you to confirm the booking and give you a final quote.',
  'We do not sell, share or distribute your information to any third party, and we will not use it for marketing without your consent.',
  'We keep your request for up to 12 months after the event date, then delete it.',
]
const TERMS = [
  'Submitting this form is a quote request, not a confirmed reservation.',
  'Your event is confirmed only after written or verbal confirmation from our team.',
  'A deposit may be required to hold your event date.',
  'Cancellations less than 72 hours before the event may incur a fee.',
  'Final guest count must be confirmed 48 hours before the event.',
  'Service hours are 11:00 AM – 10:00 PM, subject to availability.',
  'Menu selections are preferences; the final menu is confirmed when you book.',
  'Estimates may change based on the final menu and confirmed guest count. Tax and gratuity are not included.',
]

const PHONE = '(702) 735-6828'
const PHONE_HREF = 'tel:+17027356828'

/* ── Precio: mismas reglas que calcPrice() ── */
function quote({ service, guests, date, period }) {
  let flat = 0, rate = 0, note = ''
  if (service === 'catering') { flat = 200; rate = 25; note = 'Full service · flat fee + per guest' }
  else if (service === 'delivery') { rate = 25; note = 'Drop-off or pick up · per guest' }
  else if (service === 'dinein' && date && period) {
    const dow = date.getDay()
    const weekend = dow === 0 || dow === 5 || dow === 6
    if (weekend) { rate = period === 'lunch' ? 30 : 40; note = period === 'lunch' ? 'Fri–Sun lunch rate' : 'Fri–Sun dinner rate' }
    else { rate = period === 'lunch' ? 25 : 35; note = period === 'lunch' ? 'Mon–Thu lunch rate' : 'Mon–Thu dinner rate' }
  }
  return { flat, rate, note, total: rate ? flat + rate * guests : 0 }
}

const money = n => '$' + n.toLocaleString('en-US')
const dishLimit = guests => (guests <= 50 ? 3 : 4)

export function PlannerPage({ onHome }) {
  const [service, setService]   = useState(null)
  const [guests, setGuests]     = useState(40)
  const [date, setDate]         = useState(null)
  const [time, setTime]         = useState(null)
  const [period, setPeriod]     = useState(null)
  const [view, setView]         = useState(() => { const d = new Date(); d.setDate(1); return d })
  const [cat, setCat]           = useState('chicken')
  const [picks, setPicks]       = useState([])
  const [trimmed, setTrimmed]   = useState(0)
  const [form, setForm]         = useState({ fname: '', lname: '', phone: '', email: '', comments: '' })
  const [privacyOk, setPrivacy] = useState(false)
  const [termsOk, setTerms]     = useState(false)
  const [tried, setTried]       = useState(false)
  const [sent, setSent]         = useState(false)
  const [sending, setSending]   = useState(false)
  const [modal, setModal]       = useState(null)
  const contactRef = useRef(null)

  const max     = dishLimit(guests)
  const atMax   = picks.length >= max
  const dineIn  = service === 'dinein'
  const step2Ok = !!(service && guests && date && time)
  const q       = quote({ service, guests, date, period })

  /* Cambiar invitados recorta el menú al límite que corresponde */
  const applyGuests = n => {
    const next = Math.max(20, Math.min(100, n))
    const lim = dishLimit(next)
    setTrimmed(Math.max(0, picks.length - lim))
    setPicks(p => p.slice(0, lim))
    setGuests(next)
  }

  const toggleDish = dish => {
    setTrimmed(0)
    setPicks(p => {
      if (p.some(x => x.name === dish.name)) return p.filter(x => x.name !== dish.name)
      if (p.length >= max) return p
      return [...p, { cat, name: dish.name }]
    })
  }

  const setField = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  /* Validación inline */
  const errs = useMemo(() => {
    const digits = form.phone.replace(/[^0-9]/g, '')
    return {
      fname: !form.fname.trim() ? 'Please enter your first name.' : '',
      lname: !form.lname.trim() ? 'Please enter your last name.' : '',
      phone: !form.phone.trim() ? 'We need a phone number to confirm.'
        : digits.length < 10 ? 'Please enter a 10-digit phone number.' : '',
      email: form.email.trim() && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())
        ? 'That email looks incomplete.' : '',
    }
  }, [form])
  const formOk = !errs.fname && !errs.lname && !errs.phone && !errs.email
  const canSend = formOk && privacyOk && termsOk && step2Ok && !sending
  const err = k => (tried ? errs[k] : '')

  /* Calendario */
  const cells = useMemo(() => {
    const y = view.getFullYear(), m = view.getMonth()
    const lead = new Date(y, m, 1).getDay()
    const days = new Date(y, m + 1, 0).getDate()
    const now = new Date()
    const todayTs = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    const out = Array.from({ length: lead }, (_, i) => ({ key: `pad${i}`, pad: true }))
    for (let d = 1; d <= days; d++) {
      const cellDate = new Date(y, m, d)
      const ts = cellDate.getTime()
      const dow = cellDate.getDay()
      out.push({
        key: `d${d}`, day: d, date: cellDate,
        past: ts < todayTs,
        today: ts === todayTs,
        weekend: dow === 0 || dow === 5 || dow === 6,
        selected: !!date && date.getTime() === ts,
      })
    }
    return out
  }, [view, date])

  const dateFull = date
    ? date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : '—'
  const dateShort = date
    ? date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    : '—'

  const receipt = [
    { k: 'Service', v: service ? SERVICES.find(s => s.id === service).title : 'Pick one in step 1' },
    { k: 'Date', v: dateFull },
    { k: 'Time', v: time || '—' },
    { k: 'Guests', v: q.rate ? `${guests} × ${money(q.rate)}` : String(guests) },
    ...(q.flat ? [{ k: 'Service fee', v: money(q.flat) }] : []),
    ...(picks.length ? [{ k: 'Menu', v: picks.map(p => p.name).join(', ') }] : []),
    { k: 'Phone', v: form.phone.trim() || '—' },
    ...(form.email.trim() ? [{ k: 'Email', v: form.email.trim() }] : []),
    ...(form.comments.trim() ? [{ k: 'Notes', v: form.comments.trim() }] : []),
  ]

  const stepsDone = [!!service, step2Ok, picks.length > 0, sent]

  const handleSubmit = async () => {
    if (!canSend) { setTried(true); return }
    setSending(true)
    const body = new URLSearchParams({
      'form-name': 'party-booking',
      'bot-field': '',                       // honeypot que index.html declara
      'first-name': form.fname.trim(),
      'last-name': form.lname.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      comments: form.comments.trim().slice(0, 500),
      service: SERVICES.find(s => s.id === service)?.title || '',
      guests: String(guests),
      date: dateFull,
      time: time || '',
      period: period || '',
      menu: picks.map(p => `${CATS.find(c => c.id === p.cat)?.label || p.cat} — ${p.name}`).join('\n'),
      estimate: q.rate ? money(q.total) : 'TBD',
      rate: q.note,
    })
    try {
      if (import.meta.env.DEV) {
        console.info('[DEV] envío simulado — no se mandó nada:', Object.fromEntries(body))
      } else {
        await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: body.toString(),
        })
      }
      setSent(true)
      setTried(false)
    } catch (e) {
      console.error(e)
      setTried(true)
    } finally {
      setSending(false)
    }
  }

  const reset = () => {
    setService(null); setGuests(40); setDate(null); setTime(null); setPeriod(null)
    setCat('chicken'); setPicks([]); setTrimmed(0)
    setForm({ fname: '', lname: '', phone: '', email: '', comments: '' })
    setPrivacy(false); setTerms(false); setTried(false); setSent(false); setModal(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    onHome?.()
  }

  const goContact = () => {
    const el = contactRef.current
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 24, behavior: 'smooth' })
  }

  const shiftMonth = d => setView(v => { const n = new Date(v); n.setMonth(n.getMonth() + d); return n })

  return (
    <div className="pl-root">
      <header className="pl-header">
        <div className="pl-header-inner">
          <img className="pl-logo" src="/logolindo.png" alt="The Original Lindo Michoacán" />
          <div className="pl-header-right">
            <div className="pl-kicker">Party &amp; Event Planner</div>
            <button type="button" className="pl-startover" onClick={reset}>Start over</button>
          </div>
        </div>
      </header>
      <div className="pl-ribbon" />

      <main className="pl-main">

        {/* ── Progreso ── */}
        <nav className="pl-progress" aria-label="Progress">
          {['Service', 'Details', 'Menu', 'Contact'].map((name, i) => {
            const done = stepsDone[i]
            const active = !done && (i === 0 || stepsDone[i - 1])
            return (
              <div className="pl-progress-step" key={name}>
                <span className={`pl-dot${done ? ' is-done' : active ? ' is-active' : ''}`}>
                  {done ? '✓' : i + 1}
                </span>
                <span className={`pl-step-label${done || active ? ' is-on' : ''}`}>{name}</span>
                <span className={`pl-step-rule${done ? ' is-done' : ''}`} />
              </div>
            )
          })}
        </nav>

        {/* ── Paso 1 ── */}
        <section className="pl-section">
          <div className="pl-step-no">Step 01</div>
          <h2 className="pl-h2">How should we serve you?</h2>
          <div className="pl-service-grid">
            {SERVICES.map(s => (
              <button
                key={s.id}
                type="button"
                className={`pl-service${service === s.id ? ' is-on' : ''}`}
                aria-pressed={service === s.id}
                onClick={() => setService(s.id)}
              >
                <div className="pl-service-top">
                  <span className="pl-service-icon" aria-hidden="true">{s.icon}</span>
                  <span className="pl-check">{service === s.id ? '✓' : ''}</span>
                </div>
                <div className="pl-service-title">{s.title}</div>
                <div className="pl-service-desc">{s.desc}</div>
                <div className="pl-service-note">{s.note}</div>
              </button>
            ))}
          </div>
        </section>

        {/* ── Paso 2 ── */}
        <section className="pl-section">
          <div className="pl-step-no">Step 02</div>
          <h2 className="pl-h2">Guests, date and time</h2>

          <div className="pl-two-col">
            <div className="pl-col">

              {/* Invitados */}
              <div className="pl-card">
                <div className="pl-card-head">
                  <span className="pl-label">👥 Number of guests</span>
                  <span className="pl-pill">{max} dishes included</span>
                </div>

                <div className="pl-stepper">
                  <button type="button" className="pl-step-btn" onClick={() => applyGuests(guests - 1)}
                          disabled={guests <= 20} aria-label="One guest fewer">−</button>
                  <div className="pl-count-wrap">
                    <div className="pl-count">{guests}</div>
                    <div className="pl-count-label">guests</div>
                  </div>
                  <button type="button" className="pl-step-btn" onClick={() => applyGuests(guests + 1)}
                          disabled={guests >= 100} aria-label="One guest more">+</button>
                </div>

                <div className="pl-gauge">
                  <div className="pl-gauge-fill" style={{ width: `${Math.round(((guests - 20) / 80) * 100)}%` }} />
                </div>
                <div className="pl-gauge-scale"><span>20 min</span><span>100 max</span></div>

                <div className="pl-chip-row">
                  {PRESETS.map(n => (
                    <button key={n} type="button" className={`pl-chip pl-chip-round${guests === n ? ' is-on' : ''}`}
                            aria-pressed={guests === n} onClick={() => applyGuests(n)}>{n}</button>
                  ))}
                </div>

                <p className="pl-note">
                  Pick up to {max} dishes on the next step. Use − / + for an exact count, or tap a preset.
                </p>
              </div>

              {/* Calendario */}
              <div className="pl-card pl-card-flush">
                <div className="pl-cal-head">
                  <button type="button" className="pl-cal-nav" onClick={() => shiftMonth(-1)} aria-label="Previous month">‹</button>
                  <span className="pl-cal-month">{MONTHS[view.getMonth()]} {view.getFullYear()}</span>
                  <button type="button" className="pl-cal-nav" onClick={() => shiftMonth(1)} aria-label="Next month">›</button>
                </div>
                <div className="pl-cal-grid">
                  {DAYS.map(d => <div key={d} className="pl-cal-dow">{d}</div>)}
                  {cells.map(c => c.pad
                    ? <span key={c.key} className="pl-cal-pad" />
                    : (
                      <button
                        key={c.key}
                        type="button"
                        className={`pl-cal-day${c.selected ? ' is-on' : ''}${c.today ? ' is-today' : ''}${c.weekend ? ' is-weekend' : ''}`}
                        aria-pressed={c.selected}
                        disabled={c.past}
                        onClick={() => setDate(c.date)}
                      >{c.day}</button>
                    ))}
                </div>
              </div>
            </div>

            {/* Horarios */}
            <div className="pl-card pl-col">
              <div className="pl-card-head">
                <span className="pl-label">Time</span>
                <span className="pl-muted">Available 11:00 AM – 10:00 PM</span>
              </div>

              <div className="pl-time-head">
                <span className="pl-time-title"><span aria-hidden="true">☀️</span> Lunch</span>
                <span className="pl-time-tag">{dineIn ? 'Special pricing' : '11:00 AM – 3:30 PM'}</span>
              </div>
              <div className="pl-chip-row">
                {LUNCH.map(t => (
                  <button key={t} type="button" className={`pl-chip${time === t ? ' is-on' : ''}`} aria-pressed={time === t}
                          onClick={() => { setTime(t); setPeriod('lunch') }}>{t}</button>
                ))}
              </div>

              <div className="pl-time-head">
                <span className="pl-time-title"><span aria-hidden="true">🌙</span> Dinner</span>
                <span className="pl-time-tag">{dineIn ? 'Regular pricing' : '4:00 PM – 10:00 PM'}</span>
              </div>
              <div className="pl-chip-row">
                {DINNER.map(t => (
                  <button key={t} type="button" className={`pl-chip${time === t ? ' is-on' : ''}`} aria-pressed={time === t}
                          onClick={() => { setTime(t); setPeriod('dinner') }}>{t}</button>
                ))}
              </div>

              <p className="pl-note pl-note-top">
                You'll see the full estimate on the last step, before anything is sent. No payment today.
              </p>
            </div>
          </div>
        </section>

        {/* ── Paso 3 ── */}
        <section className="pl-section">
          <div className="pl-step-no">Step 03</div>
          <div className="pl-h2-row">
            <h2 className="pl-h2">Pick your dishes</h2>
            <span className={`pl-counter${atMax ? ' is-max' : ''}`}>{picks.length} of {max} chosen</span>
          </div>

          <div className="pl-chip-row pl-tabs">
            {CATS.map(c => (
              <button key={c.id} type="button" className={`pl-tab${cat === c.id ? ' is-on' : ''}`}
                      aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>
                <span aria-hidden="true">{c.icon}</span>{c.label}
              </button>
            ))}
          </div>

          <div className="pl-dish-grid">
            {MENU[cat].map(d => {
              const on = picks.some(p => p.name === d.name)
              return (
                <button
                  key={d.name}
                  type="button"
                  className={`pl-dish${on ? ' is-on' : ''}`}
                  aria-pressed={on}
                  disabled={!on && atMax}
                  onClick={() => toggleDish(d)}
                >
                  <div className="pl-dish-img-wrap">
                    <img className="pl-dish-img" src={d.img} alt={d.name} loading="lazy" />
                    <span className="pl-dish-check">{on ? '✓' : ''}</span>
                  </div>
                  <div className="pl-dish-body">
                    <div className="pl-dish-name">{d.name}</div>
                    <div className="pl-dish-desc">{d.desc}</div>
                  </div>
                </button>
              )
            })}
          </div>

          {picks.length > 0 && (
            <div className="pl-card pl-menu-summary">
              <span className="pl-label">Your menu</span>
              <div className="pl-chip-row">
                {picks.map(p => (
                  <button key={p.name} type="button" className="pl-pick" onClick={() => toggleDish(p)}
                          aria-label={`Remove ${p.name}`}>
                    {p.name}<span aria-hidden="true" className="pl-pick-x">×</span>
                  </button>
                ))}
              </div>
              <p className="pl-note">
                {trimmed
                  ? `${trimmed} dish${trimmed > 1 ? 'es' : ''} removed — a party of ${guests} includes ${max}.`
                  : atMax ? 'That is the full menu for this party size. Tap a dish to swap it.'
                  : `You can add ${max - picks.length} more.`}
              </p>
            </div>
          )}
        </section>

        {/* ── Resumen + continuar ── */}
        <div className="pl-summary">
          <div className="pl-summary-facts">
            <div><span>Service</span>{service ? SERVICES.find(s => s.id === service).title : '—'}</div>
            <div><span>Guests</span>{guests}</div>
            <div><span>Date</span>{dateShort}</div>
            <div><span>Time</span>{time || '—'}</div>
            <div><span>Dishes</span>{picks.length ? `${picks.length} selected` : 'Optional'}</div>
          </div>
          <button type="button" className="pl-cta" onClick={goContact} disabled={!step2Ok}>
            Continue to contact <span aria-hidden="true">→</span>
          </button>
        </div>

        {/* ── Paso 4 ── */}
        {!sent && (
          <section className="pl-section" ref={contactRef}>
            <div className="pl-step-no">Step 04</div>
            <h2 className="pl-h2">Who should we call?</h2>

            <div className="pl-card pl-form">
              <div className="pl-field-grid">
                {[
                  { k: 'fname', label: 'First name *', ph: 'Maria', type: 'text' },
                  { k: 'lname', label: 'Last name *',  ph: 'Garcia', type: 'text' },
                  { k: 'phone', label: 'Phone *',      ph: '(702) 123-4567', type: 'tel' },
                  { k: 'email', label: 'Email',        ph: 'maria@email.com', type: 'email' },
                ].map(f => (
                  <div key={f.k}>
                    <label className="pl-label" htmlFor={`pl-${f.k}`}>{f.label}</label>
                    <input
                      id={`pl-${f.k}`}
                      type={f.type}
                      className={`pl-input${err(f.k) ? ' has-error' : ''}`}
                      placeholder={f.ph}
                      value={form[f.k]}
                      onChange={setField(f.k)}
                    />
                    <div className="pl-error">{err(f.k)}</div>
                  </div>
                ))}
              </div>

              <div className="pl-field-full">
                <label className="pl-label" htmlFor="pl-comments">Comments or special requests</label>
                <textarea
                  id="pl-comments"
                  className="pl-input pl-textarea"
                  rows={4}
                  maxLength={500}
                  placeholder="Dietary restrictions, decorations, cake, accessibility needs…"
                  value={form.comments}
                  onChange={setField('comments')}
                />
                <div className="pl-muted">
                  {form.comments.length ? `${form.comments.length} / 500 characters` : 'Optional'}
                </div>
              </div>
            </div>

            <div className="pl-send-row">
              <div className="pl-consents">
                <label className="pl-consent">
                  <input type="checkbox" checked={privacyOk} onChange={e => setPrivacy(e.target.checked)} />
                  <span>I agree to the <a href="#privacy" onClick={e => { e.preventDefault(); setModal('privacy') }}>Privacy Policy</a></span>
                </label>
                <label className="pl-consent">
                  <input type="checkbox" checked={termsOk} onChange={e => setTerms(e.target.checked)} />
                  <span>I agree to the <a href="#terms" onClick={e => { e.preventDefault(); setModal('terms') }}>Terms &amp; Conditions</a></span>
                </label>
                <div className="pl-error">
                  {!tried ? '' : !step2Ok ? 'Finish steps 1 and 2 first.'
                    : !formOk ? 'Please fix the fields above.'
                    : (!privacyOk || !termsOk) ? 'Please accept both policies.' : ''}
                </div>
              </div>
              <button type="button" className="pl-send" onClick={handleSubmit} disabled={!canSend}>
                {sending ? 'Sending…' : <><span aria-hidden="true">📨</span> Send my request</>}
              </button>
            </div>
          </section>
        )}

        {/* ── Confirmación ── */}
        {sent && (
          <section className="pl-confirm">
            <div className="pl-confirm-head">
              <div className="pl-confirm-emoji" aria-hidden="true">🎉</div>
              <h2 className="pl-confirm-title">Thank You!</h2>
              <div className="pl-confirm-name">
                {[form.fname.trim(), form.lname.trim()].filter(Boolean).join(' ') || 'Friend'}
              </div>
            </div>
            <div className="pl-ribbon" />

            <div className="pl-confirm-body">
              <div className="pl-receipt">
                {receipt.map(r => (
                  <div className="pl-receipt-row" key={r.k}>
                    <span className="pl-receipt-k">{r.k}</span>
                    <span className="pl-receipt-v">{r.v}</span>
                  </div>
                ))}
                <div className="pl-receipt-total">
                  <span className="pl-receipt-quote-k">Quote</span>
                  <span className="pl-receipt-quote-v">{q.rate ? money(q.total) : 'TBD'}</span>
                </div>
                <div className="pl-receipt-rate">{q.note}</div>
              </div>

              <div className="pl-tax">* Tax and gratuity not included in estimate</div>

              <div className="pl-callout">
                <div className="pl-callout-icon" aria-hidden="true">📞</div>
                <div>
                  <div className="pl-callout-title">We'll be in touch shortly!</div>
                  <p className="pl-callout-text">
                    A team member will contact you within 24 hours to confirm your event details and provide a final quote.
                  </p>
                  <p className="pl-callout-phone">
                    Need us sooner? Call <a href={PHONE_HREF}>{PHONE}</a>
                  </p>
                </div>
              </div>

              <button type="button" className="pl-send pl-send-wide" onClick={reset}>Close &amp; start over</button>
            </div>
          </section>
        )}
      </main>

      <footer className="pl-footer">© 2026 Design by Joner1166 · All rights reserved</footer>

      {/* ── Modal de políticas ── */}
      {modal && (
        <div className="pl-modal-scrim" onClick={() => setModal(null)} role="dialog" aria-modal="true">
          <div className="pl-modal" onClick={e => e.stopPropagation()}>
            <h3 className="pl-modal-title">{modal === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}</h3>
            <div className="pl-modal-body">
              {(modal === 'terms' ? TERMS : PRIVACY).map((line, i) => <p key={i}>{line}</p>)}
            </div>
            <button type="button" className="pl-send pl-send-wide" onClick={() => setModal(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
