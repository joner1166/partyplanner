import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { SplashPage } from './splash.jsx'
import { PlannerPage } from './planner.jsx'
import './app.css'

function Root() {
  const [phase, setPhase] = useState('splash')

  if (phase === 'splash') return <SplashPage onStart={() => setPhase('planner')} />
  return <PlannerPage onHome={() => setPhase('splash')} />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
