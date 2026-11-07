
import { useState } from 'react'
import { supabase } from '../supabase'
import {
  Mail,
  LockKeyhole,
  UserRound,
  ArrowRight,
  Eye,
  EyeOff,
  ArrowLeft
} from 'lucide-react'
import '../styles/AuthPage.css'

function LogoMark() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true">
      <path d="M12 1.5c1.7 1.8 1.7 4.6 0 6.4c-1.7-1.8-1.7-4.6 0-6.4z" />
      <path d="M12 10.5c-3 0-4.9-1.6-5.1-4.3c3 0 4.9 1.6 5.1 4.3z" />
      <path d="M12 10.5c3 0 4.9-1.6 5.1-4.3c-3 0-4.9 1.6-5.1 4.3z" />
      <path d="M12 15c-3 0-4.9-1.6-5.1-4.3c3 0 4.9 1.6 5.1 4.3z" />
      <path d="M12 15c3 0 4.9-1.6 5.1-4.3c-3 0-4.9 1.6-5.1 4.3z" />
      <path d="M12 19.5c-3 0-4.9-1.6-5.1-4.3c3 0 4.9 1.6 5.1 4.3z" />
      <path d="M12 19.5c3 0 4.9-1.6 5.1-4.3c-3 0-4.9 1.6-5.1 4.3z" />
      <rect x="11.2" y="8" width="1.6" height="15" rx=".8" />
    </svg>
  )
}

export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const resetMessages = () => {
    setMessage('')
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    resetMessages()
    setLoading(true)

    try {
      if (mode === 'register') {
        if (password.length < 6) {
          throw new Error('Parol kamida 6 ta belgidan iborat bo‘lishi kerak.')
        }

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              first_name: firstName.trim(),
              last_name: lastName.trim(),
              full_name: `${firstName.trim()} ${lastName.trim()}`.trim()
            }
          }
        })

        if (error) throw error

        if (data.session) {
          onLogin(data.session.user)
        } else {
          setMessage(
            'Tasdiqlash havolasi emailingizga yuborildi. Emailingizni tekshirib, havolani bosing.'
          )
          setMode('login')
        }
      } else if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        })

        if (error) throw error

        onLogin(data.user)
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(
          email.trim(),
          {
            redirectTo: `${window.location.origin}/reset-password`
          }
        )

        if (error) throw error

        setMessage(
          'Agar bu email ro‘yxatdan o‘tgan bo‘lsa, parolni tiklash havolasi yuboriladi. Emailingizni tekshiring.'
        )
      }
    } catch (err) {
      setError(err.message || 'Xatolik yuz berdi. Qayta urinib ko‘ring.')
    } finally {
      setLoading(false)
    }
  }

  const changeMode = (nextMode) => {
    resetMessages()
    setMode(nextMode)
  }

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <div className="auth-brand">
          <span className="auth-brand-icon"><LogoMark /></span>
          <span>SmartFarm<span className="brand-accent"> Planner</span></span>
        </div>

        <div className="auth-visual-content">
          <span className="auth-eyebrow">AQLLI DEHQONCHILIK</span>
          <h1>Hosilingizni<br />aqlli boshqaring.</h1>
          <p>
            Maydonlar, ekinlar va sug‘orishni bitta qulay platformada
            nazorat qiling.
          </p>

          <div className="auth-benefits">
            <div><span>✓</span> Ekin va maydonlarni boshqarish</div>
            <div><span>✓</span> Sug‘orish va o‘g‘itlash rejalari</div>
            <div><span>✓</span> Ob-havo va ekin tavsiyalari</div>
          </div>
        </div>

        <p className="auth-visual-footer">
          Aqlli qarorlar. Sog‘lom hosil.
        </p>
      </section>

      <section className="auth-form-side">
        <div className="auth-form-wrap">
          <div className="auth-mobile-brand">
            <LogoMark />
            <strong>SmartFarm Planner</strong>
          </div>

          {mode === 'forgot' && (
            <button
              type="button"
              className="auth-back"
              onClick={() => changeMode('login')}
            >
              <ArrowLeft size={17} /> Kirishga qaytish
            </button>
          )}

          <div className="auth-heading">
            <span className="auth-kicker">
              {mode === 'register'
                ? 'YANGI HISOB'
                : mode === 'forgot'
                  ? 'HISOBNI TIKLASH'
                  : 'FERMER PANELI'}
            </span>

            <h2>
              {mode === 'register'
                ? 'Xush kelibsiz!'
                : mode === 'forgot'
                  ? 'Parolni tiklash'
                  : 'Yana uchrashganimizdan xursandmiz'}
            </h2>

            <p>
              {mode === 'register'
                ? 'Hisob yarating va fermer panelidan foydalaning.'
                : mode === 'forgot'
                  ? 'Email manzilingizni kiriting. Sizga tiklash havolasini yuboramiz.'
                  : 'Davom etish uchun hisobingizga kiring.'}
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div className="auth-name-grid">
                <label className="auth-field">
                  <span>Ism</span>
                  <div className="auth-input-wrap">
                    <UserRound size={18} />
                    <input
                      type="text"
                      placeholder="Ismingiz"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      autoComplete="given-name"
                      required
                    />
                  </div>
                </label>

                <label className="auth-field">
                  <span>Familiya</span>
                  <div className="auth-input-wrap">
                    <UserRound size={18} />
                    <input
                      type="text"
                      placeholder="Familiyangiz"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      autoComplete="family-name"
                      required
                    />
                  </div>
                </label>
              </div>
            )}

            <label className="auth-field">
              <span>Email manzili</span>
              <div className="auth-input-wrap">
                <Mail size={18} />
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </label>

            {mode !== 'forgot' && (
              <label className="auth-field">
                <span>Parol</span>
                <div className="auth-input-wrap">
                  <LockKeyhole size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={
                      mode === 'register'
                        ? 'Kamida 6 ta belgi'
                        : 'Parolingizni kiriting'
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={
                      mode === 'register' ? 'new-password' : 'current-password'
                    }
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    className="auth-eye"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Parolni yashirish' : 'Parolni ko‘rsatish'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>
            )}

            {mode === 'login' && (
              <button
                type="button"
                className="auth-forgot"
                onClick={() => changeMode('forgot')}
              >
                Parolni unutdingizmi?
              </button>
            )}

            {error && <div className="auth-alert auth-error">{error}</div>}
            {message && <div className="auth-alert auth-success">{message}</div>}

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading
                ? 'Kutilmoqda...'
                : mode === 'register'
                  ? 'Hisob yaratish'
                  : mode === 'forgot'
                    ? 'Tiklash havolasini yuborish'
                    : 'Tizimga kirish'}
              {!loading && <ArrowRight size={19} />}
            </button>
          </form>

          {mode !== 'forgot' && (
            <p className="auth-switch">
              {mode === 'register' ? 'Hisobingiz bormi?' : 'Hali hisobingiz yo‘qmi?'}
              <button
                type="button"
                onClick={() => changeMode(mode === 'register' ? 'login' : 'register')}
              >
                {mode === 'register' ? 'Kirish' : 'Ro‘yxatdan o‘tish'}
              </button>
            </p>
          )}

          <p className="auth-terms">
            Davom etish orqali platformadan foydalanish shartlariga rozilik bildirasiz.
          </p>
        </div>
      </section>
    </main>
  )
}
