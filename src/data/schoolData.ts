/**
 * ============================================================================
 * SRT SCHOOL – CENTRALIZED CONFIGURATION & CONTENT FILE
 * ============================================================================
 * Non-developers can easily edit school details, contact numbers, admission
 * dates, gallery photos, events, toppers, testimonials, and announcements here.
 */

export interface HeroSlide {
  id: string;
  image: string;
  subtitle: string;
  title: string;
  description: string;
  highlightMetric: string;
}

export interface WhyChooseItem {
  id: string;
  number: string;
  title: string;
  description: string;
  metric: string;
  iconName: 'GraduationCap' | 'MonitorPlay' | 'Trophy' | 'ShieldCheck' | 'Bus' | 'Palette';
  featured?: boolean;
}

export interface StatItem {
  id: string;
  label: string;
  value: number;
  suffix: string;
  detail: string;
}

export interface AdmissionStep {
  step: string;
  title: string;
  timeline: string;
  description: string;
}

export interface FacilityTab {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  highlights: string[];
  timings: string;
  capacity: string;
}

export type GalleryCategory = 'All' | 'Annual Day' | 'Sports Day' | 'Cultural' | 'Festivals' | 'Achievements';

export interface GalleryItem {
  id: string;
  title: string;
  category: Exclude<GalleryCategory, 'All'>;
  date: string;
  image: string;
  caption: string;
  aspect: 'wide' | 'tall' | 'standard';
}

export interface UpcomingEvent {
  id: string;
  date: string;
  month: string;
  day: string;
  title: string;
  category: string;
  time: string;
  venue: string;
  description: string;
}

export interface TopperItem {
  id: string;
  name: string;
  grade: string;
  score: string;
  stream: string;
  achievement: string;
}

export interface AwardItem {
  id: string;
  year: string;
  title: string;
  issuer: string;
  description: string;
}

export interface TestimonialItem {
  id: string;
  parentName: string;
  studentDetails: string;
  relationship: string;
  quote: string;
  outcome: string;
}

export interface NoticeItem {
  id: string;
  date: string;
  category: string;
  title: string;
  summary: string;
  fullText: string;
  attachmentLabel?: string;
}

export interface SocialPost {
  id: string;
  platform: 'Instagram' | 'YouTube';
  title: string;
  date: string;
  viewsOrLikes: string;
  image: string;
  duration?: string;
  link: string;
}

export interface AdditionalDetailItem {
  id: string;
  label: string;
  value: string;
}

export interface SchoolPermissions {
  siteTheme: 'light' | 'dark';
  showAnnouncementBanner: boolean;
  admissionsOpen: boolean;
  allowDocumentDownloads: boolean;
  showStatistics: boolean;
  showGallery: boolean;
  showAchievements: boolean;
  showNews: boolean;
  showSocialFeed: boolean;
  showFloatingWhatsApp: boolean;
}

// Local high-resolution generated assets
const IMG_CAMPUS = '/src/assets/images/hero_campus_main_1794568487684.jpg';
const IMG_CLASSROOM = '/src/assets/images/hero_smart_classroom_1794568487956.jpg';
const IMG_CORRESPONDENT = '/src/assets/images/correspondent_portrait_1794568490059.jpg';
const IMG_ROBOTICS = '/src/assets/images/science_robotics_lab_1794568491080.jpg';
const IMG_SPORTS = '/src/assets/images/sports_athletics_complex_1794568490686.jpg';

export const DEFAULT_ADMIN_PASSWORD = 'srtschool1527';

