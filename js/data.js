// ===== ARTICLE DATA =====
const articles = [
    {
        id: 1, type: 'editorial', typeLabel: 'Editorial',
        title: 'Pediatric Healthcare in the 21st Century: Challenges and Opportunities',
        authors: 'Sharma A, Patel R',
        journal: 'Int J Pediatr',
        year: '2026', volume: '12', issue: '1', pages: '1-3',
        doi: '10.xxxx/ijpeds.2026.001',
        abstract: 'This editorial discusses the evolving landscape of pediatric healthcare, examining the intersection of technology, policy, and clinical practice in improving child health outcomes globally.',
        views: 1245, downloads: 389
    },
    {
        id: 2, type: 'case', typeLabel: 'Case Report',
        title: 'A Rare Presentation of Neonatal Hemochromatosis with Multi-Organ Involvement',
        authors: 'Kumar S, Gupta M, Singh P',
        journal: 'Int J Pediatr',
        year: '2026', volume: '12', issue: '1', pages: '4-8',
        doi: '10.xxxx/ijpeds.2026.002',
        abstract: 'We report a rare case of neonatal hemochromatosis presenting with hepatic and cardiac involvement in a term male neonate. Early diagnosis and exchange transfusion led to favorable outcomes.',
        views: 876, downloads: 234
    },
    {
        id: 3, type: 'commentary', typeLabel: 'Commentary',
        title: 'The Role of Artificial Intelligence in Pediatric Diagnostics: Promise and Pitfalls',
        authors: 'Williams J, Brown K',
        journal: 'Int J Pediatr',
        year: '2026', volume: '12', issue: '1', pages: '9-12',
        doi: '10.xxxx/ijpeds.2026.003',
        abstract: 'This commentary examines the emerging role of AI in pediatric diagnostics, discussing current applications, limitations, and ethical considerations for clinical implementation.',
        views: 654, downloads: 187
    },
    {
        id: 4, type: 'review', typeLabel: 'Review Article',
        title: 'Advances in Gene Therapy for Pediatric Genetic Disorders: A Systematic Review',
        authors: 'Chen L, Wang Y, Liu H, Zhang W',
        journal: 'Int J Pediatr',
        year: '2026', volume: '12', issue: '1', pages: '13-26',
        doi: '10.xxxx/ijpeds.2026.004',
        abstract: 'This systematic review examines recent advances in gene therapy applications for pediatric genetic disorders, including spinal muscular atrophy, sickle cell disease, and various immunodeficiencies.',
        views: 2103, downloads: 567
    },
    {
        id: 5, type: 'original', typeLabel: 'Original Article',
        title: 'Effectiveness of Probiotics in Preventing Antibiotic-Associated Diarrhea in Children',
        authors: 'Reddy N, Joshi K, Deshmukh S',
        journal: 'Int J Pediatr',
        year: '2026', volume: '12', issue: '1', pages: '27-35',
        doi: '10.xxxx/ijpeds.2026.005',
        abstract: 'Background: Antibiotic-associated diarrhea (AAD) is common in pediatric patients. This RCT evaluated the effectiveness of Lactobacillus rhamnosus GG in preventing AAD in children aged 1-12 years.',
        views: 1567, downloads: 432
    },
    {
        id: 6, type: 'letter', typeLabel: 'Letter to Editor',
        title: 'Comments on "Childhood Obesity Trends in Southeast Asia"',
        authors: 'Tanaka M',
        journal: 'Int J Pediatr',
        year: '2026', volume: '12', issue: '1', pages: '36-37',
        doi: '10.xxxx/ijpeds.2026.006',
        abstract: 'We read with interest the article by Lee et al. on childhood obesity trends. While the study provides valuable data, we believe certain methodological aspects warrant further discussion.',
        views: 432, downloads: 98
    },
    {
        id: 7, type: 'original', typeLabel: 'Original Article',
        title: 'Prevalence of Vitamin D Deficiency in School-Going Children: A Cross-Sectional Study',
        authors: 'Agarwal P, Mishra T, Yadav R',
        journal: 'Int J Pediatr',
        year: '2026', volume: '12', issue: '1', pages: '38-45',
        doi: '10.xxxx/ijpeds.2026.007',
        abstract: 'This cross-sectional study assessed vitamin D levels in 2,500 schoolchildren aged 6-14 years across urban and rural settings, revealing a high prevalence of deficiency.',
        views: 1890, downloads: 521
    },
    {
        id: 8, type: 'review', typeLabel: 'Review Article',
        title: 'Management of Pediatric Asthma: Updated Guidelines and Emerging Therapies',
        authors: 'Williams J, Brown K, Davis L',
        journal: 'Int J Pediatr',
        year: '2026', volume: '12', issue: '1', pages: '46-59',
        doi: '10.xxxx/ijpeds.2026.008',
        abstract: 'A comprehensive review of current pediatric asthma management guidelines, including GINA 2025 updates, biologic therapies, and digital health tools for asthma monitoring.',
        views: 2456, downloads: 678
    },
    {
        id: 9, type: 'case', typeLabel: 'Case Report',
        title: 'Successful Management of Kawasaki Disease Shock Syndrome in a 3-Year-Old',
        authors: 'Kim S, Park J, Lee H',
        journal: 'Int J Pediatr',
        year: '2026', volume: '12', issue: '1', pages: '60-64',
        doi: '10.xxxx/ijpeds.2026.009',
        abstract: 'Kawasaki disease shock syndrome (KDSS) is a rare but serious complication. We present a case of KDSS in a 3-year-old who responded well to IVIG and high-dose aspirin.',
        views: 934, downloads: 267
    },
    {
        id: 10, type: 'original', typeLabel: 'Original Article',
        title: 'Impact of COVID-19 Pandemic on Childhood Vaccination Rates: A Multi-Center Analysis',
        authors: 'Anderson M, Taylor R, Wilson B',
        journal: 'Int J Pediatr',
        year: '2025', volume: '11', issue: '4', pages: '210-219',
        doi: '10.xxxx/ijpeds.2025.042',
        abstract: 'This multi-center study analyzed vaccination coverage rates before, during, and after the COVID-19 pandemic across 15 pediatric centers.',
        views: 3210, downloads: 892
    },
    {
        id: 11, type: 'editorial', typeLabel: 'Editorial',
        title: 'The Future of Pediatric Telemedicine: Beyond the Pandemic',
        authors: 'Roberts C',
        journal: 'Int J Pediatr',
        year: '2025', volume: '11', issue: '4', pages: '207-209',
        doi: '10.xxxx/ijpeds.2025.041',
        abstract: 'Telemedicine adoption in pediatrics accelerated during COVID-19. This editorial examines which telemedicine practices should be retained.',
        views: 1678, downloads: 445
    },
    {
        id: 12, type: 'correspondence', typeLabel: 'Correspondence',
        title: 'Response to: Management of Acute Gastroenteritis in Children',
        authors: 'Singh R, Kapoor V',
        journal: 'Int J Pediatr',
        year: '2026', volume: '12', issue: '1', pages: '65-66',
        doi: '10.xxxx/ijpeds.2026.010',
        abstract: 'We appreciate the comments on our recent publication regarding acute gastroenteritis management. We address the concerns raised regarding ORS formulation and zinc supplementation.',
        views: 312, downloads: 67
    },
    {
        id: 13, type: 'clinical_quiz', typeLabel: 'Clinical Quiz',
        title: 'A 5-Year-Old with Recurrent Abdominal Pain and Failure to Thrive',
        authors: 'Editorial Board',
        journal: 'Int J Pediatr',
        year: '2026', volume: '12', issue: '1', pages: '67-68',
        doi: '10.xxxx/ijpeds.2026.011',
        abstract: 'A clinical quiz presenting a case of a 5-year-old with chronic abdominal pain, diarrhea, and poor weight gain. Can you identify the diagnosis?',
        views: 567, downloads: 134
    }
];

