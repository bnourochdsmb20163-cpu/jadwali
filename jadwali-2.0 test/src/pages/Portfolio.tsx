import { useState } from 'react';

interface PortfolioItem {
  id: number;
  title: string;
  subtitle: string;
  type: string;
  teachers: string;
  classes: string;
  time: string;
  description: string;
  tags: string[];
}

export default function Portfolio() {
  const [filter, setFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const portfolioData: PortfolioItem[] = [
    {
      id: 1,
      title: "ثانوية تأهيلية — جهة مراكش",
      subtitle: "12 قسم — جميع مسالك الباكالوريا — تفويج علوم",
      type: "highschool",
      teachers: "28",
      classes: "12",
      time: "36h",
      description: "مؤسسة ثانوية تأهيلية متوسطة الحجم مع تفويج علوم الحياة والأرض والفيزياء. تم مراعاة جميع شروط الأساتذة وتوزيع الحصص بشكل متوازن.",
      tags: ["ثانوي تأهيلي", "تفويج", "12 قسم"]
    },
    {
      id: 2,
      title: "إعدادية — جهة الرباط",
      subtitle: "9 أقسام — 3 مستويات — شروط خاصة معقدة للأساتذة",
      type: "college",
      teachers: "18",
      classes: "9",
      time: "24h",
      description: "إعدادية عادية مع شروط خاصة معقدة للأساتذة. تم التعامل مع جميع القيود بنجاح وإنتاج جدول متوازن.",
      tags: ["إعدادي", "9 أقسام", "شروط خاصة"]
    },
    {
      id: 3,
      title: "إعدادية رائدة — جهة فاس",
      subtitle: "15 قسم — مسار دولي + عادي — إدارة ازدواجية المستويات",
      type: "pioneer",
      teachers: "32",
      classes: "15",
      time: "48h",
      description: "إعدادية رائدة مع مسار دولي وعادي. تم إدارة ازدواجية المستويات باحترافية عالية.",
      tags: ["إعدادي رائد", "مسار دولي", "15 قسم"]
    },
    {
      id: 4,
      title: "ثانوية — جهة الدار البيضاء",
      subtitle: "20 قسم — نسبة إشغال 91% — معالجة قيود صعبة",
      type: "highschool",
      teachers: "45",
      classes: "20",
      time: "48h",
      description: "ثانوية كبيرة بنسبة إشغال مرتفعة جداً. تم معالجة القيود الصعبة باحترافية وإنتاج جدول متوازن.",
      tags: ["ثانوي تأهيلي", "نسبة إشغال عالية", "20 قسم"]
    },
    {
      id: 5,
      title: "إعدادية قروية — جهة سوس",
      subtitle: "6 أقسام — أساتذة مشتركون مع مؤسسة أخرى",
      type: "college",
      teachers: "10",
      classes: "6",
      time: "12h",
      description: "إعدادية قروية صغيرة مع أساتذة مشتركين مع مؤسسة أخرى. تم إنجاز الجدول بسرعة عالية.",
      tags: ["إعدادي", "6 أقسام", "أساتذة مشتركون"]
    },
    {
      id: 6,
      title: "إعدادية رائدة — جهة طنجة",
      subtitle: "تعديل طارئ — انتقال 3 أساتذة في منتصف السنة",
      type: "pioneer",
      teachers: "25",
      classes: "—",
      time: "8h",
      description: "تعديل طارئ لإعدادية رائدة بعد انتقال 3 أساتذة في منتصف السنة. تم إعادة بناء الجدول بسرعة قياسية.",
      tags: ["إعدادي رائد", "تعديل طارئ", "25 أستاذ"]
    }
  ];

  const filteredData = filter === 'all' 
    ? portfolioData 
    : portfolioData.filter(item => item.type === filter);

  return (
    <div className="portfolio-page">
      <section className="portfolio page-portfolio" id="portfolio">
        <div className="section-container">
          <div className="section-header">
            <div className="section-tag">نماذج من أعمالنا</div>
            <h2 className="section-title">جداول أنتجناها فعلاً</h2>
            <p className="section-subtitle">نماذج حقيقية من مؤسسات متنوعة — البيانات مُخفاة للحفاظ على الخصوصية</p>
          </div>

          {/* Filter Tabs */}
          <div className="portfolio-filters">
            <button className={`pf-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>الكل</button>
            <button className={`pf-btn ${filter === 'college' ? 'active' : ''}`} onClick={() => setFilter('college')}>إعدادي</button>
            <button className={`pf-btn ${filter === 'pioneer' ? 'active' : ''}`} onClick={() => setFilter('pioneer')}>إعدادي رائد</button>
            <button className={`pf-btn ${filter === 'highschool' ? 'active' : ''}`} onClick={() => setFilter('highschool')}>ثانوي تأهيلي</button>
          </div>

          <div className="portfolio-grid">
            {filteredData.map((item) => (
              <div className="portfolio-card" key={item.id} data-type={item.type}>
                <div className="pc-preview">
                  <div className={`pc-schedule ${item.type}`}>
                    <div className="pc-sch-header">
                      <span className="pc-sch-dot d1"></span>
                      <span className="pc-sch-dot d2"></span>
                      <span className="pc-sch-dot d3"></span>
                      <span className="pc-sch-title">{item.subtitle.split('—')[0]}</span>
                    </div>
                    <div className="pc-sch-grid">
                      <div className="pc-sch-row">
                        <div className="pc-cell hd">الوقت</div>
                        <div className="pc-cell hd">الاثنين</div>
                        <div className="pc-cell hd">الثلاثاء</div>
                        <div className="pc-cell hd">الأربعاء</div>
                        <div className="pc-cell hd">الخميس</div>
                      </div>
                      <div className="pc-sch-row">
                        <div className="pc-cell tm">8:00</div>
                        <div className="pc-cell"><div className="pc-sub c1">رياضيات</div></div>
                        <div className="pc-cell"><div className="pc-sub c2">فيزياء</div></div>
                        <div className="pc-cell"><div className="pc-sub c3">عربية</div></div>
                        <div className="pc-cell"><div className="pc-sub c4">إنجليزية</div></div>
                      </div>
                      <div className="pc-sch-row">
                        <div className="pc-cell tm">10:00</div>
                        <div className="pc-cell"><div className="pc-sub c3">عربية</div></div>
                        <div className="pc-cell"><div className="pc-sub c5">علوم</div></div>
                        <div className="pc-cell"><div className="pc-sub c1">رياضيات</div></div>
                        <div className="pc-cell"><div className="pc-sub c2">فيزياء</div></div>
                      </div>
                      <div className="pc-sch-row">
                        <div className="pc-cell tm">14:00</div>
                        <div className="pc-cell"><div className="pc-sub c4">إنجليزية</div></div>
                        <div className="pc-cell"><div className="pc-sub c1">رياضيات</div></div>
                        <div className="pc-cell"><div className="pc-sub c5">علوم</div></div>
                        <div className="pc-cell"><div className="pc-sub c3">عربية</div></div>
                      </div>
                    </div>
                  </div>
                  <div className="pc-overlay">
                    <button className="pc-zoom-btn" onClick={() => setSelectedItem(item)}>
                      🔍 عرض تفاصيل أكثر
                    </button>
                  </div>
                </div>
                <div className="pc-info">
                  <div className={`pc-badge ${item.type}`}>
                    {item.type === 'college' ? 'إعدادي' : item.type === 'pioneer' ? 'إعدادي رائد' : 'ثانوي تأهيلي'}
                  </div>
                  <h4>{item.title}</h4>
                  <p>{item.subtitle}</p>
                  <div className="pc-meta">
                    <span>🏫 {item.teachers} أستاذ</span>
                    <span>⚡ إنجاز في {item.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="portfolio-cta">
            <p>هذه مجرد نماذج — لدينا أكثر من 50 مؤسسة تعليمية تم إنجازها بنجاح</p>
            <button className="btn-primary" onClick={() => window.location.href = '/services'}>اطلب خدمتك الآن</button>
          </div>
        </div>
      </section>

      {/* Portfolio Modal */}
      {selectedItem && (
        <div className="modal-overlay open" onClick={() => setSelectedItem(null)}>
          <div className="modal-box modal-portfolio" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedItem(null)}>✕</button>
            <div className="pm-header">
              <h3>{selectedItem.title}</h3>
              <p>{selectedItem.subtitle}</p>
            </div>
            <div className="pm-body">
              <div className="pm-tags">
                {selectedItem.tags.map((tag, idx) => (
                  <span className="pm-tag" key={idx}>{tag}</span>
                ))}
              </div>
              <div className="pm-stats-grid">
                <div className="pm-stat">
                  <span className="pm-stat-val">{selectedItem.teachers}</span>
                  <span className="pm-stat-label">أستاذ</span>
                </div>
                <div className="pm-stat">
                  <span className="pm-stat-val">{selectedItem.classes}</span>
                  <span className="pm-stat-label">قسم</span>
                </div>
                <div className="pm-stat">
                  <span className="pm-stat-val">{selectedItem.time}</span>
                  <span className="pm-stat-label">وقت الإنجاز</span>
                </div>
              </div>
              <p className="pm-desc">{selectedItem.description}</p>
            </div>
            <div className="pm-footer">
              <button className="btn-primary" onClick={() => window.location.href = '/services'}>اطلب خدمة مماثلة</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
