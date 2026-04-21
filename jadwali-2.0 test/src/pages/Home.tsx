import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const STORAGE_KEY = 'jadwali_form_data';

export default function Home() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [hasSavedData, setHasSavedData] = useState(false);

  // Check for existing incomplete data when page loads
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hasData = Object.keys(parsed).some(key => {
          if (key === 'currentStep') return false;
          const val = parsed[key];
          if (Array.isArray(val) && val.length === 0) return false;
          if (typeof val === 'object' && val !== null && Object.keys(val).length === 0) return false;
          return val !== undefined && val !== '' && val !== 0;
        });
        setHasSavedData(hasData);
      } catch {
        setHasSavedData(false);
      }
    } else {
      setHasSavedData(false);
    }
  }, []);

  const handleServiceRequest = () => {
    if (hasSavedData) {
      setShowResumeModal(true);
    } else {
      navigate('/services');
    }
  };

  const closeModal = () => setShowResumeModal(false);

  const handleCorrect = () => {
    closeModal();
    navigate('/services');
  };

  const handleNew = () => {
    localStorage.removeItem(STORAGE_KEY);
    closeModal();
    navigate('/services');
  };

  // Animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.feature-card, .testimonial-card, .pricing-card').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const testimonials = [
    {
      stars: '★★★★★',
      text: 'خدمة ممتازة. استعمال الزمن جاء متوازنًا تمامًا ومحترمًا لجميع شروطنا الخاصة. سرعة الإنجاز كانت مذهلة.',
      avatar: 'م.ع',
      name: 'مدير ثانوية إعدادية',
      role: 'جهة الرباط-سلا-القنيطرة'
    },
    {
      stars: '★★★★★',
      text: 'تعاملنا مع الخدمة للمرة الثانية. المواكبة بعد الإنتاج أنقذتنا مرات عديدة عند التغييرات المفاجئة.',
      avatar: 'ف.ب',
      name: 'مديرة إعدادية اعدادية',
      role: 'جهة الدار البيضاء-سطات',
      featured: true
    },
    {
      stars: '★★★★★',
      text: 'مؤسستنا ثانوي تأهيلي بنسبة إشغال مرتفعة. تم التعامل مع التعقيد باحترافية عالية والنتيجة كانت رائعة.',
      avatar: 'أ.ص',
      name: 'ناظر ثانوية تأهيلية',
      role: 'جهة مراكش-آسفي'
    }
  ];

  const features = [
    {
      icon: '⚖️',
      title: 'استعمال زمن متوازن',
      description: 'توزيع عادل للحصص على أيام الأسبوع مع مراعاة الإرهاق وتوافر الأساتذة والقاعات بشكل متناسق تمامًا.',
      big: true
    },
    {
      icon: '📅',
      title: 'مواكبة طوال السنة',
      description: 'دعم مستمر عند أي تغيير طارئ: انتقال أستاذ، تعديل حصص، حالات استثنائية.'
    },
    {
      icon: '⚡',
      title: 'سرعة الإنجاز',
      description: 'إنجاز استعمال الزمن في مدة قياسية لا تتجاوز 48 ساعة من استلام المعطيات الكاملة.'
    },
    {
      icon: '🎯',
      title: 'دقة عالية',
      description: 'احترام جميع القيود التربوية: نسبة الإشغال، التفويج، المواد العلمية، الشروط الخاصة بالأساتذة.'
    },
    {
      icon: '🔧',
      title: 'مرونة التعديل',
      description: 'إمكانية تعديل استعمال زمن موجود أو معالجة حالات خاصة معقدة بأسعار مناسبة.'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Background */}
      <div className="hero-bg">
        <div className="grid-overlay"></div>
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {/* Hero Section */}
      <section className="hero" ref={heroRef}>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            خدمة متخصصة للمؤسسات التعليمية المغربية
          </div>
          <h1 className="hero-title">
            استعمال الزمن المثالي<br />
            <span className="gradient-text">لمؤسستك التعليمية</span>
          </h1>
          <p className="hero-subtitle">
            نقدم لكم خدمة احترافية لإنتاج وتعديل استعمالات الزمن للمؤسسات الإعدادية والثانوية التأهيلية،
            بدقة عالية ومواكبة طوال السنة الدراسية.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={handleServiceRequest}>
              <span>طلب الخدمة الآن</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <button className="btn-ghost" onClick={() => navigate('/portfolio')}>
              شاهد نماذجنا
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-num">+50</span>
              <span className="stat-label">مؤسسة تعليمية</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-num">48h</span>
              <span className="stat-label">متوسط وقت الإنجاز</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-num">100%</span>
              <span className="stat-label">رضا العملاء</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="schedule-mockup">
            <div className="mockup-header">
              <div className="mockup-dots"><span></span><span></span><span></span></div>
              <span className="mockup-title">استعمال الزمن — ثانوية إبن سينا</span>
            </div>
            <div className="mockup-grid">
              <div className="mock-row mock-header-row">
                <div className="mock-cell mock-time">الوقت</div>
                <div className="mock-cell">الاثنين</div>
                <div className="mock-cell">الثلاثاء</div>
                <div className="mock-cell">الأربعاء</div>
                <div className="mock-cell">الخميس</div>
                <div className="mock-cell">الجمعة</div>
              </div>
              <div className="mock-row">
                <div className="mock-cell mock-time">8:00</div>
                <div className="mock-cell"><div className="mock-subject s1">رياضيات</div></div>
                <div className="mock-cell"><div className="mock-subject s2">فيزياء</div></div>
                <div className="mock-cell"><div className="mock-subject s3">عربية</div></div>
                <div className="mock-cell"><div className="mock-subject s1">رياضيات</div></div>
                <div className="mock-cell"><div className="mock-subject s4">إنجليزية</div></div>
              </div>
              <div className="mock-row">
                <div className="mock-cell mock-time">10:00</div>
                <div className="mock-cell"><div className="mock-subject s3">عربية</div></div>
                <div className="mock-cell"><div className="mock-subject s5">علوم</div></div>
                <div className="mock-cell"><div className="mock-subject s1">رياضيات</div></div>
                <div className="mock-cell"><div className="mock-subject s2">فيزياء</div></div>
                <div className="mock-cell"><div className="mock-subject s3">عربية</div></div>
              </div>
              <div className="mock-row">
                <div className="mock-cell mock-time">14:00</div>
                <div className="mock-cell"><div className="mock-subject s4">إنجليزية</div></div>
                <div className="mock-cell"><div className="mock-subject s3">عربية</div></div>
                <div className="mock-cell"><div className="mock-subject s5">علوم</div></div>
                <div className="mock-cell"><div className="mock-subject s4">إنجليزية</div></div>
                <div className="mock-cell"><div className="mock-subject s2">فيزياء</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="section-container">
          <div className="section-header">
            <div className="section-tag">لماذا تختارنا</div>
            <h2 className="section-title">مميزات الخدمة</h2>
            <p className="section-subtitle">نعتمد على برنامج FET المتخصص لضمان جداول دراسية متوازنة ومحكمة</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className={`feature-card ${feature.big ? 'feature-big' : ''}`}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                {feature.big && <div className="feature-decoration"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials" id="testimonials">
        <div className="section-container">
          <div className="section-header">
            <div className="section-tag">آراء المؤسسات</div>
            <h2 className="section-title">ماذا يقول عملاؤنا</h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className={`testimonial-card ${testimonial.featured ? 'testimonial-featured' : ''}`}>
                <div className="testimonial-stars">{testimonial.stars}</div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.avatar}</div>
                  <div className="author-info">
                    <strong>{testimonial.name}</strong>
                    <span>{testimonial.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="pricing" id="pricing">
        <div className="section-container">
          <div className="section-header">
            <div className="section-tag">الأسعار</div>
            <h2 className="section-title">تعرف على أسعارنا</h2>
            <p className="section-subtitle">أسعار تأشيرية — السعر النهائي يُحدد بعد تقييم طلبك</p>
          </div>
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-badge">إعدادي عادي</div>
              <div className="pricing-price">
                <span className="price-from">ابتداءً من</span>
                <span className="price-amount">600</span>
                <span className="price-currency">درهم</span>
              </div>
              <ul className="pricing-features">
                <li>✓ إنتاج استعمال زمن كامل</li>
                <li>✓ مراعاة جميع شروط الأساتذة</li>
                <li>✓ مواكبة طوال السنة</li>
                <li>✓ مسار دراسة ورياضة</li>
              </ul>
              <button className="btn-primary" style={{width:'100%', justifyContent:'center', marginTop:'1rem'}} onClick={handleServiceRequest}>
                اطلب الآن
              </button>
            </div>
            <div className="pricing-card pricing-popular">
              <div className="popular-label">الأكثر طلبًا</div>
              <div className="pricing-badge">إعدادي رائد</div>
              <div className="pricing-price">
                <span className="price-from">ابتداءً من</span>
                <span className="price-amount">700</span>
                <span className="price-currency">درهم</span>
              </div>
              <ul className="pricing-features">
                <li>✓ كل مميزات الإعدادي العادي</li>
                <li>✓ دعم المسار الدولي</li>
                <li>✓ الدعم التربوي في الرياضيات والفرنسية</li>
                <li>✓ أولوية في الإنجاز</li>
              </ul>
              <button className="btn-primary" style={{width:'100%', justifyContent:'center', marginTop:'1rem'}} onClick={handleServiceRequest}>
                اطلب الآن
              </button>
            </div>
            <div className="pricing-card">
              <div className="pricing-badge">ثانوي تأهيلي</div>
              <div className="pricing-price">
                <span className="price-from">ابتداءً من</span>
                <span className="price-amount">700</span>
                <span className="price-currency">درهم</span>
              </div>
              <ul className="pricing-features">
                <li>✓ جميع مسالك الباكالوريا</li>
                <li>✓ دعم التفويج العلمي</li>
                <li>✓ جميع أنواع الشعب (تقنية، صناعية، كهربائية...)</li>
                <li>✓ مواكبة طوال السنة</li>
              </ul>
              <button className="btn-primary" style={{width:'100%', justifyContent:'center', marginTop:'1rem'}} onClick={handleServiceRequest}>
                اطلب الآن
              </button>
            </div>
          </div>
          <div className="pricing-note">
            <span className="note-icon">⚠️</span>
            <p>الأسعار المذكورة تأشيرية. السعر النهائي يتحدد حسب: تعقيد المؤسسة، الشروط الخاصة، ونسبة الإشغال.
            <strong>إعادة الإنتاج: 100 درهم — المواكبة بعد الإنتاج مجانية طوال السنة.</strong></p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="section-container">
          <div className="cta-box">
            <h2>جاهز لتحسين استعمال الزمن لمؤسستك؟</h2>
            <p>تواصل معنا الآن واحصل على استعمال زمن مثالي يلبي جميع احتياجاتك</p>
            <div className="cta-buttons">
              <button className="btn-primary" onClick={handleServiceRequest}>اطلب الخدمة</button>
              <button className="btn-ghost" onClick={() => navigate('/contact')}>تواصل معنا</button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal for existing data */}
      {showResumeModal && (
        <div className="modal-overlay open" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <div className="modal-icon">📋</div>
            <h3>هل تريد متابعة طلب سابق؟</h3>
            <p>يوجد بيانات غير مكتملة من جلسة سابقة. ماذا تريد أن تفعل؟</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginTop: '1.5rem' }}>
              <button 
                className="btn-primary" 
                onClick={handleCorrect} 
                style={{ background: '#2563eb', flex: 1 }}
              >
                تصحيح الطلب السابق
              </button>
              <button 
                className="btn-primary" 
                onClick={handleNew} 
                style={{ background: '#ef4444', flex: 1 }}
              >
                طلب جديد (مسح البيانات)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}