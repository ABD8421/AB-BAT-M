import type { Education } from "@/lib/types";

/** ACADEMIC RECORD (spec §25). */
export const education: Education[] = [
  {
    id: "edu-1",
    institution: "International Islamic University Chittagong (IIUC)",
    degree: "B.Sc. in Computer Science and Engineering",
    department: "Department of CSE",
    start: "2022",
    end: "Dec 2026",
    cgpa: "3.40 / 4.00 (Thesis defense pending)",
    coursework: [
      "Data Structures & Algorithms",
      "Object Oriented Programming",
      "Database Management Systems",
      "Artificial Intelligence & Machine Learning",
      "Web & Mobile Application Development",
    ],
    highlights: [
      "Completed thesis on Deep Learning / Computer Vision",
      "Served as Finance Secretary at IIUC Computer Club (2025–2026)",
    ],
    placeholder: false,
  },
  {
    id: "edu-2",
    institution: "Cantonment English School and College, Chattogram",
    degree: "Higher Secondary Certificate (HSC)",
    department: "Science",
    start: "2019",
    end: "2021",
    cgpa: "GPA 5.00 / 5.00",
    coursework: ["Physics", "Chemistry", "Mathematics", "Information & Communication Technology"],
    highlights: ["Graduated with maximum GPA 5.00"],
    placeholder: false,
  },
  {
    id: "edu-3",
    institution: "Standard School and College, Chattogram",
    degree: "Secondary School Certificate (SSC)",
    department: "Science",
    start: "2016",
    end: "2018",
    cgpa: "GPA 5.00 / 5.00",
    coursework: ["General Science", "Higher Mathematics", "Physics", "Chemistry"],
    highlights: ["Graduated with maximum GPA 5.00"],
    placeholder: false,
  },
];
