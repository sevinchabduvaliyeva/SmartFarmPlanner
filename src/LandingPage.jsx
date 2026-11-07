import { ArrowRight } from "lucide-react";
import "./LandingPage.css";

function LogoMark() {
  return (
    <span className="landing-logo-mark" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
        <path d="M12 1.5c1.7 1.8 1.7 4.6 0 6.4c-1.7-1.8-1.7-4.6 0-6.4z" />
        <path d="M12 10.5c-3 0-4.9-1.6-5.1-4.3c3 0 4.9 1.6 5.1 4.3z" />
        <path d="M12 10.5c3 0 4.9-1.6 5.1-4.3c-3 0-4.9 1.6-5.1 4.3z" />
        <path d="M12 15c-3 0-4.9-1.6-5.1-4.3c3 0 4.9 1.6 5.1 4.3z" />
        <path d="M12 15c3 0 4.9-1.6 5.1-4.3c-3 0-4.9 1.6-5.1 4.3z" />
        <path d="M12 19.5c-3 0-4.9-1.6-5.1-4.3c3 0 4.9 1.6 5.1 4.3z" />
        <path d="M12 19.5c3 0 4.9-1.6 5.1-4.3c-3 0-4.9 1.6-5.1 4.3z" />
        <rect x="11.2" y="8" width="1.6" height="15" rx=".8" />
      </svg>
    </span>
  );
}