// ===== CATEGORY CONFIG =====
const categories = [
    { type: 'editorial', label: 'Editorial', icon: 'fas fa-pen-fancy' },
    { type: 'case', label: 'Case Report', icon: 'fas fa-notes-medical' },
    { type: 'commentary', label: 'Commentary', icon: 'fas fa-comment-dots' },
    { type: 'review', label: 'Review Article', icon: 'fas fa-book-open' },
    { type: 'original', label: 'Original Article', icon: 'fas fa-file-alt' },
    { type: 'letter', label: 'Letter to Editor', icon: 'fas fa-envelope-open-text' },
    { type: 'clinical_quiz', label: 'Clinical Quiz', icon: 'fas fa-question-circle' },
    { type: 'correspondence', label: 'Correspondence', icon: 'fas fa-mail-bulk' },
];

// ===== MOST READ =====
const mostReadArticles = [
    'Impact of COVID-19 Pandemic on Childhood Vaccination Rates',
    'Management of Pediatric Asthma: Updated Guidelines',
    'Advances in Gene Therapy for Pediatric Genetic Disorders',
    'Prevalence of Vitamin D Deficiency in School Children',
    'Effectiveness of Probiotics in Preventing AAD'
];

// ===== ALERTS DATA =====
const alertsData = [
    {
        type: 'info', icon: 'fas fa-info-circle',
        title: 'New Issue Published',
        message: 'Volume 12, Issue 1 (January-March 2026) is now available with 13 new articles.',
        date: 'March 15, 2026'
    },
    {
        type: 'success', icon: 'fas fa-check-circle',
        title: 'Journal Indexing Update',
        message: 'IJPEDS has been accepted for indexing in Scopus and PubMed Central.',
        date: 'February 28, 2026'
    },
    {
        type: 'warning', icon: 'fas fa-exclamation-triangle',
        title: 'Submission Deadline Extended',
        message: 'The submission deadline for the Special Issue on Pediatric Infectious Diseases has been extended to April 30, 2026.',
        date: 'February 20, 2026'
    },
    {
        type: 'info', icon: 'fas fa-calendar',
        title: 'Upcoming Webinar',
        message: 'Join us for a webinar on "Pediatric Vaccine Hesitancy: Clinical Strategies" on April 15, 2026.',
        date: 'February 10, 2026'
    },
    {
        type: 'success', icon: 'fas fa-trophy',
        title: 'Best Paper Award 2025',
        message: 'Congratulations to Dr. Anderson et al. for winning the Best Original Article award.',
        date: 'January 30, 2026'
    },
    {
        type: 'info', icon: 'fas fa-users',
        title: 'Call for Reviewers',
        message: 'We are expanding our reviewer panel. Interested pediatric specialists may apply.',
        date: 'January 15, 2026'
    }
];

