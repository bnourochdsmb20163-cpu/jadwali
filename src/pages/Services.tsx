import { useState, useEffect, useRef, useCallback } from 'react';
import { moroccoData, subjectsData, collegeLevels, highschoolLevels } from '../data/moroccoData';

// ============================================
// CONFIG: Google Apps Script Web App URL
// Replace the URL below with your actual deployed Google Apps Script Web App URL
// after deploying the script as a web app.
// To get your URL:
//   1. Open your Google Apps Script project
//   2. Click Deploy > New deployment
//   3. Select type: Web app
//   4. Set Execute as: Me
//   5. Set Who has access: Anyone
//   6. Click Deploy and copy the Web App URL
//   7. Paste it below replacing 'YOUR_SCRIPT_ID'
// ============================================
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwCXN_DNH9dSeuti3QAUb3AstxtSN8ipXRMmXl1ffX19dgHiZ1-eXORjLVieieXvEJXfQ/exec';

interface FormData {
  [key: string]: string | number | boolean | string[];
}

interface Modification {
  id: number;
  subject: string;
  level: string;
  change: string;
}

interface GroupingLevel {
  levelId: string;
  levelName: string;
  selected: boolean;
}

interface CustomLevel {
  id: string;
  name: string;
  sections: number;
  intlSections: number;
}

const stepTitles = [
  '',
  'معلومات المؤسسة',
  'نوع المؤسسة',
  'البنية التربوية',
  'المواد الدراسية',
  'البنية المادية',
  'التفويج',
  'تعديل الحصص',
  'نوع الخدمة المطلوبة',
  'توقيتات العمل',
  'الملاحظات والوثائق',
  'معلومات الخدمة وتأكيد الطلب',
];

