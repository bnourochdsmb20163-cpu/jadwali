// ============================================
// JADWALI - Google Apps Script (نسخة الأعمدة المنفصلة)
// لكل مستوى: عمود عادي + عمود مسار دولي
// ============================================

function doPost(e) {
  try {
    var headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    if (e.postData.type === 'OPTIONS' || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({ status: 'ok' }))
        .setHeaders(headers);
    }

    var data = JSON.parse(e.postData.contents);
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getActiveSheet();

    createHeaders(sheet);
    var row = buildDataRow(data);
    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'تم استلام البيانات بنجاح'
    })).setHeaders(headers);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    });
  }
}

function createHeaders(sheet) {
  var firstCell = sheet.getRange('A1').getValue();
  if (firstCell === '' || firstCell === null) {
    var headers = [
      'التاريخ والوقت',                    // A
      'اسم المؤسسة',                       // B
      'رقم الهاتف',                        // C
      'الجهة',                             // D
      'جهة أخرى',                          // E
      'الإقليم',                           // F
      'إقليم آخر',                         // G
      'الجماعة',                           // H
      'جماعة أخرى (نص)',                   // I
      'نوع المؤسسة',                       // J
      // الإعدادي
      'أولى إعدادي (عادي)',                // K
      'أولى إعدادي (مسار دولي)',           // L
      'ثانية إعدادي (عادي)',               // M
      'ثانية إعدادي (مسار دولي)',          // N
      'ثالثة إعدادي (عادي)',               // O
      'ثالثة إعدادي (مسار دولي)',          // P
      // الثانوي - جذع مشترك
      'جذع مشترك علمي (عادي)',             // Q
      'جذع مشترك علمي (مسار دولي)',        // R
      'جذع مشترك أدبي (عادي)',             // S
      'جذع مشترك أدبي (مسار دولي)',        // T
      'جذع مشترك تكنولوجي (عادي)',         // U
      'جذع مشترك تكنولوجي (مسار دولي)',    // V
      // الثانوي - أولى باك
      'أولى باك علوم تجريبية (عادي)',      // W
      'أولى باك علوم تجريبية (مسار دولي)', // X
      'أولى باك علوم رياضية (عادي)',       // Y
      'أولى باك علوم رياضية (مسار دولي)',  // Z
      'أولى باك علوم اقتصادية (عادي)',     // AA
      'أولى باك علوم اقتصادية (مسار دولي)',// AB
      // الثانوي - ثانية باك
      'ثانية باك علوم حياة وأرض (عادي)',   // AC
      'ثانية باك علوم حياة وأرض (مسار دولي)', // AD
      'ثانية باك علوم فيزيائية (عادي)',    // AE
      'ثانية باك علوم فيزيائية (مسار دولي)', // AF
      'ثانية باك علوم رياضية أ (عادي)',    // AG
      'ثانية باك علوم رياضية أ (مسار دولي)', // AH
      'ثانية باك علوم رياضية ب (عادي)',    // AI
      'ثانية باك علوم رياضية ب (مسار دولي)', // AJ
      'ثانية باك تقنية (عادي)',            // AK
      'ثانية باك تقنية (مسار دولي)',       // AL
      'ثانية باك مهنية (عادي)',            // AM
      'ثانية باك مهنية (مسار دولي)',       // AN
      // مستويات مضافة (ستكون كخانة نصية واحدة، يمكن تفصيلها لاحقاً)
      'مستويات مضافة (تفاصيل)',            // AO
      'المواد المختارة',                   // AP
      'المواد المضافة',                    // AQ
      'القاعات العامة (العدد)',            // AR
      'أسماء القاعات العامة',              // AS
      'القاعات العلمية (العدد)',           // AT
      'أسماء القاعات العلمية',             // AU
      'قاعات الإعلاميات (العدد)',          // AV
      'أسماء قاعات الإعلاميات',            // AW
      'الملاعب (العدد)',                   // AX
      'أسماء الملاعب',                     // AY
      'تفويج الفيزياء والكيمياء',          // AZ
      'مستويات تفويج الفيزياء',            // BA
      'نوع تفويج الفيزياء',                // BB
      'تفويج علوم الحياة والأرض',          // BC
      'مستويات تفويج SVT',                 // BD
      'نوع تفويج SVT',                     // BE
      'التجاور بين الفيزياء وSVT',         // BF
      'تعديلات الحصص',                     // BG
      'نوع الخدمة',                        // BH
      'رابط ملف التعديل (إن وجد)',         // BI
      'ملاحظات الحالة الخاصة',             // BJ
      'روابط الملفات الداعمة',             // BK
      'توقيت الدخول صباحاً',               // BL
      'توقيت الخروج صباحاً',               // BM
      'توقيت الدخول مساءً',                // BN
      'توقيت الخروج مساءً',                // BO
      'التوقيت المستمر',                   // BP
      'أيام عدم العمل',                    // BQ
      'شروط الأساتذة',                     // BR
      'رغبات تنظيمية',                     // BS
      'ملاحظات إضافية',                    // BT
      'التسعيرة التقديرية (درهم)',         // BU
      'وسيلة الدفع',                       // BV
      'حالة الطلب'                         // BW
    ];

    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#2d7cf6');
    headerRange.setFontColor('#ffffff');
    headerRange.setHorizontalAlignment('center');
    sheet.setFrozenRows(1);
  }
}

