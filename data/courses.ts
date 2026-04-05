export interface Course {
  crn: string;
  code: string;
  title: string;
  instructor: string;
  units: number;
  days: string[];    // ["Mon", "Wed"] etc. Empty = async/online
  startTime: string; // "08:00" — "00:00" if async
  endTime: string;   // "09:25" — "00:00" if async
  location: string;
  mode: "in-person" | "online" | "hybrid";
  requirement?: string; // degree/IGETC requirement it satisfies
  seats: number;
  enrolled: number;
  term: string; // e.g. "Spring 2025"
}

// ─── Spring 2026 ─────────────────────────────────────────────────────────────
const spring2026: Course[] = [
  // Area 1A – English Composition
  {
    crn: "61001", code: "ENGL 001A", title: "Reading and Composition",
    instructor: "Patricia Moore", units: 4, days: ["Mon", "Wed"],
    startTime: "09:00", endTime: "10:50", location: "L 201",
    mode: "in-person", requirement: "IGETC Area 1A – English Composition",
    seats: 28, enrolled: 10, term: "Spring 2026",
  },
  {
    crn: "61002", code: "ENGL 001AH", title: "Reading and Composition – Honors",
    instructor: "Diana Walsh", units: 4, days: ["Tue", "Thu"],
    startTime: "10:00", endTime: "11:50", location: "L 110",
    mode: "in-person", requirement: "IGETC Area 1A – English Composition",
    seats: 22, enrolled: 8, term: "Spring 2026",
  },
  // Area 1B – Critical Thinking
  {
    crn: "61010", code: "ENGL 001C", title: "Critical Thinking and Writing",
    instructor: "Robert Fields", units: 4, days: ["Mon", "Wed", "Fri"],
    startTime: "11:00", endTime: "11:50", location: "L 205",
    mode: "in-person", requirement: "IGETC Area 1B – Critical Thinking",
    seats: 28, enrolled: 12, term: "Spring 2026",
  },
  {
    crn: "61011", code: "PHIL 006", title: "Introduction to Logic",
    instructor: "Marcus Webb", units: 3, days: ["Tue", "Thu"],
    startTime: "13:00", endTime: "14:25", location: "SS 201",
    mode: "in-person", requirement: "IGETC Area 1B – Critical Thinking",
    seats: 35, enrolled: 18, term: "Spring 2026",
  },
  // Area 1C – Oral Communication
  {
    crn: "61020", code: "COMM 001", title: "Public Speaking",
    instructor: "Thomas Bell", units: 3, days: ["Mon", "Wed"],
    startTime: "12:00", endTime: "13:25", location: "P 310",
    mode: "in-person", requirement: "IGETC Area 1C – Oral Communication",
    seats: 25, enrolled: 9, term: "Spring 2026",
  },
  // Area 2 – Mathematics
  {
    crn: "61030", code: "MATH 015", title: "Statistics",
    instructor: "Lisa Park", units: 4, days: ["Mon", "Wed"],
    startTime: "08:00", endTime: "09:50", location: "GM 201",
    mode: "in-person", requirement: "IGETC Area 2 – Mathematical Concepts",
    seats: 35, enrolled: 14, term: "Spring 2026",
  },
  {
    crn: "61031", code: "MATH 055", title: "Precalculus",
    instructor: "Alan Nguyen", units: 5, days: ["Mon", "Wed", "Fri"],
    startTime: "10:00", endTime: "10:50", location: "GM 105",
    mode: "in-person", requirement: "IGETC Area 2 – Mathematical Concepts",
    seats: 32, enrolled: 20, term: "Spring 2026",
  },
  {
    crn: "61032", code: "MATH 005A", title: "Calculus I",
    instructor: "David Torres", units: 5, days: ["Tue", "Thu"],
    startTime: "08:00", endTime: "10:15", location: "GM 110",
    mode: "in-person", requirement: "IGETC Area 2 – Mathematical Concepts",
    seats: 30, enrolled: 11, term: "Spring 2026",
  },
  // Area 3A – Arts
  {
    crn: "61040", code: "ART 004", title: "Introduction to Drawing",
    instructor: "Claire Fontaine", units: 3, days: ["Tue", "Thu"],
    startTime: "09:00", endTime: "11:05", location: "ART 210",
    mode: "in-person", requirement: "IGETC Area 3A – Arts",
    seats: 24, enrolled: 10, term: "Spring 2026",
  },
  {
    crn: "61041", code: "THEA 001", title: "Introduction to Theatre",
    instructor: "Gloria Reyes", units: 3, days: ["Mon", "Wed", "Fri"],
    startTime: "13:00", endTime: "13:50", location: "THEA 100",
    mode: "in-person", requirement: "IGETC Area 3A – Arts",
    seats: 40, enrolled: 22, term: "Spring 2026",
  },
  // Area 3B – Humanities
  {
    crn: "61050", code: "PHIL 001", title: "Introduction to Philosophy",
    instructor: "Marcus Webb", units: 3, days: ["Mon", "Wed"],
    startTime: "14:00", endTime: "15:25", location: "SS 201",
    mode: "in-person", requirement: "IGETC Area 3B – Humanities",
    seats: 35, enrolled: 15, term: "Spring 2026",
  },
  {
    crn: "61051", code: "HIST 001A", title: "History of Western Civilization I",
    instructor: "Kevin Okafor", units: 3, days: ["Tue", "Thu"],
    startTime: "11:00", endTime: "12:25", location: "SS 105",
    mode: "in-person", requirement: "IGETC Area 3B – Humanities",
    seats: 40, enrolled: 18, term: "Spring 2026",
  },
  {
    crn: "61052", code: "ENGL 002", title: "Critical Analysis Through Literature",
    instructor: "Diana Walsh", units: 3, days: [],
    startTime: "00:00", endTime: "00:00", location: "Online",
    mode: "online", requirement: "IGETC Area 3B – Humanities",
    seats: 30, enrolled: 20, term: "Spring 2026",
  },
  // Area 4 – Social & Behavioral Sciences
  {
    crn: "61060", code: "PSYC 001", title: "Introduction to Psychology",
    instructor: "Sarah Bloom", units: 3, days: ["Mon", "Wed", "Fri"],
    startTime: "10:00", endTime: "10:50", location: "P 105",
    mode: "in-person", requirement: "IGETC Area 4 – Social & Behavioral Sciences",
    seats: 45, enrolled: 20, term: "Spring 2026",
  },
  {
    crn: "61061", code: "ECON 001A", title: "Principles of Macroeconomics",
    instructor: "Jonathan Price", units: 3, days: ["Tue", "Thu"],
    startTime: "14:00", endTime: "15:25", location: "C 302",
    mode: "in-person", requirement: "IGETC Area 4 – Social & Behavioral Sciences",
    seats: 40, enrolled: 16, term: "Spring 2026",
  },
  {
    crn: "61062", code: "POLS 001", title: "Introduction to Political Science",
    instructor: "Nicole Foster", units: 3, days: [],
    startTime: "00:00", endTime: "00:00", location: "Online",
    mode: "online", requirement: "IGETC Area 4 – Social & Behavioral Sciences",
    seats: 40, enrolled: 25, term: "Spring 2026",
  },
  {
    crn: "61063", code: "ANTH 001", title: "Physical Anthropology",
    instructor: "Rita Sandoval", units: 3, days: ["Mon", "Wed"],
    startTime: "15:30", endTime: "16:55", location: "SS 310",
    mode: "in-person", requirement: "IGETC Area 4 – Social & Behavioral Sciences",
    seats: 35, enrolled: 12, term: "Spring 2026",
  },
  // Area 5A – Physical Sciences
  {
    crn: "61070", code: "PHYS 001A", title: "Introductory Physics I",
    instructor: "Howard Kim", units: 4, days: ["Mon", "Wed"],
    startTime: "09:00", endTime: "10:50", location: "SCI 220",
    mode: "in-person", requirement: "IGETC Area 5A – Physical Sciences",
    seats: 30, enrolled: 18, term: "Spring 2026",
  },
  {
    crn: "61071", code: "ASTR 001", title: "Introductory Astronomy",
    instructor: "Maria Santos", units: 3, days: ["Tue", "Thu"],
    startTime: "12:30", endTime: "13:55", location: "SCI 110",
    mode: "in-person", requirement: "IGETC Area 5A – Physical Sciences",
    seats: 40, enrolled: 22, term: "Spring 2026",
  },
  // Area 5B – Biological Sciences
  {
    crn: "61080", code: "BIOL 003", title: "Introduction to Biology",
    instructor: "Vanessa Park", units: 4, days: ["Mon", "Wed"],
    startTime: "11:00", endTime: "12:50", location: "SCI 305",
    mode: "in-person", requirement: "IGETC Area 5B – Biological Sciences",
    seats: 32, enrolled: 14, term: "Spring 2026",
  },
  {
    crn: "61081", code: "BIOL 001", title: "Biology for Non-Majors",
    instructor: "Vanessa Park", units: 3, days: [],
    startTime: "00:00", endTime: "00:00", location: "Online",
    mode: "online", requirement: "IGETC Area 5B – Biological Sciences",
    seats: 35, enrolled: 28, term: "Spring 2026",
  },
  // Area 6 – Languages Other Than English
  {
    crn: "61090", code: "SPAN 001", title: "Elementary Spanish I",
    instructor: "Isabel Cruz", units: 5, days: ["Mon", "Wed", "Fri"],
    startTime: "09:00", endTime: "09:50", location: "L 310",
    mode: "in-person", requirement: "IGETC Area 6 – Languages Other Than English",
    seats: 30, enrolled: 16, term: "Spring 2026",
  },
  {
    crn: "61091", code: "FREN 001", title: "Elementary French I",
    instructor: "Sophie Laurent", units: 5, days: ["Tue", "Thu"],
    startTime: "09:00", endTime: "11:15", location: "L 208",
    mode: "in-person", requirement: "IGETC Area 6 – Languages Other Than English",
    seats: 28, enrolled: 10, term: "Spring 2026",
  },
  // Business / CS
  {
    crn: "61100", code: "BUS 001", title: "Introduction to Business",
    instructor: "Daniel Raddon", units: 3, days: ["Mon", "Wed"],
    startTime: "13:00", endTime: "14:25", location: "C 205",
    mode: "in-person", requirement: "Business Core",
    seats: 35, enrolled: 18, term: "Spring 2026",
  },
  {
    crn: "61101", code: "ACCT 001A", title: "Financial Accounting",
    instructor: "Karen Harmon", units: 4, days: ["Tue", "Thu"],
    startTime: "08:00", endTime: "10:05", location: "R 304",
    mode: "in-person", requirement: "Accounting Core",
    seats: 40, enrolled: 22, term: "Spring 2026",
  },
  {
    crn: "61110", code: "CS 002", title: "Python Programming",
    instructor: "Jason Lee", units: 3, days: ["Mon", "Wed"],
    startTime: "16:00", endTime: "17:25", location: "CS 110",
    mode: "in-person", requirement: "CS Core",
    seats: 30, enrolled: 13, term: "Spring 2026",
  },
];

