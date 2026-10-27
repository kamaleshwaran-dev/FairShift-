import { Language } from './types';

export interface Translations {
  appName: string;
  appTagline: string;
  sdgTag: string;

  // Sectors & Roles
  constructionSector: string;
  hospitalSector: string;
  workerRole: string;
  adminRole: string;
  switchSector: string;
  switchRole: string;
  demoAccounts: string;
  desktopFrameToggle: string;
  fullScreenToggle: string;

  // Worker Navigation
  navShift: string;
  navPayslip: string;
  navSafety: string;
  navFeedback: string;
  navPassport: string;

  // Shift Tracker
  shiftTrackingTitle: string;
  shiftTrackingSubtitle: string;
  checkIn: string;
  checkOut: string;
  checkingIn: string;
  checkingOut: string;
  shiftActive: string;
  shiftNotStarted: string;
  elapsedTime: string;
  regularHoursLabel: string;
  overtimeHoursLabel: string;
  overtimeNotice: string;
  simulatedGps: string;
  simulatedQr: string;
  geoVerified: string;
  siteLocation: string;
  shiftStartedAt: string;
  totalEarningsToday: string;
  simulateHourAdvance: string;

  // Payslip
  payslipTitle: string;
  payslipSubtitle: string;
  periodLabel: string;
  listenPayslip: string;
  speakingPayslip: string;
  stopListening: string;
  basePayLabel: string;
  overtimePayLabel: string;
  statutoryDeductions: string;
  providentFund: string;
  esiInsurance: string;
  welfareFund: string;
  netTakeHomePay: string;
  grossEarnings: string;
  paymentStatusLabel: string;
  paidStatus: string;
  pendingStatus: string;
  transparentPayNotice: string;

  // Safety Reporting
  safetyTitle: string;
  safetySubtitle: string;
  voiceReportPrompt: string;
  typeReportPrompt: string;
  startVoiceRecord: string;
  stopVoiceRecord: string;
  listeningNow: string;
  voiceRecordedNote: string;
  hazardDescription: string;
  hazardCategory: string;
  hazardSeverity: string;
  submitHazardReport: string;
  hazardReportSuccess: string;
  myReportsHistory: string;
  statusReported: string;
  statusInReview: string;
  statusResolved: string;
  anonymousSafetyNotice: string;

  // Categories
  catFallProtection: string;
  catMachineryScaffold: string;
  catChemicalDust: string;
  catBiohazardNeedle: string;
  catErgonomicHeavyLift: string;
  catPpeShortage: string;
  catExcessiveHeatNoise: string;
  catOther: string;

  // Severities
  sevLow: string;
  sevMedium: string;
  sevHigh: string;
  sevCritical: string;

  // Anonymous Feedback
  feedbackTitle: string;
  feedbackSubtitle: string;
  privacyGuarantee: string;
  rateManager: string;
  rateConditions: string;
  rateRestBreaks: string;
  rateFairShifts: string;
  optionalComment: string;
  commentPlaceholder: string;
  submitFeedback: string;
  feedbackSuccess: string;

  // Skill Passport
  passportTitle: string;
  passportSubtitle: string;
  credentialIdLabel: string;
  issuedOn: string;
  validUntil: string;
  statusValid: string;
  statusExpiring: string;
  statusExpired: string;
  verifiedBadge: string;
  addCertificate: string;

  // Admin Dashboard
  adminDashboardTitle: string;
  adminSubtitle: string;
  metricActiveWorkers: string;
  metricWeeklyOvertime: string;
  metricOpenHazards: string;
  metricSatisfactionScore: string;
  tabOverview: string;
  tabFatigueAlerts: string;
  tabAttritionRisk: string;
  tabSafetyBoard: string;
  tabRoster: string;

  // Fatigue Alerts
  fatigueTitle: string;
  fatigueSubtitle: string;
  weeklyHoursBadge: string;
  turnaroundViolation: string;
  restHoursBetweenShifts: string;
  mitigationProtocol: string;
  sendRestOrder: string;
  reassignShift: string;
  actionTaken: string;

  // Attrition Risk
  attritionTitle: string;
  attritionSubtitle: string;
  riskScoreLabel: string;
  highRisk: string;
  mediumRisk: string;
  lowRisk: string;
  burnoutFactor: string;
  dissatisfactionFactor: string;
  safetyHazardFactor: string;
  retentionRecommendation: string;
  takePreventiveAction: string;

  // Safety Admin
  safetyBoardTitle: string;
  updateStatus: string;
  resolutionNotesPrompt: string;
  markInReview: string;
  markResolved: string;
  noOpenHazards: string;

  // Speech Text Generators
  generatePayslipSpeech: (payslip: {
    workerName: string;
    period: string;
    basePay: number;
    regularHours: number;
    overtimeHours: number;
    overtimePay: number;
    totalDeductions: number;
    netPay: number;
  }) => string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'FairShift',
    appTagline: 'Decent Work & Shift Transparency',
    sdgTag: 'UN SDG 8 · Decent Work & Economic Growth',

