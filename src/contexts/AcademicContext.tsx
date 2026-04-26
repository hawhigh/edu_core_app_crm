import React, { createContext, useContext, useState, useEffect } from 'react';

export interface School {
  id: string;
  name: string;
  address: string;
}

export interface Class {
  id: string;
  schoolId: string;
  name: string;
  year: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  specialization: string[];
}

export interface Subject {
  id: string;
  classId: string;
  name: string;
  teacherIds: string[];
}

export interface Topic {
  id: string;
  subjectId: string;
  title: string;
  order: number;
}

export interface LessonStructure {
  title: string;
  duration: string;
  description: string;
}

export interface LessonMaterial {
  name: string;
  type: 'file' | 'link';
  url?: string;
}

export interface Lesson {
  id: string;
  topicId?: string;
  subjectId: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  type: string;
  aims: string[];
  structure: LessonStructure[];
  materials: LessonMaterial[];
  status: 'draft' | 'published' | 'rework';
}

export interface Student {
  id: string;
  classId: string;
  name: string;
  email: string;
  parentEmail?: string;
}

export interface TimetableEntry {
  id: string;
  classId: string;
  subjectId: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  startTime: string;
  endTime: string;
}

export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  lessonId?: string;
  score: number;
  maxScore: number;
  feedback: string;
  date: string;
}

export interface ReferenceMaterial {
  id: string;
  title: string;
  type: 'government_plan' | 'lector_script' | 'other';
  content: string;
  url?: string;
  dateAdded: string;
}

export interface CurriculumPreparation {
  id: string;
  title: string;
  grade: string;
  subject: string;
  topic: string;
  content: string;
  dateGenerated: string;
  sourceMaterialIds: string[];
}

interface AcademicContextType {
  schools: School[];
  classes: Class[];
  teachers: Teacher[];
  subjects: Subject[];
  topics: Topic[];
  lessons: Lesson[];
  students: Student[];
  timetable: TimetableEntry[];
  grades: Grade[];
  referenceMaterials: ReferenceMaterial[];
  curriculumPreparations: CurriculumPreparation[];
  
  // School Actions
  addSchool: (school: Omit<School, 'id'>) => void;
  updateSchool: (id: string, school: Partial<School>) => void;
  deleteSchool: (id: string) => void;
  
  // Class Actions
  addClass: (cls: Omit<Class, 'id'>) => void;
  updateClass: (id: string, cls: Partial<Class>) => void;
  deleteClass: (id: string) => void;
  
  // Teacher Actions
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;
  
  // Subject Actions
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, subject: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  
  // Topic Actions
  addTopic: (topic: Omit<Topic, 'id'>) => void;
  updateTopic: (id: string, topic: Partial<Topic>) => void;
  deleteTopic: (id: string) => void;
  
  // Lesson Actions
  addLesson: (lesson: Omit<Lesson, 'id' | 'status'>) => string;
  updateLesson: (id: string, lesson: Partial<Lesson>) => void;
  deleteLesson: (id: string) => void;
  getLesson: (id: string) => Lesson | undefined;
  publishLesson: (id: string) => void;
  publishAll: (subjectId: string) => void;
  moveLesson: (id: string, direction: 'up' | 'down') => void;

  // Student Actions
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  // Timetable Actions
  addTimetableEntry: (entry: Omit<TimetableEntry, 'id'>) => void;
  updateTimetableEntry: (id: string, entry: Partial<TimetableEntry>) => void;
  deleteTimetableEntry: (id: string) => void;

  // Grade Actions
  addGrade: (grade: Omit<Grade, 'id'>) => void;
  updateGrade: (id: string, grade: Partial<Grade>) => void;
  deleteGrade: (id: string) => void;

  // Reference Material Actions
  addReferenceMaterial: (material: Omit<ReferenceMaterial, 'id'>) => void;
  deleteReferenceMaterial: (id: string) => void;

