/**
 * Predefined Semester Subject Catalog
 * Semesters 1-4: Common foundational Computer Science subjects.
 * Semesters 5-8: Branch-specific CS specialization subjects.
 */

export const CS_BRANCHES = [
  { id: "cse", name: "CSE - Core Computer Science & Engineering" },
  { id: "cse_iot", name: "CSE - Internet of Things (IoT)" },
  { id: "aids", name: "AI & DS - Artificial Intelligence & Data Science" },
  { id: "cyber", name: "Cyber Security - CS & Cyber Security" },
  { id: "it", name: "IT - Information Technology & Software Eng" }
];

export const PREDEFINED_SUBJECTS = {
  // Semesters 1-4: Common Foundational Subjects
  1: [
    { code: "1FY2-01", name: "Engineering Mathematics - I", credits: 4, type: "theory", internalMaxMarks: 30, externalMaxMarks: 70 },
    { code: "1FY2-02", name: "Engineering Physics", credits: 4, type: "theory", internalMaxMarks: 30, externalMaxMarks: 70 },
    { code: "1FY1-04", name: "Communication Skills", credits: 2, type: "theory", internalMaxMarks: 30, externalMaxMarks: 70 },
    { code: "1FY3-06", name: "Programming for Problem Solving", credits: 2, type: "theory", internalMaxMarks: 30, externalMaxMarks: 70 },
    { code: "1FY3-08", name: "Basic Electrical Engineering", credits: 2, type: "theory", internalMaxMarks: 30, externalMaxMarks: 70 },
    { code: "1FY2-20", name: "Engineering Physics Lab", credits: 1, type: "practical", internalMaxMarks: 60, externalMaxMarks: 40 },
    { code: "1FY1-22", name: "Language Lab", credits: 1, type: "practical", internalMaxMarks: 60, externalMaxMarks: 40 },
    { code: "1FY3-24", name: "Computer Programming Lab", credits: 1.5, type: "practical", internalMaxMarks: 60, externalMaxMarks: 40 },
    { code: "1FY3-26", name: "Basic Electrical Engineering Lab", credits: 1, type: "practical", internalMaxMarks: 60, externalMaxMarks: 40 },
    { code: "1FY3-28", name: "Computer Aided Engineering Graphics", credits: 1.5, type: "practical", internalMaxMarks: 60, externalMaxMarks: 40 },
    { code: "1FY8-0X", name: "NCC / NSS / Sports", credits: 0.5, type: "fec", totalMaxMarks: 100 }
  ],
  2: [
    { code: "2FY2-01", name: "Engineering Mathematics - II", credits: 4, type: "theory", internalMaxMarks: 30, externalMaxMarks: 70 },
    { code: "2FY2-03", name: "Engineering Chemistry", credits: 4, type: "theory", internalMaxMarks: 30, externalMaxMarks: 70 },
    { code: "2FY1-05", name: "Human Values", credits: 2, type: "theory", internalMaxMarks: 30, externalMaxMarks: 70 },
    { code: "2FY3-07", name: "Basic Mechanical Engineering", credits: 2, type: "theory", internalMaxMarks: 30, externalMaxMarks: 70 },
    { code: "2FY3-09", name: "Basic Civil Engineering", credits: 2, type: "theory", internalMaxMarks: 30, externalMaxMarks: 70 },
    { code: "2FY2-21", name: "Engineering Chemistry Lab", credits: 1, type: "practical", internalMaxMarks: 60, externalMaxMarks: 40 },
    { code: "2FY1-23", name: "Human Values Activities and Sports", credits: 1, type: "practical", internalMaxMarks: 60, externalMaxMarks: 40 },
    { code: "2FY3-25", name: "Manufacturing Practices Workshop", credits: 1.5, type: "practical", internalMaxMarks: 60, externalMaxMarks: 40 },
    { code: "2FY3-27", name: "Basic Civil Engineering Lab", credits: 1, type: "practical", internalMaxMarks: 60, externalMaxMarks: 40 },
    { code: "2FY3-29", name: "Computer Aided Machine Drawing", credits: 1.5, type: "practical", internalMaxMarks: 60, externalMaxMarks: 40 },
    { code: "1FY8-0X", name: "NCC / NSS / Sports", credits: 0.5, type: "fec", totalMaxMarks: 100 }
  ],
  3: [
    { code: "3CS01", name: "Data Structures & Algorithms", credits: 3, type: "theory" },
    { code: "3CS02", name: "Object Oriented Programming (C++)", credits: 3, type: "theory" },
    { code: "3CS03", name: "Digital Logic Design", credits: 3, type: "theory" },
    { code: "3CS04", name: "Software Engineering", credits: 3, type: "theory" },
    { code: "3CS05", name: "Advanced Engineering Mathematics", credits: 3, type: "theory" },
    { code: "3CS06", name: "Data Structures Lab", credits: 1.5, type: "practical" },
    { code: "3CS07", name: "OOP Lab", credits: 1.5, type: "practical" },
    { code: "3CS08", name: "Digital Design Lab", credits: 1, type: "practical" },
    { code: "3CS09", name: "Human Values & Professional Ethics", credits: 0.5, type: "fec" }
  ],
  4: [
    { code: "4CIT1-01", name: "Managerial Economics & Financial Accounting", credits: 2, type: "theory" },
    { code: "4CIT2-02", name: "Discrete Mathematics Structure", credits: 3, type: "theory" },
    { code: "4CIT3-03", name: "Microprocessor & Interfaces", credits: 3, type: "theory" },
    { code: "4CIT4-04", name: "Database Management System", credits: 3, type: "theory" },
    { code: "4CIT4-05", name: "Theory of Computation", credits: 3, type: "theory" },
    { code: "4CIT4-06", name: "Data Communication & Computer Networks", credits: 3, type: "theory" },
    { code: "4CIT4-07", name: "Microprocessor & Interfaces Lab", credits: 1, type: "practical" },
    { code: "4CIT4-08", name: "Database Management System Lab", credits: 1.5, type: "practical" },
    { code: "4CIT4-09", name: "Network Programming Lab", credits: 1.5, type: "practical" },
    { code: "4CIT4-10", name: "Linux Shell Programming Lab", credits: 1, type: "practical" },
    { code: "4CIT4-11", name: "Java Lab", credits: 1, type: "practical" },
    { code: "4CIT4-12", name: "German / Foreign Language (FEC)", credits: 0.5, type: "fec" }
  ],

  // Semesters 5-8 Branch Specific Catalog
  branches: {
    // -------------------------------------------------------------
    // CSE-Core (Computer Science & Engineering)
    // -------------------------------------------------------------
    cse: {
      5: [
        { code: "5CS3-01", name: "Information Theory & Coding", credits: 2, type: "theory", internalMaxMarks: 20, externalMaxMarks: 80, totalMaxMarks: 100 },
        { code: "5CS4-02", name: "Compiler Design", credits: 3, type: "theory", internalMaxMarks: 30, externalMaxMarks: 120, totalMaxMarks: 150 },
        { code: "5CS4-03", name: "Operating System", credits: 3, type: "theory", internalMaxMarks: 30, externalMaxMarks: 120, totalMaxMarks: 150 },
        { code: "5CS4-04", name: "Computer Graphics & Multimedia", credits: 3, type: "theory", internalMaxMarks: 30, externalMaxMarks: 120, totalMaxMarks: 150 },
        { code: "5CS4-05", name: "Analysis of Algorithms", credits: 3, type: "theory", internalMaxMarks: 30, externalMaxMarks: 120, totalMaxMarks: 150 },
        { code: "5CS5-11", name: "Wireless Communication", credits: 2, type: "elective", internalMaxMarks: 20, externalMaxMarks: 80, totalMaxMarks: 100 },
        { code: "5CS5-12", name: "Human Computer Interaction", credits: 2, type: "elective", internalMaxMarks: 20, externalMaxMarks: 80, totalMaxMarks: 100 },
        { code: "5CS5-13", name: "Bioinformatics", credits: 2, type: "elective", internalMaxMarks: 20, externalMaxMarks: 80, totalMaxMarks: 100 },
        { code: "5CS4-21", name: "Computer Graphics & Multimedia Lab", credits: 1, type: "practical", internalMaxMarks: 30, externalMaxMarks: 20, totalMaxMarks: 50 },
        { code: "5CS4-22", name: "Compiler Design Lab", credits: 1, type: "practical", internalMaxMarks: 30, externalMaxMarks: 20, totalMaxMarks: 50 },
        { code: "5CS4-23", name: "Analysis of Algorithms Lab", credits: 1, type: "practical", internalMaxMarks: 30, externalMaxMarks: 20, totalMaxMarks: 50 },
        { code: "5CS4-24", name: "Advance Java Lab", credits: 1, type: "practical", internalMaxMarks: 30, externalMaxMarks: 20, totalMaxMarks: 50 }
      ],
      6: [
        { code: "6CS3-01", name: "Digital Image Processing", credits: 2, type: "theory", internalMaxMarks: 20, externalMaxMarks: 80, totalMaxMarks: 100 },
        { code: "6CS4-02", name: "Machine Learning", credits: 3, type: "theory", internalMaxMarks: 30, externalMaxMarks: 120, totalMaxMarks: 150 },
        { code: "6CS4-03", name: "Information Security System", credits: 2, type: "theory", internalMaxMarks: 20, externalMaxMarks: 80, totalMaxMarks: 100 },
        { code: "6CS4-04", name: "Computer Architecture and Organization", credits: 3, type: "theory", internalMaxMarks: 30, externalMaxMarks: 120, totalMaxMarks: 150 },
        { code: "6CS4-05", name: "Artificial Intelligence", credits: 2, type: "theory", internalMaxMarks: 20, externalMaxMarks: 80, totalMaxMarks: 100 },
        { code: "6CS4-06", name: "Cloud Computing", credits: 3, type: "theory", internalMaxMarks: 30, externalMaxMarks: 120, totalMaxMarks: 150 },
        { code: "6CS5-11", name: "Distributed System", credits: 2, type: "elective", internalMaxMarks: 20, externalMaxMarks: 80, totalMaxMarks: 100 },
        { code: "6CS5-12", name: "Software Defined Network", credits: 2, type: "elective", internalMaxMarks: 20, externalMaxMarks: 80, totalMaxMarks: 100 },
        { code: "6CS5-13", name: "Ecommerce & ERP", credits: 2, type: "elective", internalMaxMarks: 20, externalMaxMarks: 80, totalMaxMarks: 100 },
        { code: "6CS4-21", name: "Digital Image Processing Lab", credits: 1.5, type: "practical", internalMaxMarks: 45, externalMaxMarks: 30, totalMaxMarks: 75 },
        { code: "6CS4-22", name: "Machine Learning Lab", credits: 1.5, type: "practical", internalMaxMarks: 45, externalMaxMarks: 30, totalMaxMarks: 75 },
        { code: "6CS4-23", name: "Python Lab", credits: 1.5, type: "practical", internalMaxMarks: 45, externalMaxMarks: 30, totalMaxMarks: 75 },
        { code: "6CS4-24", name: "Mobile Application Development Lab", credits: 1.5, type: "practical", internalMaxMarks: 45, externalMaxMarks: 30, totalMaxMarks: 75 }
      ],
      7: [
        { code: "7CS01", name: "Big Data Analytics", credits: 3, type: "theory" },
        { code: "7CS02", name: "Internet of Things (IoT)", credits: 3, type: "theory" },
        { code: "7CS03", name: "Professional Elective - Cyber Security", credits: 3, type: "elective" },
        { code: "7CS04", name: "Open Elective - Management Info Systems", credits: 3, type: "elective" },
        { code: "7CS05", name: "Major Project Part - 1", credits: 3, type: "project" },
        { code: "7CS06", name: "Big Data & IoT Lab", credits: 2, type: "practical" },
        { code: "7CS07", name: "Practical Training / Seminar", credits: 2, type: "internship" }
      ],
      8: [
        { code: "8CS01", name: "Professional Elective - Deep Learning", credits: 3, type: "elective" },
        { code: "8CS02", name: "Open Elective - Entrepreneurship", credits: 3, type: "elective" },
        { code: "8CS03", name: "Major Project Part - 2", credits: 8, type: "project" },
        { code: "8CS04", name: "Comprehensive Seminar & Viva", credits: 2, type: "internship" }
      ]
    },

    // CSE-IOT semester 5/6 catalog retained separately from the Core syllabus.
    cse_iot: {
      5: [
        { code: "5CS01", name: "Operating Systems", credits: 3, type: "theory" },
        { code: "5CS02", name: "Compiler Design", credits: 3, type: "theory" },
        { code: "5CS03", name: "Computer Architecture & Organization", credits: 3, type: "theory" },
        { code: "5CS04", name: "", credits: 3, type: "theory" },
        { code: "5CS05", name: "Professional Elective - Web Technologies", credits: 3, type: "elective" },
        { code: "5CS06", name: "Operating Systems Lab", credits: 1.5, type: "practical" },
        { code: "5CS07", name: "Compiler Design Lab", credits: 1, type: "practical" },
        { code: "5CS08", name: "AI & Python Lab", credits: 1.5, type: "practical" },
        { code: "5CS09", name: "Industrial Practical Training - I", credits: 1, type: "internship" }
      ],
      6: [
        { code: "6CS01", name: "Design & Analysis of Algorithms", credits: 3, type: "theory" },
        { code: "6CS02", name: "Machine Learning", credits: 3, type: "theory" },
        { code: "6CS03", name: "Information Security & Cryptography", credits: 3, type: "theory" },
        { code: "6CS04", name: "Professional Elective - Cloud Computing", credits: 3, type: "elective" },
        { code: "6CS05", name: "Open Elective - Robotics & Automation", credits: 3, type: "elective" },
        { code: "6CS06", name: "Algorithms Lab", credits: 1.5, type: "practical" },
        { code: "6CS07", name: "Machine Learning Lab", credits: 1.5, type: "practical" },
        { code: "6CS08", name: "Mobile Application Lab", credits: 1, type: "practical" }
      ]
    },

    // -------------------------------------------------------------
    // Branch 2: AI & DS (Artificial Intelligence & Data Science)
    // -------------------------------------------------------------
    aids: {
      5: [
        { code: "5AI01", name: "Operating Systems for AI", credits: 3, type: "theory" },
        { code: "5AI02", name: "Machine Learning Foundations", credits: 3, type: "theory" },
        { code: "5AI03", name: "Data Mining & Data Warehousing", credits: 3, type: "theory" },
        { code: "5AI04", name: "Artificial Intelligence & Expert Systems", credits: 3, type: "theory" },
        { code: "5AI05", name: "Professional Elective - Python Data Science", credits: 3, type: "elective" },
        { code: "5AI06", name: "Machine Learning Lab", credits: 1.5, type: "practical" },
        { code: "5AI07", name: "Data Analytics & Mining Lab", credits: 1.5, type: "practical" },
        { code: "5AI08", name: "AI Application Development Lab", credits: 1, type: "practical" },
        { code: "5AI09", name: "Industrial Practical Training - I", credits: 1, type: "internship" }
      ],
      6: [
        { code: "6AI01", name: "Deep Learning & Neural Networks", credits: 3, type: "theory" },
        { code: "6AI02", name: "Natural Language Processing (NLP)", credits: 3, type: "theory" },
        { code: "6AI03", name: "Reinforcement Learning", credits: 3, type: "theory" },
        { code: "6AI04", name: "Professional Elective - Computer Vision", credits: 3, type: "elective" },
        { code: "6AI05", name: "Open Elective - Big Data Distributed Systems", credits: 3, type: "elective" },
        { code: "6AI06", name: "Deep Learning Lab", credits: 1.5, type: "practical" },
        { code: "6AI07", name: "NLP & Text Analytics Lab", credits: 1.5, type: "practical" },
        { code: "6AI08", name: "Computer Vision Lab", credits: 1, type: "practical" }
      ],
      7: [
        { code: "7AI01", name: "Generative AI & LLMs", credits: 3, type: "theory" },
        { code: "7AI02", name: "Cloud AI & MLOps Infrastructure", credits: 3, type: "theory" },
        { code: "7AI03", name: "Professional Elective - AI Ethics & Governance", credits: 3, type: "elective" },
        { code: "7AI04", name: "Open Elective - Predictive Analytics", credits: 3, type: "elective" },
        { code: "7AI05", name: "AI Capstone Project Part - 1", credits: 3, type: "project" },
        { code: "7AI06", name: "Generative AI & MLOps Lab", credits: 2, type: "practical" },
        { code: "7AI07", name: "AI Internship & Seminar", credits: 2, type: "internship" }
      ],
      8: [
        { code: "8AI01", name: "Professional Elective - Autonomous Systems & Robotics", credits: 3, type: "elective" },
        { code: "8AI02", name: "Open Elective - AI Product Management", credits: 3, type: "elective" },
        { code: "8AI03", name: "AI Capstone Project Part - 2", credits: 8, type: "project" },
        { code: "8AI04", name: "AI Research Defense & Viva", credits: 2, type: "internship" }
      ]
    },

    // -------------------------------------------------------------
    // Branch 3: Cyber Security (CS & Cyber Security)
    // -------------------------------------------------------------
    cyber: {
      5: [
        { code: "5CY01", name: "Operating System Security", credits: 3, type: "theory" },
        { code: "5CY02", name: "Computer Networks & Security Protocols", credits: 3, type: "theory" },
        { code: "5CY03", name: "Applied Cryptography", credits: 3, type: "theory" },
        { code: "5CY04", name: "Ethical Hacking & Penetration Testing", credits: 3, type: "theory" },
        { code: "5CY05", name: "Professional Elective - Network Security", credits: 3, type: "elective" },
        { code: "5CY06", name: "Cryptography Lab", credits: 1.5, type: "practical" },
        { code: "5CY07", name: "Penetration Testing Lab", credits: 1.5, type: "practical" },
        { code: "5CY08", name: "Network Security Lab", credits: 1, type: "practical" },
        { code: "5CY09", name: "Security Training - I", credits: 1, type: "internship" }
      ],
      6: [
        { code: "6CY01", name: "Digital Forensics & Incident Response", credits: 3, type: "theory" },
        { code: "6CY02", name: "Web Application & API Security", credits: 3, type: "theory" },
        { code: "6CY03", name: "Wireless & IoT Security", credits: 3, type: "theory" },
        { code: "6CY04", name: "Professional Elective - Security Operations Center (SOC)", credits: 3, type: "elective" },
        { code: "6CY05", name: "Open Elective - Cloud Security Engineering", credits: 3, type: "elective" },
        { code: "6CY06", name: "Digital Forensics Lab", credits: 1.5, type: "practical" },
        { code: "6CY07", name: "Web Security Lab", credits: 1.5, type: "practical" },
        { code: "6CY08", name: "SOC & SIEM Tools Lab", credits: 1, type: "practical" }
      ],
      7: [
        { code: "7CY01", name: "Malware Analysis & Reverse Engineering", credits: 3, type: "theory" },
        { code: "7CY02", name: "Blockchain & Crypto Security", credits: 3, type: "theory" },
        { code: "7CY03", name: "Professional Elective - Cyber Law & Risk Governance", credits: 3, type: "elective" },
        { code: "7CY04", name: "Open Elective - Threat Intelligence", credits: 3, type: "elective" },
        { code: "7CY05", name: "Cyber Capstone Project Part - 1", credits: 3, type: "project" },
        { code: "7CY06", name: "Reverse Engineering Lab", credits: 2, type: "practical" },
        { code: "7CY07", name: "Cyber Internship & Seminar", credits: 2, type: "internship" }
      ],
      8: [
        { code: "8CY01", name: "Professional Elective - Zero Trust Security Architecture", credits: 3, type: "elective" },
        { code: "8CY02", name: "Open Elective - Quantum Cryptography", credits: 3, type: "elective" },
        { code: "8CY03", name: "Cyber Capstone Project Part - 2", credits: 8, type: "project" },
        { code: "8CY04", name: "Security Audit Defense & Viva", credits: 2, type: "internship" }
      ]
    },

    // -------------------------------------------------------------
    // Branch 4: IT (Information Technology & Software Engineering)
    // -------------------------------------------------------------
    it: {
      5: [
        { code: "5IT01", name: "Operating Systems", credits: 3, type: "theory" },
        { code: "5IT02", name: "Web Engineering & Frameworks", credits: 3, type: "theory" },
        { code: "5IT03", name: "Software Architecture & Design Patterns", credits: 3, type: "theory" },
        { code: "5IT04", name: "Database Administration & Tuning", credits: 3, type: "theory" },
        { code: "5IT05", name: "Professional Elective - Agile Software Methods", credits: 3, type: "elective" },
        { code: "5IT06", name: "Web Frameworks Lab", credits: 1.5, type: "practical" },
        { code: "5IT07", name: "Database Administration Lab", credits: 1.5, type: "practical" },
        { code: "5IT08", name: "Software Design Lab", credits: 1, type: "practical" },
        { code: "5IT09", name: "Industrial Practical Training - I", credits: 1, type: "internship" }
      ],
      6: [
        { code: "6IT01", name: "Cloud Computing & DevOps", credits: 3, type: "theory" },
        { code: "6IT02", name: "Mobile Application Development", credits: 3, type: "theory" },
        { code: "6IT03", name: "Information Systems & Security", credits: 3, type: "theory" },
        { code: "6IT04", name: "Professional Elective - Microservices & Serverless", credits: 3, type: "elective" },
        { code: "6IT05", name: "Open Elective - Full Stack Engineering", credits: 3, type: "elective" },
        { code: "6IT06", name: "DevOps & CI/CD Lab", credits: 1.5, type: "practical" },
        { code: "6IT07", name: "Mobile App Development Lab", credits: 1.5, type: "practical" },
        { code: "6IT08", name: "Full Stack Lab", credits: 1, type: "practical" }
      ],
      7: [
        { code: "7IT01", name: "Enterprise Resource Planning (ERP)", credits: 3, type: "theory" },
        { code: "7IT02", name: "Data Analytics for Business", credits: 3, type: "theory" },
        { code: "7IT03", name: "Professional Elective - Software Quality Assurance", credits: 3, type: "elective" },
        { code: "7IT04", name: "Open Elective - Distributed Systems", credits: 3, type: "elective" },
        { code: "7IT05", name: "IT Capstone Project Part - 1", credits: 3, type: "project" },
        { code: "7IT06", name: "ERP & Analytics Lab", credits: 2, type: "practical" },
        { code: "7IT07", name: "IT Internship & Seminar", credits: 2, type: "internship" }
      ],
      8: [
        { code: "8IT01", name: "Professional Elective - Cloud Native Architecture", credits: 3, type: "elective" },
        { code: "8IT02", name: "Open Elective - IT Strategy & Entrepreneurship", credits: 3, type: "elective" },
        { code: "8IT03", name: "IT Capstone Project Part - 2", credits: 8, type: "project" },
        { code: "8IT04", name: "Software Project Defense & Viva", credits: 2, type: "internship" }
      ]
    }
  }
};

/**
 * Get predefined subjects for a given semester and branch.
 * @param {number} sem - Semester number (1-8)
 * @param {string} branchId - Branch identifier ('cse', 'cse_iot', 'aids', 'cyber', 'it')
 * @returns {Array} List of predefined subjects
 */
export function getPredefinedSubjects(sem, branchId = "cse") {
  const semNum = Number(sem);
  if (semNum <= 4) {
    return PREDEFINED_SUBJECTS[semNum] || [];
  }
  // For Semesters 5 to 8, return branch-specific subjects
  const branchData = PREDEFINED_SUBJECTS.branches[branchId] || PREDEFINED_SUBJECTS.branches.cse;
  return branchData[semNum]
    || (branchId === "cse_iot" ? PREDEFINED_SUBJECTS.branches.cse[semNum] : [])
    || [];
}