function buildDataRow(data) {
  // دالة مساعدة لجلب العدد مع قيمة افتراضية 0
  function getCount(obj, key) {
    return (obj && obj[key]) ? obj[key] : 0;
  }

  // الإعدادي
  var col1_regular = getCount(data.levelSectionCounts, 'col1');
  var col1_intl    = getCount(data.internationalSections, 'col1');
  var col2_regular = getCount(data.levelSectionCounts, 'col2');
  var col2_intl    = getCount(data.internationalSections, 'col2');
  var col3_regular = getCount(data.levelSectionCounts, 'col3');
  var col3_intl    = getCount(data.internationalSections, 'col3');

  // الثانوي - جذع مشترك
  var tc_sc_regular = getCount(data.levelSectionCounts, 'tc_sc');
  var tc_sc_intl    = getCount(data.internationalSections, 'tc_sc');
  var tc_lit_regular = getCount(data.levelSectionCounts, 'tc_lit');
  var tc_lit_intl    = getCount(data.internationalSections, 'tc_lit');
  var tc_tech_regular = getCount(data.levelSectionCounts, 'tc_tech');
  var tc_tech_intl    = getCount(data.internationalSections, 'tc_tech');

  // أولى باك
  var bac1_exp_regular = getCount(data.levelSectionCounts, 'bac1_exp');
  var bac1_exp_intl    = getCount(data.internationalSections, 'bac1_exp');
  var bac1_math_regular = getCount(data.levelSectionCounts, 'bac1_math');
  var bac1_math_intl    = getCount(data.internationalSections, 'bac1_math');
  var bac1_tech_regular = getCount(data.levelSectionCounts, 'bac1_tech');
  var bac1_tech_intl    = getCount(data.internationalSections, 'bac1_tech');

  // ثانية باك
  var bac2_exp_regular = getCount(data.levelSectionCounts, 'bac2_exp');
  var bac2_exp_intl    = getCount(data.internationalSections, 'bac2_exp');
  var bac2_phy_regular = getCount(data.levelSectionCounts, 'bac2_phy');
  var bac2_phy_intl    = getCount(data.internationalSections, 'bac2_phy');
  var bac2_math_a_regular = getCount(data.levelSectionCounts, 'bac2_math_a');
  var bac2_math_a_intl    = getCount(data.internationalSections, 'bac2_math_a');
  var bac2_math_b_regular = getCount(data.levelSectionCounts, 'bac2_math_b');
  var bac2_math_b_intl    = getCount(data.internationalSections, 'bac2_math_b');
  var bac2_tech_regular = getCount(data.levelSectionCounts, 'bac2_tech');
  var bac2_tech_intl    = getCount(data.internationalSections, 'bac2_tech');
  var bac2_prof_regular = getCount(data.levelSectionCounts, 'bac2_prof');
  var bac2_prof_intl    = getCount(data.internationalSections, 'bac2_prof');

  // المستويات المضافة (يمكن أن تكون كخانة نصية تحتوي على تفاصيل العادي والدولي)
  var customLevelsStr = '';
  if (data.customLevels && Array.isArray(data.customLevels)) {
    customLevelsStr = data.customLevels.map(function(l) {
      return l.name + ': عادي=' + (l.sections || 0) + ', دولي=' + (l.intlSections || 0);
    }).join(' | ');
  }

  // باقي البيانات (كما هي)
  var selectedSubjectsNames = data.selectedSubjectsNames || '';
  var customSubjectsNames = data.customSubjectsNames || '';
  var modificationsStr = '';
  if (data.modifications && Array.isArray(data.modifications)) {
    modificationsStr = data.modifications.map(function(m) {
      return m.subject + ' - ' + m.level + ': ' + m.change;
    }).join(' | ');
  }
  var typesStr = '';
  if (Array.isArray(data.institutionTypes)) {
    typesStr = data.institutionTypes.map(function(t) {
      if (t === 'college') return 'إعدادي عادي';
      if (t === 'college-pioneer') return 'إعدادي رائد';
      if (t === 'highschool') return 'ثانوي تأهيلي';
      return t;
    }).join(' + ');
  }
  var serviceStr = '';
  if (data.serviceType === 'new') serviceStr = 'إنتاج جديد';
  else if (data.serviceType === 'edit') serviceStr = 'تعديل موجود';
  else if (data.serviceType === 'special') serviceStr = 'حالة خاصة';
  var physicsGroupTypeStr = data.physicsGroupType === '2' ? 'كل قسم → فوجين' : 'كل قسمين → ثلاثة أفواج';
  var svtGroupTypeStr = data.svtGroupType === '2' ? 'كل قسم → فوجين' : 'كل قسمين → ثلاثة أفواج';
  var adjacencyStr = data.physicsSVTAdjacency ? 'نعم' : 'لا';
  var continuousTimeStr = data.continuousTime === 'yes' ? 'نعم' : 'لا';
  var paymentMethodStr = data.paymentMethod || '';

  // صف البيانات (يجب أن يطابق عدد الأعمدة في createHeaders)
  return [
    data.timestamp ? new Date(data.timestamp) : new Date(),
    data.institutionName || '',
    data.phone || '',
    data.region || '',
    data.otherRegion || '',
    data.province || '',
    data.otherProvince || '',
    data.commune || '',
    data.otherCommune || '',
    typesStr,
    // الإعدادي
    col1_regular, col1_intl,
    col2_regular, col2_intl,
    col3_regular, col3_intl,
    // جذع مشترك
    tc_sc_regular, tc_sc_intl,
    tc_lit_regular, tc_lit_intl,
    tc_tech_regular, tc_tech_intl,
    // أولى باك
    bac1_exp_regular, bac1_exp_intl,
    bac1_math_regular, bac1_math_intl,
    bac1_tech_regular, bac1_tech_intl,
    // ثانية باك
    bac2_exp_regular, bac2_exp_intl,
    bac2_phy_regular, bac2_phy_intl,
    bac2_math_a_regular, bac2_math_a_intl,
    bac2_math_b_regular, bac2_math_b_intl,
    bac2_tech_regular, bac2_tech_intl,
    bac2_prof_regular, bac2_prof_intl,
    // مستويات مضافة
    customLevelsStr,
    selectedSubjectsNames,
    customSubjectsNames,
    data.generalRooms || 0,
    data.generalRoomNames || '',
    data.scienceRooms || 0,
    data.scienceRoomNames || '',
    data.computerRooms || 0,
    data.computerRoomNames || '',
    data.playgrounds || 0,
    data.playgroundNames || '',
    data.groupingPhysics ? 'نعم' : 'لا',
    data.groupingPhysicsLevels || '',
    physicsGroupTypeStr,
    data.groupingSVT ? 'نعم' : 'لا',
    data.groupingSVTLevels || '',
    svtGroupTypeStr,
    adjacencyStr,
    modificationsStr,
    serviceStr,
    data.editFileLink || '',
    data.specialCaseNotes || '',
    data.supportFilesLinks || '',
    data.morningStart || '08:00',
    data.morningEnd || '12:00',
    data.eveningStart || '14:00',
    data.eveningEnd || '18:00',
    continuousTimeStr,
    data.nonWorkDays || '',
    data.teacherConditions || '',
    data.orgWishes || '',
    data.additionalNotes || '',
    data.pricingEstimate || 0,
    paymentMethodStr,
    'جديد'
  ];
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'ok',
    message: 'Jadwali API is running. Use POST to submit data.'
  })).setHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  });
}