export default function Services() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 11;
  const [formData, setFormData] = useState<FormData>({});
  const [modifications, setModifications] = useState<Modification[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [institutionTypes, setInstitutionTypes] = useState<string[]>([]);
  const [serviceType, setServiceType] = useState('');
  const [groupingPhysics, setGroupingPhysics] = useState(false);
  const [groupingSVT, setGroupingSVT] = useState(false);
  const [modifyHours, setModifyHours] = useState(false);
  const [customSubjects, setCustomSubjects] = useState<{ id: string; name: string }[]>([]);
  const [pricingEstimate, setPricingEstimate] = useState(0);

  // Room info states - now using text comments for names
  const [generalRoomsCount, setGeneralRoomsCount] = useState(0);
  const [scienceRoomsCount, setScienceRoomsCount] = useState(0);
  const [computerRoomsCount, setComputerRoomsCount] = useState(0);
  const [playgroundCount, setPlaygroundCount] = useState(0);
  const [generalRoomNamesText, setGeneralRoomNamesText] = useState('');
  const [scienceRoomNamesText, setScienceRoomNamesText] = useState('');
  const [computerRoomNamesText, setComputerRoomNamesText] = useState('');
  const [playgroundNamesText, setPlaygroundNamesText] = useState('');

  // Custom levels
  const [customLevels, setCustomLevels] = useState<CustomLevel[]>([]);

  // Grouping levels
  const [groupingLevelsPhysics, setGroupingLevelsPhysics] = useState<GroupingLevel[]>([]);
  const [groupingLevelsSVT, setGroupingLevelsSVT] = useState<GroupingLevel[]>([]);

  // International track per level
  const [internationalSections, setInternationalSections] = useState<Record<string, number>>({});

  // Section counts per level (read from step 3 for filtering grouping)
  const [levelSectionCounts, setLevelSectionCounts] = useState<Record<string, number>>({});

  const formRef = useRef<HTMLFormElement>(null);
  const stepContentRef = useRef<HTMLDivElement>(null);

  // Progress bar
  useEffect(() => {
    const progress = (currentStep / totalSteps) * 100;
    const progressBar = document.getElementById('progressBar');
    if (progressBar) progressBar.style.width = `${progress}%`;
  }, [currentStep]);

  // Scroll to step title on step change
  useEffect(() => {
    if (stepContentRef.current) {
      setTimeout(() => {
        stepContentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }, [currentStep]);

  // Pricing estimate
  useEffect(() => {
    let price = 0;
    if (institutionTypes.includes('college')) price += 600;
    if (institutionTypes.includes('college-pioneer')) price += 700;
    if (institutionTypes.includes('highschool')) price += 700;
    if (serviceType === 'edit') price += 100;
    if (serviceType === 'special') price += 150;
    setPricingEstimate(price);
  }, [institutionTypes, serviceType]);

  // Build grouping levels based on configured levels (only those with sections > 0)
  useEffect(() => {
    const levels: GroupingLevel[] = [];

    // Get college levels that have sections > 0
    if (institutionTypes.includes('college') || institutionTypes.includes('college-pioneer')) {
      collegeLevels.forEach(l => {
        const count = levelSectionCounts[l.id] || 0;
        if (count > 0) {
          levels.push({ levelId: l.id, levelName: l.name, selected: false });
        }
      });
    }

    // Get high school levels that have sections > 0
    if (institutionTypes.includes('highschool')) {
      highschoolLevels.forEach(l => {
        const count = levelSectionCounts[l.id] || 0;
        if (count > 0) {
          levels.push({ levelId: l.id, levelName: l.name, selected: false });
        }
      });
    }

    // Get custom levels that have sections > 0
    customLevels.forEach(l => {
      if (l.sections > 0) {
        levels.push({ levelId: l.id, levelName: l.name, selected: false });
      }
    });

    setGroupingLevelsPhysics(levels);
    setGroupingLevelsSVT(levels.map(l => ({ ...l })));
  }, [institutionTypes, levelSectionCounts, customLevels]);

  // Read section counts from inputs
  const readLevelSectionCounts = useCallback(() => {
    const counts: Record<string, number> = {};

    // College levels
    if (institutionTypes.includes('college') || institutionTypes.includes('college-pioneer')) {
      collegeLevels.forEach(l => {
        const input = document.querySelector(`input[name="college_${l.id}"]`) as HTMLInputElement;
        counts[l.id] = parseInt(input?.value || '0') || 0;
      });
    }

    // High school levels
    if (institutionTypes.includes('highschool')) {
      highschoolLevels.forEach(l => {
        const input = document.querySelector(`input[name="hs_${l.id}"]`) as HTMLInputElement;
        counts[l.id] = parseInt(input?.value || '0') || 0;
      });
    }

    // Custom levels
    customLevels.forEach(l => {
      counts[l.id] = l.sections;
    });

    setLevelSectionCounts(counts);
  }, [institutionTypes, customLevels]);

  const handleNext = () => {
    if (currentStep === 3) {
      // Read section counts before moving to grouping step
      readLevelSectionCounts();
    }
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    // Allow navigation to any step
    if (step >= 1 && step <= totalSteps) {
      if (step === 6 && currentStep === 3) {
        // Read section counts when jumping from step 3 to grouping
        readLevelSectionCounts();
      }
      setCurrentStep(step);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleInstitutionTypeChange = (type: string) => {
    if (institutionTypes.includes(type)) {
      setInstitutionTypes(institutionTypes.filter(t => t !== type));
    } else {
      setInstitutionTypes([...institutionTypes, type]);
    }
  };

  // Grouping levels handlers
  const toggleGroupingLevel = (subject: 'physics' | 'svt', levelId: string) => {
    if (subject === 'physics') {
      setGroupingLevelsPhysics(levels => levels.map(l => l.levelId === levelId ? { ...l, selected: !l.selected } : l));
    } else {
      setGroupingLevelsSVT(levels => levels.map(l => l.levelId === levelId ? { ...l, selected: !l.selected } : l));
    }
  };

  // International sections handler
  const handleInternationalChange = (levelId: string, value: number) => {
    setInternationalSections(prev => ({ ...prev, [levelId]: value }));
  };

  // Custom levels handlers
  const handleAddCustomLevel = () => {
    setCustomLevels([...customLevels, {
      id: 'custom_' + Date.now(),
      name: '',
      sections: 0,
      intlSections: 0,
    }]);
  };

  const handleCustomLevelChange = (id: string, field: keyof CustomLevel, value: string | number) => {
    setCustomLevels(levels => levels.map(l =>
      l.id === id ? { ...l, [field]: value } : l
    ));
  };

  const handleRemoveCustomLevel = (id: string) => {
    setCustomLevels(levels => levels.filter(l => l.id !== id));
  };

  const handleAddModification = () => {
    const subject = (document.getElementById('modifySubject') as HTMLSelectElement)?.value;
    const level = (document.getElementById('modifyLevel') as HTMLSelectElement)?.value;
    const change = (document.getElementById('modifyChange') as HTMLTextAreaElement)?.value;
    if (subject && level && change) {
      setModifications([...modifications, { id: Date.now(), subject, level, change }]);
      (document.getElementById('modifyChange') as HTMLTextAreaElement).value = '';
    }
  };

  const handleRemoveModification = (id: number) => {
    setModifications(modifications.filter(m => m.id !== id));
  };

  const handleAddCustomSubject = () => {
    const input = document.getElementById('newSubjectName') as HTMLInputElement;
    if (input.value.trim()) {
      setCustomSubjects([...customSubjects, { id: 'custom_' + Date.now(), name: input.value.trim() }]);
      input.value = '';
    }
  };

  // Build full review data for step 11
  const buildReviewData = () => {
    const lines: string[] = [];
    lines.push('=== طلب خدمة إنتاج استعمال الزمن ===');
    lines.push('');

    // Step 1: Institution Info
    lines.push('📌 معلومات المؤسسة:');
    lines.push(`• اسم المؤسسة: ${(formData.institutionName as string) || '—'}`);
    lines.push(`• رقم الهاتف: ${(formData.phone as string) || '—'}`);
    lines.push(`• الجهة: ${selectedRegion === 'other' ? (formData.otherRegion as string) : selectedRegion || '—'}`);
    lines.push(`• الإقليم: ${selectedProvince === 'other' ? (formData.otherProvince as string) : selectedProvince || '—'}`);
    lines.push(`• الجماعة: ${(formData.commune as string) || '—'}`);
    lines.push('');

    // Step 2: Institution Type
    lines.push('🏫 نوع المؤسسة:');
    institutionTypes.forEach(t => {
      lines.push(`• ${t === 'college' ? 'إعدادي عادي' : t === 'college-pioneer' ? 'إعدادي رائد' : 'ثانوي تأهيلي'}`);
    });
    lines.push('');

    // Step 3: Educational Structure
    lines.push('📚 البنية التربوية:');
    if (institutionTypes.includes('college') || institutionTypes.includes('college-pioneer')) {
      lines.push('— الإعدادية:');
      collegeLevels.forEach(l => {
        const count = levelSectionCounts[l.id] || 0;
        if (count > 0) {
          lines.push(`  • ${l.name}: ${count} قسم`);
        }
      });
    }
    if (institutionTypes.includes('college-pioneer') || institutionTypes.includes('college')) {
      lines.push('— المسار الدولي (الإعدادية):');
      collegeLevels.forEach(l => {
        const count = internationalSections[l.id] || 0;
        if (count > 0) {
          lines.push(`  • ${l.name}: ${count} قسم مسار دولي`);
        }
      });
    }
    if (institutionTypes.includes('highschool')) {
      lines.push('— الثانوي:');
      highschoolLevels.forEach(l => {
        const count = levelSectionCounts[l.id] || 0;
        if (count > 0) {
          lines.push(`  • ${l.name}: ${count} قسم`);
        }
      });
      lines.push('— المسار الدولي (الثانوي):');
      highschoolLevels.forEach(l => {
        const count = internationalSections[l.id] || 0;
        if (count > 0) {
          lines.push(`  • ${l.name}: ${count} قسم مسار دولي`);
        }
      });
    }
    if (customLevels.length > 0) {
      lines.push('— مستويات مضافة:');
      customLevels.forEach(l => {
        if (l.sections > 0) {
          lines.push(`  • ${l.name}: ${l.sections} قسم`);
        }
      });
    }
    lines.push('');

    // Step 4: Subjects
    lines.push('📖 المواد الدراسية:');
    const selectedSubjects = Array.from(document.querySelectorAll('input[name="subjects"]:checked')).map((cb) => {
      const val = (cb as HTMLInputElement).value;
      const sub = [...subjectsData, ...customSubjects].find(s => s.id === val);
      return sub?.name || val;
    });
    lines.push(`• ${selectedSubjects.join('، ')}`);
    if (customSubjects.length > 0) {
      lines.push(`• مواد مضافة: ${customSubjects.map(s => s.name).join('، ')}`);
    }
    lines.push('');

    // Step 5: Infrastructure
    lines.push('🏢 البنية المادية:');
    lines.push(`• القاعات العامة: ${generalRoomsCount}`);
    if (generalRoomsCount > 0 && generalRoomNamesText) lines.push(`  الأسماء: ${generalRoomNamesText}`);
    lines.push(`• القاعات العلمية: ${scienceRoomsCount}`);
    if (scienceRoomsCount > 0 && scienceRoomNamesText) lines.push(`  الأسماء: ${scienceRoomNamesText}`);
    lines.push(`• قاعات الإعلاميات: ${computerRoomsCount}`);
    if (computerRoomsCount > 0 && computerRoomNamesText) lines.push(`  الأسماء: ${computerRoomNamesText}`);
    lines.push(`• الملاعب: ${playgroundCount}`);
    if (playgroundCount > 0 && playgroundNamesText) lines.push(`  الأسماء: ${playgroundNamesText}`);
    lines.push('');

    // Step 6: Grouping
    lines.push('⚗️ التفويج:');
    if (groupingPhysics) {
      lines.push(`• الفيزياء والكيمياء: نعم`);
      lines.push(`  المستويات: ${groupingLevelsPhysics.filter(l => l.selected).map(l => l.levelName).join('، ') || '—'}`);
    } else {
      lines.push(`• الفيزياء والكيمياء: لا`);
    }
    if (groupingSVT) {
      lines.push(`• علوم الحياة والأرض: نعم`);
      lines.push(`  المستويات: ${groupingLevelsSVT.filter(l => l.selected).map(l => l.levelName).join('، ') || '—'}`);
    } else {
      lines.push(`• علوم الحياة والأرض: لا`);
    }
    lines.push('');

    // Step 7: Modifications
    if (modifications.length > 0) {
      lines.push('✏️ تعديلات الحصص:');
      modifications.forEach(m => {
        const sub = [...subjectsData, ...customSubjects].find(s => s.id === m.subject);
        const lvl = [...collegeLevels, ...highschoolLevels].find(l => l.id === m.level);
        lines.push(`• ${sub?.name || m.subject} — ${lvl?.name || m.level}: ${m.change}`);
      });
      lines.push('');
    }

    // Step 8: Service Type
    lines.push('🔧 نوع الخدمة:');
    lines.push(`• ${serviceType === 'new' ? 'إنتاج جديد' : serviceType === 'edit' ? 'تعديل موجود' : serviceType === 'special' ? 'حالة خاصة' : '—'}`);
    lines.push('');

    // Step 9: Work Schedule
    lines.push('🕐 توقيتات العمل:');
    lines.push(`• الدخول صباحًا: ${(formData.morningStart as string) || '08:00'}`);
    lines.push(`• الخروج صباحًا: ${(formData.morningEnd as string) || '12:00'}`);
    lines.push(`• الدخول مساءً: ${(formData.eveningStart as string) || '14:00'}`);
    lines.push(`• الخروج مساءً: ${(formData.eveningEnd as string) || '18:00'}`);
    lines.push(`• أيام عدم العمل: ${(formData.nonWorkDays as string) || '—'}`);
    lines.push('');

    // Step 10: Notes
    if (formData.teacherConditions || formData.orgWishes || formData.additionalNotes) {
      lines.push('📝 الملاحظات:');
      if (formData.teacherConditions) lines.push(`• شروط الأساتذة: ${formData.teacherConditions}`);
      if (formData.orgWishes) lines.push(`• رغبات تنظيمية: ${formData.orgWishes}`);
      if (formData.additionalNotes) lines.push(`• ملاحظات: ${formData.additionalNotes}`);
      lines.push('');
    }

    // Pricing
    lines.push('💰 التسعيرة التقديرية:');
    lines.push(`• ${pricingEstimate} درهم`);
    lines.push('');
    lines.push('===================');

    return lines.join('\n');
  };

  const handleCopyReview = async () => {
    const text = buildReviewData();
    try {
      await navigator.clipboard.writeText(text);
      alert('تم نسخ جميع المعلومات بنجاح! يمكنك الآن لصقها في واتساب.');
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('تم نسخ جميع المعلومات بنجاح! يمكنك الآن لصقها في واتساب.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      institutionTypes,
      serviceType,
      modifications,
      customSubjects,
      customLevels,
      pricingEstimate,
      generalRooms: generalRoomsCount,
      scienceRooms: scienceRoomsCount,
      computerRooms: computerRoomsCount,
      playgrounds: playgroundCount,
      generalRoomNames: generalRoomNamesText,
      scienceRoomNames: scienceRoomNamesText,
      computerRoomNames: computerRoomNamesText,
      playgroundNames: playgroundNamesText,
      groupingPhysics,
      groupingSVT,
      groupingPhysicsLevels: groupingLevelsPhysics.filter(l => l.selected).map(l => l.levelName).join(', '),
      groupingSVTLevels: groupingLevelsSVT.filter(l => l.selected).map(l => l.levelName).join(', '),
      internationalSections,
      levelSectionCounts,
      timestamp: new Date().toISOString(),
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(submitData),
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors',
      });
    } catch {
      // silent fail for no-cors
    }

    setShowSuccess(true);
  };

  const getProvinces = () => {
    if (!selectedRegion || selectedRegion === 'other') return [];
    return Object.keys(moroccoData[selectedRegion as keyof typeof moroccoData] || {});
  };

  const getCommunes = () => {
    if (!selectedRegion || !selectedProvince || selectedProvince === 'other') return [];
    const regionData = moroccoData[selectedRegion as keyof typeof moroccoData];
    if (!regionData) return [];
    return regionData[selectedProvince as keyof typeof regionData] || [];
  };

  const allSubjects = [...subjectsData, ...customSubjects] as Array<{ id: string; name: string; main?: boolean }>;
  const allLevels = [...collegeLevels, ...highschoolLevels, ...customLevels.map(l => ({ id: l.id, name: l.name }))];

  return (
    <div className="services-page">
      <section className="form-section page-form">
        <div className="section-container">

          {/* Progress Bar Only - No Title */}
          <div className="progress-container" style={{ marginTop: '2rem' }}>
            <div className="step-title-bar" ref={stepContentRef}>
              <span className="step-title-num">الخطوة {currentStep} من {totalSteps}</span>
              <span className="step-title-name">{stepTitles[currentStep]}</span>
            </div>
            <div className="progress-bar-wrap">
              <div className="progress-bar" id="progressBar"></div>
            </div>
            <div className="progress-steps">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`progress-step-dot ${i + 1 < currentStep ? 'done' : i + 1 === currentStep ? 'active' : ''}`}
                  onClick={() => goToStep(i + 1)}
                  title={stepTitles[i + 1]}
                >
                  {i + 1 < currentStep ? '✓' : i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="form-wrapper">
            <form ref={formRef} onSubmit={handleSubmit}>

              {/* ============ STEP 1: Institution Info ============ */}
              {currentStep === 1 && (
                <div className="form-step active">
                  <div className="step-header">
                    <div className="step-num">01</div>
                    <div>
                      <h3 className="step-title">معلومات المؤسسة</h3>
                      <p className="step-desc">أدخل البيانات الأساسية لمؤسستك التعليمية</p>
                    </div>
                  </div>
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label>اسم المؤسسة <span className="required">*</span></label>
                      <input type="text" name="institutionName" placeholder="ثانوية / إعدادية ..." required onChange={handleInputChange} />
                    </div>
                    <div className="form-group full-width">
                      <label>رقم الهاتف للتواصل <span className="required">*</span></label>
                      <input type="tel" name="phone" placeholder="أدخل رقم الهاتف" required onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label>الجهة <span className="required">*</span></label>
                      <select name="region" required onChange={(e) => { setSelectedRegion(e.target.value); handleInputChange(e); }}>
                        <option value="">— اختر الجهة —</option>
                        {Object.keys(moroccoData).map(region => (
                          <option key={region} value={region}>{region}</option>
                        ))}
                        <option value="other">جهة أخرى</option>
                      </select>
                      {selectedRegion === 'other' && (
                        <input type="text" name="otherRegion" placeholder="أدخل اسم الجهة" style={{ marginTop: '0.5rem' }} onChange={handleInputChange} />
                      )}
                    </div>
                    <div className="form-group">
                      <label>الإقليم <span className="required">*</span></label>
                      <select name="province" required onChange={(e) => { setSelectedProvince(e.target.value); handleInputChange(e); }} disabled={!selectedRegion}>
                        <option value="">— اختر الإقليم —</option>
                        {getProvinces().map(province => (
                          <option key={province} value={province}>{province}</option>
                        ))}
                        <option value="other">إقليم آخر</option>
                      </select>
                      {selectedProvince === 'other' && (
                        <input type="text" name="otherProvince" placeholder="أدخل اسم الإقليم" style={{ marginTop: '0.5rem' }} onChange={handleInputChange} />
                      )}
                    </div>
                    <div className="form-group full-width">
                      <label>الجماعة <span className="required">*</span></label>
                      <select name="commune" required onChange={handleInputChange} disabled={!selectedProvince}>
                        <option value="">— اختر الجماعة —</option>
                        {getCommunes().map(commune => (
                          <option key={commune} value={commune}>{commune}</option>
                        ))}
                        <option value="other">جماعة أخرى</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* ============ STEP 2: Institution Type ============ */}
              {currentStep === 2 && (
                <div className="form-step active">
                  <div className="step-header">
                    <div className="step-num">02</div>
                    <div>
                      <h3 className="step-title">نوع المؤسسة</h3>
                      <p className="step-desc">يمكن اختيار أكثر من نوع إذا كانت مؤسستك مختلطة</p>
                    </div>
                  </div>
                  <div className="type-cards">
                    <label className={`type-card ${institutionTypes.includes('college') ? 'selected' : ''}`}>
                      <input type="checkbox" checked={institutionTypes.includes('college')} onChange={() => handleInstitutionTypeChange('college')} />
                      <div className="type-card-inner">
                        <div className="type-icon">🏫</div>
                        <div className="type-title">إعدادي عادي</div>
                        <div className="type-desc">المستويات الثلاثة — إعدادي عادي</div>
                      </div>
                    </label>
                    <label className={`type-card ${institutionTypes.includes('college-pioneer') ? 'selected' : ''}`}>
                      <input type="checkbox" checked={institutionTypes.includes('college-pioneer')} onChange={() => handleInstitutionTypeChange('college-pioneer')} />
                      <div className="type-card-inner">
                        <div className="type-icon">🌟</div>
                        <div className="type-title">إعدادي رائد</div>
                        <div className="type-desc">إعدادي مع مسار دولي أو ازدواجي</div>
                      </div>
                    </label>
                    <label className={`type-card ${institutionTypes.includes('highschool') ? 'selected' : ''}`}>
                      <input type="checkbox" checked={institutionTypes.includes('highschool')} onChange={() => handleInstitutionTypeChange('highschool')} />
                      <div className="type-card-inner">
                        <div className="type-icon">🎓</div>
                        <div className="type-title">ثانوي تأهيلي</div>
                        <div className="type-desc">جميع مسالك الباكالوريا</div>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* ============ STEP 3: Educational Structure ============ */}
              {currentStep === 3 && (
                <div className="form-step active">
                  <div className="step-header">
                    <div className="step-num">03</div>
                    <div>
                      <h3 className="step-title">البنية التربوية</h3>
                      <p className="step-desc">حدد عدد الأقسام لكل مستوى دراسي والمسار الدولي</p>
                    </div>
                  </div>

                  {(institutionTypes.includes('college') || institutionTypes.includes('college-pioneer')) && (
                    <div className="structure-section">
                      <h4 className="structure-title">🏫 البنية الإعدادية</h4>
                      <div className="form-grid">
                        {collegeLevels.map(level => (
                          <div className="form-group" key={level.id}>
                            <label>عدد أقسام {level.name}</label>
                            <input type="number" name={`college_${level.id}`} min="0" max="30" defaultValue="0" className="num-input" />
                          </div>
                        ))}
                      </div>

                      {/* International track for college - now available for both normal and pioneer */}
                      <div className="international-section">
                        <h5 className="sub-title">🌐 المسار الدولي (لكل مستوى)</h5>
                        <div className="form-grid">
                          {collegeLevels.map(level => (
                            <div className="form-group" key={`int_${level.id}`}>
                              <label>عدد أقسام المسار الدولي — {level.name}</label>
                              <input
                                type="number"
                                name={`intl_${level.id}`}
                                min="0"
                                max="10"
                                defaultValue="0"
                                className="num-input"
                                onChange={(e) => handleInternationalChange(level.id, parseInt(e.target.value) || 0)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {institutionTypes.includes('highschool') && (
                    <div className="structure-section" style={{ marginTop: '2rem' }}>
                      <h4 className="structure-title">🎓 البنية الثانوية التأهيلية</h4>
                      {highschoolLevels.map((level, idx) => (
                        <div className="level-block" key={level.id}>
                          <div className={`level-label ${idx < 3 ? 'lb-blue' : idx < 6 ? 'lb-green' : 'lb-red'}`}>
                            {level.name}
                          </div>
                          <div className="form-grid">
                            <div className="form-group">
                              <label>عدد الأقسام</label>
                              <input type="number" name={`hs_${level.id}`} min="0" max="20" defaultValue="0" className="num-input" />
                            </div>
                            {/* International track for each high school level */}
                            <div className="form-group">
                              <label>🌐 عدد أقسام المسار الدولي — {level.name}</label>
                              <input
                                type="number"
                                name={`hs_intl_${level.id}`}
                                min="0"
                                max="10"
                                defaultValue="0"
                                className="num-input"
                                onChange={(e) => handleInternationalChange(level.id, parseInt(e.target.value) || 0)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Custom Levels Section */}
                  {customLevels.length > 0 && (
                    <div className="structure-section" style={{ marginTop: '2rem' }}>
                      <h4 className="structure-title">➕ مستويات مضافة</h4>
                      {customLevels.map((level) => (
                        <div className="level-block" key={level.id}>
                          <div className="form-grid">
                            <div className="form-group">
                              <label>اسم المستوى</label>
                              <input
                                type="text"
                                value={level.name}
                                onChange={(e) => handleCustomLevelChange(level.id, 'name', e.target.value)}
                                placeholder="اسم المستوى الجديد"
                              />
                            </div>
                            <div className="form-group">
                              <label>عدد الأقسام</label>
                              <input
                                type="number"
                                min="0"
                                max="30"
                                value={level.sections}
                                onChange={(e) => handleCustomLevelChange(level.id, 'sections', parseInt(e.target.value) || 0)}
                                className="num-input"
                              />
                            </div>
                            <div className="form-group">
                              <label>🌐 عدد أقسام المسار الدولي</label>
                              <input
                                type="number"
                                min="0"
                                max="10"
                                value={level.intlSections}
                                onChange={(e) => {
                                  handleCustomLevelChange(level.id, 'intlSections', parseInt(e.target.value) || 0);
                                  handleInternationalChange(level.id, parseInt(e.target.value) || 0);
                                }}
                                className="num-input"
                              />
                            </div>
                            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                              <button
                                type="button"
                                className="btn-remove-modification"
                                onClick={() => handleRemoveCustomLevel(level.id)}
                                style={{ marginBottom: '0.3rem' }}
                              >
                                حذف
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Custom Level Button */}
                  <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <button type="button" className="btn-add-subject" onClick={handleAddCustomLevel}>
                      <span>+</span> إضافة مستوى جديد
                    </button>
                  </div>
                </div>
              )}

              {/* ============ STEP 4: Subjects ============ */}
              {currentStep === 4 && (
                <div className="form-step active">
                  <div className="step-header">
                    <div className="step-num">04</div>
                    <div>
                      <h3 className="step-title">المواد الدراسية</h3>
                      <p className="step-desc">حدد المواد المدرَّسة في المؤسسة (تم إزالة عدد الأساتذة — سيتم التعامل برموز)</p>
                    </div>
                  </div>

                  <div className="subjects-note">
                    <p>💡 سيتم إنشاء استعمال الزمن باستخدام رموز الأساتذة مثل: AR1, AR2, FR1… ويمكن تغييرها لاحقًا إلى الأسماء.</p>
                  </div>

                  <h4 className="sub-section-title">📚 المواد الدراسية</h4>
                  <div className="subjects-grid">
                    {allSubjects.filter(s => s.id !== 'amazigh').map(subject => {
                      const isMain = (subject as Record<string, unknown>).main === true;
                      return (
                        <div className={`subject-item ${isMain ? 'main-subject' : ''}`} key={subject.id}>
                          <label className="subject-check-row">
                            <input type="checkbox" name="subjects" value={subject.id} defaultChecked={isMain || subject.id === 'math' || subject.id === 'philosophy'} />
                            <span className="subject-name">
                              {subject.name}
                              {(isMain || subject.id === 'math' || subject.id === 'philosophy') && <span className="main-badge">(مادة رئيسية)</span>}
                            </span>
                          </label>
                        </div>
                      );
                    })}
                  </div>

                  <div className="add-subject-container">
                    <div className="form-group" style={{ flex: 1 }}>
                      <input type="text" id="newSubjectName" placeholder="اسم المادة الجديدة" />
                    </div>
                    <button type="button" className="btn-add-subject" onClick={handleAddCustomSubject}>
                      <span>+</span> إضافة مادة
                    </button>
                  </div>
                </div>
              )}

              {/* ============ STEP 5: Infrastructure ============ */}
              {currentStep === 5 && (
                <div className="form-step active">
                  <div className="step-header">
                    <div className="step-num">05</div>
                    <div>
                      <h3 className="step-title">البنية المادية</h3>
                      <p className="step-desc">حدد عدد القاعات والمرافق ثم أدخل أسماءها</p>
                    </div>
                  </div>

                  {/* Room counts */}
                  <div className="form-grid">
                    <div className="form-group">
                      <label>عدد القاعات العامة</label>
                      <input type="number" name="generalRooms" min="0" max="100" defaultValue="0" className="num-input" onChange={(e) => setGeneralRoomsCount(parseInt(e.target.value) || 0)} />
                    </div>
                    <div className="form-group">
                      <label>عدد القاعات العلمية (مختبرات)</label>
                      <input type="number" name="scienceRooms" min="0" max="30" defaultValue="0" className="num-input" onChange={(e) => setScienceRoomsCount(parseInt(e.target.value) || 0)} />
                    </div>
                    <div className="form-group">
                      <label>عدد قاعات الإعلاميات</label>
                      <input type="number" name="computerRooms" min="0" max="20" defaultValue="0" className="num-input" onChange={(e) => setComputerRoomsCount(parseInt(e.target.value) || 0)} />
                    </div>
                    <div className="form-group">
                      <label>عدد الملاعب</label>
                      <input type="number" name="playgrounds" min="0" max="10" defaultValue="0" className="num-input" onChange={(e) => setPlaygroundCount(parseInt(e.target.value) || 0)} />
                    </div>
                  </div>

                  {/* Room names text areas */}
                  <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                    <h4 className="sub-section-title">🏷️ أسماء القاعات والمرافق</h4>

                    {generalRoomsCount > 0 && (
                      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label>📚 أسماء وأرقام القاعات العامة ({generalRoomsCount} قاعة) — اكتبها مفصولة بفواصل أو كل قاعة في سطر</label>
                        <textarea
                          rows={3}
                          placeholder="مثال: قاعة 1، قاعة 2، قاعة 3..."
                          value={generalRoomNamesText}
                          onChange={(e) => setGeneralRoomNamesText(e.target.value)}
                        />
                      </div>
                    )}

                    {scienceRoomsCount > 0 && (
                      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label>🔬 أسماء وأرقام المختبرات العلمية ({scienceRoomsCount} مختبر) — اكتبها مفصولة بفواصل أو كل مختبر في سطر</label>
                        <textarea
                          rows={3}
                          placeholder="مثال: مختبر الفيزياء، مختبر الكيمياء..."
                          value={scienceRoomNamesText}
                          onChange={(e) => setScienceRoomNamesText(e.target.value)}
                        />
                      </div>
                    )}

                    {computerRoomsCount > 0 && (
                      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label>💻 أسماء وأرقام قاعات الإعلاميات ({computerRoomsCount} قاعة) — اكتبها مفصولة بفواصل أو كل قاعة في سطر</label>
                        <textarea
                          rows={3}
                          placeholder="مثال: قاعة إعلاميات 1، قاعة إعلاميات 2..."
                          value={computerRoomNamesText}
                          onChange={(e) => setComputerRoomNamesText(e.target.value)}
                        />
                      </div>
                    )}

                    {playgroundCount > 0 && (
                      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label>⚽ أسماء الملاعب ({playgroundCount} ملعب) — اكتبها مفصولة بفواصل أو كل ملعب في سطر</label>
                        <textarea
                          rows={2}
                          placeholder="مثال: الملعب الرئيسي، ملعب التربية البدنية..."
                          value={playgroundNamesText}
                          onChange={(e) => setPlaygroundNamesText(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ============ STEP 6: Grouping (filtered by sections > 0) ============ */}
              {currentStep === 6 && (
                <div className="form-step active">
                  <div className="step-header">
                    <div className="step-num">06</div>
                    <div>
                      <h3 className="step-title">التفويج</h3>
                      <p className="step-desc">حدد إن كنت تريد تفويج الأقسام للمواد العلمية — تظهر فقط المستويات التي لها أقسام</p>
                    </div>
                  </div>

                  <div className="grouping-cards">
                    {/* Physics Grouping */}
                    <div className="grouping-card">
                      <div className="grouping-header">
                        <span className="grouping-icon">⚗️</span>
                        <h4>الفيزياء والكيمياء</h4>
                      </div>
                      <div className="toggle-row">
                        <label className="radio-option">
                          <input type="radio" name="physicsGroup" checked={groupingPhysics} onChange={() => setGroupingPhysics(true)} /> نعم، أريد التفويج
                        </label>
                        <label className="radio-option">
                          <input type="radio" name="physicsGroup" checked={!groupingPhysics} onChange={() => setGroupingPhysics(false)} /> لا
                        </label>
                      </div>

                      {groupingPhysics && (
                        <div className="grouping-options">
                          {groupingLevelsPhysics.length > 0 ? (
                            <>
                              <p className="grouping-label"><strong>اختر المستويات المعنية بالتفويج:</strong></p>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                                {groupingLevelsPhysics.map(level => (
                                  <label key={level.levelId} className="radio-option">
                                    <input
                                      type="checkbox"
                                      checked={level.selected}
                                      onChange={() => toggleGroupingLevel('physics', level.levelId)}
                                    />
                                    {level.levelName}
                                  </label>
                                ))}
                              </div>
                              <p className="grouping-label">اختر نوع التفويج:</p>
                              <select name="physicsGroupType">
                                <option value="2">كل قسم → فوجين</option>
                                <option value="3">كل قسمين → ثلاثة أفواج</option>
                              </select>
                              <p className="grouping-label" style={{ marginTop: '1rem' }}>
                                <label className="radio-option">
                                  <input type="checkbox" name="physicsSVTAdjacency" /> هل يريد التجاور بين الفيزياء وعلوم الحياة والأرض؟
                                </label>
                              </p>
                            </>
                          ) : (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                              ⚠️ لا توجد مستويات بها أقسام. يرجى العودة للخطوة 3 وإدخال عدد الأقسام أولاً.
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* SVT Grouping */}
                    <div className="grouping-card">
                      <div className="grouping-header">
                        <span className="grouping-icon">🧬</span>
                        <h4>علوم الحياة والأرض</h4>
                      </div>
                      <div className="toggle-row">
                        <label className="radio-option">
                          <input type="radio" name="svtGroup" checked={groupingSVT} onChange={() => setGroupingSVT(true)} /> نعم، أريد التفويج
                        </label>
                        <label className="radio-option">
                          <input type="radio" name="svtGroup" checked={!groupingSVT} onChange={() => setGroupingSVT(false)} /> لا
                        </label>
                      </div>

                      {groupingSVT && (
                        <div className="grouping-options">
                          {groupingLevelsSVT.length > 0 ? (
                            <>
                              <p className="grouping-label"><strong>اختر المستويات المعنية بالتفويج:</strong></p>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                                {groupingLevelsSVT.map(level => (
                                  <label key={level.levelId} className="radio-option">
                                    <input
                                      type="checkbox"
                                      checked={level.selected}
                                      onChange={() => toggleGroupingLevel('svt', level.levelId)}
                                    />
                                    {level.levelName}
                                  </label>
                                ))}
                              </div>
                              <p className="grouping-label">اختر نوع التفويج:</p>
                              <select name="svtGroupType">
                                <option value="2">كل قسم → فوجين</option>
                                <option value="3">كل قسمين → ثلاثة أفواج</option>
                              </select>
                            </>
                          ) : (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                              ⚠️ لا توجد مستويات بها أقسام. يرجى العودة للخطوة 3 وإدخال عدد الأقسام أولاً.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ============ STEP 7: Session Modification ============ */}
              {currentStep === 7 && (
                <div className="form-step active">
                  <div className="step-header">
                    <div className="step-num">07</div>
                    <div>
                      <h3 className="step-title">تعديل الحصص</h3>
                      <p className="step-desc">هل تريد تغيير الحصص الرسمية لبعض المواد؟</p>
                    </div>
                  </div>
                  <div className="toggle-row big-toggle">
                    <label className="radio-option">
                      <input type="radio" name="modifyHours" checked={modifyHours} onChange={() => setModifyHours(true)} /> نعم
                    </label>
                    <label className="radio-option">
                      <input type="radio" name="modifyHours" checked={!modifyHours} onChange={() => setModifyHours(false)} /> لا
                    </label>
                  </div>

                  {modifyHours && (
                    <div style={{ marginTop: '1.5rem' }}>
                      <div className="modification-form">
                        <div className="form-grid">
                          <div className="form-group">
                            <label>اختر المادة</label>
                            <select id="modifySubject">
                              <option value="">— اختر المادة —</option>
                              {allSubjects.filter(s => s.id !== 'amazigh').map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                              ))}
                            </select>
                          </div>
                          <div className="form-group">
                            <label>اختر المستوى</label>
                            <select id="modifyLevel">
                              <option value="">— اختر المستوى —</option>
                              {allLevels.map(l => (
                                <option key={l.id} value={l.id}>{l.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="form-group" style={{ marginTop: '1rem' }}>
                          <label>التغيير المطلوب</label>
                          <textarea id="modifyChange" rows={2} placeholder="مثال: 5 = 2+2+1 أو دمج ساعتين في حصة واحدة..."></textarea>
                        </div>
                        <button type="button" className="btn-add-modification" onClick={handleAddModification}>
                          <span>+</span> إضافة التغيير
                        </button>
                      </div>

                      {modifications.length > 0 && (
                        <div className="modifications-list">
                          {modifications.map(mod => (
                            <div className="modification-item" key={mod.id}>
                              <div className="modification-item-content">
                                <div className="modification-item-subject">{allSubjects.find(s => s.id === mod.subject)?.name || mod.subject}</div>
                                <div className="modification-item-level">{allLevels.find(l => l.id === mod.level)?.name || mod.level}</div>
                                <div className="modification-item-change">{mod.change}</div>
                              </div>
                              <button type="button" className="btn-remove-modification" onClick={() => handleRemoveModification(mod.id)}>حذف</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ============ STEP 8: Service Type ============ */}
              {currentStep === 8 && (
                <div className="form-step active">
                  <div className="step-header">
                    <div className="step-num">08</div>
                    <div>
                      <h3 className="step-title">نوع الخدمة المطلوبة</h3>
                      <p className="step-desc">اختر نوع التدخل الذي تحتاجه</p>
                    </div>
                  </div>
                  <div className="service-cards">
                    <label className={`service-card ${serviceType === 'new' ? 'selected' : ''}`}>
                      <input type="radio" name="serviceType" value="new" checked={serviceType === 'new'} onChange={(e) => setServiceType(e.target.value)} />
                      <div className="service-card-inner">
                        <div className="service-icon">✨</div>
                        <div className="service-title">إنتاج جديد</div>
                        <div className="service-desc">إنشاء استعمال زمن من الصفر لمؤسستك</div>
                      </div>
                    </label>
                    <label className={`service-card ${serviceType === 'edit' ? 'selected' : ''}`}>
                      <input type="radio" name="serviceType" value="edit" checked={serviceType === 'edit'} onChange={(e) => setServiceType(e.target.value)} />
                      <div className="service-card-inner">
                        <div className="service-icon">✏️</div>
                        <div className="service-title">تعديل موجود</div>
                        <div className="service-desc">تعديل وتحسين استعمال زمن موجود لديك</div>
                      </div>
                    </label>
                    <label className={`service-card ${serviceType === 'special' ? 'selected' : ''}`}>
                      <input type="radio" name="serviceType" value="special" checked={serviceType === 'special'} onChange={(e) => setServiceType(e.target.value)} />
                      <div className="service-card-inner">
                        <div className="service-icon">🔍</div>
                        <div className="service-title">حالة خاصة</div>
                        <div className="service-desc">معالجة وضعيات معقدة أو استثنائية</div>
                      </div>
                    </label>
                  </div>

                  {serviceType === 'edit' && (
                    <div style={{ marginTop: '1.5rem' }}>
                      <div className="form-group">
                        <label>رفع ملف استعمال الزمن الحالي</label>
                        <div className="file-drop-zone">
                          <div className="file-drop-icon">📁</div>
                          <div className="file-drop-text">اسحب الملف هنا أو انقر للاختيار</div>
                          <div className="file-drop-sub">PDF, Excel, صورة — حجم أقصى 10MB</div>
                          <input type="file" name="editFile" accept=".pdf,.xlsx,.xls,.jpg,.png" className="file-hidden" />
                        </div>
                      </div>
                    </div>
                  )}

                  {serviceType === 'special' && (
                    <div style={{ marginTop: '1.5rem' }}>
                      <div className="form-group">
                        <label>اشرح الحالة الخاصة بالتفصيل</label>
                        <textarea name="specialCaseText" rows={5} placeholder="صف الوضعية الخاصة أو الإشكالية التي تواجهها..."></textarea>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ============ STEP 9: Work Schedule ============ */}
              {currentStep === 9 && (
                <div className="form-step active">
                  <div className="step-header">
                    <div className="step-num">09</div>
                    <div>
                      <h3 className="step-title">توقيتات العمل</h3>
                      <p className="step-desc">حدد أيام ومواعيد العمل</p>
                    </div>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>توقيت الدخول صباحًا</label>
                      <input type="time" name="morningStart" defaultValue="08:00" onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label>توقيت الخروج صباحًا</label>
                      <input type="time" name="morningEnd" defaultValue="12:00" onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label>توقيت الدخول مساءً</label>
                      <input type="time" name="eveningStart" defaultValue="14:00" onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label>توقيت الخروج مساءً</label>
                      <input type="time" name="eveningEnd" defaultValue="18:00" onChange={handleInputChange} />
                    </div>
                    <div className="form-group full-width">
                      <label className="toggle-label">هل يعتمد التوقيت المستمر؟</label>
                      <div className="toggle-row">
                        <label className="radio-option">
                          <input type="radio" name="continuousTime" value="yes" /> نعم
                        </label>
                        <label className="radio-option">
                          <input type="radio" name="continuousTime" value="no" defaultChecked /> لا
                        </label>
                      </div>
                    </div>
                    <div className="form-group full-width">
                      <label>أيام أو فترات عدم العمل</label>
                      <textarea name="nonWorkDays" rows={2} placeholder="مثال: السبت صباحًا، الجمعة بعد الزوال..." onChange={handleInputChange}></textarea>
                    </div>
                  </div>
                </div>
              )}

              {/* ============ STEP 10: Notes & Files ============ */}
              {currentStep === 10 && (
                <div className="form-step active">
                  <div className="step-header">
                    <div className="step-num">10</div>
                    <div>
                      <h3 className="step-title">الملاحظات والوثائق</h3>
                      <p className="step-desc">أضف الشروط الخاصة والملفات الداعمة</p>
                    </div>
                  </div>
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label>شروط خاصة بالأساتذة</label>
                      <textarea name="teacherConditions" rows={4} placeholder="مثال: الأستاذ فلان لا يتاح إلا صباحًا — الأستاذة فلانة تدرس في مؤسستين..." onChange={handleInputChange}></textarea>
                    </div>
                    <div className="form-group full-width">
                      <label>رغبات تنظيمية</label>
                      <textarea name="orgWishes" rows={4} placeholder="مثال: تركيز الحصص في أيام معينة — توزيع خاص لمواد..." onChange={handleInputChange}></textarea>
                    </div>
                    <div className="form-group full-width">
                      <label>ملاحظات إضافية</label>
                      <textarea name="additionalNotes" rows={3} placeholder="أي ملاحظات أخرى ترغب في إضافتها..." onChange={handleInputChange}></textarea>
                    </div>
                    <div className="form-group full-width">
                      <label>رفع ملفات داعمة (اختياري)</label>
                      <div className="file-drop-zone">
                        <div className="file-drop-icon">📎</div>
                        <div className="file-drop-text">اسحب الملفات هنا أو انقر للاختيار</div>
                        <div className="file-drop-sub">PDF, Excel, صور — يمكن رفع عدة ملفات</div>
                        <input type="file" name="supportFiles" multiple accept=".pdf,.xlsx,.xls,.jpg,.png,.jpeg" className="file-hidden" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ============ STEP 11: Summary & Confirmation ============ */}
              {currentStep === 11 && (
                <div className="form-step active">
                  <div className="step-header">
                    <div className="step-num">11</div>
                    <div>
                      <h3 className="step-title">معلومات الخدمة وتأكيد الطلب</h3>
                      <p className="step-desc">مراجعة شاملة لجميع البيانات المدخلة</p>
                    </div>
                  </div>

                  <div className="info-boxes">
                    <div className="info-box info-green">
                      <div className="info-box-icon">✅</div>
                      <div>
                        <strong>مواكبة مجانية بعد الإنتاج</strong>
                        <p>دعم مستمر طوال السنة الدراسية عند أي تغيير أو تعديل طارئ — مجانًا</p>
                      </div>
                    </div>
                    <div className="info-box info-blue">
                      <div className="info-box-icon">🔄</div>
                      <div>
                        <strong>إعادة الإنتاج: 100 درهم</strong>
                        <p>في حالة الرغبة في إعادة بناء الجدول من الصفر بعد الإنتاج الأول</p>
                      </div>
                    </div>
                  </div>

                  {/* Complete Review Data */}
                  <div className="pricing-summary" style={{ marginBottom: '2rem' }}>
                    <h4>📋 مراجعة كاملة لجميع البيانات</h4>

                    <div className="review-section">
                      <h5>📌 معلومات المؤسسة</h5>
                      <div className="review-row"><span>اسم المؤسسة:</span><span>{(formData.institutionName as string) || '—'}</span></div>
                      <div className="review-row"><span>رقم الهاتف:</span><span>{(formData.phone as string) || '—'}</span></div>
                      <div className="review-row"><span>الجهة:</span><span>{selectedRegion === 'other' ? (formData.otherRegion as string) : selectedRegion || '—'}</span></div>
                      <div className="review-row"><span>الإقليم:</span><span>{selectedProvince === 'other' ? (formData.otherProvince as string) : selectedProvince || '—'}</span></div>
                      <div className="review-row"><span>الجماعة:</span><span>{(formData.commune as string) || '—'}</span></div>
                    </div>

                    <div className="review-section">
                      <h5>🏫 نوع المؤسسة</h5>
                      <div className="review-row"><span></span><span>{institutionTypes.map(t => t === 'college' ? 'إعدادي عادي' : t === 'college-pioneer' ? 'إعدادي رائد' : 'ثانوي تأهيلي').join('، ') || '—'}</span></div>
                    </div>

                    <div className="review-section">
                      <h5>📚 البنية التربوية</h5>
                      {(institutionTypes.includes('college') || institutionTypes.includes('college-pioneer')) && (
                        <>
                          <p style={{ color: 'var(--blue-light)', fontWeight: 700, marginBottom: '0.5rem' }}>الإعدادية:</p>
                          {collegeLevels.map(l => {
                            const count = levelSectionCounts[l.id] || 0;
                            return count > 0 ? (
                              <div className="review-row" key={l.id}>
                                <span>{l.name}:</span>
                                <span>{count} قسم {internationalSections[l.id] ? `(دولي: ${internationalSections[l.id]})` : ''}</span>
                              </div>
                            ) : null;
                          })}
                        </>
                      )}
                      {institutionTypes.includes('highschool') && (
                        <>
                          <p style={{ color: 'var(--blue-light)', fontWeight: 700, marginBottom: '0.5rem', marginTop: '1rem' }}>الثانوي:</p>
                          {highschoolLevels.map(l => {
                            const count = levelSectionCounts[l.id] || 0;
                            return count > 0 ? (
                              <div className="review-row" key={l.id}>
                                <span>{l.name}:</span>
                                <span>{count} قسم {internationalSections[l.id] ? `(دولي: ${internationalSections[l.id]})` : ''}</span>
                              </div>
                            ) : null;
                          })}
                        </>
                      )}
                      {customLevels.filter(l => l.sections > 0).map(l => (
                        <div className="review-row" key={l.id}>
                          <span>{l.name}:</span>
                          <span>{l.sections} قسم {l.intlSections > 0 ? `(دولي: ${l.intlSections})` : ''}</span>
                        </div>
                      ))}
                    </div>

                    <div className="review-section">
                      <h5>🏢 البنية المادية</h5>
                      <div className="review-row"><span>القاعات العامة:</span><span>{generalRoomsCount} {generalRoomNamesText ? `(${generalRoomNamesText})` : ''}</span></div>
                      <div className="review-row"><span>القاعات العلمية:</span><span>{scienceRoomsCount} {scienceRoomNamesText ? `(${scienceRoomNamesText})` : ''}</span></div>
                      <div className="review-row"><span>قاعات الإعلاميات:</span><span>{computerRoomsCount} {computerRoomNamesText ? `(${computerRoomNamesText})` : ''}</span></div>
                      <div className="review-row"><span>الملاعب:</span><span>{playgroundCount} {playgroundNamesText ? `(${playgroundNamesText})` : ''}</span></div>
                    </div>

                    <div className="review-section">
                      <h5>⚗️ التفويج</h5>
                      <div className="review-row"><span>الفيزياء والكيمياء:</span><span>{groupingPhysics ? `نعم — ${groupingLevelsPhysics.filter(l => l.selected).map(l => l.levelName).join('، ') || '—'}` : 'لا'}</span></div>
                      <div className="review-row"><span>علوم الحياة والأرض:</span><span>{groupingSVT ? `نعم — ${groupingLevelsSVT.filter(l => l.selected).map(l => l.levelName).join('، ') || '—'}` : 'لا'}</span></div>
                    </div>

                    <div className="review-section">
                      <h5>🔧 نوع الخدمة</h5>
                      <div className="review-row"><span></span><span>{serviceType === 'new' ? 'إنتاج جديد' : serviceType === 'edit' ? 'تعديل موجود' : serviceType === 'special' ? 'حالة خاصة' : '—'}</span></div>
                    </div>

                    <div className="review-section">
                      <h5>🕐 توقيتات العمل</h5>
                      <div className="review-row"><span>الصباح:</span><span>{(formData.morningStart as string) || '08:00'} — {(formData.morningEnd as string) || '12:00'}</span></div>
                      <div className="review-row"><span>المساء:</span><span>{(formData.eveningStart as string) || '14:00'} — {(formData.eveningEnd as string) || '18:00'}</span></div>
                      <div className="review-row"><span>أيام عدم العمل:</span><span>{(formData.nonWorkDays as string) || '—'}</span></div>
                    </div>

                    {(formData.teacherConditions || formData.orgWishes || formData.additionalNotes) && (
                      <div className="review-section">
                        <h5>📝 الملاحظات</h5>
                        {formData.teacherConditions && <div className="review-row"><span>شروط الأساتذة:</span><span>{formData.teacherConditions}</span></div>}
                        {formData.orgWishes && <div className="review-row"><span>رغبات تنظيمية:</span><span>{formData.orgWishes}</span></div>}
                        {formData.additionalNotes && <div className="review-row"><span>ملاحظات:</span><span>{formData.additionalNotes}</span></div>}
                      </div>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="pricing-summary">
                    <h4>التسعيرة التقديرية لطلبك</h4>
                    <div className="pricing-details">
                      {institutionTypes.map(type => (
                        <div className="pricing-item" key={type}>
                          <span>
                            {type === 'college' ? 'إعدادي عادي' :
                             type === 'college-pioneer' ? 'إعدادي رائد' :
                             type === 'highschool' ? 'ثانوي تأهيلي' : type}
                          </span>
                          <span className="price-val">
                            {type === 'college' ? '600' : type === 'college-pioneer' ? '700' : '700'} درهم
                          </span>
                        </div>
                      ))}
                      {serviceType === 'edit' && (
                        <div className="pricing-item">
                          <span>تعديل استعمال زمن</span>
                          <span className="price-val">100 درهم</span>
                        </div>
                      )}
                      {serviceType === 'special' && (
                        <div className="pricing-item">
                          <span>حالة خاصة</span>
                          <span className="price-val">150 درهم</span>
                        </div>
                      )}
                      <div className="pricing-item total">
                        <span>الإجمالي التقديري</span>
                        <span className="price-val">{pricingEstimate} درهم</span>
                      </div>
                    </div>
                    <div className="pricing-warning">
                      <span>⚠️</span>
                      <p>هذا السعر تقديري. السعر النهائي يُحدد بعد دراسة طلبك وتقييم تعقيد المؤسسة ونسبة الإشغال.</p>
                    </div>
                  </div>

                  {/* Copy Button */}
                  <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <button type="button" className="btn-primary" onClick={handleCopyReview} style={{ background: '#25d366', boxShadow: '0 4px 20px rgba(37,211,102,0.4)' }}>
                      📋 نسخ جميع المعلومات للواتساب
                    </button>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>انسخ هذه المعلومات وأرسلها لنا عبر واتساب لتأكيد طلبك</p>
                  </div>

                  <div className="form-group" style={{ marginTop: '1.5rem' }}>
                    <label className="checkbox-label">
                      <input type="checkbox" name="acceptTerms" required />
                      <span>أوافق على شروط الخدمة وأقر بصحة المعلومات المدخلة</span>
                    </label>
                  </div>

                  <div className="payment-method">
                    <h4>وسيلة الدفع المفضلة</h4>
                    <div className="toggle-row">
                      <label className="radio-option">
                        <input type="radio" name="paymentMethod" value="bank" defaultChecked /> تحويل بنكي
                      </label>
                      <label className="radio-option">
                        <input type="radio" name="paymentMethod" value="agency" /> وكالة تحويل
                      </label>
                      <label className="radio-option">
                        <input type="radio" name="paymentMethod" value="other" /> أخرى
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="form-nav">
                {currentStep > 1 && (
                  <button type="button" className="btn-prev" onClick={handlePrev}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    السابق
                  </button>
                )}
                {currentStep < totalSteps && (
                  <button type="button" className="btn-next" onClick={handleNext}>
                    التالي
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                )}
                {currentStep === totalSteps && (
                  <button type="submit" className="btn-submit">
                    <span>إرسال الطلب</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                    </svg>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Success Modal */}
      {showSuccess && (
        <div className="modal-overlay open">
          <div className="modal-box">
            <div className="modal-icon">🎉</div>
            <h3>تم إرسال طلبك بنجاح!</h3>
            <p>تم استلام طلبكم بنجاح. سيتم تحليله خلال 24 ساعة وسيتم التواصل معكم قريبًا.</p>
            <p className="note-text">تنبيه: معالجة وتنفيذ طلبكم يتم بالترتيب اعتمادًا على تاريخ ووقت توصلنا بتأكيد الطلب.</p>
            <button className="btn-primary" onClick={() => setShowSuccess(false)}>حسنًا، شكرًا</button>
          </div>
        </div>
      )}
    </div>
  );
}