export const SCHOOL_CONFIG = {
  name: 'SRT School',
  tagline: 'Inspiring Young Minds Through Excellence, Integrity & Innovation',
  academicYear: '2026–2027',
  permissions: {
    siteTheme: 'light',
    showAnnouncementBanner: true,
    admissionsOpen: true,
    allowDocumentDownloads: true,
    showStatistics: true,
    showGallery: true,
    showAchievements: true,
    showNews: true,
    showSocialFeed: true,
    showFloatingWhatsApp: true
  } as SchoolPermissions,
  correspondent: {
    name: 'PRANAV.J',
    designation: 'Correspondent & Managing Trustee, SRT Educational Trust',
    qualifications: 'M.S. (Educational Leadership), B.Tech',
    photo: IMG_CORRESPONDENT,
    welcomeHeadline: 'Building Future Leaders Rooted in Values and Global Competence',
    welcomeMessage: [
      'At SRT School, we believe education is far more than the memorization of facts—it is the awakening of curiosity, resilience, and moral courage in every child. Over the past two decades, our campus has evolved into a vibrant learning ecosystem where timeless values meet twenty-first-century innovation.',
      'From our interactive digital classrooms and STEM robotics studio to our championship athletics track, every square foot of SRT School is designed so students discover their unique strengths. We partner closely with parents to ensure every learner graduates ready to lead with empathy and excellence.'
    ],
    quote: 'Every child enters our gates with boundless potential; our mission is to provide the wings, the compass, and the confidence to soar.'
  },
  boardAndMedium: 'CBSE & State Board · English & Tamil Medium',
  classesOffered: 'LKG to Class XII (Science, Commerce & Humanities)',
  affiliationCode: 'Affiliation No. 1930842 · School Code: 55412',
  contact: {
    addressLine1: 'SRT Universal School Campus, Sathyamangalam – Mettupalayam Road',
    addressLine2: 'Sirumugai / Mettupalayam Zone, Tamil Nadu 641302',
    phonePrimary: '+91 44 2745 8900',
    phoneAdmissions: '+91 98401 72500',
    emailGeneral: 'info@srtschool.edu.in',
    emailAdmissions: 'admissions@srtschool.edu.in',
    workingHours: 'Monday – Saturday: 8:15 AM to 4:30 PM (Office Open 8:00 AM – 5:30 PM)',
    locationShareLink: 'https://maps.app.goo.gl/MKFZvMQ8UKvrshGMA',
    googleMapsEmbedUrl:
      'https://maps.google.com/maps?q=11.3089232%2C76.9421433%20(SRT%20Universal%20School)&t=h&z=17&ie=UTF8&iwloc=&output=embed'
  },
  socials: {
    facebook: 'https://facebook.com/srtschool',
    instagram: 'https://instagram.com/srtschool',
    youtube: 'https://youtube.com/@srtschool',
    whatsappNumber: '919840172500',
    whatsappDisplay: '+91 98401 72500'
  },
  announcementsTicker: [
    'Admissions Open for Academic Year 2026–2027 (LKG to Class IX & Class XI)',
    '100% Distinction Record in Class X & XII Board Examinations for 8 Consecutive Years',
    'New AI & Robotics Innovation Center Inaugurated by Correspondent PRANAV.J',
    'Scholarship Entrance Test (SRT-SET) Registration Closes on April 25, 2026'
  ],
  heroSlides: [
    {
      id: 'slide-campus',
      image: IMG_CAMPUS,
      subtitle: 'CBSE & State Board · LKG to Class XII',
      title: 'Welcome to SRT School – Inspiring Young Minds',
      description:
        'A 12-acre green campus combining rigorous academic mentorship, next-generation STEM laboratories, and holistic character formation in English and Tamil mediums.',
      highlightMetric: 'Ranked #1 Holistic K-12 Campus in South Zone'
    },
    {
      id: 'slide-classroom',
      image: IMG_CLASSROOM,
      subtitle: 'Interactive Smart Pedagogy · 18:1 Student-Teacher Ratio',
      title: 'Where Curiosity Transforms Into Lifelong Mastery',
      description:
        'Concept-driven learning powered by interactive smart panels, experiential science kits, and personalized mentoring for every learner from foundational years to senior secondary.',
      highlightMetric: '100% Board Pass Rate with 94.6% School Average'
    },
    {
      id: 'slide-sports',
      image: IMG_SPORTS,
      subtitle: 'Championship Athletics & Co-Curricular Excellence',
      title: 'Nurturing Champions Inside and Beyond the Classroom',
      description:
        'Olympic-standard 400m synthetic track, FIFA-grade football turf, indoor badminton courts, and conservatory arts programs guided by national coaches.',
      highlightMetric: '42+ State & National Sports Medals in 2025–26'
    }
  ] as HeroSlide[],
  about: {
    historyTitle: 'A Legacy of Educational Excellence Since 2004',
    historyText:
      'Founded in 2004 under the aegis of the SRT Educational Trust, SRT School began with 180 students and a singular commitment: to deliver world-class education accessible to families seeking both academic rigor and cultural grounding. Today, under the dynamic leadership of Correspondent PRANAV.J, our 12-acre eco-friendly campus serves over 2,850 students from LKG to Class XII across CBSE and State Board streams.',
    vision:
      'To empower every student with intellectual curiosity, ethical leadership, scientific temper, and compassionate citizenship for an interconnected world.',
    mission: [
      'Deliver bilingual and English-medium conceptual mastery across STEM, commerce, humanities, and languages.',
      'Maintain a safe, inclusive, zero-tolerance-to-bullying campus with personalized mentorship and 18:1 student-faculty ratio.',
      'Integrate sports, fine arts, robotics, and community service into the daily timetable of every student.'
    ],
    keyHighlights: [
      { label: 'Campus Area', value: '12 Acres Eco-Green Zone' },
      { label: 'Class Size', value: 'Max 30 Students / Section' },
      { label: 'Streams Offered', value: 'CBSE & State Board (Eng/Tam)' },
      { label: 'Safety Standard', value: '160+ CCTV & GPS Bus Fleet' }
    ]
  },
  additionalDetails: [
    { id: 'add-1', label: 'UDISE+ School Code', value: '33030901425' },
    { id: 'add-2', label: 'Scholarship Entrance Exam', value: 'SRT-SET (Up to 100% Tuition Waiver)' },
    { id: 'add-3', label: 'Student Counseling & Infirmary', value: 'Full-Time Pediatric Nurse & Career Guidance Cell' },
    { id: 'add-4', label: 'Transport Coverage', value: '38 GPS Buses (30 km Radius Around Campus)' }
  ] as AdditionalDetailItem[],
  whyChooseUs: [
    {
      id: 'teachers',
      number: '01',
      title: 'Highly Qualified & Mentored Faculty',
      description:
        'Over 165 postgraduate educators trained in NEP-aligned experiential pedagogy, continuous formative assessment, and individualized student counseling.',
      metric: '18:1 Student–Teacher Ratio · 120+ Hrs Annual Faculty Training',
      iconName: 'GraduationCap',
      featured: true
    },
    {
      id: 'smart-class',
      number: '02',
      title: 'Interactive 4K Smart Classrooms',
      description:
        'Acoustic, daylight-optimized classrooms equipped with interactive touch panels, 3D visual simulations, and digital learning repositories.',
      metric: '85+ Digital Classrooms · Dual-Medium Resource Library',
      iconName: 'MonitorPlay'
    },
    {
      id: 'sports',
      number: '03',
      title: 'Championship Sports & Athletics Arena',
      description:
        '8-lane synthetic athletics track, floodlit football turf, basketball courts, skating rink, and indoor chess & table tennis academies.',
      metric: '6 Acres Dedicated Playfields · 14 Professional Coaches',
      iconName: 'Trophy',
      featured: true
    },
    {
      id: 'safety',
      number: '04',
      title: '360° Safe & Wellness-First Campus',
      description:
        'RFID student attendance with instant parent SMS alerts, 24/7 AI-assisted CCTV surveillance, full-time infirmary with qualified nurses, and RO drinking water.',
      metric: '100% RFID Gate Security · On-Campus Pediatric Infirmary',
      iconName: 'ShieldCheck'
    },
    {
      id: 'transport',
      number: '05',
      title: 'GPS-Tracked AC & Non-AC Bus Fleet',
      description:
        '38 school buses covering a 30 km radius with live parent app tracking, speed governors, onboard female attendants, and first-aid kits.',
      metric: '38 Routes Covered · Live Parent App Route Telemetry',
      iconName: 'Bus'
    },
    {
      id: 'activities',
      number: '06',
      title: 'Robotics, Performing Arts & Clubs',
      description:
        '22 student-led clubs including AI & Robotics, Carnatic & Western Music, Bharatanatyam, Debate, Eco-Sustainability, and Model United Nations.',
      metric: '22 Active Student Clubs · Weekly Club Hours Built In',
      iconName: 'Palette'
    }
  ] as WhyChooseItem[],
  statistics: [
    {
      id: 'students',
      label: 'Enrolled Students',
      value: 2850,
      suffix: '+',
      detail: 'Across LKG to Class XII in CBSE & State Board'
    },
    {
      id: 'teachers',
      label: 'Expert Educators',
      value: 165,
      suffix: '+',
      detail: 'Postgraduate & B.Ed certified subject specialists'
    },
    {
      id: 'years',
      label: 'Years of Excellence',
      value: 22,
      suffix: '',
      detail: 'Shaping scholars and citizens since 2004'
    },
    {
      id: 'results',
      label: 'Board Exam Pass Rate',
      value: 100,
      suffix: '%',
      detail: 'With 78% scoring Distinction (Above 90%)'
    }
  ] as StatItem[],
  admissions: {
    closedMessage:
      'Online admission registrations for the current cycle are closed. Please contact the SRT School Admissions Office directly for mid-term transfer or upcoming session enquiries.',
    steps: [
      {
        step: 'Step 01',
        title: 'Online Enquiry & Prospectus',
        timeline: 'Day 1',
        description:
          'Submit the online admission enquiry form below or visit the Admissions Desk on campus to receive the 2026–27 Prospectus and fee structure.'
      },
      {
        step: 'Step 02',
        title: 'Campus Tour & Academic Counseling',
        timeline: 'Within 3 Days',
        description:
          'Take a guided tour of our smart classrooms, labs, and sports complex with our Admissions Counselor and choose your preferred board/medium.'
      },
      {
        step: 'Step 03',
        title: 'Student Interaction / Skill Readiness',
        timeline: 'Saturday Slot',
        description:
          'Informal play-based interaction for Kindergarten (LKG/UKG) and foundational diagnostic interaction for Classes I to IX & XI.'
      },
      {
        step: 'Step 04',
        title: 'Document Verification & Enrollment',
        timeline: 'Within 5 Days of Offer',
        description:
          'Submit original documents for verification, complete the term-1 fee remittance, and collect the student welcome kit and ID credentials.'
      }
    ] as AdmissionStep[],
    eligibility: [
      { level: 'Kindergarten (LKG & UKG)', ageCriteria: 'LKG: 3+ years as on June 1, 2026 · UKG: 4+ years', medium: 'English Medium (Bilingual Support)' },
      { level: 'Primary Wing (Classes I – V)', ageCriteria: 'Class I: 5+ years as on June 1, 2026; Transfer Certificate from recognized school', medium: 'CBSE & State Board · English / Tamil Medium' },
      { level: 'Middle & High School (Classes VI – X)', ageCriteria: 'Previous two years academic report cards + EMIS number & Transfer Certificate', medium: 'CBSE & State Board · English / Tamil Medium' },
      { level: 'Senior Secondary (Classes XI & XII)', ageCriteria: 'Class X Board Marks Sheet; Streams: CS-Math, Bio-Math, Commerce-CA, Humanities', medium: 'CBSE & State Board · English / Tamil Medium' }
    ],
    requiredDocuments: [
      'Original Birth Certificate (plus 2 self-attested photocopies)',
      'Transfer Certificate (TC) & EMIS ID from the previous school (for Class I and above)',
      'Previous Academic Year Progress Report / Class X Mark Sheet (for Class XI)',
      'Aadhaar Card copy of the Student and both Parents/Guardians',
      'Community & Nativity Certificate copy (as per government norms)',
      'Blood Group Report & Medical Fitness Record + 5 Passport-size Photographs'
    ],
    feeHighlights:
      'Transparent 3-term fee structure with zero hidden charges. Merit scholarships up to 100% tuition waiver for Class X/XII toppers and State-level sports achievers.'
  },
  facilitiesTabs: [
    {
      id: 'classes',
      label: 'Smart Classrooms',
      title: 'Ergonomic, Daylight-Filled 4K Smart Classrooms',
      subtitle: 'Foundational, Preparatory, Middle & Secondary Wings',
      description:
        'Every classroom at SRT School is cross-ventilated, acoustically treated, and limited to 30 learners per section. Interactive 75-inch 4K flat panels bring physics simulations, historical maps, and bilingual language exercises to life.',
      image: IMG_CLASSROOM,
      highlights: [
        '75-inch 4K Interactive Panels with 3D Curriculum Modules',
        'Ergonomic posture-friendly seating & individual student lockers',
        'Dedicated English & Tamil Language Phonetics Corner',
        'Dual-camera lecture capture for revision on the Parent Portal'
      ],
      timings: '8:30 AM – 3:40 PM (Mon–Fri) · 8:30 AM – 12:45 PM (2nd/4th Sat Off)',
      capacity: 'Max 30 Students per Classroom (18:1 Faculty Ratio)'
    },
    {
      id: 'labs',
      label: 'STEM & Science Labs',
      title: 'Atal Tinkering, AI Robotics & Wet Science Laboratories',
      subtitle: 'Physics, Chemistry, Biology, Computer Science & Robotics',
      description:
        'Hands-on experimentation drives scientific temper at SRT. Our dedicated laboratories feature 3D printers, Arduino/Raspberry Pi kits, optical microscopes, fume hoods, and 120 high-speed workstations with gigabit fiber connectivity.',
      image: IMG_ROBOTICS,
      highlights: [
        'AI, Robotics & Drone Fabrication Studio with 3D Printers',
        'Separate NABL-grade Physics, Chemistry & Biology Wet Labs',
        '1:1 Computer Lab ratio with Python, Full-Stack & Data Science Curriculum',
        'Dedicated Math & Junior Discovery Lab for Classes III to VIII'
      ],
      timings: 'Open 8:00 AM – 5:00 PM including after-school Innovation Club hours',
      capacity: '35 Workstations per Lab with 2 Lab Instructors'
    },
    {
      id: 'library',
      label: 'Knowledge Library',
      title: 'Dr. A.P.J. Abdul Kalam Central Library & Digital Media Hub',
      subtitle: '32,000+ Volumes, Periodicals & Kindle E-Reading Stations',
      description:
        'Spread across 6,500 sq. ft., our sunlit double-height library houses over 32,000 print volumes in English and Tamil, international science journals, competitive exam archives (NEET, JEE, CUET, UPSC foundation), and quiet study pods.',
      image: IMG_CORRESPONDENT,
      highlights: [
        '32,000+ Print Books across Fiction, Science, Tamil Literature & Biographies',
        '24 Digital E-Library Terminals with National Digital Library access',
        'Dedicated Storytelling Amphitheater for Kindergarten & Primary students',
        'Weekly "Read & Reflect" book review sessions led by language faculty'
      ],
      timings: '8:00 AM – 5:15 PM (Extended Exam Prep Hours for Classes X–XII)',
      capacity: '180 Readers Simultaneously'
    },
    {
      id: 'sports',
      label: 'Sports Complex',
      title: '6-Acre Olympic-Standard Sports & Aquatics Arena',
      subtitle: 'Athletics, Football, Cricket, Basketball, Silambam & Indoor Games',
      description:
        'Physical fitness is treated on par with academics. Our sports complex includes a 400m 8-lane synthetic track, FIFA-approved natural turf, 4 synthetic basketball and tennis courts, cricket practice nets with bowling machines, and traditional Silambam & Yoga studios.',
      image: IMG_SPORTS,
      highlights: [
        '400m 8-Lane Synthetic Track & Floodlit Football Turf',
        '4 Synthetic Basketball & Lawn Tennis Courts + Skating Rink',
        'Indoor Badminton Arena, Chess Academy & Table Tennis Hall',
        'Complimentary Morning & Evening Special Coaching Camps'
      ],
      timings: 'Morning Camp: 6:30 AM – 8:00 AM · Evening Camp: 3:45 PM – 5:30 PM',
      capacity: '6 Acres Outdoor + 18,000 sq. ft. Indoor Sports Hall'
    },
    {
      id: 'transport',
      label: 'Safe Transport & Campus',
      title: 'GPS-Enabled Fleet, Infirmary & Eco-Green Infrastructure',
      subtitle: '38 Bus Routes Across Chennai & Suburbs',
      description:
        'Our yellow fleet of 38 Bharat-Stage VI buses covers all major residential neighborhoods within a 30 km radius. Parents receive real-time boarding notifications and live route maps on the SRT Parent App.',
      image: IMG_CAMPUS,
      highlights: [
        'Live GPS Tracking & RFID Boarding Alerts via SRT Parent Portal',
        'Trained Female Bus Attendants, Speed Governors & Dashcams in every bus',
        '100 kW Solar-Powered Campus with Rainwater Harvesting & Organic Garden',
        'Full-time 6-bed Medical Infirmary with tie-up to Apollo Children’s Hospital'
      ],
      timings: 'Morning Pickup: 7:05 AM – 8:10 AM · Afternoon Drop: 3:50 PM – 4:55 PM',
      capacity: '38 Buses Serving 140+ Verified Pickup Points'
    }
  ] as FacilityTab[],
  gallery: [
    {
      id: 'gal-1',
      title: '22nd Annual Day Grand Symphony & Prize Distribution',
      category: 'Annual Day',
      date: 'February 14, 2026',
      image: IMG_CAMPUS,
      caption: 'Over 900 students performed on the open-air amphitheater stage during the 22nd Annual Day presided over by Correspondent PRANAV.J.',
      aspect: 'wide'
    },
    {
      id: 'gal-2',
      title: 'Inter-House Track & Field Meet – 4x100m Relay Finals',
      category: 'Sports Day',
      date: 'January 24, 2026',
      image: IMG_SPORTS,
      caption: 'Chola House clinched the Overall Championship Trophy at the Annual Athletic Meet held on our 400m synthetic track.',
      aspect: 'tall'
    },
    {
      id: 'gal-3',
      title: 'South India Inter-School Robotics & AI Hackathon Winners',
      category: 'Achievements',
      date: 'December 18, 2025',
      image: IMG_ROBOTICS,
      caption: 'SRT School’s senior robotics team won the First Prize for their autonomous agricultural soil-testing rover.',
      aspect: 'standard'
    },
    {
      id: 'gal-4',
      title: 'Pongal & Tamil Heritage Cultural Confluence',
      category: 'Festivals',
      date: 'January 13, 2026',
      image: IMG_CLASSROOM,
      caption: 'Students and faculty celebrated Thai Pongal with traditional folk arts, Silambam demonstrations, and Tamil literary recitations.',
      aspect: 'standard'
    },
    {
      id: 'gal-5',
      title: 'Kalai Vizha – Classical Music & Bharatanatyam Showcase',
      category: 'Cultural',
      date: 'November 29, 2025',
      image: IMG_CAMPUS,
      caption: 'Middle and high school artists presenting an ensemble Varnam and Carnatic orchestra in the SRT Auditorium.',
      aspect: 'wide'
    },
    {
      id: 'gal-6',
      title: 'National Science Olympiad Gold Medalists Felicitation',
      category: 'Achievements',
      date: 'February 02, 2026',
      image: IMG_CORRESPONDENT,
      caption: 'Correspondent PRANAV.J felicitating 18 students who secured International Ranks in the Science & Mathematics Olympiad.',
      aspect: 'standard'
    }
  ] as GalleryItem[],
  upcomingEvents: [
    {
      id: 'evt-1',
      date: '2026-04-18',
      month: 'APR',
      day: '18',
      title: 'Open House & Campus Experience Day for 2026–27 Admissions',
      category: 'Admissions',
      time: '9:30 AM – 1:00 PM',
      venue: 'Main Auditorium & STEM Innovation Block',
      description: 'Prospective parents and students are invited for live robotics demos, faculty interaction, and on-the-spot scholarship counseling.'
    },
    {
      id: 'evt-2',
      date: '2026-04-25',
      month: 'APR',
      day: '25',
      title: 'SRT Scholarship & Talent Entrance Test (SRT-SET 2026)',
      category: 'Academics',
      time: '10:00 AM – 12:00 PM',
      venue: 'Academic Block B (Classes VI to XI Aspirants)',
      description: 'Annual merit scholarship examination offering up to 100% tuition fee waiver for meritorious students.'
    },
    {
      id: 'evt-3',
      date: '2026-05-04',
      month: 'MAY',
      day: '04',
      title: 'Summer Sports, Robotics & Theatre Camp Inauguration',
      category: 'Co-Curricular',
      time: '7:30 AM – 11:30 AM',
      venue: 'SRT Sports Arena & Maker Lab',
      description: '3-week intensive skill camp in athletics, swimming, drone coding, and public speaking.'
    }
  ] as UpcomingEvent[],
  toppers: [
    {
      id: 'top-1',
      name: 'Harini Sundaram',
      grade: 'Class XII (CBSE – Science)',
      score: '497 / 500 (99.4%)',
      stream: 'Centum in Physics, Chemistry & Mathematics',
      achievement: 'Admitted to IIT Madras (B.Tech Computer Science)'
    },
    {
      id: 'top-2',
      name: 'Kavin Rajasekaran',
      grade: 'Class XII (State Board – Bio-Math)',
      score: '596 / 600 (99.3%)',
      stream: 'Centum in Biology, Chemistry & Mathematics',
      achievement: 'District 1st Rank · NEET Score 705/720'
    },
    {
      id: 'top-3',
      name: 'Aadhya Narayanan',
      grade: 'Class X (CBSE)',
      score: '498 / 500 (99.6%)',
      stream: 'Centum in Science, Social Science & Tamil',
      achievement: 'National Science Talent Search Scholar'
    },
    {
      id: 'top-4',
      name: 'Mohammed Farhan',
      grade: 'Class XII (Commerce & Accountancy)',
      score: '495 / 500 (99.0%)',
      stream: 'Centum in Accountancy, Economics & Business Studies',
      achievement: 'State Topper in Commerce Stream'
    }
  ] as TopperItem[],
  awards: [
    {
      id: 'awd-1',
      year: '2025–2026',
      title: 'Best Holistic K-12 School in Tamil Nadu Award',
      issuer: 'EducationWorld India School Rankings',
      description: 'Recognized for integrating STEM innovation, bilingual literacy, and national-level sports infrastructure.'
    },
    {
      id: 'awd-2',
      year: '2025',
      title: 'Green School Platinum Certification',
      issuer: 'Centre for Science and Environment (CSE)',
      description: 'Awarded for 100% solar energy utilization, zero-plastic cafeteria, and campus rainwater recharge.'
    },
    {
      id: 'awd-3',
      year: '2024–2025',
      title: 'Atal Tinkering Lab School of the Year (South Region)',
      issuer: 'NITI Aayog – Atal Innovation Mission',
      description: 'Honored for filing 4 student utility patents in assistive healthcare and sustainable agriculture.'
    }
  ] as AwardItem[],
  testimonials: [
    {
      id: 'test-1',
      parentName: 'Dr. Senthil Kumar & Mrs. Revathi Senthil',
      studentDetails: 'Parents of Pranav S. (Class XI – Science) & Diya S. (Class VI)',
      relationship: 'SRT Parents for 7 Years',
      quote:
        'When we moved my son to SRT School in Class V, he was hesitant to speak on stage. The personalized mentoring from teachers and the weekly STEM & Debate clubs transformed his confidence completely. He scored 98.4% in his Class X Boards and won the Regional Robotics Trophy.',
      outcome: '98.4% in Class X Boards & Regional Robotics Winner'
    },
    {
      id: 'test-2',
      parentName: 'Mr. Vigneshwaran M. (Senior Architect)',
      studentDetails: 'Parent of Sahana V. (Class IX – CBSE)',
      relationship: 'SRT Parent for 5 Years',
      quote:
        'What sets SRT School apart under Correspondent PRANAV.J is the equal respect given to Tamil heritage, English communication, and modern science. The GPS bus tracking and regular parent-teacher coffee meets give us complete peace of mind every single day.',
      outcome: 'State-Level Bharatanatyam & Olympiad Achiever'
    },
    {
      id: 'test-3',
      parentName: 'Mrs. Lakshmi Priya & Mr. Karthikeyan R.',
      studentDetails: 'Parents of Aadhi K. (UKG)',
      relationship: 'Kindergarten Parents',
      quote:
        'Our son looks forward to going to school every morning! The Kindergarten wing feels warm, safe, and joyful. Without any rote pressure, he now reads bilingual storybooks and loves his weekly gardening and music sessions.',
      outcome: 'Stress-free Montessori & Activity-Based Foundation'
    }
  ] as TestimonialItem[],
  notices: [
    {
      id: 'not-1',
      date: 'March 15, 2026',
      category: 'Admissions Circular',
      title: 'Phase II Admission Schedule & Scholarship Test (SRT-SET) for 2026–27',
      summary:
        'Applications are invited for LKG to Class IX and Class XI (CBSE & State Board, English & Tamil Medium). Register before April 25, 2026.',
      fullText:
        'Dear Parents, Phase II admissions for the academic year 2026–2027 are currently open across LKG to Class IX and Class XI. Limited seats are available in each section to maintain our strict 30-student classroom cap. Students applying for Classes VI to XI can also opt for the SRT Scholarship Entrance Test (SRT-SET) scheduled on April 25, 2026 at 10:00 AM.',
      attachmentLabel: 'Download Admission Circular'
    },
    {
      id: 'not-2',
      date: 'March 08, 2026',
      category: 'Academic Achievement',
      title: 'SRT Students Secure 18 Gold Medals in National Science & Cyber Olympiad',
      summary:
        'Congratulations to our middle and high school scholars for securing 18 Gold, 24 Silver, and 31 Bronze medals in the 2025–26 Olympiad cycle.',
      fullText:
        'We are proud to announce that 73 students from Classes IV to XII achieved zonal and national honors in the National Science, Mathematics, and Cyber Olympiads. Special commendation to Harini Sundaram (Class XII) and Roshan K. (Class VIII) for achieving State Rank 1.',
      attachmentLabel: 'View Honor Roll'
    },
    {
      id: 'not-3',
      date: 'February 26, 2026',
      category: 'Campus Update',
      title: 'New Electric GPS Bus Routes Added for Medavakkam, Chromepet & Guduvancheri',
      summary:
        'Three new low-noise AC buses with live parent tracking will commence service from the June 2026 academic session.',
      fullText:
        'To serve families residing in southern and eastern corridors, the Transport Department has added Route 36 (Medavakkam–Sithalapakkam), Route 37 (Chromepet–MIT Gate), and Route 38 (Guduvancheri–Urapakkam). Route timings and stop lists are available at the Transport Desk.',
      attachmentLabel: 'View Bus Route Map'
    }
  ] as NoticeItem[],
  socialFeed: [
    {
      id: 'soc-1',
      platform: 'YouTube',
      title: 'Campus Tour 2026: Inside SRT School’s 12-Acre Green Campus & Robotics Studio',
      date: '2 weeks ago',
      viewsOrLikes: '48.2K views',
      image: IMG_CAMPUS,
      duration: '06:42',
      link: 'https://youtube.com/@srtschool'
    },
    {
      id: 'soc-2',
      platform: 'Instagram',
      title: 'Highlights from our 22nd Annual Sports Meet – Energy, Teamwork & Sportsmanship!',
      date: '5 days ago',
      viewsOrLikes: '3,410 likes',
      image: IMG_SPORTS,
      link: 'https://instagram.com/srtschool'
    },
    {
      id: 'soc-3',
      platform: 'Instagram',
      title: 'Class VIII Innovators testing their solar-powered water purifier in the STEM Lab',
      date: '1 week ago',
      viewsOrLikes: '2,890 likes',
      image: IMG_ROBOTICS,
      link: 'https://instagram.com/srtschool'
    },
    {
      id: 'soc-4',
      platform: 'YouTube',
      title: 'Correspondent PRANAV.J’s Address on NEP 2020, Bilingual Mastery & Future Skills',
      date: '3 weeks ago',
      viewsOrLikes: '31.5K views',
      image: IMG_CLASSROOM,
      duration: '11:15',
      link: 'https://youtube.com/@srtschool'
    }
  ] as SocialPost[]
};