    constructionSector: 'Construction & Civil Works',
    hospitalSector: 'Hospital & Healthcare Facilities',
    workerRole: 'Worker View',
    adminRole: 'Admin Dashboard',
    switchSector: 'Switch Sector',
    switchRole: 'Switch Role',
    demoAccounts: 'Quick Demo Switch',
    desktopFrameToggle: 'Phone View',
    fullScreenToggle: 'Full Width',

    navShift: 'Shift',
    navPayslip: 'Payslip',
    navSafety: 'Safety',
    navFeedback: 'Feedback',
    navPassport: 'Passport',

    shiftTrackingTitle: 'Shift Attendance & Tracker',
    shiftTrackingSubtitle: 'Transparent hourly check-in with automatic overtime calculation beyond 8 hours.',
    checkIn: 'CHECK IN TO SHIFT',
    checkOut: 'CHECK OUT & FINALIZE SHIFT',
    checkingIn: 'Verifying Location...',
    checkingOut: 'Calculating Wages...',
    shiftActive: 'Shift Active',
    shiftNotStarted: 'Not Checked In',
    elapsedTime: 'Shift Duration',
    regularHoursLabel: 'Regular Hours (Up to 8h)',
    overtimeHoursLabel: 'Overtime Hours (1.5x / 2.0x)',
    overtimeNotice: 'Overtime applies automatically after 8 working hours.',
    simulatedGps: 'GPS Geo-Fence Active',
    simulatedQr: 'Site QR Verified',
    geoVerified: 'Location Verified at Gate',
    siteLocation: 'Metro Rail Project - Phase 3 Site',
    shiftStartedAt: 'Started at',
    totalEarningsToday: "Estimated Today's Pay",
    simulateHourAdvance: '+1 Hour (Simulate Shift)',

    payslipTitle: 'Clear Transparent Payslip',
    payslipSubtitle: 'Every rupee accounted for: base rate, overtime calculation, statutory deductions.',
    periodLabel: 'Pay Period',
    listenPayslip: 'Listen to Payslip',
    speakingPayslip: 'Reading aloud...',
    stopListening: 'Stop Voice',
    basePayLabel: 'Base Pay',
    overtimePayLabel: 'Overtime Pay (1.5x / 2.0x)',
    statutoryDeductions: 'Statutory Deductions',
    providentFund: 'Provident Fund (PF 12%)',
    esiInsurance: 'ESI Health Insurance (0.75%)',
    welfareFund: 'Labor Welfare Fund',
    netTakeHomePay: 'Net Take-Home Pay',
    grossEarnings: 'Gross Total Wages',
    paymentStatusLabel: 'Disbursement Status',
    paidStatus: 'Direct Deposit Verified',
    pendingStatus: 'Processing for Friday Cycle',
    transparentPayNotice: 'Zero unexplained deductions. Backed by verifiable shift attendance stamps.',

    safetyTitle: 'Voice & Instant Safety Hazard Reporting',
    safetySubtitle: 'Report dangerous conditions by voice or text. Your rights to a safe workplace are protected.',
    voiceReportPrompt: 'Tap microphone and speak in English, Tamil, or Hindi',
    typeReportPrompt: 'Or type description of hazard...',
    startVoiceRecord: 'Start Voice Report',
    stopVoiceRecord: 'Finish Recording',
    listeningNow: 'Listening... Please describe the hazard clearly',
    voiceRecordedNote: 'Voice transcript captured successfully',
    hazardDescription: 'Hazard Description',
    hazardCategory: 'Hazard Category',
    hazardSeverity: 'Risk Severity',
    submitHazardReport: 'Submit Safety Report',
    hazardReportSuccess: 'Hazard reported! Site safety coordinator alerted.',
    myReportsHistory: 'Site Safety Incident Log',
    statusReported: 'Reported',
    statusInReview: 'In Review',
    statusResolved: 'Resolved',
    anonymousSafetyNotice: 'You can report without fear of retaliation under UN SDG 8 safety standards.',

    catFallProtection: 'Scaffold & Fall Hazard',
    catMachineryScaffold: 'Heavy Equipment & Machinery',
    catChemicalDust: 'Silica Dust & Chemical Fumes',
    catBiohazardNeedle: 'Biohazard & Sharps / Infection Risk',
    catErgonomicHeavyLift: 'Ergonomic & Heavy Manual Lifting',
    catPpeShortage: 'Damaged or Missing PPE (Helmets/Gloves/Masks)',
    catExcessiveHeatNoise: 'Extreme Heat & Noise Stress',
    catOther: 'General Site Safety Issue',

    sevLow: 'Low',
    sevMedium: 'Medium',
    sevHigh: 'High',
    sevCritical: 'Critical / Immediate Danger',

    feedbackTitle: '100% Anonymous Workplace Feedback',
    feedbackSubtitle: 'Rate leadership and working conditions without your identity or worker code being stored.',
    privacyGuarantee: 'Cryptographically decoupled: Your identity is NEVER linked to this feedback response.',
    rateManager: 'Supervisor Empathy & Fair Treatment',
    rateConditions: 'Rest Area, Clean Water & Sanitary Facilities',
    rateRestBreaks: 'Prompt Rest & Meal Breaks',
    rateFairShifts: 'Fair & Transparent Shift Distribution',
    optionalComment: 'Optional Comments (No personal names)',
    commentPlaceholder: 'What can management improve regarding your shifts or welfare?',
    submitFeedback: 'Submit Anonymous Rating',
    feedbackSuccess: 'Thank you! Your feedback will help improve site conditions.',