  // Curriculum Preparation Actions
  addCurriculumPreparation: (prep: Omit<CurriculumPreparation, 'id'>) => void;
  deleteCurriculumPreparation: (id: string) => void;
  
  // NAS
  nasUrl: string;
  setNasUrl: (url: string) => void;
  
  // System
  resetData: () => void;
}

const AcademicContext = createContext<AcademicContextType | undefined>(undefined);

const safeParse = (data: string | null, fallback: any) => {
  if (!data) return fallback;
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('safeParse failed:', e);
    return fallback;
  }
};

const safeStringify = (obj: any) => {
  // Pre-check for common browser objects that should never be stringified
  const isBrowserObject = (val: any): boolean => {
    try {
      if (!val || typeof val !== 'object') return false;
      
      // Check for window/global using multiple strategies
      if (typeof window !== 'undefined' && val === window) return true;
      if (val.self === val && val.window === val) return true;
      
      const toString = Object.prototype.toString.call(val);
      if (toString === '[object Window]' || toString === '[object global]' || toString === '[object HTMLDocument]') return true;
      
      // Node check
      if (val instanceof Node || (val.nodeType && typeof val.nodeName === 'string')) return true;
      
      return false;
    } catch (e) {
      // If we can't even check, it's probably a restricted browser object (like a cross-origin window)
      return true;
    }
  };

  if (isBrowserObject(obj)) return '"[Browser Object]"';
  
  if (typeof obj === 'string') return JSON.stringify(obj);

  try {
    const cache = new WeakSet();
    return JSON.stringify(obj, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (isBrowserObject(value)) {
          return '[Browser Object]';
        }

        if (cache.has(value)) {
          return '[Circular]';
        }
        cache.add(value);
      }
      return value;
    });
  } catch (error) {
    console.error('safeStringify fatal failure:', error);
    try {
      // Last resort: try to stringify only own properties that are primitive
      const fallback: any = Array.isArray(obj) ? [] : {};
      Object.keys(obj).forEach(key => {
        const val = obj[key];
        if (typeof val !== 'object' || val === null) {
          fallback[key] = val;
        } else {
          fallback[key] = '[Complex Object]';
        }
      });
      return JSON.stringify(fallback);
    } catch (e) {
      return Array.isArray(obj) ? "[]" : "{}";
    }
  }
};

