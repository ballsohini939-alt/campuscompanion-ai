import { useState } from 'react'
import { supabase } from './supabaseClient'
import './Auth.css'

export default function Auth({ onAuthenticated }) {
  const [mode, setMode] = useState('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setNotice('')

    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your name.')
      return
    }

    if (!email.trim() || !password) {
      setError('Please enter your email and password.')
      return
    }

    if (password.length < 8) {
      setError('Your password must contain at least 8 characters.')
      return
    }

    setLoading(true)

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: name.trim() },
          },
        })

        if (error) throw error

        if (data.session) {
          onAuthenticated?.(data.session.user)
        } else {
          setNotice(
            'Account created! Check your email to confirm your account, then sign in.'
          )
          setMode('signin')
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })

        if (error) throw error

        onAuthenticated?.(data.user)
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-showcase">
        <div className="auth-brand">
          <span className="auth-brand-icon">C</span>
          <span>CampusCompanion <strong>AI</strong></span>
        </div>

        <div className="auth-showcase-content">
          <span className="auth-eyebrow">YOUR CAMPUS. YOUR FUTURE.</span>
          <h1>Your campus journey, <span>all in one place.</span></h1>
          <p>
            Discover scholarships, organize your studies, and get guidance
            for your next academic milestone.
          </p>

          <div className="auth-feature-list">
            <div><span>✦</span><div><strong>Scholarship discovery</strong><small>Explore opportunities for your future.</small></div></div>
            <div><span>◷</span><div><strong>Smarter study planning</strong><small>Build routines and track your progress.</small></div></div>
            <div><span>✧</span><div><strong>Your student workspace</strong><small>Keep your campus goals organized.</small></div></div>
          </div>
        </div>

        <p className="auth-footer-note">Built for students. Designed for possibilities.</p>
      </section>

      <section className="auth-form-side">
        <div className="auth-mobile-brand">
          <span className="auth-brand-icon">C</span>
          <span>CampusCompanion <strong>AI</strong></span>
        </div>

        <div className="auth-card">
          <span className="auth-eyebrow">
            {mode === 'signin' ? 'WELCOME BACK' : 'START YOUR JOURNEY'}
          </span>
          <h2>{mode === 'signin' ? 'Sign in to your space' : 'Create your account'}</h2>
          <p className="auth-subtitle">
            {mode === 'signin'
              ? 'Your goals are waiting. Let’s pick up where you left off.'
              : 'One account to organize your campus journey.'}
          </p>

          <div className="auth-mode-switch" aria-label="Authentication mode">
            <button type="button" className={mode === 'signin' ? 'active' : ''} onClick={() => { setMode('signin'); setError(''); setNotice('') }}>
              Sign in
            </button>
            <button type="button" className={mode === 'signup' ? 'active' : ''} onClick={() => { setMode('signup'); setError(''); setNotice('') }}>
              Sign up
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <label className="auth-field">
                <span>Full name</span>
                <input
                  type="text"
                  autoComplete="name"
                  placeholder="Your full name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </label>
            )}

            <label className="auth-field">
              <span>Email address</span>
              <input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>

            <label className="auth-field">
              <span>Password</span>
              <div className="auth-password-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={8}
                  required
                />
                <button type="button" className="auth-password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>

            {error && <p className="auth-message auth-error" role="alert">{error}</p>}
            {notice && <p className="auth-message auth-notice" role="status">{notice}</p>}

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading
                ? 'Please wait…'
                : mode === 'signin'
                  ? 'Sign in securely →'
                  : 'Create account →'}
            </button>
          </form>

          <p className="auth-privacy-note">
            Your account is secured by Supabase authentication.
          </p>
        </div>
      </section>
    </main>
  )
}