// ─── Summer 2026 ─────────────────────────────────────────────────────────────
const summer2026: Course[] = [
  {
    crn: "71001", code: "ENGL 001A", title: "Reading and Composition",
    instructor: "Robert Fields", units: 4, days: ["Mon", "Tue", "Wed", "Thu"],
    startTime: "09:00", endTime: "10:30", location: "L 201",
    mode: "in-person", requirement: "IGETC Area 1A – English Composition",
    seats: 25, enrolled: 8, term: "Summer 2026",
  },
  {
    crn: "71002", code: "ENGL 001C", title: "Critical Thinking and Writing",
    instructor: "Patricia Moore", units: 4, days: [],
    startTime: "00:00", endTime: "00:00", location: "Online",
    mode: "online", requirement: "IGETC Area 1B – Critical Thinking",
    seats: 28, enrolled: 15, term: "Summer 2026",
  },
  {
    crn: "71010", code: "MATH 015", title: "Statistics",
    instructor: "Alan Nguyen", units: 4, days: ["Mon", "Tue", "Wed", "Thu"],
    startTime: "08:00", endTime: "09:30", location: "GM 201",
    mode: "in-person", requirement: "IGETC Area 2 – Mathematical Concepts",
    seats: 30, enrolled: 12, term: "Summer 2026",
  },
  {
    crn: "71011", code: "MATH 005A", title: "Calculus I",
    instructor: "Lisa Park", units: 5, days: ["Mon", "Tue", "Wed", "Thu"],
    startTime: "10:00", endTime: "11:50", location: "GM 105",
    mode: "in-person", requirement: "IGETC Area 2 – Mathematical Concepts",
    seats: 28, enrolled: 9, term: "Summer 2026",
  },
  {
    crn: "71020", code: "PSYC 001", title: "Introduction to Psychology",
    instructor: "Michael Grant", units: 3, days: [],
    startTime: "00:00", endTime: "00:00", location: "Online",
    mode: "online", requirement: "IGETC Area 4 – Social & Behavioral Sciences",
    seats: 50, enrolled: 30, term: "Summer 2026",
  },
  {
    crn: "71021", code: "SOC 001", title: "Introduction to Sociology",
    instructor: "Angela Rivera", units: 3, days: [],
    startTime: "00:00", endTime: "00:00", location: "Online",
    mode: "online", requirement: "IGETC Area 4 – Social & Behavioral Sciences",
    seats: 40, enrolled: 22, term: "Summer 2026",
  },
  {
    crn: "71030", code: "BIOL 001", title: "Biology for Non-Majors",
    instructor: "Vanessa Park", units: 3, days: ["Mon", "Tue", "Wed", "Thu"],
    startTime: "12:00", endTime: "13:30", location: "SCI 305",
    mode: "in-person", requirement: "IGETC Area 5B – Biological Sciences",
    seats: 32, enrolled: 14, term: "Summer 2026",
  },
  {
    crn: "71040", code: "HIST 001A", title: "History of Western Civilization I",
    instructor: "Kevin Okafor", units: 3, days: [],
    startTime: "00:00", endTime: "00:00", location: "Online",
    mode: "online", requirement: "IGETC Area 3B – Humanities",
    seats: 35, enrolled: 18, term: "Summer 2026",
  },
  {
    crn: "71050", code: "SPAN 001", title: "Elementary Spanish I",
    instructor: "Isabel Cruz", units: 5, days: ["Mon", "Tue", "Wed", "Thu"],
    startTime: "09:00", endTime: "10:20", location: "L 310",
    mode: "in-person", requirement: "IGETC Area 6 – Languages Other Than English",
    seats: 28, enrolled: 11, term: "Summer 2026",
  },
  {
    crn: "71060", code: "BUS 001", title: "Introduction to Business",
    instructor: "Sandra Kim", units: 3, days: [],
    startTime: "00:00", endTime: "00:00", location: "Online",
    mode: "online", requirement: "Business Core",
    seats: 40, enrolled: 20, term: "Summer 2026",
  },
  {
    crn: "71070", code: "CS 001", title: "Introduction to Computer Science",
    instructor: "Priya Sharma", units: 3, days: ["Mon", "Tue", "Wed", "Thu"],
    startTime: "14:00", endTime: "15:20", location: "CS 110",
    mode: "in-person", requirement: "CS Core",
    seats: 28, enrolled: 16, term: "Summer 2026",
  },
  {
    crn: "71080", code: "COMM 001", title: "Public Speaking",
    instructor: "Vanessa Ruiz", units: 3, days: ["Mon", "Tue", "Wed", "Thu"],
    startTime: "11:00", endTime: "12:20", location: "P 310",
    mode: "in-person", requirement: "IGETC Area 1C – Oral Communication",
    seats: 25, enrolled: 10, term: "Summer 2026",
  },
];

