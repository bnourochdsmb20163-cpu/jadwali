import { useNavigate } from 'react-router-dom';

export default function Pricing() {
  const navigate = useNavigate();

  return (
    <div className="pricing-page">
      <section className="pricing-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-tag">الأسعار</div>
            <h2 className="section-title">تعرف على أسعارنا</h2>
            <p className="section-subtitle">أسعار تأشيرية — السعر النهائي يُحدد بعد تقييم طلبك خلال 24 ساعة</p>
          </div>

          <div className="pricing-grid">
            {/* College Normal */}
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
                <li>✓ دعم فني مجاني</li>
              </ul>
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }} onClick={() => navigate('/services')}>
                اطلب الآن
              </button>
            </div>

            {/* College Pioneer */}
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
                <li>✓ المذكرات المنظمة لإعدادية الريادة</li>
                <li>✓ الدعم المؤسساتي للرياضيات والفرنسية</li>
                <li>✓ توقيت الأنشطة المندمجة</li>
                <li>✓ أولوية في الإنجاز</li>
              </ul>
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }} onClick={() => navigate('/services')}>
                اطلب الآن
              </button>
            </div>

            {/* High School */}
            <div className="pricing-card">
              <div className="pricing-badge">ثانوي تأهيلي</div>
              <div className="pricing-price">
                <span className="price-from">ابتداءً من</span>
                <span className="price-amount">700</span>
                <span className="price-currency">درهم</span>
              </div>
              <ul className="pricing-features">
                <li>✓ جميع مسالك الباكالوريا</li>
                <li>✓ جميع أنواع الشعب (تقنية، صناعية، كهربائية...)</li>
                <li>✓ دعم التفويج العلمي</li>
                <li>✓ مراعاة جميع الشروط الضرورية</li>
                <li>✓ مواكبة طوال السنة</li>
              </ul>
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }} onClick={() => navigate('/services')}>
                اطلب الآن
              </button>
            </div>
          </div>

          {/* Additional Services */}
          <div className="additional-services">
            <h3>خدمات إضافية</h3>
            <div className="services-grid">
              <div className="service-item">
                <div className="service-icon">🔄</div>
                <h4>إعادة الإنتاج</h4>
                <p className="service-price">100 درهم</p>
                <p>إعادة بناء الجدول من الصفر بعد الإنتاج الأول</p>
              </div>
              <div className="service-item">
                <div className="service-icon">✏️</div>
                <h4>تعديل استعمال زمن</h4>
                <p className="price-situation">الثمن حسب الوضعية</p>
                <p>تعديل وتحسين استعمال زمن موجود — يُحدد السعر بعد تقييم التعديلات المطلوبة</p>
              </div>
              <div className="service-item">
                <div className="service-icon">🔍</div>
                <h4>حالة خاصة</h4>
                <p className="price-situation">الثمن حسب الوضعية</p>
                <p>معالجة وضعيات معقدة أو استثنائية — يُحدد السعر بعد دراسة الحالة</p>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="payment-info">
            <h3>طرق الدفع</h3>
            <div className="payment-methods">
              <div className="payment-method-item">
                <div className="payment-icon">🏦</div>
                <h4>تحويل بنكي</h4>
                <p>يمكنك التحويل مباشرة إلى حسابنا البنكي</p>
              </div>
              <div className="payment-method-item">
                <div className="payment-icon">💳</div>
                <h4>وكالات تحويل الأموال</h4>
                <p>وفاكاش، كاش بلوس، وغيرها</p>
              </div>
            </div>
            <div className="payment-terms">
              <h4>نظام الدفع</h4>
              <div className="terms-grid">
                <div className="term-item">
                  <span className="term-percent">50%</span>
                  <span className="term-label">مسبقًا عند تأكيد الطلب</span>
                </div>
                <div className="term-item">
                  <span className="term-percent">50%</span>
                  <span className="term-label">بعد التسليم</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Note */}
          <div className="pricing-note-box">
            <span className="note-icon">⚠️</span>
            <div>
              <h4>تنبيه مهم</h4>
              <p>الأسعار المذكورة تأشيرية وتقريبية. السعر النهائي يتحدد بعد دراسة طلبك وتقييم تعقيد المؤسسة ونسبة الإشغال خلال 24 ساعة من استلام الطلب.</p>
              <p><strong>المواكبة بعد الإنتاج مجانية طوال السنة الدراسية.</strong></p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
