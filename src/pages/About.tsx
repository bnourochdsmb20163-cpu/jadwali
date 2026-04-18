import { useNavigate } from 'react-router-dom';

export default function About() {
  const navigate = useNavigate();

  const features = [
    {
      icon: '🎯',
      title: 'خبرة 5 سنوات',
      description: 'في إنتاج استعمالات الزمن مع المؤسسات العمومية والخاصة'
    },
    {
      icon: '💻',
      title: 'برنامج FET',
      description: 'خبرة في المعلوميات وبرنامج FET المتخصص في إنتاج الجداول'
    },
    {
      icon: '📍',
      title: 'الموقع',
      description: 'فاس، المغرب — نخدم جميع جهات المملكة'
    },
    {
      icon: '⚡',
      title: 'سرعة الإنجاز',
      description: 'إنجاز استعمال الزمن في مدة قياسية لا تتجاوز 48 ساعة'
    }
  ];

  const stats = [
    { value: '+50', label: 'مؤسسة تعليمية' },
    { value: '5', label: 'سنوات خبرة' },
    { value: '100%', label: 'رضا العملاء' },
    { value: '48h', label: 'متوسط الإنجاز' }
  ];

  return (
    <div className="about-page">
      <section className="about-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-tag">من نحن</div>
            <h2 className="section-title">جدولي — خدمة متخصصة</h2>
            <p className="section-subtitle">نقدم حلولاً احترافية لإنتاج استعمالات الزمن للمؤسسات التعليمية المغربية</p>
          </div>

          {/* About Content */}
          <div className="about-content">
            <div className="about-text">
              <h3>أستاذ رياضيات</h3>
              <p>
                أعمل كأستاذ للرياضيات ولدي خبرة تمتد لـ 5 سنوات في إنتاج استعمالات الزمن 
                للمؤسسات التعليمية العمومية والخاصة. أستخدم برنامج FET المتخصص لضمان 
                إنتاج جداول دراسية متوازنة ومحكمة.
              </p>
              <p>
                هدفي هو مساعدة المؤسسات التعليمية على تحقيق استعمال زمن مثالي يلبي 
                جميع الاحتياجات التربوية والتنظيمية، مع مراعاة جميع الشروط الخاصة 
                بالأساتذة والقاعات.
              </p>
              <div className="about-location">
                <span>📍</span>
                <span>فاس، المغرب</span>
              </div>
            </div>

            <div className="about-features">
              {features.map((feature, index) => (
                <div className="about-feature-item" key={index}>
                  <div className="feature-icon">{feature.icon}</div>
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="about-stats">
            {stats.map((stat, index) => (
              <div className="about-stat-item" key={index}>
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Mission */}
          <div className="mission-section">
            <h3>هدفنا</h3>
            <p>
              إنشاء منصة إلكترونية لطلب إنتاج استعمال زمن جديد أو تعديل استعمال زمن 
              موجود أو معالجة حالات خاصة معقدة، مع جمع جميع المعطيات الضرورية بدقة 
              عالية لتسهيل العمل وتحقيق أفضل نتيجة.
            </p>
            <div className="mission-features">
              <div className="mission-feature">
                <span>⚖️</span>
                <span>استعمال زمن متوازن</span>
              </div>
              <div className="mission-feature">
                <span>✅</span>
                <span>احترام جميع الشروط</span>
              </div>
              <div className="mission-feature">
                <span>📅</span>
                <span>مواكبة طوال السنة</span>
              </div>
              <div className="mission-feature">
                <span>⚡</span>
                <span>سرعة الإنجاز</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="about-cta">
            <h3>هل أنت جاهز لتحسين استعمال الزمن لمؤسستك؟</h3>
            <p>تواصل معنا الآن واحصل على استعمال زمن مثالي يلبي جميع احتياجاتك</p>
            <div className="cta-buttons">
              <button className="btn-primary" onClick={() => navigate('/services')}>
                اطلب الخدمة
              </button>
              <button className="btn-ghost" onClick={() => navigate('/contact')}>
                تواصل معنا
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