// ─── Fall 2026 ───────────────────────────────────────────────────────────────
const fall2026: Course[] = [
  // Area 1A – English Composition
  {
    crn: "81001", code: "ENGL 001A", title: "Reading and Composition",
    instructor: "Patricia Moore", units: 4, days: ["Mon", "Wed"],
    startTime: "08:00", endTime: "09:50", location: "L 201",
    mode: "in-person", requirement: "IGETC Area 1A – English Composition",
    seats: 28, enrolled: 5, term: "Fall 2026",
  },
  {
    crn: "81002", code: "ENGL 001A", title: "Reading and Composition",
    instructor: "Robert Fields", units: 4, days: [],
    startTime: "00:00", endTime: "00:00", location: "Online",
    mode: "online", requirement: "IGETC Area 1A – English Composition",
    seats: 30, enrolled: 12, term: "Fall 2026",
  },
  // Area 1B – Critical Thinking
  {
    crn: "81010", code: "PHIL 006", title: "Introduction to Logic",
    instructor: "Marcus Webb", units: 3, days: ["Tue", "Thu"],
    startTime: "09:30", endTime: "10:55", location: "SS 201",
    mode: "in-person", requirement: "IGETC Area 1B – Critical Thinking",
    seats: 35, enrolled: 8, term: "Fall 2026",
  },
  {
    crn: "81011", code: "ENGL 001C", title: "Critical Thinking and Writing",
    instructor: "Diana Walsh", units: 4, days: ["Mon", "Wed", "Fri"],
    startTime: "10:00", endTime: "10:50", location: "L 110",
    mode: "in-person", requirement: "IGETC Area 1B – Critical Thinking",
    seats: 28, enrolled: 10, term: "Fall 2026",
  },
  // Area 1C – Oral Communication
  {
    crn: "81020", code: "COMM 001", title: "Public Speaking",
    instructor: "Thomas Bell", units: 3, days: ["Mon", "Wed"],
    startTime: "13:00", endTime: "14:25", location: "P 310",
    mode: "in-person", requirement: "IGETC Area 1C – Oral Communication",
    seats: 25, enrolled: 6, term: "Fall 2026",
  },
  {
    crn: "81021", code: "COMM 010", title: "Interpersonal Communication",
    instructor: "Vanessa Ruiz", units: 3, days: ["Tue", "Thu"],
    startTime: "15:30", endTime: "16:55", location: "P 205",
    mode: "in-person", requirement: "IGETC Area 1C – Oral Communication",
    seats: 30, enrolled: 4, term: "Fall 2026",
  },
  // Area 2 – Mathematics
  {
    crn: "81030", code: "MATH 015", title: "Statistics",
    instructor: "David Torres", units: 4, days: ["Mon", "Wed"],
    startTime: "11:00", endTime: "12:50", location: "GM 201",
    mode: "in-person", requirement: "IGETC Area 2 – Mathematical Concepts",
    seats: 35, enrolled: 9, term: "Fall 2026",
  },
  {
    crn: "81031", code: "MATH 015", title: "Statistics",
    instructor: "Lisa Park", units: 4, days: [],
    startTime: "00:00", endTime: "00:00", location: "Online",
    mode: "online", requirement: "IGETC Area 2 – Mathematical Concepts",
    seats: 40, enrolled: 18, term: "Fall 2026",
  },
  {
    crn: "81032", code: "MATH 005B", title: "Calculus II",
    instructor: "Alan Nguyen", units: 5, days: ["Mon", "Wed", "Fri"],
    startTime: "09:00", endTime: "09:50", location: "GM 105",
    mode: "in-person", requirement: "IGETC Area 2 – Mathematical Concepts",
    seats: 30, enrolled: 7, term: "Fall 2026",
  },
  // Area 3A – Arts
  {
    crn: "81040", code: "MUS 001", title: "Music Appreciation",
    instructor: "Raymond Cho", units: 3, days: ["Mon", "Wed", "Fri"],
    startTime: "10:00", endTime: "10:50", location: "MUS 105",
    mode: "in-person", requirement: "IGETC Area 3A – Arts",
    seats: 40, enrolled: 12, term: "Fall 2026",
  },
  {
    crn: "81041", code: "ART 001", title: "Art History Survey",
    instructor: "Claire Fontaine", units: 3, days: ["Tue", "Thu"],
    startTime: "12:30", endTime: "13:55", location: "ART 101",
    mode: "in-person", requirement: "IGETC Area 3A – Arts",
    seats: 35, enrolled: 10, term: "Fall 2026",
  },
  {
    crn: "81042", code: "DANC 001", title: "Introduction to Dance",
    instructor: "Carmen Estrada", units: 3, days: ["Tue", "Thu"],
    startTime: "09:00", endTime: "10:25", location: "PE 105",
    mode: "in-person", requirement: "IGETC Area 3A – Arts",
    seats: 30, enrolled: 8, term: "Fall 2026",
  },
  // Area 3B – Humanities
  {
    crn: "81050", code: "HIST 020", title: "U.S. History to 1877",
    instructor: "Kevin Okafor", units: 3, days: ["Mon", "Wed", "Fri"],
    startTime: "11:00", endTime: "11:50", location: "SS 105",
    mode: "in-person", requirement: "IGETC Area 3B – Humanities",
    seats: 40, enrolled: 14, term: "Fall 2026",
  },
  {
    crn: "81051", code: "PHIL 001", title: "Introduction to Philosophy",
    instructor: "Marcus Webb", units: 3, days: [],
    startTime: "00:00", endTime: "00:00", location: "Online",
    mode: "online", requirement: "IGETC Area 3B – Humanities",
    seats: 35, enrolled: 20, term: "Fall 2026",
  },
  {
    crn: "81052", code: "ENGL 002", title: "Critical Analysis Through Literature",
    instructor: "Diana Walsh", units: 3, days: ["Tue", "Thu"],
    startTime: "14:00", endTime: "15:25", location: "L 205",
    mode: "in-person", requirement: "IGETC Area 3B – Humanities",
    seats: 28, enrolled: 9, term: "Fall 2026",
  },
  // Area 4 – Social & Behavioral Sciences
  {
    crn: "81060", code: "PSYC 001", title: "Introduction to Psychology",
    instructor: "Michael Grant", units: 3, days: ["Mon", "Wed", "Fri"],
    startTime: "13:00", endTime: "13:50", location: "P 105",
    mode: "in-person", requirement: "IGETC Area 4 – Social & Behavioral Sciences",
    seats: 45, enrolled: 15, term: "Fall 2026",
  },
  {
    crn: "81061", code: "ECON 001B", title: "Principles of Microeconomics",
    instructor: "Jonathan Price", units: 3, days: ["Tue", "Thu"],
    startTime: "11:00", endTime: "12:25", location: "C 302",
    mode: "in-person", requirement: "IGETC Area 4 – Social & Behavioral Sciences",
    seats: 40, enrolled: 11, term: "Fall 2026",
  },
  {
    crn: "81062", code: "GEOG 001", title: "Physical Geography",
    instructor: "Daniel Cruz", units: 3, days: ["Mon", "Wed"],
    startTime: "14:30", endTime: "15:55", location: "SS 220",
    mode: "in-person", requirement: "IGETC Area 4 – Social & Behavioral Sciences",
    seats: 35, enrolled: 8, term: "Fall 2026",
  },
  {
    crn: "81063", code: "ANTH 002", title: "Cultural Anthropology",
    instructor: "Rita Sandoval", units: 3, days: [],
    startTime: "00:00", endTime: "00:00", location: "Online",
    mode: "online", requirement: "IGETC Area 4 – Social & Behavioral Sciences",
    seats: 35, enrolled: 16, term: "Fall 2026",
  },
  // Area 5A – Physical Sciences
  {
    crn: "81070", code: "CHEM 001A", title: "General Chemistry I",
    instructor: "Howard Kim", units: 5, days: ["Mon", "Wed", "Fri"],
    startTime: "08:00", endTime: "08:50", location: "SCI 220",
    mode: "in-person", requirement: "IGETC Area 5A – Physical Sciences",
    seats: 28, enrolled: 10, term: "Fall 2026",
  },
  {
    crn: "81071", code: "ASTR 001", title: "Introductory Astronomy",
    instructor: "Maria Santos", units: 3, days: ["Tue", "Thu"],
    startTime: "16:00", endTime: "17:25", location: "SCI 110",
    mode: "in-person", requirement: "IGETC Area 5A – Physical Sciences",
    seats: 40, enrolled: 13, term: "Fall 2026",
  },
  // Area 5B – Biological Sciences
  {
    crn: "81080", code: "BIOL 003", title: "Introduction to Biology",
    instructor: "Vanessa Park", units: 4, days: ["Mon", "Wed"],
    startTime: "09:00", endTime: "10:50", location: "SCI 305",
    mode: "in-person", requirement: "IGETC Area 5B – Biological Sciences",
    seats: 32, enrolled: 7, term: "Fall 2026",
  },
  {
    crn: "81081", code: "BIOL 009", title: "Human Biology",
    instructor: "Vanessa Park", units: 4, days: ["Tue", "Thu"],
    startTime: "09:30", endTime: "11:20", location: "SCI 310",
    mode: "in-person", requirement: "IGETC Area 5B – Biological Sciences",
    seats: 35, enrolled: 12, term: "Fall 2026",
  },
  // Area 6 – LOTE
  {
    crn: "81090", code: "SPAN 001", title: "Elementary Spanish I",
    instructor: "Isabel Cruz", units: 5, days: ["Mon", "Wed", "Fri"],
    startTime: "10:00", endTime: "10:50", location: "L 310",
    mode: "in-person", requirement: "IGETC Area 6 – Languages Other Than English",
    seats: 30, enrolled: 9, term: "Fall 2026",
  },
  {
    crn: "81091", code: "ASL 001", title: "American Sign Language I",
    instructor: "Diane Hollis", units: 4, days: ["Tue", "Thu"],
    startTime: "13:00", endTime: "14:50", location: "L 312",
    mode: "in-person", requirement: "IGETC Area 6 – Languages Other Than English",
    seats: 28, enrolled: 6, term: "Fall 2026",
  },
  {
    crn: "81092", code: "JAPN 001", title: "Elementary Japanese I",
    instructor: "Yuki Tanaka", units: 5, days: ["Mon", "Wed", "Fri"],
    startTime: "12:00", endTime: "12:50", location: "L 308",
    mode: "in-person", requirement: "IGETC Area 6 – Languages Other Than English",
    seats: 28, enrolled: 11, term: "Fall 2026",
  },
  // Business / CS / Accounting
  {
    crn: "81100", code: "BUS 001", title: "Introduction to Business",
    instructor: "Maria Chen", units: 3, days: ["Mon", "Wed"],
    startTime: "15:00", endTime: "16:25", location: "C 205",
    mode: "in-person", requirement: "Business Core",
    seats: 35, enrolled: 6, term: "Fall 2026",
  },
  {
    crn: "81101", code: "ACCT 001A", title: "Financial Accounting",
    instructor: "James Wu", units: 4, days: ["Tue", "Thu"],
    startTime: "18:00", endTime: "20:05", location: "R 201",
    mode: "in-person", requirement: "Accounting Core",
    seats: 40, enrolled: 8, term: "Fall 2026",
  },
  {
    crn: "81110", code: "CS 001", title: "Introduction to Computer Science",
    instructor: "Priya Sharma", units: 3, days: ["Mon", "Wed"],
    startTime: "11:00", endTime: "12:25", location: "CS 110",
    mode: "in-person", requirement: "CS Core",
    seats: 30, enrolled: 7, term: "Fall 2026",
  },
  {
    crn: "81111", code: "CS 010", title: "Web Development Fundamentals",
    instructor: "Jason Lee", units: 3, days: ["Tue", "Thu"],
    startTime: "14:00", endTime: "15:25", location: "CS 112",
    mode: "hybrid", requirement: "CS Elective",
    seats: 28, enrolled: 5, term: "Fall 2026",
  },
];

export const courses: Course[] = [
  ...spring2026,
  ...summer2026,
  ...fall2026,
];
