import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    // جلب البريد الإلكتروني للمستخدم الحالي من Supabase
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setUserEmail(user.email);
      }
    });

    const handleOutsideClick = (e: MouseEvent) => {
      const hamburger = document.getElementById('hamburgerBtn');
      const menu = document.getElementById('menuPanel');
      if (hamburger && menu && !hamburger.contains(e.target as Node) && !menu.contains(e.target as Node)) {
        setIsMenuOpen(false);
        hamburger.classList.remove('open');
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    const hamburger = document.getElementById('hamburgerBtn');
    if (hamburger) {
      hamburger.classList.toggle('open');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(480px 480px at 12% 12%, rgba(255,79,163,0.18), transparent 70%), radial-gradient(520px 520px at 92% 90%, rgba(139,92,246,0.20), transparent 70%), linear-gradient(160deg, #1c0e30 0%, #160a24 55%, #100819 100%)', color: '#f2e9fb', fontFamily: "'Inter', 'Segoe UI', sans-serif", overflowX: 'hidden' }}>
      <style>{`
        .display { font-family: 'Poppins', 'Segoe UI', sans-serif; }
        .topbar {
          position: sticky; top: 0; z-index: 50;
          display: flex; align-items: center; justify-content: space-between;
          padding: 22px 40px;
          background: rgba(16,8,25,0.55);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .topbar-left { display: flex; align-items: center; gap: 16px; }
        .hamburger {
          width: 30px; height: 22px; background: none; border: none; cursor: pointer;
          display: flex; flex-direction: column; justify-content: space-between; padding: 0;
        }
        .hamburger span {
          display: block; height: 3px; border-radius: 2px; background: #f2e9fb;
          transition: transform .2s ease, opacity .2s ease, width .2s ease;
        }
        .hamburger span:nth-child(1) { width: 100%; }
        .hamburger span:nth-child(2) { width: 100%; }
        .hamburger span:nth-child(3) { width: 60%; }
        .hamburger.open span:nth-child(1) { transform: translateY(9.5px) rotate(45deg); width: 100%; }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: translateY(-9.5px) rotate(-45deg); width: 100%; }
        .logo { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 20px; }
        .logo .bolt { font-size: 22px; }
        .logo .brand {
          background: linear-gradient(90deg, #ff5fa8, #a855f7);
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        .topbar-right { display: flex; align-items: center; gap: 18px; }
        .avatar {
          width: 32px; height: 32px; border-radius: 50%; background: #3a2354;
          display: flex; align-items: center; justify-content: center; font-size: 14px; color: #f2e9fb;
        }
        .user-email { font-size: 13px; color: #cbb9e6; }
        .btn-signout {
          padding: 9px 22px; border-radius: 20px; border: none; cursor: pointer;
          background: linear-gradient(90deg, #ff4fa3, #a855f7);
          color: #fff; font-weight: 700; font-size: 13px;
          box-shadow: 0 6px 18px rgba(255,79,163,0.35);
          transition: transform .15s ease, box-shadow .15s ease;
        }
        .btn-signout:hover { transform: translateY(-1px); box-shadow: 0 8px 22px rgba(255,79,163,0.5); }
        .menu-panel {
          position: absolute; top: 70px; left: 40px; z-index: 60;
          background: #1c1030; border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px; padding: 10px; min-width: 190px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.45);
          opacity: 0; pointer-events: none; transform: translateY(-8px);
          transition: opacity .18s ease, transform .18s ease;
        }
        .menu-panel.open { opacity: 1; pointer-events: auto; transform: translateY(0); }
        .menu-panel a {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 9px; color: #c9baE3;
          text-decoration: none; font-size: 14px;
        }
        .menu-panel a:hover { background: rgba(255,255,255,0.06); color: #fff; }
        .page {
          display: grid;
          grid-template-columns: minmax(320px, 640px) 1fr;
          min-height: calc(100vh - 76px);
          position: relative;
        }
        .page::after {
          content: "";
          position: absolute; top: 0; bottom: 0; left: 640px;
          width: 1px;
          background: linear-gradient(180deg, transparent, rgba(255,95,168,0.35), rgba(139,92,246,0.35), transparent);
        }
        .mission {
          display: flex; flex-direction: column; justify-content: center;
          padding: 60px 80px;
          min-height: 640px;
        }
        .eyebrow {
          font-size: 12.5px; font-weight: 700; letter-spacing: 3px; color: #ff8fc4;
          margin: 0 0 22px 0;
        }
        .headline {
          font-size: clamp(40px, 5vw, 64px); font-weight: 800; margin: 0 0 26px 0; line-height: 1.05;
          background: linear-gradient(135deg, #ff5fa8 0%, #c76bf0 55%, #8b5cf6 100%);
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        .mission p {
          font-size: 16.5px; line-height: 1.75; color: #c9baE3;
          max-width: 480px; margin: 0 0 34px 0;
        }
        .btn-cta {
          display: inline-flex; align-items: center; gap: 8px; width: fit-content;
          padding: 16px 30px; border-radius: 27px; border: none; cursor: pointer;
          background: linear-gradient(90deg, #ff4fa3, #a855f7);
          color: #fff; font-weight: 700; font-size: 15.5px;
          box-shadow: 0 10px 28px rgba(255,79,163,0.4);
          transition: transform .15s ease, box-shadow .15s ease;
        }
        .btn-cta:hover { transform: translateY(-2px); box-shadow: 0 14px 34px rgba(255,79,163,0.55); }
        .footer-note {
          font-size: 12px; color: #7c6994; padding: 0 80px 32px 80px;
        }
        .labs { padding: 56px 60px 40px 60px; }
        .labs h2 { font-size: 24px; font-weight: 700; margin: 0 0 6px 0; }
        .labs .sub { font-size: 13px; color: #9c89bb; margin: 0 0 26px 0; }
        .lab-row {
          display: grid;
          grid-template-columns: 56px 44px 1fr 20px;
          align-items: center;
          gap: 18px;
          padding: 22px 18px;
          border-radius: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          text-decoration: none;
          color: inherit;
          cursor: pointer;
          transition: background .18s ease;
        }
        .lab-row:hover { background: rgba(255,255,255,0.05); }
        .lab-row.featured { background: rgba(255,255,255,0.045); }
        .lab-num {
          font-family: 'Poppins', 'Segoe UI', sans-serif;
          font-size: 30px; font-weight: 800;
          background: linear-gradient(180deg, #ff8ac2, #9b7dfb);
          -webkit-background-clip: text; background-clip: text; color: transparent;
          opacity: 0.55;
        }
        .lab-row.featured .lab-num { opacity: 1; }
        .lab-icon { font-size: 22px; text-align: center; }
        .lab-title { font-size: 18px; font-weight: 700; margin: 0 0 6px 0; color: #f2e9fb; }
        .lab-desc { font-size: 13px; color: #9c89bb; margin: 0; line-height: 1.5; }
        .lab-continue {
          font-size: 11px; font-weight: 700; letter-spacing: 1px; color: #ff8fc4;
          margin-top: 8px; display: block;
        }
        .lab-arrow { color: #7c6994; font-size: 18px; transition: transform .15s ease, color .15s ease; }
        .lab-row:hover .lab-arrow { transform: translateX(4px); color: #fff; }
        .view-all {
          display: grid; grid-template-columns: 56px 1fr; align-items: center; gap: 18px;
          padding: 22px 18px; cursor: pointer; border-radius: 16px;
          transition: background .18s ease;
        }
        .view-all:hover { background: rgba(255,255,255,0.05); }
        .view-all .plus-circle {
          width: 32px; height: 32px; border-radius: 50%; border: 1.5px solid #8b5cf6;
          display: flex; align-items: center; justify-content: center; font-size: 16px; color: #c9a8ff;
        }
        .view-all .vt { font-size: 16px; font-weight: 700; color: #c9a8ff; margin: 0 0 2px 0; }
        .view-all .vs { font-size: 12.5px; color: #9c89bb; margin: 0; }
        .chat-fab {
          position: fixed; bottom: 30px; right: 30px; z-index: 40;
          width: 58px; height: 58px; border-radius: 50%; border: none; cursor: pointer;
          background: linear-gradient(90deg, #ff4fa3, #a855f7);
          font-size: 24px; color: #fff;
          box-shadow: 0 10px 28px rgba(255,79,163,0.4);
          transition: transform .15s ease;
        }
        .chat-fab:hover { transform: scale(1.08); }
        @media (max-width: 980px) {
          .page { grid-template-columns: 1fr; }
          .page::after { display: none; }
          .mission { padding: 50px 28px 20px 28px; min-height: auto; }
          .mission p { max-width: 100%; }
          .footer-note { padding: 0 28px 20px 28px; }
          .labs { padding: 20px 20px 40px 20px; }
          .topbar { padding: 18px 20px; }
          .user-email { display: none; }
          .lab-row { grid-template-columns: 40px 36px 1fr 16px; padding: 18px 10px; }
          .lab-num { font-size: 22px; }
        }
      `}</style>

      {/* الـ Topbar الخاص بصفحة اللاندنج والتصميم الجديد */}
      <header className="topbar">
        <div className="topbar-left">
          <button className="hamburger" id="hamburgerBtn" onClick={toggleMenu} aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
          <div className="logo display">
            <span className="bolt">⚡</span>
            <span className="brand">Virtual Hub</span>
          </div>
        </div>
        <div className="topbar-right">
          <div className="avatar">{userEmail ? userEmail.charAt(0).toUpperCase() : 'L'}</div>
          <span className="user-email">{userEmail}</span>
          <button className="btn-signout" onClick={handleSignOut}>Sign Out</button>
        </div>
      </header>

      {/* القائمة المنسدلة للهمبرغر مرتبطة بمسارات الـ App */}
      <nav className={`menu-panel ${isMenuOpen ? 'open' : ''}`} id="menuPanel">
        <Link to="/settings" onClick={() => setIsMenuOpen(false)}>⚙️ Settings</Link>
        <Link to="/lab/iot" onClick={() => setIsMenuOpen(false)}>🧪 Labs</Link>
      </nav>

      <main className="page">
        <section className="mission">
          <p className="eyebrow">FOR STUDENTS, BY STUDENTS</p>
          <h1 className="headline display">Virtual Hub</h1>
          <p>
            We know the fear of breaking equipment and falling behind.
            Virtual Hub gives you a calm, judgment-free space to practice,
            get it wrong, and actually learn — with real-time AI guidance,
            whenever you're ready.
          </p>
          <button className="btn-cta" onClick={() => navigate('/lab/iot')}>Explore Labs →</button>
        </section>

        <section className="labs">
          <h2 className="display">Labs &amp; Experiments</h2>
          <p className="sub">Pick up where you left off</p>

          <a className="lab-row featured" onClick={() => navigate('/lab/iot')}>
            <span className="lab-num">01</span>
            <span className="lab-icon">⚡</span>
            <span>
              <p className="lab-title">Engineering &amp; IoT Lab</p>
              <p className="lab-desc">Simulate Arduino, ESP32, and electronics circuits safely with real-time AI feedback.</p>
              <span className="lab-continue">CONTINUE →</span>
            </span>
            <span className="lab-arrow">›</span>
          </a>

          <a className="lab-row" onClick={() => navigate('/lab/network')}>
            <span className="lab-num">02</span>
            <span className="lab-icon">🌐</span>
            <span>
              <p className="lab-title">Network &amp; Cyber Lab</p>
              <p className="lab-desc">Build router and switch topologies and practice cyber defense scenarios.</p>
            </span>
            <span className="lab-arrow">›</span>
          </a>

          <a className="lab-row" onClick={() => navigate('/lab/assembly')}>
            <span className="lab-num">03</span>
            <span className="lab-icon">💻</span>
            <span>
              <p className="lab-title">Assembly Lab</p>
              <p className="lab-desc">Write and simulate 8086 Assembly code with real-time CPU register visualization.</p>
            </span>
            <span className="lab-arrow">›</span>
          </a>

          <a className="lab-row" onClick={() => navigate('/lab/circuit')}>
            <span className="lab-num">04</span>
            <span className="lab-icon">🔌</span>
            <span>
              <p className="lab-title">Circuit Lab</p>
              <p className="lab-desc">Build and simulate electrical circuits with drag &amp; drop components.</p>
            </span>
            <span className="lab-arrow">›</span>
          </a>

          <a className="view-all" onClick={() => navigate('/lab/iot')}>
            <span className="plus-circle">+</span>
            <span>
              <p className="vt">View All Labs</p>
              <p className="vs">See the full catalog</p>
            </span>
          </a>
        </section>
      </main>

      <footer className="footer-note">ctrl+innovate • JSYP Hackathon 2026</footer>
    </div>
  );
}