    passportTitle: 'Digital Skill Passport',
    passportSubtitle: 'Portable verified credentials, site safety inductions, and occupational qualifications.',
    credentialIdLabel: 'Credential ID',
    issuedOn: 'Issued on',
    validUntil: 'Valid until',
    statusValid: 'Verified & Active',
    statusExpiring: 'Expiring Soon (< 30 days)',
    statusExpired: 'Expired (Renewal Required)',
    verifiedBadge: 'QR Certified',
    addCertificate: 'Upload / Claim Certificate',

    adminDashboardTitle: 'FairShift Operations Console',
    adminSubtitle: 'Workforce compliance, proactive fatigue monitoring, and attrition risk mitigation.',
    metricActiveWorkers: 'Active On-Site Workers',
    metricWeeklyOvertime: 'Total Overtime Hours (Week)',
    metricOpenHazards: 'Open Safety Reports',
    metricSatisfactionScore: 'Workplace Health Index',
    tabOverview: 'Dashboard Overview',
    tabFatigueAlerts: 'Fatigue Alerts (>60h)',
    tabAttritionRisk: 'Attrition Risk Engine',
    tabSafetyBoard: 'Hazard Resolution',
    tabRoster: 'Worker Roster',

    fatigueTitle: 'Fatigue & Overtaxing Watchlist',
    fatigueSubtitle: 'Early warning system preventing industrial accidents, burnout, and excessive shift exploitation.',
    weeklyHoursBadge: 'Weekly Total Hours',
    turnaroundViolation: 'Back-to-Back Shift Alert (< 10h rest gap)',
    restHoursBetweenShifts: 'Rest interval between shifts',
    mitigationProtocol: 'Recommended Compliance Action',
    sendRestOrder: 'Issue 24h Mandatory Rest',
    reassignShift: 'Rebalance Shift to Backup Worker',
    actionTaken: 'Intervention Logged',

    attritionTitle: 'Rule-Based Worker Attrition Risk',
    attritionSubtitle: 'Proactive retention score based on overtime burden, anonymous dissatisfaction, and hazard exposure.',
    riskScoreLabel: 'Attrition Probability',
    highRisk: 'High Flight Risk (65-100%)',
    mediumRisk: 'Moderate Risk (35-64%)',
    lowRisk: 'Healthy / Low Risk (< 35%)',
    burnoutFactor: 'Overtime Exhaustion',
    dissatisfactionFactor: 'Condition Dissatisfaction',
    safetyHazardFactor: 'Hazard Exposure',
    retentionRecommendation: 'Retention Strategy',
    takePreventiveAction: 'Apply Retention Remedy',

    safetyBoardTitle: 'Safety Hazard Resolution Board',
    updateStatus: 'Update Incident Status',
    resolutionNotesPrompt: 'Resolution Notes / Corrective Action',
    markInReview: 'Mark In Review',
    markResolved: 'Mark Resolved & Closed',
    noOpenHazards: 'No open hazard reports for this sector.',