export const AcademicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [schools, setSchools] = useState<School[]>(() => {
    const saved = localStorage.getItem('educore_schools');
    return safeParse(saved, [
      { id: 'sch-1', name: 'EDUCORE Academy A', address: 'London' },
      { id: 'sch-2', name: 'EDUCORE Academy B', address: 'Manchester' }
    ]);
  });

  const [classes, setClasses] = useState<Class[]>(() => {
    const saved = localStorage.getItem('educore_classes');
    return safeParse(saved, [
      { id: 'cls-1', schoolId: 'sch-1', name: '10-A', year: '2025' },
      { id: 'cls-2', schoolId: 'sch-1', name: '10-B', year: '2025' },
      { id: 'cls-3', schoolId: 'sch-1', name: '11-A', year: '2025' }
    ]);
  });

  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('educore_teachers');
    return safeParse(saved, [
      { id: 'tch-1', name: 'Mr. Smith', email: 'smith@educore.com', specialization: ['Mathematics', 'Physics'] },
      { id: 'tch-2', name: 'Dr. Jones', email: 'jones@educore.com', specialization: ['Physics'] },
      { id: 'tch-3', name: 'Ms. Davis', email: 'davis@educore.com', specialization: ['Literature'] }
    ]);
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('educore_subjects');
    const parsed = safeParse(saved, [
      { id: 'sub-1', classId: 'cls-1', name: 'English', teacherIds: ['tch-1'] },
      { id: 'sub-2', classId: 'cls-1', name: 'Grammar', teacherIds: ['tch-2'] },
      { id: 'sub-3', classId: 'cls-1', name: 'Literature', teacherIds: ['tch-1'] },
      { id: 'sub-4', classId: 'cls-1', name: 'Speaking', teacherIds: ['tch-3'] },
      { id: 'sub-5', classId: 'cls-1', name: 'Writing', teacherIds: ['tch-3'] },
      { id: 'sub-6', classId: 'cls-1', name: 'Phonics', teacherIds: ['tch-2'] },
      { id: 'sub-7', classId: 'cls-1', name: 'Mathematics', teacherIds: ['tch-1'] },
      { id: 'sub-8', classId: 'cls-1', name: 'Slovak Language', teacherIds: ['tch-3'] }
    ]);
    
    // Migration: Convert single teacherId to teacherIds array if necessary
    return parsed.map((s: any) => {
      if (s.teacherId && !s.teacherIds) {
        const { teacherId, ...rest } = s;
        return { ...rest, teacherIds: [teacherId] };
      }
      if (!s.teacherIds) {
        return { ...s, teacherIds: [] };
      }
      return s;
    });
  });

  const [topics, setTopics] = useState<Topic[]>(() => {
    const saved = localStorage.getItem('educore_topics');
    if (saved) return safeParse(saved, []);
    
    const initialTopics: Topic[] = [];
    const subjectIds = ['sub-1', 'sub-2', 'sub-3', 'sub-4', 'sub-5', 'sub-6'];
    const topicNames = [
      ['Algebra', 'Geometry', 'Calculus', 'Statistics'],
      ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Optics'],
      ['Cell Biology', 'Genetics', 'Ecology', 'Human Anatomy'],
      ['Ancient Civilizations', 'Medieval Europe', 'Industrial Revolution', 'Modern History'],
      ['Classical Poetry', 'Shakespearean Drama', 'Modernist Prose', 'Contemporary Literature'],
      ['Programming Basics', 'Data Structures', 'Web Development', 'Artificial Intelligence']
    ];

    subjectIds.forEach((sId, sIdx) => {
      topicNames[sIdx].forEach((tName, tIdx) => {
        initialTopics.push({
          id: `top-${sId}-${tIdx}`,
          subjectId: sId,
          title: tName,
          order: tIdx + 1
        });
      });
    });
    return initialTopics;
  });

  const [lessons, setLessons] = useState<Lesson[]>(() => {
    const saved = localStorage.getItem('educore_lessons_v2');
    if (saved) return safeParse(saved, []);
    
    const initialLessons: Lesson[] = [];
    const subjectIds = ['sub-1', 'sub-2', 'sub-3', 'sub-4', 'sub-5', 'sub-6'];
    
    subjectIds.forEach((sId) => {
      const subjectTopics = [
        `top-${sId}-0`, `top-${sId}-1`, `top-${sId}-2`, `top-${sId}-3`
      ];
      
      for (let i = 1; i <= 10; i++) {
        const topicId = subjectTopics[Math.floor((i-1) / 2.5)];
        initialLessons.push({
          id: `les-${sId}-${i}`,
          subjectId: sId,
          topicId: topicId,
          title: `Lesson ${i}: ${sId === 'sub-1' ? 'Advanced' : 'Introduction to'} Module ${i}`,
          date: `2023-10-${10 + i}`,
          time: "09:00 - 09:45 AM",
          duration: "45 min",
          type: i % 3 === 0 ? "Practical" : "Lecture",
          aims: [
            `Master the core concepts of Module ${i}`,
            `Apply theoretical knowledge to problem solving`,
            `Prepare for the upcoming assessment`
          ],
          structure: [
            { title: "Introduction", duration: "10 min", description: "Recap of previous lesson and goal setting." },
            { title: "Core Content", duration: "25 min", description: "Detailed explanation of new concepts." },
            { title: "Conclusion", duration: "10 min", description: "Summary and Q&A session." }
          ],
          materials: [
            { name: `Handout ${i}.pdf`, type: 'file', url: '#' },
            { name: "Reference Video", type: 'link', url: 'https://youtube.com' }
          ],
          status: i < 8 ? 'published' : 'draft'
        });
      }
    });
    return initialLessons;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('educore_students');
    return safeParse(saved, [
      { id: 'std-1', classId: 'cls-1', name: 'Alice Johnson', email: 'alice@student.com', parentEmail: 'hawino@gmail.com' },
      { id: 'std-2', classId: 'cls-1', name: 'Bob Wilson', email: 'bob@student.com', parentEmail: 'parent@example.com' },
      { id: 'std-3', classId: 'cls-2', name: 'Charlie Brown', email: 'charlie@student.com', parentEmail: 'parent@example.com' }
    ]);
  });

  const [timetable, setTimetable] = useState<TimetableEntry[]>(() => {
    const saved = localStorage.getItem('educore_timetable');
    return safeParse(saved, [
      { id: 'tt-1', classId: 'cls-1', subjectId: 'sub-1', day: 'Monday', startTime: '09:00', endTime: '09:45' },
      { id: 'tt-2', classId: 'cls-1', subjectId: 'sub-2', day: 'Monday', startTime: '10:00', endTime: '10:45' },
      { id: 'tt-3', classId: 'cls-1', subjectId: 'sub-3', day: 'Tuesday', startTime: '09:00', endTime: '09:45' },
      { id: 'tt-4', classId: 'cls-1', subjectId: 'sub-4', day: 'Wednesday', startTime: '11:00', endTime: '11:45' }
    ]);
  });

  const [grades, setGrades] = useState<Grade[]>(() => {
    const saved = localStorage.getItem('educore_grades');
    return safeParse(saved, [
      { id: 'grd-1', studentId: 'std-1', subjectId: 'sub-1', score: 85, maxScore: 100, feedback: 'Great work on Algebra!', date: '2023-10-15' },
      { id: 'grd-2', studentId: 'std-1', subjectId: 'sub-2', score: 78, maxScore: 100, feedback: 'Good understanding of Mechanics.', date: '2023-10-18' }
    ]);
  });

  const [referenceMaterials, setReferenceMaterials] = useState<ReferenceMaterial[]>(() => {
    const saved = localStorage.getItem('educore_reference_materials');
    return safeParse(saved, [
      {
        id: 'ref-1',
        title: 'Government Education Plan - Grade 1 English (Reform 2023)',
        type: 'government_plan',
        content: 'Standard curriculum for Grade 1 English language learners following the 2023 reform. Focus on basic communication, vocabulary (colors, numbers, animals), and simple greetings.',
        dateAdded: '2023-09-01'
      },
      {
        id: 'ref-2',
        title: 'Lector Script - Phonics Introduction',
        type: 'lector_script',
        content: 'Script for teaching basic phonics to young learners. Focus on vowel sounds and simple consonant-vowel-consonant (CVC) words.',
        dateAdded: '2023-09-15'
      }
    ]);
  });

  const [curriculumPreparations, setCurriculumPreparations] = useState<CurriculumPreparation[]>(() => {
    const saved = localStorage.getItem('educore_curriculum_preps');
    return safeParse(saved, []);
  });

  const [nasUrl, setNasUrl] = useState(() => {
    return localStorage.getItem('educore_nas_url') || "";
  });

  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    if (isResetting) return;
    
    const saveData = (key: string, data: any) => {
      try {
        // Defensive check against window or other restricted objects before stringifying
        const isRestricted = (val: any): boolean => {
          try {
            if (!val || typeof val !== 'object') return false;
            if (typeof window !== 'undefined' && val === window) return true;
            if (val.window === val && val.self === val) return true;
            const toString = Object.prototype.toString.call(val);
            return toString === '[object Window]' || toString === '[object global]' || toString === '[object HTMLDocument]';
          } catch (e) {
            return true;
          }
        };

        if (isRestricted(data)) {
          console.warn(`Attempted to save restricted object to ${key}`);
          return;
        }
        
        const stringified = safeStringify(data);
        localStorage.setItem(key, stringified);
      } catch (error) {
        console.error(`Failed to save ${key}:`, error);
      }
    };

    saveData('educore_schools', schools);
    saveData('educore_classes', classes);
    saveData('educore_teachers', teachers);
    saveData('educore_subjects', subjects);
    saveData('educore_topics', topics);
    saveData('educore_lessons_v2', lessons);
    saveData('educore_students', students);
    saveData('educore_timetable', timetable);
    saveData('educore_grades', grades);
    saveData('educore_reference_materials', referenceMaterials);
    saveData('educore_curriculum_preps', curriculumPreparations);
    saveData('educore_nas_url', nasUrl);
  }, [schools, classes, teachers, subjects, topics, lessons, students, timetable, grades, referenceMaterials, curriculumPreparations, nasUrl, isResetting]);

  const addSchool = (school: Omit<School, 'id'>) => {
    const id = `sch-${Date.now()}`;
    setSchools([...schools, { ...school, id }]);
  };

  const updateSchool = (id: string, updated: Partial<School>) => {
    setSchools(schools.map(s => s.id === id ? { ...s, ...updated } : s));
  };

  const addClass = (cls: Omit<Class, 'id'>) => {
    const id = `cls-${Date.now()}`;
    setClasses([...classes, { ...cls, id }]);
  };

  const updateClass = (id: string, updated: Partial<Class>) => {
    setClasses(classes.map(c => c.id === id ? { ...c, ...updated } : c));
  };

  const addTeacher = (teacher: Omit<Teacher, 'id'>) => {
    const id = `tch-${Date.now()}`;
    setTeachers([...teachers, { ...teacher, id }]);
  };

  const updateTeacher = (id: string, updated: Partial<Teacher>) => {
    setTeachers(teachers.map(t => t.id === id ? { ...t, ...updated } : t));
  };

  const addSubject = (subject: Omit<Subject, 'id'>) => {
    const id = `sub-${Date.now()}`;
    setSubjects([...subjects, { ...subject, id }]);
  };

  const updateSubject = (id: string, updated: Partial<Subject>) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, ...updated } : s));
  };

  const addTopic = (topic: Omit<Topic, 'id'>) => {
    const id = `top-${Date.now()}`;
    setTopics([...topics, { ...topic, id }]);
  };

  const updateTopic = (id: string, updated: Partial<Topic>) => {
    setTopics(topics.map(t => t.id === id ? { ...t, ...updated } : t));
  };

  const addLesson = (lesson: Omit<Lesson, 'id'>) => {
    const id = `les-${Date.now()}`;
    setLessons([...lessons, { ...lesson, id }]);
    return id;
  };

  const updateLesson = (id: string, updated: Partial<Lesson>) => {
    setLessons(lessons.map(l => l.id === id ? { ...l, ...updated } : l));
  };

  const deleteLesson = (id: string) => {
    setLessons(lessons.filter(l => l.id !== id));
  };

  const getLesson = (id: string) => lessons.find(l => l.id === id);

  const publishLesson = (id: string) => {
    setLessons(lessons.map(l => l.id === id ? { ...l, status: 'published' } : l));
  };

  const publishAll = (subjectId: string) => {
    setLessons(lessons.map(l => l.subjectId === subjectId ? { ...l, status: 'published' } : l));
  };

  const moveLesson = (id: string, direction: 'up' | 'down') => {
    const lesson = lessons.find(l => l.id === id);
    if (!lesson) return;
    
    const topicLessons = lessons
      .filter(l => l.topicId === lesson.topicId)
      .sort((a, b) => lessons.indexOf(a) - lessons.indexOf(b));
    
    const currentIndex = topicLessons.findIndex(l => l.id === id);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (targetIndex < 0 || targetIndex >= topicLessons.length) return;
    
    const targetLesson = topicLessons[targetIndex];
    const newLessons = [...lessons];
    const idx1 = lessons.indexOf(lesson);
    const idx2 = lessons.indexOf(targetLesson);
    
    [newLessons[idx1], newLessons[idx2]] = [newLessons[idx2], newLessons[idx1]];
    setLessons(newLessons);
  };

  const resetData = () => {
    setIsResetting(true);
    localStorage.clear(); // Clear everything to be safe
    window.location.href = window.location.origin;
  };

  const deleteSchool = (id: string) => {
    setSchools(schools.filter(s => s.id !== id));
  };

  const deleteClass = (id: string) => {
    setClasses(classes.filter(c => c.id !== id));
  };

  const deleteTeacher = (id: string) => {
    setTeachers(teachers.filter(t => t.id !== id));
  };

  const deleteSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  const deleteTopic = (id: string) => {
    setTopics(topics.filter(t => t.id !== id));
  };

  const addStudent = (student: Omit<Student, 'id'>) => {
    const id = `std-${Date.now()}`;
    setStudents([...students, { ...student, id }]);
  };

  const updateStudent = (id: string, updated: Partial<Student>) => {
    setStudents(students.map(s => s.id === id ? { ...s, ...updated } : s));
  };

  const deleteStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
  };

  const addTimetableEntry = (entry: Omit<TimetableEntry, 'id'>) => {
    const id = `tt-${Date.now()}`;
    setTimetable([...timetable, { ...entry, id }]);
  };

  const updateTimetableEntry = (id: string, updated: Partial<TimetableEntry>) => {
    setTimetable(timetable.map(t => t.id === id ? { ...t, ...updated } : t));
  };

  const deleteTimetableEntry = (id: string) => {
    setTimetable(timetable.filter(t => t.id !== id));
  };

  const addGrade = (grade: Omit<Grade, 'id'>) => {
    const id = `grd-${Date.now()}`;
    setGrades([...grades, { ...grade, id }]);
  };

  const updateGrade = (id: string, updated: Partial<Grade>) => {
    setGrades(grades.map(g => g.id === id ? { ...g, ...updated } : g));
  };

  const deleteGrade = (id: string) => {
    setGrades(grades.filter(g => g.id !== id));
  };

  const addReferenceMaterial = (material: Omit<ReferenceMaterial, 'id'>) => {
    const id = `ref-${Date.now()}`;
    setReferenceMaterials([...referenceMaterials, { ...material, id }]);
  };

  const deleteReferenceMaterial = (id: string) => {
    setReferenceMaterials(referenceMaterials.filter(m => m.id !== id));
  };

  const addCurriculumPreparation = (prep: Omit<CurriculumPreparation, 'id'>) => {
    const id = `prep-${Date.now()}`;
    setCurriculumPreparations([...curriculumPreparations, { ...prep, id }]);
  };

  const deleteCurriculumPreparation = (id: string) => {
    setCurriculumPreparations(curriculumPreparations.filter(p => p.id !== id));
  };

  return (
    <AcademicContext.Provider value={{
      schools, classes, teachers, subjects, topics, lessons, students, timetable, grades,
      referenceMaterials, curriculumPreparations,
      addSchool, updateSchool, deleteSchool,
      addClass, updateClass, deleteClass,
      addTeacher, updateTeacher, deleteTeacher,
      addSubject, updateSubject, deleteSubject,
      addTopic, updateTopic, deleteTopic,
      addLesson, updateLesson, deleteLesson, getLesson, publishLesson, publishAll, moveLesson,
      addStudent, updateStudent, deleteStudent,
      addTimetableEntry, updateTimetableEntry, deleteTimetableEntry,
      addGrade, updateGrade, deleteGrade,
      addReferenceMaterial, deleteReferenceMaterial,
      addCurriculumPreparation, deleteCurriculumPreparation,
      nasUrl, setNasUrl,
      resetData
    }}>
      {children}
    </AcademicContext.Provider>
  );
};

export const useAcademic = () => {
  const context = useContext(AcademicContext);
  if (!context) throw new Error('useAcademic must be used within an AcademicProvider');
  return context;
};
