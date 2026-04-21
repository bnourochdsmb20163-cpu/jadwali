import { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import Pricing from './pages/Pricing';
import About from './pages/About';

// ===== THEME CONTEXT =====
type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

// ===== THEME PROVIDER =====
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('jadwali-theme');
    // Default to light mode always. User can toggle to dark manually.
    if (saved === 'dark') return 'dark';
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('jadwali-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ===== THEME TOGGLE BUTTON =====
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      title={theme === 'dark' ? 'تبديل للوضع النهاري' : 'تبديل للوضع الليلي'}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}

// ===== NAVIGATION COMPONENT =====
function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const navLinks = [
    { path: '/', label: 'الرئيسية' },
    { path: '/services', label: 'طلب الخدمة' },
    { path: '/portfolio', label: 'نماذج أعمالنا' },
    { path: '/pricing', label: 'الأسعار' },
    { path: '/about', label: 'من نحن' },
    { path: '/contact', label: 'تواصل معنا' },
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <div className="nav-logo" onClick={() => handleNavClick('/')}>
          <span className="logo-icon">&#x29D6;</span>
          <span className="logo-text">جدولي</span>
        </div>
        <div className="nav-links">
          {navLinks.map(link => (
            <a key={link.path} className={isActive(link.path) ? 'active' : ''} onClick={() => handleNavClick(link.path)}>
              {link.label}
            </a>
          ))}
        </div>
        <div className="nav-actions" style={{ display: 'flex', alignItems: 'center' }}>
          <ThemeToggle />
          <button className="hamburger" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        {navLinks.map(link => (
          <a key={link.path} className={isActive(link.path) ? 'active' : ''} onClick={() => handleNavClick(link.path)}>
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

// ===== FOOTER COMPONENT =====
function Footer() {
  const navigate = useNavigate();

  const handleNavClick = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  const footerLinks = [
    { path: '/', label: 'الرئيسية' },
    { path: '/services', label: 'طلب الخدمة' },
    { path: '/portfolio', label: 'نماذج أعمالنا' },
    { path: '/pricing', label: 'الأسعار' },
    { path: '/about', label: 'من نحن' },
    { path: '/contact', label: 'تواصل معنا' },
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="nav-logo" onClick={() => handleNavClick('/')}>
            <span className="logo-icon">&#x29D6;</span>
            <span className="logo-text">جدولي</span>
          </div>
          <p>خدمة متخصصة في إنتاج استعمالات الزمن للمؤسسات التعليمية المغربية</p>
        </div>
        <div className="footer-links">
          <h5>روابط سريعة</h5>
          {footerLinks.map(link => (
            <a key={link.path} onClick={() => handleNavClick(link.path)}>{link.label}</a>
          ))}
        </div>
        <div className="footer-contact">
          <h5>تواصل معنا</h5>
          <p>
            <a href="https://wa.me/212612345678" className="contact-link" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--blue-light)' }}>
              WhatsApp: 0612345678
            </a>
          </p>
          <p>⏰ نعمل طوال أيام الأسبوع</p>
          <p>🕐 من 08:00 إلى 20:00</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 جدولي — جميع الحقوق محفوظة</p>
      </div>
    </footer>
  );
}

// ===== WHATSAPP FLOAT BUTTON =====
function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/212612345678"
      className="whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
      title="تواصل عبر واتساب"
    >
      💬
    </a>
  );
}

// ===== MAIN APP =====
function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app">
          <Navigation />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
          <Footer />
          <WhatsAppFloat />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