    generatePayslipSpeech: (p) =>
      `Hello ${p.workerName}. Here is your payslip for ${p.period}. ` +
      `Your base pay is ${p.basePay} rupees for ${p.regularHours} regular hours. ` +
      `You worked ${p.overtimeHours} hours of overtime, earning ${p.overtimePay} rupees at premium rates. ` +
      `Total statutory deductions for provident fund, health insurance, and welfare are ${p.totalDeductions} rupees. ` +
      `Your net take-home pay is ${p.netPay} rupees. Thank you for your hard work and commitment to safety.`,
  },

  ta: {
    appName: 'ஃபேர்ஷிப்ட் (FairShift)',
    appTagline: 'நேர்மையான வேலை & வெளிப்படையான பணிநேரம்',
    sdgTag: 'ஐ.நா இலக்கு 8 · கண்ணியமான வேலை மற்றும் பொருளாதார வளர்ச்சி',

    constructionSector: 'கட்டுமானப் பணிகள்',
    hospitalSector: 'மருத்துவமனை மற்றும் சுகாதார வசதிகள்',
    workerRole: 'தொழிலாளர் பக்கம்',
    adminRole: 'நிர்வாக டாஷ்போர்டு',
    switchSector: 'துறையை மாற்று',
    switchRole: 'பங்கை மாற்று',
    demoAccounts: 'டெமோ கணக்குகள்',
    desktopFrameToggle: 'மொபைல் காட்சி',
    fullScreenToggle: 'முழு திரை',

    navShift: 'பணிநேரம்',
    navPayslip: 'சம்பளச் சீட்டு',
    navSafety: 'பாதுகாப்பு',
    navFeedback: 'கருத்து',
    navPassport: 'திறன் சான்றிதழ்',

    shiftTrackingTitle: 'பணி வருகை மற்றும் கண்காணிப்பு',
    shiftTrackingSubtitle: '8 மணி நேரத்திற்கு மேல் கூடுதல் பணிநேரக் கணக்கீட்டுடன் (Overtime) துல்லியமான பதிவு.',
    checkIn: 'பணியைத் தொடங்கு (CHECK IN)',
    checkOut: 'பணியை முடி (CHECK OUT)',
    checkingIn: 'இடத்தை உறுதிப்படுத்துகிறது...',
    checkingOut: 'சம்பளம் கணக்கிடப்படுகிறது...',
    shiftActive: 'பணியில் உள்ளார்',
    shiftNotStarted: 'இன்னும் தொடங்கவில்லை',
    elapsedTime: 'பணி செய்த நேரம்',
    regularHoursLabel: 'வழக்கமான நேரம் (8 மணி வரை)',
    overtimeHoursLabel: 'கூடுதல் பணிநேரம் (1.5x / 2.0x OT)',
    overtimeNotice: '8 மணி நேரத்திற்குப் பின் கூடுதல் நேர ஊதியம் தானாகக் கணக்கிடப்படும்.',
    simulatedGps: 'GPS இருப்பிடம் சரிபார்க்கப்பட்டது',
    simulatedQr: 'QR குறியீடு சரிபார்க்கப்பட்டது',
    geoVerified: 'நுழைவு வாயிலில் சரிபார்க்கப்பட்டது',
    siteLocation: 'மெட்ரோ ரயில் திட்டம் - கட்டம் 3 தளம்',
    shiftStartedAt: 'தொடங்கிய நேரம்',
    totalEarningsToday: 'இன்றைய உத்தேச ஊதியம்',
    simulateHourAdvance: '+1 மணி நேரம் கூட்டு (டெமோ)',

    payslipTitle: 'தெளிவான சம்பளச் சீட்டு',
    payslipSubtitle: 'ஒவ்வொரு ரூபாய்க்கும் கணக்கு: அடிப்படை ஊதியம், கூடுதல் நேரம், சட்டப்பூர்வ பிடித்தங்கள்.',
    periodLabel: 'சம்பளக் காலம்',
    listenPayslip: 'சம்பளச் சீட்டைக் கேள்',
    speakingPayslip: 'வாசிக்கப்படுகிறது...',
    stopListening: 'ஒலியை நிறுத்து',
    basePayLabel: 'அடிப்படை ஊதியம்',
    overtimePayLabel: 'கூடுதல் பணிநேர ஊதியம் (1.5x / 2.0x)',
    statutoryDeductions: 'சட்டப்பூர்வ பிடித்தங்கள்',
    providentFund: 'வருங்கால வைப்பு நிதி (PF 12%)',
    esiInsurance: 'ESI மருத்துவக் காப்பீடு (0.75%)',
    welfareFund: 'தொழிலாளர் நல நிதி',
    netTakeHomePay: 'நிகர ஊதியம் (கையில் கிடைக்கும் பணம்)',
    grossEarnings: 'மொத்த ஊதியம்',
    paymentStatusLabel: 'வழங்கல் நிலை',
    paidStatus: 'வங்கி கணக்கில் செலுத்தப்பட்டது',
    pendingStatus: 'வெள்ளிக்கிழமை வழங்கல் செயலாக்கத்தில் உள்ளது',
    transparentPayNotice: 'மறைமுகப் பிடித்தங்கள் இல்லை. பதிவு செய்யப்பட்ட பணிநேர சான்றுகள் உண்டு.',

    safetyTitle: 'குரல்வழி & உடனடி பாதுகாப்பு அறிக்கை',
    safetySubtitle: 'பாதுகாப்பற்ற சூழலை குரல் மூலமாகவோ அல்லது தட்டச்சு செய்தோ புகார் அளிக்கலாம்.',
    voiceReportPrompt: 'மைக் பட்டனைத் தட்டி தமிழில் பேசவும்',
    typeReportPrompt: 'அல்லது பிரச்சனையை விவரிக்கவும்...',
    startVoiceRecord: 'குரல் பதிவைத் தொடங்கு',
    stopVoiceRecord: 'பதிவை முடி',
    listeningNow: 'கேட்கிறது... தயவுசெய்து பிரச்சனையைத் தெளிவாகப் பேசவும்',
    voiceRecordedNote: 'குரல் வெற்றிகரமாகப் பதிவு செய்யப்பட்டது',
    hazardDescription: 'ஆபத்தின் விளக்கம்',
    hazardCategory: 'ஆபத்து வகை',
    hazardSeverity: 'ஆபத்தின் தீவிரம்',
    submitHazardReport: 'புகாரைச் சமர்ப்பி',
    hazardReportSuccess: 'புகார் அளிக்கப்பட்டது! தளப் பாதுகாப்பாளர் கவனத்திற்குச் சென்றுள்ளது.',
    myReportsHistory: 'தளப் பாதுகாப்பு நிகழ்வுப் பதிவு',
    statusReported: 'பதிவு செய்யப்பட்டது',
    statusInReview: 'பரிசீலனையில்',
    statusResolved: 'சரிசெய்யப்பட்டது',
    anonymousSafetyNotice: 'ஐ.நா இலக்கு 8-ன் படி பயமின்றி புகார் அளிக்கலாம்.',

    catFallProtection: 'சாரம் மற்றும் விழுதல் ஆபத்து',
    catMachineryScaffold: 'கனரக இயந்திரங்கள் & கருவிகள்',
    catChemicalDust: 'தூசி மற்றும் ரசாயன நச்சு',
    catBiohazardNeedle: 'மருத்துவக் கழிவு / ஊசி தொற்று ஆபத்து',
    catErgonomicHeavyLift: 'கனமான எடையைத் தூக்குதல்',
    catPpeShortage: 'பாதுகாப்பு உபகரணங்கள் பற்றாக்குறை',
    catExcessiveHeatNoise: 'அதிக வெப்பம் & இரைச்சல்',
    catOther: 'பொதுவான தளப் பாதுகாப்பு பிரச்சனை',

    sevLow: 'குறைந்த ஆபத்து',
    sevMedium: 'நடுத்தர ஆபத்து',
    sevHigh: 'அதிக ஆபத்து',
    sevCritical: 'மிகவும் ஆபத்தானது / உடனடி கவனம்',

    feedbackTitle: '100% அநாமதேய தளக் கருத்து',
    feedbackSubtitle: 'உங்கள் பெயர் அல்லது தொழிலாளர் அடையாளக் குறியீடு சேமிக்கப்படாமல் கருத்து தெரிவிக்கலாம்.',
    privacyGuarantee: 'உங்கள் அடையாளம் எப்போதும் ரகசியமாக வைக்கப்படும்.',
    rateManager: 'மேற்பார்வையாளரின் அணுகுமுறை',
    rateConditions: 'ஓய்வறை, குடிநீர் மற்றும் கழிப்பறை வசதிகள்',
    rateRestBreaks: 'சரியான நேரத்தில் உணவு & ஓய்வு இடைவேளை',
    rateFairShifts: 'நியாயமான பணிநேரப் பகிர்வு',
    optionalComment: 'கூடுதல் கருத்துக்கள் (பெயர்களைக் குறிப்பிட வேண்டாம்)',
    commentPlaceholder: 'நிர்வாகம் என்னென்ன வசதிகளை மேம்படுத்த வேண்டும்?',
    submitFeedback: 'கருத்தைச் சமர்ப்பி',
    feedbackSuccess: 'நன்றி! உங்கள் கருத்து தளத்தை மேம்படுத்த உதவும்.',

    passportTitle: 'டிஜிட்டல் திறன் பாஸ்போர்ட்',
    passportSubtitle: 'சரிபார்க்கப்பட்ட சான்றிதழ்கள், பாதுகாப்புப் பயிற்சிகள் மற்றும் தொழில் தகுதிகள்.',
    credentialIdLabel: 'சான்றிதழ் எண்',
    issuedOn: 'வழங்கப்பட்ட நாள்',
    validUntil: 'காலாவதி நாள்',
    statusValid: 'சரிபார்க்கப்பட்டு செயல்பாட்டில் உள்ளது',
    statusExpiring: 'விரைவில் காலாவதியாகிறது (< 30 நாட்கள்)',
    statusExpired: 'காலாவதியானது (புதுப்பிக்க வேண்டும்)',
    verifiedBadge: 'QR சான்றளிக்கப்பட்டது',
    addCertificate: 'சான்றிதழைச் சேர்',

    adminDashboardTitle: 'ஃபேர்ஷிப்ட் நிர்வாக மையம்',
    adminSubtitle: 'தொழிலாளர் நலன், சோர்வு தடுப்பு மற்றும் விழிப்புணர்வு கண்காணிப்பு.',
    metricActiveWorkers: 'தற்போது பணியில் உள்ளோர்',
    metricWeeklyOvertime: 'வாரத்தின் மொத்த கூடுதல் பணிநேரம்',
    metricOpenHazards: 'தீர்க்கப்படாத பாதுகாப்புப் புகார்கள்',
    metricSatisfactionScore: 'தொழிலாளர் மனநிறைவு குறியீடு',
    tabOverview: 'டாஷ்போர்டு பார்வை',
    tabFatigueAlerts: 'சோர்வு எச்சரிக்கைகள் (>60 மணி)',
    tabAttritionRisk: 'வேலை விலகல் அபாய கணிப்பு',
    tabSafetyBoard: 'பாதுகாப்பு நடவடிக்கை பலகை',
    tabRoster: 'பணியாளர் பட்டியல்',

    fatigueTitle: 'அதிக சோர்வு மற்றும் அபாய கண்காணிப்பு',
    fatigueSubtitle: 'விபத்துகள் மற்றும் தீவிர சோர்வைத் தடுக்க முன்கூட்டியே எச்சரிக்கும் அமைப்பு.',
    weeklyHoursBadge: 'வாரத்தின் மொத்த பணி நேரம்',
    turnaroundViolation: 'இடைவேளையற்ற அடுத்தடுத்த ஷிப்ட் எச்சரிக்கை (< 10 மணி ஓய்வு)',
    restHoursBetweenShifts: 'ஷிப்டுகளுக்கு இடையேயான ஓய்வு நேரம்',
    mitigationProtocol: 'பரிந்துரைக்கப்பட்ட நடவடிக்கை',
    sendRestOrder: '24 மணி கட்டாய ஓய்வு வழங்கு',
    reassignShift: 'மாற்றுப் பணியாளரை நியமி',
    actionTaken: 'நடவடிக்கை எடுக்கப்பட்டது',

    attritionTitle: 'தொழிலாளர் வேலை விலகல் அபாயம்',
    attritionSubtitle: 'அதிக பணிச்சுமை, அதிருப்தி மற்றும் ஆபத்துகளின் அடிப்படையில் கணக்கிடப்பட்ட குறியீடு.',
    riskScoreLabel: 'வேலை விலகல் சாத்தியக்கூறு',
    highRisk: 'அதிக ஆபத்து (65-100%)',
    mediumRisk: 'நடுத்தர ஆபத்து (35-64%)',
    lowRisk: 'ஆரோக்கியமான நிலை (< 35%)',
    burnoutFactor: 'கூடுதல் பணிநேரச் சோர்வு',
    dissatisfactionFactor: 'தள வசதிகள் அதிருப்தி',
    safetyHazardFactor: 'ஆபத்து வெளிப்பாடு',
    retentionRecommendation: 'தக்கவைப்பு உத்தி',
    takePreventiveAction: 'நடவடிக்கை எடு',

    safetyBoardTitle: 'பாதுகாப்புப் புகார் தீர்வு பலகை',
    updateStatus: 'புகாரின் நிலையை மாற்று',
    resolutionNotesPrompt: 'எடுக்கப்பட்ட தீர்வு நடவடிக்கைகள்',
    markInReview: 'பரிசீலனைக்கு மாற்று',
    markResolved: 'தீர்க்கப்பட்டதாக முடி',
    noOpenHazards: 'தற்போது புகார்கள் ஏதுமில்லை.',

    generatePayslipSpeech: (p) =>
      `வணக்கம் ${p.workerName}. ${p.period} காலத்திற்கான உங்கள் சம்பளச் சீட்டு விவரம். ` +
      `${p.regularHours} மணி நேர வழக்கமான பணிக்கான அடிப்படை ஊதியம் ${p.basePay} ரூபாய். ` +
      `நீங்கள் செய்த ${p.overtimeHours} மணி நேர கூடுதல் பணிக்கான ஊதியம் ${p.overtimePay} ரூபாய். ` +
      `பி.எஃப், மருத்துவக் காப்பீடு மற்றும் நலநிதி பிடித்தங்கள் மொத்தம் ${p.totalDeductions} ரூபாய். ` +
      `உங்கள் கையில் கிடைக்கும் நிகர சம்பளம் ${p.netPay} ரூபாய். உங்கள் கடின உழைப்புக்கும் பாதுகாப்புக்கும் நன்றி.`,
  },

  hi: {
    appName: 'फेयरशिफ्ट (FairShift)',
    appTagline: 'उचित कार्य और पारदर्शी शिफ्ट प्रणाली',
    sdgTag: 'संयुक्त राष्ट्र एसडीजी 8 · सम्मानजनक कार्य और आर्थिक विकास',

    constructionSector: 'निर्माण और सिविल कार्य',
    hospitalSector: 'अस्पताल और स्वास्थ्य सुविधाएं',
    workerRole: 'श्रमिक दृश्य',
    adminRole: 'प्रशासक डैशबोर्ड',
    switchSector: 'क्षेत्र बदलें',
    switchRole: 'भूमिका बदलें',
    demoAccounts: 'डेमो खाते',
    desktopFrameToggle: 'मोबाइल दृश्य',
    fullScreenToggle: 'पूर्ण स्क्रीन',

    navShift: 'शिफ्ट',
    navPayslip: 'वेतन पर्ची',
    navSafety: 'सुरक्षा',
    navFeedback: 'प्रतिक्रिया',
    navPassport: 'कौशल पासपोर्ट',

    shiftTrackingTitle: 'शिफ्ट उपस्थिति और ट्रैकर',
    shiftTrackingSubtitle: '8 घंटे से अधिक के ओवरटाइम की स्वचालित गणना के साथ पारदर्शी चेक-इन।',
    checkIn: 'शिफ्ट शुरू करें (CHECK IN)',
    checkOut: 'शिफ्ट समाप्त करें (CHECK OUT)',
    checkingIn: 'स्थान सत्यापित हो रहा है...',
    checkingOut: 'मजदूरी की गणना जारी है...',
    shiftActive: 'शिफ्ट जारी है',
    shiftNotStarted: 'चेक-इन नहीं हुआ है',
    elapsedTime: 'कार्य समय',
    regularHoursLabel: 'नियमित घंटे (8 घंटे तक)',
    overtimeHoursLabel: 'ओवरटाइम घंटे (1.5x / 2.0x)',
    overtimeNotice: '8 घंटे से अधिक काम करने पर ओवरटाइम स्वतः लागू होता है।',
    simulatedGps: 'GPS जियो-फेंस सत्यापित',
    simulatedQr: 'साइट QR कोड सत्यापित',
    geoVerified: 'प्रवेश द्वार पर सत्यापित',
    siteLocation: 'मेट्रो रेल परियोजना - चरण 3 साइट',
    shiftStartedAt: 'शुरू होने का समय',
    totalEarningsToday: 'आज की अनुमानित कमाई',
    simulateHourAdvance: '+1 घंटा बढ़ाएं (डेमो)',

    payslipTitle: 'स्पष्ट और पारदर्शी वेतन पर्ची',
    payslipSubtitle: 'एक-एक रुपये का पूरा हिसाब: मूल वेतन, ओवरटाइम, और वैधानिक कटौतियां।',
    periodLabel: 'वेतन अवधि',
    listenPayslip: 'वेतन पर्ची सुनें',
    speakingPayslip: 'सुनाई जा रही है...',
    stopListening: 'आवाज रोकें',
    basePayLabel: 'मूल वेतन',
    overtimePayLabel: 'ओवरटाइम वेतन (1.5x / 2.0x)',
    statutoryDeductions: 'वैधानिक कटौतियां',
    providentFund: 'भविष्य निधि (PF 12%)',
    esiInsurance: 'ESI स्वास्थ्य बीमा (0.75%)',
    welfareFund: 'श्रम कल्याण निधि',
    netTakeHomePay: 'शुद्ध देय राशि (हाथ में मिलने वाला वेतन)',
    grossEarnings: 'कुल सकल वेतन',
    paymentStatusLabel: 'भुगतान स्थिति',
    paidStatus: 'बैंक खाते में जमा',
    pendingStatus: 'शुक्रवार चक्र हेतु प्रक्रियाधीन',
    transparentPayNotice: 'कोई गुप्त या अस्पष्ट कटौती नहीं। डिजिटल शिफ्ट टिकट द्वारा प्रमाणित।',

    safetyTitle: 'आवाज और त्वरित सुरक्षा खतरा रिपोर्ट',
    safetySubtitle: 'खतरे की शिकायत बोलकर या लिखकर दर्ज करें। सुरक्षित कार्यस्थल आपका अधिकार है।',
    voiceReportPrompt: 'माइक दबाएं और हिंदी, तमिल या अंग्रेजी में बोलें',
    typeReportPrompt: 'या खतरे का विवरण यहां टाइप करें...',
    startVoiceRecord: 'आवाज से रिपोर्ट करें',
    stopVoiceRecord: 'रिकॉर्डिंग समाप्त करें',
    listeningNow: 'सुन रहे हैं... कृपया खतरे की समस्या स्पष्ट बताएं',
    voiceRecordedNote: 'आवाज सफलतापूर्वक दर्ज कर ली गई है',
    hazardDescription: 'खतरे का विवरण',
    hazardCategory: 'खतरे की श्रेणी',
    hazardSeverity: 'जोखिम की गंभीरता',
    submitHazardReport: 'सुरक्षा रिपोर्ट सबमिट करें',
    hazardReportSuccess: 'रिपोर्ट दर्ज हो गई! साइट सुरक्षा अधिकारी को सूचित कर दिया गया है।',
    myReportsHistory: 'कार्यस्थल सुरक्षा रिपोर्ट सूची',
    statusReported: 'दर्ज किया गया',
    statusInReview: 'समीक्षाधीन',
    statusResolved: 'निराकरण हो चुका',
    anonymousSafetyNotice: 'संयुक्त राष्ट्र एसडीजी 8 के तहत आप बिना किसी डर के रिपोर्ट कर सकते हैं।',

    catFallProtection: 'ऊंचाई से गिरने व मचान का जोखिम',
    catMachineryScaffold: 'भारी मशीनरी व उपकरण',
    catChemicalDust: 'धूल व जहरीला रसायन',
    catBiohazardNeedle: 'बायोहजार्ड व सुई संक्रमण खतरा',
    catErgonomicHeavyLift: 'अत्यधिक भारी सामान उठाना',
    catPpeShortage: 'सुरक्षा उपकरण (PPE) की कमी',
    catExcessiveHeatNoise: 'अत्यधिक गर्मी व शोर तनाव',
    catOther: 'सामान्य साइट सुरक्षा समस्या',

    sevLow: 'कम जोखिम',
    sevMedium: 'मध्यम जोखिम',
    sevHigh: 'उच्च जोखिम',
    sevCritical: 'अत्यंत गंभीर / तत्काल खतरा',

    feedbackTitle: '100% गोपनीय व अनाम फीडबैक',
    feedbackSubtitle: 'बिना अपनी पहचान या कर्मचारी कोड उजागर किए कार्य परिस्थितियों पर अपनी राय दें।',
    privacyGuarantee: 'आपकी पहचान पूरी तरह से गुप्त रखी जाती है।',
    rateManager: 'पर्यवेक्षक का व्यवहार व सहयोग',
    rateConditions: 'विश्राम स्थल, स्वच्छ पेयजल व शौचालय',
    rateRestBreaks: 'भोजन व विश्राम का उचित समय',
    rateFairShifts: 'शिफ्टों का निष्पक्ष वितरण',
    optionalComment: 'अतिरिक्त टिप्पणी (कोई नाम न लिखें)',
    commentPlaceholder: 'प्रबंधन को क्या सुधार करना चाहिए?',
    submitFeedback: 'फीडबैक सबमिट करें',
    feedbackSuccess: 'धन्यवाद! आपकी राय से कार्यस्थल को बेहतर बनाने में मदद मिलेगी।',

    passportTitle: 'डिजिटल कौशल पासपोर्ट',
    passportSubtitle: 'प्रमाणित योग्यताएं, सुरक्षा प्रशिक्षण और व्यावसायिक प्रमाण पत्र।',
    credentialIdLabel: 'प्रमाणपत्र संख्या',
    issuedOn: 'जारी करने की तिथि',
    validUntil: 'वैधता समाप्ति',
    statusValid: 'प्रमाणित व सक्रिय',
    statusExpiring: 'शीघ्र समाप्त होने वाला (< 30 दिन)',
    statusExpired: 'समाप्त हो चुका (नवीनीकरण आवश्यक)',
    verifiedBadge: 'QR प्रमाणित',
    addCertificate: 'प्रमाणपत्र जोड़ें',

    adminDashboardTitle: 'फेयरशिफ्ट ऑपरेशंस कंसोल',
    adminSubtitle: 'श्रमिक अनुपालन, थकान निगरानी और नौकरी छोड़ने के जोखिम का पूर्वानुमान।',
    metricActiveWorkers: 'वर्तमान में कार्यरत श्रमिक',
    metricWeeklyOvertime: 'साप्ताहिक कुल ओवरटाइम घंटे',
    metricOpenHazards: 'लंबित सुरक्षा शिकायतें',
    metricSatisfactionScore: 'कार्यस्थल संतुष्टि सूचकांक',
    tabOverview: 'डैशबोर्ड सारांश',
    tabFatigueAlerts: 'थकान अलर्ट (>60 घंटे)',
    tabAttritionRisk: 'नौकरी छोड़ने का जोखिम',
    tabSafetyBoard: 'सुरक्षा समाधान पटल',
    tabRoster: 'श्रमिक सूची',

    fatigueTitle: 'अत्यधिक थकान व तनाव चेतावनी पटल',
    fatigueSubtitle: 'दुर्घटनाओं और गंभीर तनाव को रोकने के लिए पूर्व चेतावनी प्रणाली।',
    weeklyHoursBadge: 'साप्ताहिक कुल घंटे',
    turnaroundViolation: 'बिना पर्याप्त विश्राम के अगली शिफ्ट (< 10 घंटे आराम)',
    restHoursBetweenShifts: 'शिफ्टों के बीच विश्राम का अंतर',
    mitigationProtocol: 'अनुशंसित निवारक कदम',
    sendRestOrder: '24 घंटे का अनिवार्य विश्राम दें',
    reassignShift: 'दूसरे कर्मचारी को कार्य सौंपें',
    actionTaken: 'कदम उठाया गया',

    attritionTitle: 'श्रमिक नौकरी छोड़ने का जोखिम (Attrition Risk)',
    attritionSubtitle: 'अधिक ओवरटाइम, असंतोष और असुरक्षा के आधार पर पारदर्शी जोखिम स्कोर।',
    riskScoreLabel: 'छोड़ने की संभावना',
    highRisk: 'उच्च जोखिम (65-100%)',
    mediumRisk: 'मध्यम जोखिम (35-64%)',
    lowRisk: 'सामान्य / कम जोखिम (< 35%)',
    burnoutFactor: 'ओवरटाइम से थकान',
    dissatisfactionFactor: 'साइट सुविधाओं से असंतोष',
    safetyHazardFactor: 'खतरे के संपर्क का स्तर',
    retentionRecommendation: 'रोकथाम रणनीति',
    takePreventiveAction: 'निवारक कार्रवाई करें',

    safetyBoardTitle: 'सुरक्षा शिकायत निवारण पटल',
    updateStatus: 'स्थिति अपडेट करें',
    resolutionNotesPrompt: 'सुधार कार्रवाई व विवरण',
    markInReview: 'समीक्षा में डालें',
    markResolved: 'समाधान पूर्ण चिह्नित करें',
    noOpenHazards: 'इस क्षेत्र में कोई खुली सुरक्षा शिकायत नहीं है।',

    generatePayslipSpeech: (p) =>
      `नमस्ते ${p.workerName}। ${p.period} के लिए आपकी वेतन पर्ची। ` +
      `आपके ${p.regularHours} नियमित घंटों का मूल वेतन ${p.basePay} रुपये है। ` +
      `आपने ${p.overtimeHours} घंटे ओवरटाइम काम किया, जिससे ${p.overtimePay} रुपये की अतिरिक्त कमाई हुई। ` +
      `भविष्य निधि, स्वास्थ्य बीमा और कल्याण कोष की कुल कटौती ${p.totalDeductions} रुपये है। ` +
      `आपके हाथ में मिलने वाला शुद्ध वेतन ${p.netPay} रुपये है। आपके श्रम और सुरक्षा प्रतिबद्धता के लिए धन्यवाद।`,
  },
};
