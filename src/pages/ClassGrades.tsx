import { useState } from "react";
import { useAcademic, Grade, Student } from "../contexts/AcademicContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Save, Plus, Trash2, Calendar, ClipboardCheck, LayoutGrid, List } from "lucide-react";

export default function ClassGrades() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { subjects, students, grades, addGrade, updateGrade, deleteGrade, classes } = useAcademic();
  
  const subjectId = searchParams.get('subjectId');
  const classId = searchParams.get('classId') || (subjectId ? subjects.find(s => s.id === subjectId)?.classId : "");
  
  const subject = subjects.find(s => s.id === subjectId);
  const cls = classes.find(c => c.id === classId);
  const classStudents = students.filter(s => s.classId === classId);

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeStudentId, setActiveStudentId] = useState<string | null>(null);

  const handleAddGrade = (studentId: string) => {
    addGrade({
      studentId,
      subjectId: subjectId || "",
      score: 100,
      maxScore: 100,
      feedback: "Well done!",
      date
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="bg-card p-6 md:p-8 rounded-3xl border border-border flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 hover:bg-bg rounded-2xl border border-transparent hover:border-border transition-all"
          >
            <ArrowLeft className="w-6 h-6 text-text-muted" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-text-dark tracking-tight">Student Evaluations</h1>
            <p className="text-text-muted mt-1">{subject?.name} • Class {cls?.name}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="bg-bg border border-border rounded-xl px-4 py-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent text-sm font-bold focus:outline-none"
            />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Students Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-card p-6 rounded-3xl border border-border shadow-sm">
            <h2 className="text-xl font-bold text-text-dark mb-6 flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-primary" />
              Class List
            </h2>
            <div className="space-y-2">
              {classStudents.map(student => (
                <button
                  key={student.id}
                  onClick={() => setActiveStudentId(student.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                    activeStudentId === student.id 
                      ? 'bg-primary/5 border-primary text-primary shadow-sm' 
                      : 'bg-bg border-border text-text-dark hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                      activeStudentId === student.id ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
                    }`}>
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-bold text-sm truncate">{student.name}</p>
                      <p className="text-[10px] text-text-muted uppercase">ID: {student.id}</p>
                    </div>
                  </div>
                  {grades.some(g => g.studentId === student.id && g.subjectId === subjectId) && (
                    <Star className="w-4 h-4 text-primary fill-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grades Content */}
        <div className="lg:col-span-3">
          {activeStudentId ? (
            <div className="flex flex-col gap-6">
              <div className="bg-card p-8 rounded-[2.5rem] border border-border shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-text-dark">Edit Grades</h2>
                    <p className="text-text-muted text-sm mt-1">
                      Managing assessment for {students.find(s => s.id === activeStudentId)?.name}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleAddGrade(activeStudentId)}
                    className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                  >
                    <Plus className="w-5 h-5" />
                    New Assessment
                  </button>
                </div>

                <div className="space-y-6">
                  {grades.filter(g => g.studentId === activeStudentId && g.subjectId === subjectId).map(grade => (
                    <div key={grade.id} className="p-6 rounded-3xl bg-bg border border-border relative group hover:border-primary/30 transition-all">
                      <button 
                        onClick={() => deleteGrade(grade.id)}
                        className="absolute top-4 right-4 p-2 text-text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Score</label>
                          <div className="flex items-center gap-3">
                            <input 
                              type="number" 
                              value={grade.score}
                              onChange={(e) => updateGrade(grade.id, { score: parseInt(e.target.value) })}
                              className="w-20 p-3 rounded-xl border border-border bg-card font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                            <span className="text-text-muted font-bold">/</span>
                            <input 
                              type="number" 
                              value={grade.maxScore}
                              onChange={(e) => updateGrade(grade.id, { maxScore: parseInt(e.target.value) })}
                              className="w-20 p-3 rounded-xl border border-border bg-card font-bold text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                            <div className="ml-4 px-3 py-1 bg-primary/10 text-primary rounded-lg font-bold text-lg">
                              {Math.round((grade.score / grade.maxScore) * 100)}%
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Category</label>
                          <select className="w-full p-3 rounded-xl border border-border bg-card text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50">
                            <option>Exam</option>
                            <option>Homework</option>
                            <option>Participation</option>
                            <option>Project</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Date</label>
                          <input 
                            type="date" 
                            defaultValue={grade.date}
                            className="w-full p-3 rounded-xl border border-border bg-card text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                        <div className="md:col-span-4">
                          <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Feedback & Comments</label>
                          <textarea 
                            rows={3} 
                            value={grade.feedback}
                            onChange={(e) => updateGrade(grade.id, { feedback: e.target.value })}
                            className="w-full p-4 rounded-2xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                            placeholder="Add detailed feedback for the student and parents..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {grades.filter(g => g.studentId === activeStudentId && g.subjectId === subjectId).length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 bg-bg border-4 border-dashed border-border rounded-3xl opacity-40">
                      <ClipboardCheck className="w-16 h-16 text-text-muted mb-4" />
                      <h3 className="text-xl font-bold">No Assessments Found</h3>
                      <p className="text-sm">Start by adding a new assessment for this student.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card p-12 rounded-[2.5rem] border border-border shadow-sm flex flex-col items-center justify-center text-center opacity-40 h-full min-h-[400px]">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-8">
                <ClipboardCheck className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-text-dark">Select a Student</h3>
              <p className="text-sm text-text-muted max-w-xs mt-2">
                Pick a student from the class list on the left to view or manage their grades.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
