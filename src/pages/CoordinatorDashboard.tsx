import { Users, GraduationCap, BookOpen, Settings, School, Plus, Trash2, MoreVertical, Edit2, ChevronRight, X, RefreshCw, UserCheck, Calendar as CalendarIcon, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAcademic, School as SchoolType, Class as ClassType, Teacher as TeacherType, Subject as SubjectType, Student as StudentType, TimetableEntry } from "../contexts/AcademicContext";

export default function CoordinatorDashboard() {
  const { 
    schools, classes, teachers, subjects, students, timetable,
    addSchool, updateSchool, deleteSchool,
    addClass, updateClass, deleteClass,
    addTeacher, updateTeacher, deleteTeacher,
    addSubject, updateSubject, deleteSubject,
    addStudent, updateStudent, deleteStudent,
    addTimetableEntry, updateTimetableEntry, deleteTimetableEntry,
    resetData
  } = useAcademic();

  const [activeTab, setActiveTab] = useState<"overview" | "classes" | "teachers" | "subjects" | "students" | "timetable">("overview");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"school" | "class" | "teacher" | "subject" | "student" | "timetable">("class");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || "");

  // Form States
  const [formData, setFormData] = useState<any>({});

  const stats = [
    { label: "Total Schools", value: schools.length, icon: School, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Total Classes", value: classes.length, icon: GraduationCap, color: "text-purple-600", bg: "bg-purple-100" },
    { label: "Total Teachers", value: teachers.length, icon: Users, color: "text-orange-600", bg: "bg-orange-100" },
    { label: "Total Students", value: students.length, icon: UserCheck, color: "text-green-600", bg: "bg-green-100" },
  ];

  const openModal = (type: typeof modalType, id: string | null = null) => {
    setModalType(type);
    setEditingId(id);
    if (id) {
      if (type === 'school') {
        const school = schools.find(s => s.id === id);
        setFormData({ name: school?.name, address: school?.address });
      } else if (type === 'class') {
        const cls = classes.find(c => c.id === id);
        setFormData({ name: cls?.name, schoolId: cls?.schoolId, year: cls?.year });
      } else if (type === 'teacher') {
        const teacher = teachers.find(t => t.id === id);
        setFormData({ name: teacher?.name, email: teacher?.email, specialization: teacher?.specialization.join(', ') });
      } else if (type === 'subject') {
        const sub = subjects.find(s => s.id === id);
        setFormData({ name: sub?.name, classId: sub?.classId, teacherIds: sub?.teacherIds || [] });
      } else if (type === 'student') {
        const student = students.find(s => s.id === id);
        setFormData({ name: student?.name, email: student?.email, classId: student?.classId, parentEmail: student?.parentEmail });
      } else if (type === 'timetable') {
        const entry = timetable.find(t => t.id === id);
        setFormData({ classId: entry?.classId, subjectId: entry?.subjectId, day: entry?.day, startTime: entry?.startTime, endTime: entry?.endTime });
      }
    } else {
      setFormData({});
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (modalType === 'school') {
      if (editingId) updateSchool(editingId, formData);
      else addSchool(formData);
    } else if (modalType === 'class') {
      if (editingId) updateClass(editingId, formData);
      else addClass(formData);
    } else if (modalType === 'teacher') {
      const data = { ...formData, specialization: formData.specialization?.split(',').map((s: string) => s.trim()) || [] };
      if (editingId) updateTeacher(editingId, data);
      else addTeacher(data);
    } else if (modalType === 'subject') {
      if (editingId) updateSubject(editingId, formData);
      else addSubject(formData);
    } else if (modalType === 'student') {
      if (editingId) updateStudent(editingId, formData);
      else addStudent(formData);
    } else if (modalType === 'timetable') {
      if (editingId) updateTimetableEntry(editingId, formData);
      else addTimetableEntry(formData);
    }
    setShowModal(false);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <header 
        className="bg-card p-6 md:p-8 rounded-3xl border border-border flex flex-col lg:flex-row justify-between items-center gap-6 shadow-sm"
      >
        <div className="w-full lg:w-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-text-dark">Coordinator Dashboard</h1>
          <p className="text-text-muted mt-1 text-sm">Manage schools, classes, teachers, and curriculum structure.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          {isResetting ? (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button 
                onClick={() => resetData()}
                className="flex-1 sm:flex-none bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-700 transition-all"
              >
                Confirm Reset
              </button>
              <button 
                onClick={() => setIsResetting(false)}
                className="flex-1 sm:flex-none bg-bg text-text-muted border border-border px-4 py-2 rounded-xl text-xs font-bold hover:bg-card transition-all"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsResetting(true)}
              className="w-full sm:w-auto bg-bg text-text-muted border border-border px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
            >
              <RefreshCw className="w-3 h-3" />
              Reset System Data
            </button>
          )}
          <button 
            onClick={() => openModal('class')}
            className="w-full sm:w-auto bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            <Plus className="w-5 h-5" />
            Add New Entity
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card p-6 rounded-3xl border border-border shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-muted">{stat.label}</p>
                <p className="text-2xl font-bold text-text-dark">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-8 overflow-x-auto">
        {["overview", "classes", "teachers", "subjects", "students", "timetable"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all relative ${
              activeTab === tab ? "text-primary" : "text-text-muted hover:text-text-dark"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-card p-6 rounded-3xl border border-border shadow-sm">
              <h3 className="text-xl font-bold text-text-dark mb-6">Recent Schools</h3>
              <div className="space-y-4">
                {schools.map(school => (
                  <div key={school.id} className="flex items-center justify-between p-4 rounded-2xl bg-bg border border-border">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                        {school.name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-text-dark">{school.name}</p>
                        <p className="text-xs text-text-muted">{school.address}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openModal('school', school.id)} className="text-text-muted hover:text-primary">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteSchool(school.id)} className="text-text-muted hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card p-6 rounded-3xl border border-border shadow-sm">
              <h3 className="text-xl font-bold text-text-dark mb-6">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => openModal('school')} className="p-4 rounded-2xl border border-border hover:border-primary hover:bg-primary/5 transition-all text-center">
                  <School className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <span className="text-sm font-bold">Add School</span>
                </button>
                <button onClick={() => openModal('teacher')} className="p-4 rounded-2xl border border-border hover:border-orange-500 hover:bg-orange-50 transition-all text-center">
                  <Users className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                  <span className="text-sm font-bold">Add Teacher</span>
                </button>
                <button onClick={() => openModal('class')} className="p-4 rounded-2xl border border-border hover:border-purple-500 hover:bg-purple-50 transition-all text-center">
                  <GraduationCap className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                  <span className="text-sm font-bold">Add Class</span>
                </button>
                <button onClick={() => openModal('subject')} className="p-4 rounded-2xl border border-border hover:border-lime-500 hover:bg-lime-50 transition-all text-center">
                  <BookOpen className="w-6 h-6 mx-auto mb-2 text-lime-500" />
                  <span className="text-sm font-bold">Add Subject</span>
                </button>
                <button onClick={() => openModal('student')} className="p-4 rounded-2xl border border-border hover:border-green-500 hover:bg-green-50 transition-all text-center">
                  <UserCheck className="w-6 h-6 mx-auto mb-2 text-green-500" />
                  <span className="text-sm font-bold">Add Student</span>
                </button>
                <button onClick={() => openModal('timetable')} className="p-4 rounded-2xl border border-border hover:border-blue-500 hover:bg-blue-50 transition-all text-center">
                  <CalendarIcon className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                  <span className="text-sm font-bold">Schedule Class</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "classes" && (
          <div className="grid grid-cols-1 gap-6">
            {classes.map((cls) => (
              <div key={cls.id} className="bg-card p-6 rounded-3xl border border-border shadow-sm hover:border-primary/50 transition-all">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-text-dark flex items-center gap-2">
                      <GraduationCap className="w-6 h-6 text-purple-600" />
                      Class {cls.name}
                    </h3>
                    <p className="text-sm text-text-muted mt-1">
                      {schools.find(s => s.id === cls.schoolId)?.name} • Academic Year {cls.year}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openModal('class', cls.id)} className="px-4 py-2 rounded-xl border border-border text-sm font-bold hover:bg-bg transition-colors flex items-center gap-2">
                      <Edit2 className="w-4 h-4" /> Edit
                    </button>
                    <button onClick={() => deleteClass(cls.id)} className="px-4 py-2 rounded-xl border border-border text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2">
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-bg rounded-2xl p-4 border border-border">
                    <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">Assigned Subjects</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {subjects.filter(s => s.classId === cls.id).map(sub => (
                        <div key={sub.id} className="bg-card p-3 rounded-xl border border-border flex items-center justify-between group">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-lime-100 text-lime-600 flex items-center justify-center">
                              <BookOpen className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-text-dark">{sub.name}</p>
                              <p className="text-[10px] text-text-muted">
                                {sub.teacherIds.length > 0 
                                  ? sub.teacherIds.map(tid => teachers.find(t => t.id === tid)?.name).filter(Boolean).join(', ')
                                  : 'No Teacher'}
                              </p>
                            </div>
                          </div>
                          <button onClick={() => openModal('subject', sub.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-text-muted hover:text-primary">
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => {setFormData({ classId: cls.id }); openModal('subject');}}
                        className="p-3 rounded-xl border border-dashed border-border text-text-muted hover:text-primary hover:border-primary transition-all flex items-center justify-center gap-2 text-sm font-medium"
                      >
                        <Plus className="w-4 h-4" /> Add Subject
                      </button>
                    </div>
                  </div>

                  <div className="bg-bg rounded-2xl p-4 border border-border">
                    <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">Enrolled Students ({students.filter(s => s.classId === cls.id).length})</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {students.filter(s => s.classId === cls.id).map(std => (
                        <div key={std.id} className="bg-card p-3 rounded-xl border border-border flex items-center justify-between group">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center font-bold text-[10px]">
                              {std.name[0]}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-text-dark">{std.name}</p>
                              <p className="text-[10px] text-text-muted truncate max-w-[100px]">{std.email}</p>
                            </div>
                          </div>
                          <button onClick={() => openModal('student', std.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-text-muted hover:text-primary">
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => {setFormData({ classId: cls.id }); openModal('student');}}
                        className="p-3 rounded-xl border border-dashed border-border text-text-muted hover:text-primary hover:border-primary transition-all flex items-center justify-center gap-2 text-sm font-medium"
                      >
                        <Plus className="w-4 h-4" /> Add Student
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {classes.length === 0 && (
              <div className="text-center py-20 bg-card rounded-3xl border border-border border-dashed">
                <GraduationCap className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-20" />
                <p className="text-text-muted font-medium">No classes found. Add your first class to get started.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "teachers" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((teacher) => (
              <div key={teacher.id} className="bg-card p-6 rounded-3xl border border-border shadow-sm hover:border-primary/50 transition-all flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xl">
                    {teacher.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-text-dark truncate">{teacher.name}</h4>
                    <p className="text-xs text-text-muted truncate">{teacher.email}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Specialization</p>
                  <div className="flex flex-wrap gap-2">
                    {teacher.specialization.map((spec, i) => (
                      <span key={i} className="px-2 py-1 rounded-lg bg-bg border border-border text-[10px] font-bold text-text-muted uppercase tracking-wider">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-6 flex-1">
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Teaching Subjects</p>
                  <div className="space-y-2">
                    {subjects.filter(s => s.teacherIds.includes(teacher.id)).map(sub => (
                      <div key={sub.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-bg border border-border">
                        <span className="font-medium text-text-dark">{sub.name}</span>
                        <span className="text-text-muted">Class {classes.find(c => c.id === sub.classId)?.name}</span>
                      </div>
                    ))}
                    {subjects.filter(s => s.teacherIds.includes(teacher.id)).length === 0 && (
                      <p className="text-xs text-text-muted italic">No subjects assigned yet.</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => openModal('teacher', teacher.id)} className="flex-1 py-2 rounded-xl border border-border text-sm font-bold hover:bg-bg transition-colors">Edit</button>
                  <button onClick={() => deleteTeacher(teacher.id)} className="px-3 py-2 rounded-xl border border-border text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "subjects" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((sub) => (
              <div key={sub.id} className="bg-card p-6 rounded-3xl border border-border shadow-sm hover:border-primary/50 transition-all flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-lime-100 text-lime-600 flex items-center justify-center">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <span className="bg-bg px-3 py-1 rounded-full text-[10px] font-bold text-text-muted uppercase tracking-wider border border-border">
                    Class {classes.find(c => c.id === sub.classId)?.name}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-text-dark mb-2">{sub.name}</h3>
                
                <div className="mb-6 flex-1">
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Teachers</p>
                  <div className="flex flex-col gap-2">
                    {sub.teacherIds.map(tid => {
                      const teacher = teachers.find(t => t.id === tid);
                      return (
                        <div key={tid} className="flex items-center gap-3 p-3 rounded-2xl bg-bg border border-border">
                          <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                            {teacher?.name[0] || '?'}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-text-dark">{teacher?.name || 'Unknown'}</p>
                            <p className="text-[10px] text-text-muted">{teacher?.email || ''}</p>
                          </div>
                        </div>
                      );
                    })}
                    {sub.teacherIds.length === 0 && (
                      <div className="p-3 rounded-2xl bg-bg border border-dashed border-border flex items-center justify-center">
                        <p className="text-xs text-text-muted italic">Unassigned</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => openModal('subject', sub.id)} className="flex-1 py-2 rounded-xl border border-border text-sm font-bold hover:bg-bg transition-colors">Edit</button>
                  <button onClick={() => deleteSubject(sub.id)} className="px-3 py-2 rounded-xl border border-border text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {subjects.length === 0 && (
              <div className="col-span-full text-center py-20 bg-card rounded-3xl border border-border border-dashed">
                <BookOpen className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-20" />
                <p className="text-text-muted font-medium">No subjects found. Add your first subject to get started.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "students" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <div key={student.id} className="bg-card p-6 rounded-3xl border border-border shadow-sm hover:border-primary/50 transition-all flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center font-bold text-xl">
                    {student.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-text-dark truncate">{student.name}</h4>
                    <p className="text-xs text-text-muted truncate">{student.email}</p>
                  </div>
                </div>
                
                <div className="mb-6 flex-1">
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Class Assignment</p>
                  <div className="p-3 rounded-2xl bg-bg border border-border">
                    <p className="text-sm font-bold text-text-dark">Class {classes.find(c => c.id === student.classId)?.name || 'Unassigned'}</p>
                    <p className="text-[10px] text-text-muted">{schools.find(s => s.id === classes.find(c => c.id === student.classId)?.schoolId)?.name || 'No School'}</p>
                  </div>
                  {student.parentEmail && (
                    <div className="mt-3">
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Parent Email</p>
                      <p className="text-xs text-text-dark">{student.parentEmail}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button onClick={() => openModal('student', student.id)} className="flex-1 py-2 rounded-xl border border-border text-sm font-bold hover:bg-bg transition-colors">Edit</button>
                  <button onClick={() => deleteStudent(student.id)} className="px-3 py-2 rounded-xl border border-border text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {students.length === 0 && (
              <div className="col-span-full text-center py-20 bg-card rounded-3xl border border-border border-dashed">
                <UserCheck className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-20" />
                <p className="text-text-muted font-medium">No students found. Add your first student to get started.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "timetable" && (
          <div className="bg-card rounded-3xl border border-border shadow-sm p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
              <div>
                <h3 className="text-xl font-bold text-text-dark">Class Timetable</h3>
                <p className="text-sm text-text-muted mt-1">Manage weekly schedules for each class.</p>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <select 
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="bg-bg border border-border rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:border-primary"
                >
                  {classes.map(c => <option key={c.id} value={c.id}>Class {c.name}</option>)}
                </select>
                <button 
                  onClick={() => {setFormData({ classId: selectedClassId }); openModal('timetable');}}
                  className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Slot
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                <div key={day} className="flex flex-col gap-4">
                  <div className="bg-bg p-3 rounded-xl border border-border text-center">
                    <span className="text-xs font-bold text-text-dark uppercase tracking-widest">{day}</span>
                  </div>
                  <div className="space-y-3">
                    {timetable
                      .filter(t => t.classId === selectedClassId && t.day === day)
                      .sort((a, b) => a.startTime.localeCompare(b.startTime))
                      .map(entry => (
                        <div key={entry.id} className="bg-card p-4 rounded-2xl border border-border hover:border-primary/30 transition-all group relative">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/5 px-2 py-0.5 rounded">
                              {entry.startTime} - {entry.endTime}
                            </span>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => openModal('timetable', entry.id)} className="text-text-muted hover:text-primary p-1">
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button onClick={() => deleteTimetableEntry(entry.id)} className="text-text-muted hover:text-red-500 p-1">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          <h4 className="font-bold text-text-dark text-sm">{subjects.find(s => s.id === entry.subjectId)?.name || 'Unknown'}</h4>
                          <p className="text-[10px] text-text-muted mt-1">
                            {(() => {
                              const sub = subjects.find(s => s.id === entry.subjectId);
                              return sub?.teacherIds.length 
                                ? sub.teacherIds.map(tid => teachers.find(t => t.id === tid)?.name).filter(Boolean).join(', ')
                                : 'No Teacher';
                            })()}
                          </p>
                        </div>
                      ))}
                    {timetable.filter(t => t.classId === selectedClassId && t.day === day).length === 0 && (
                      <div className="py-8 text-center border border-dashed border-border rounded-2xl">
                        <span className="text-[10px] text-text-muted italic">No classes</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md rounded-3xl p-8 border border-border shadow-2xl relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-text-muted hover:text-text-dark"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-text-dark mb-6">
              {editingId ? 'Edit' : 'Add New'} {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
            </h2>
            
            <div className="space-y-4">
              {modalType === 'school' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">School Name</label>
                    <input 
                      type="text" 
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-bg border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                      placeholder="e.g. EDUCORE Academy"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Address</label>
                    <input 
                      type="text" 
                      value={formData.address || ''}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full bg-bg border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                      placeholder="e.g. London, UK"
                    />
                  </div>
                </>
              )}

              {modalType === 'class' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Class Name</label>
                    <input 
                      type="text" 
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-bg border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                      placeholder="e.g. 10-A"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">School</label>
                    <select 
                      value={formData.schoolId || ''}
                      onChange={(e) => setFormData({...formData, schoolId: e.target.value})}
                      className="w-full bg-bg border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    >
                      <option value="">Select School</option>
                      {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Year</label>
                    <input 
                      type="text" 
                      value={formData.year || ''}
                      onChange={(e) => setFormData({...formData, year: e.target.value})}
                      className="w-full bg-bg border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                      placeholder="e.g. 2025"
                    />
                  </div>
                </>
              )}

              {modalType === 'teacher' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Full Name</label>
                    <input 
                      type="text" 
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-bg border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                      placeholder="e.g. Mr. Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Email</label>
                    <input 
                      type="email" 
                      value={formData.email || ''}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-bg border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                      placeholder="e.g. smith@educore.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Specialization (comma separated)</label>
                    <input 
                      type="text" 
                      value={formData.specialization || ''}
                      onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                      className="w-full bg-bg border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                      placeholder="e.g. Mathematics, Physics"
                    />
                  </div>
                </>
              )}

              {modalType === 'subject' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Subject Name</label>
                    <input 
                      type="text" 
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-bg border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                      placeholder="e.g. Mathematics"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Class</label>
                    <select 
                      value={formData.classId || ''}
                      onChange={(e) => setFormData({...formData, classId: e.target.value})}
                      className="w-full bg-bg border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    >
                      <option value="">Select Class</option>
                      {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Teachers</label>
                    <div className="grid grid-cols-2 gap-2 bg-bg border border-border rounded-2xl p-4 max-h-[160px] overflow-y-auto">
                      {teachers.map(t => (
                        <label key={t.id} className="flex items-center gap-2 cursor-pointer hover:bg-card p-1 rounded-lg transition-all">
                          <input 
                            type="checkbox" 
                            checked={(formData.teacherIds || []).includes(t.id)}
                            onChange={(e) => {
                              const current = formData.teacherIds || [];
                              if (e.target.checked) {
                                setFormData({...formData, teacherIds: [...current, t.id]});
                              } else {
                                setFormData({...formData, teacherIds: current.filter((id: string) => id !== t.id)});
                              }
                            }}
                            className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                          />
                          <span className="text-xs font-medium text-text-dark">{t.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {modalType === 'student' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Student Name</label>
                    <input 
                      type="text" 
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-bg border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                      placeholder="e.g. Alice Johnson"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Email</label>
                    <input 
                      type="email" 
                      value={formData.email || ''}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-bg border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                      placeholder="e.g. alice@student.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Class</label>
                    <select 
                      value={formData.classId || ''}
                      onChange={(e) => setFormData({...formData, classId: e.target.value})}
                      className="w-full bg-bg border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    >
                      <option value="">Select Class</option>
                      {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Parent Email (Optional)</label>
                    <input 
                      type="email" 
                      value={formData.parentEmail || ''}
                      onChange={(e) => setFormData({...formData, parentEmail: e.target.value})}
                      className="w-full bg-bg border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                      placeholder="e.g. parent@example.com"
                    />
                  </div>
                </>
              )}

              {modalType === 'timetable' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Class</label>
                    <select 
                      value={formData.classId || ''}
                      onChange={(e) => setFormData({...formData, classId: e.target.value})}
                      className="w-full bg-bg border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    >
                      <option value="">Select Class</option>
                      {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Subject</label>
                    <select 
                      value={formData.subjectId || ''}
                      onChange={(e) => setFormData({...formData, subjectId: e.target.value})}
                      className="w-full bg-bg border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    >
                      <option value="">Select Subject</option>
                      {subjects.filter(s => s.classId === formData.classId).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Day</label>
                    <select 
                      value={formData.day || ''}
                      onChange={(e) => setFormData({...formData, day: e.target.value as any})}
                      className="w-full bg-bg border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    >
                      <option value="">Select Day</option>
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Start Time</label>
                      <input 
                        type="time" 
                        value={formData.startTime || ''}
                        onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                        className="w-full bg-bg border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">End Time</label>
                      <input 
                        type="time" 
                        value={formData.endTime || ''}
                        onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                        className="w-full bg-bg border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-2xl border border-border font-bold hover:bg-bg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="flex-1 py-3 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                Save {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