// ===== ARCHIVE DATA =====
const archiveVolumes = [
    {
        volume: 'Volume 12', year: '2026',
        issues: [
            { label: 'Issue 1 (Jan-Mar 2026)', articles: 13 }
        ]
    },
    {
        volume: 'Volume 11', year: '2025',
        issues: [
            { label: 'Issue 4 (Oct-Dec 2025)', articles: 12 },
            { label: 'Issue 3 (Jul-Sep 2025)', articles: 11 },
            { label: 'Issue 2 (Apr-Jun 2025)', articles: 10 },
            { label: 'Issue 1 (Jan-Mar 2025)', articles: 9 }
        ]
    },
    {
        volume: 'Volume 10', year: '2024',
        issues: [
            { label: 'Issue 4 (Oct-Dec 2024)', articles: 11 },
            { label: 'Issue 3 (Jul-Sep 2024)', articles: 10 },
            { label: 'Issue 2 (Apr-Jun 2024)', articles: 12 },
            { label: 'Issue 1 (Jan-Mar 2024)', articles: 8 }
        ]
    },
    {
        volume: 'Volume 9', year: '2023',
        issues: [
            { label: 'Issue 4 (Oct-Dec 2023)', articles: 10 },
            { label: 'Issue 3 (Jul-Sep 2023)', articles: 9 },
            { label: 'Issue 2 (Apr-Jun 2023)', articles: 11 },
            { label: 'Issue 1 (Jan-Mar 2023)', articles: 10 }
        ]
    }
];