export default function LandingPage({ onEnter }) {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <a className="landing-logo" href="#home">
          <LogoMark />
          <span>Smart<span>Farm</span></span>
        </a>

        <nav className="landing-nav">
          <a href="#home">Bosh sahifa</a>
          <a href="#services">Imkoniyatlar</a>
          <a href="#about">Biz haqimizda</a>
        </nav>

        <button className="landing-login" onClick={onEnter}>
          Fermer paneli <ArrowRight size={16} />
        </button>
      </header>

      <main>
        <section className="landing-hero" id="home">
          <div className="landing-hero-overlay" />
          <div className="landing-hero-content">
            <span className="landing-eyebrow">Zamonaviy dehqonchilik</span>

            <h1>
              Yerga mehr bering.<br />
              <em>Hosilingizni ko‘paytiring.</em>
            </h1>

            <p>
              SmartFarm yordamida maydonlaringizni boshqaring,
              sug‘orish ishlarini rejalashtiring va xo‘jaligingiz
              samaradorligini oshiring.
            </p>

            <div className="landing-hero-actions">
              <button className="landing-primary" onClick={onEnter}>
                Boshqaruv paneliga kirish <ArrowRight size={18} />
              </button>
              <a className="landing-secondary" href="#services">
                Imkoniyatlar bilan tanishish
              </a>
            </div>

            <div className="landing-trust">
              <strong>Bir platforma.</strong>
              <small>Butun xo‘jaligingiz nazoratingizda.</small>
            </div>
          </div>
        </section>

        <section className="landing-services" id="services">
          <div className="landing-section-heading">
            <span className="landing-eyebrow">Bizning imkoniyatlar</span>
            <h2>
              Fermer xo‘jaligingiz uchun
              <br />
              ishonchli yechimlar
            </h2>
            <p>
              Kundalik qishloq xo‘jaligi ishlarini oson rejalashtiring,
              maydonlaringizni boshqaring va hosildorlikni oshiring.
            </p>
          </div>

          <div className="landing-service-grid">
            <article className="landing-service-card">
              <img
                className="landing-service-photo"
                src="/images/fields.jpg"
                alt="Yashil ekin maydoni"
              />
              <div className="landing-service-content">
                <span className="landing-service-number">01</span>
                <h3>Maydonlarni boshqarish</h3>
                <p>
                  Maydonlar maydoni, tuproq turi va boshqa muhim
                  ma’lumotlarni bir joyda saqlang.
                </p>
                <button onClick={onEnter} className="landing-card-link">
                  Batafsil ma’lumot <ArrowRight size={16} />
                </button>
              </div>
            </article>

            <article className="landing-service-card">
              <img
                className="landing-service-photo"
                src="/images/crops.jpg"
                alt="Sog‘lom va yashil ekinlar"
              />
              <div className="landing-service-content">
                <span className="landing-service-number">02</span>
                <h3>Ekinlarni kuzatish</h3>
                <p>
                  Ekin turlarini, ekish sanalarini va o‘sish holatini
                  muntazam nazorat qiling.
                </p>
                <button onClick={onEnter} className="landing-card-link">
                  Batafsil ma’lumot <ArrowRight size={16} />
                </button>
              </div>
            </article>

            <article className="landing-service-card">
              <img
                className="landing-service-photo"
                src="/images/irrigation.jpg"
                alt="Ekin maydonini sug‘orish"
              />
              <div className="landing-service-content">
                <span className="landing-service-number">03</span>
                <h3>Sug‘orishni rejalashtirish</h3>
                <p>
                  Sug‘orish vazifalarini rejalashtiring va muhim
                  ishlarni o‘z vaqtida bajaring.
                </p>
                <button onClick={onEnter} className="landing-card-link">
                  Batafsil ma’lumot <ArrowRight size={16} />
                </button>
              </div>
            </article>
          </div>
        </section>

        <section className="landing-about" id="about">
          <div className="landing-about-image">
            <img
              src="/images/fields.jpg"
              alt="Yashil qishloq xo‘jaligi maydoni"
            />
          </div>

          <div className="landing-about-content">
            <span className="landing-eyebrow">Biz haqimizda</span>

            <h2>
              Fermer xo‘jaligingizni
              <br />
              <em>aqlli boshqaring</em>
            </h2>

            <p className="landing-about-description">
              SmartFarm Planner — qishloq xo‘jaligi ishlarini bitta
              platformada rejalashtirish va boshqarish uchun qulay yechim.
              Maydonlar, ekinlar va kundalik vazifalarni tartibli nazorat qiling.
            </p>

            <div className="landing-about-feature">
              <span className="landing-about-check">✓</span>
              <div>
                <h3>Maydonlar va ekinlar nazorati</h3>
                <p>Barcha muhim ma’lumotlaringiz bir joyda.</p>
              </div>
            </div>

            <div className="landing-about-feature">
              <span className="landing-about-check">✓</span>
              <div>
                <h3>Kundalik ishlarni rejalashtirish</h3>
                <p>Sug‘orish va boshqa vazifalarni o‘z vaqtida bajaring.</p>
              </div>
            </div>

            <button className="landing-primary" onClick={onEnter}>
              Ishni boshlash <ArrowRight size={18} />
            </button>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-footer-main">
          <div className="landing-footer-brand">
            <a className="landing-logo" href="#home">
              <LogoMark />
              <span>Smart<span>Farm</span></span>
            </a>

            <p>
              Fermer xo‘jaligingizni boshqarish, ekinlarni kuzatish
              va kundalik ishlarni rejalashtirish uchun qulay platforma.
            </p>
          </div>

          <div className="landing-footer-links">
            <h3>Tezkor havolalar</h3>
            <a href="#home">Bosh sahifa</a>
            <a href="#services">Imkoniyatlar</a>
            <a href="#about">Biz haqimizda</a>
          </div>

          <div className="landing-footer-contact">
            <h3>SmartFarm Planner</h3>
            <p>Qishloq xo‘jaligini raqamli boshqarish.</p>
            <button onClick={onEnter} className="landing-footer-button">
              Fermer paneliga o‘tish <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="landing-footer-bottom">
          <p>
            © {new Date().getFullYear()} SmartFarm Planner.
            Barcha huquqlar himoyalangan.
          </p>
          <a href="#home">Yuqoriga qaytish ↑</a>
        </div>
      </footer>
    </div>
  );
}
