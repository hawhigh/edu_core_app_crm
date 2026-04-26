import { Book, MessageSquare, FileText, CheckCircle2, Clock, Calendar, Bell, Search, Filter, LayoutGrid, List, ChevronRight, Atom, Calculator, Languages, History as HistoryIcon, FlaskConical, Cpu, Palette, Music, Globe, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAcademic } from "../contexts/AcademicContext";
import { useState } from "react";

export default function StudentDashboard() {
  const { lessons, subjects, classes, timetable, teachers, grades } = useAcademic();
  const navigate = useNavigate();
  const [view, setView] = useState<"grid" | "list">("grid");

  // Mocking current student in Class 10-A (cls-1)
  const currentClassId = 'cls-1';
  const studentSubjects = subjects.filter(s => s.classId === currentClassId);
  const publishedLessons = lessons.filter(l => l.status === 'published' && studentSubjects.some(s => s.id === l.subjectId));
  const studentGrades = grades.filter(g => g.studentId === 'std-1');

  const getSubjectStyle = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('math')) return { icon: Calculator, color: 'bg-blue-100 text-blue-700', border: 'hover:border-blue-400' };
    if (n.includes('physic')) return { icon: Atom, color: 'bg-purple-100 text-purple-700', border: 'hover:border-purple-400' };
    if (n.includes('chem')) return { icon: FlaskConical, color: 'bg-teal-100 text-teal-700', border: 'hover:border-teal-400' };
    if (n.includes('biol')) return { icon: FlaskConical, color: 'bg-green-100 text-green-700', border: 'hover:border-green-400' };
    if (n.includes('hist')) return { icon: HistoryIcon, color: 'bg-orange-100 text-orange-700', border: 'hover:border-orange-400' };
    if (n.includes('lit') || n.includes('lang') || n.includes('english')) return { icon: Languages, color: 'bg-pink-100 text-pink-700', border: 'hover:border-pink-400' };
    if (n.includes('comp') || n.includes('it') || n.includes('tech')) return { icon: Cpu, color: 'bg-indigo-100 text-indigo-700', border: 'hover:border-indigo-400' };
    if (n.includes('art')) return { icon: Palette, color: 'bg-rose-100 text-rose-700', border: 'hover:border-rose-400' };
    if (n.includes('music')) return { icon: Music, color: 'bg-cyan-100 text-cyan-700', border: 'hover:border-cyan-400' };
    if (n.includes('geog')) return { icon: Globe, color: 'bg-yellow-100 text-yellow-700', border: 'hover:border-yellow-400' };
    return { icon: Book, color: 'bg-gray-100 text-gray-700', border: 'hover:border-gray-400' };
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header / Student Details */}
      <header 
        className="bg-card p-6 md:p-8 rounded-3xl border border-border flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm"
      >
        <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl md:text-3xl font-bold text-primary shrink-0">
            JS
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-text-dark truncate">John Smith</h1>
            <p className="text-text-muted mt-1 text-sm">ID: #STU-84920</p>
          </div>
        </div>
        <div className="bg-lime/20 text-lime-700 px-6 py-3 rounded-2xl font-bold text-base md:text-lg border border-lime/30 w-full md:w-auto text-center">
          Class 10-A
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Subjects */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-text-dark">My Subjects</h2>
            <div className="flex bg-bg p-1 rounded-xl border border-border">
              <button onClick={() => setView("grid")} className={`p-2 rounded-lg ${view === "grid" ? "bg-card shadow-sm text-primary" : "text-text-muted"}`}><LayoutGrid className="w-4 h-4" /></button>
              <button onClick={() => setView("list")} className={`p-2 rounded-lg ${view === "list" ? "bg-card shadow-sm text-primary" : "text-text-muted"}`}><List className="w-4 h-4" /></button>
            </div>
          </div>
          
          <div 
            className={`grid gap-4 ${view === "grid" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}
          >
            {studentSubjects.map((subject) => {
              const style = getSubjectStyle(subject.name);
              const Icon = style.icon;
              return (
                <div key={subject.id}>
                  <Link 
                    to={`/subject?subjectId=${subject.id}`}
                    className={`block h-full bg-card p-5 rounded-3xl border border-border ${style.border} hover:shadow-md transition-all group flex items-center justify-between`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${style.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-text-dark group-hover:text-primary transition-colors">{subject.name}</h3>
                        <p className="text-sm text-text-muted">Class {classes.find(c => c.id === subject.classId)?.name}</p>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-text-dark bg-bg px-3 py-1 rounded-xl">
                      A
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Timetable Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-text-dark mb-6">Weekly Schedule</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                <div key={day} className="flex flex-col gap-3">
                  <div className="bg-bg p-2 rounded-xl border border-border text-center">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{day}</span>
                  </div>
                  <div className="space-y-3">
                    {timetable
                      .filter(t => t.classId === currentClassId && t.day === day)
                      .sort((a, b) => a.startTime.localeCompare(b.startTime))
                      .map(entry => (
                        <div key={entry.id} className="bg-card p-3 rounded-2xl border border-border hover:border-primary/30 transition-all">
                          <p className="text-[9px] font-bold text-primary uppercase mb-1">{entry.startTime}</p>
                          <h4 className="font-bold text-text-dark text-xs truncate">{subjects.find(s => s.id === entry.subjectId)?.name}</h4>
                        </div>
                      ))}
                    {timetable.filter(t => t.classId === currentClassId && t.day === day).length === 0 && (
                      <div className="py-4 text-center border border-dashed border-border rounded-2xl">
                        <span className="text-[9px] text-text-muted italic">Free</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Previous Lessons Section */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-text-dark">Previous Lessons</h2>
              <button className="text-primary font-medium hover:underline">View History</button>
            </div>
            <div className="bg-card rounded-3xl border border-border overflow-hidden">
              <div className="divide-y divide-border">
                {publishedLessons.slice(0, 5).map((lesson, i) => {
                  const sub = subjects.find(s => s.id === lesson.subjectId);
                  return (
                    <div 
                      key={lesson.id} 
                      onClick={() => navigate(`/subject?id=${lesson.id}`)}
                      className="p-4 flex items-center justify-between hover:bg-bg transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          i % 4 === 0 ? "bg-blue-100 text-blue-600" : 
                          i % 4 === 1 ? "bg-purple-100 text-purple-600" : 
                          i % 4 === 2 ? "bg-pink-100 text-pink-600" : 
                          "bg-green-100 text-green-600"
                        }`}>
                          <Book className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-text-dark group-hover:text-primary transition-colors">{lesson.title}</h4>
                          <p className="text-xs text-text-muted">{sub?.name} • {lesson.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">Completed</span>
                        <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Messages & Homework */}
        <div 
          className="flex flex-col gap-8"
        >
          {/* Messages */}
          <div className="bg-card p-6 rounded-3xl border border-border">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-text-dark">Recent Messages</h2>
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                3
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <Link to="/messages" key={i} className="flex gap-4 p-3 rounded-2xl hover:bg-bg transition-colors cursor-pointer relative">
                  {i === 1 && <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary"></div>}
                  <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-text-dark">Mr. Smith</h4>
                    <p className="text-xs text-text-muted line-clamp-2 mt-1">Don't forget the upcoming math test on Friday. Please review chapters 4 and 5.</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Homework & Files */}
          <div className="bg-card p-6 rounded-3xl border border-border">
            <h2 className="text-xl font-bold text-text-dark mb-6">Tasks & Files</h2>
            
            <Link to="/student/homework" className="w-full bg-primary text-white py-4 rounded-2xl font-bold mb-6 hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
              <FileText className="w-5 h-5" />
              View Homework
            </Link>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">Physics Lab Report</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-orange-500" />
                <span className="text-sm font-medium">History Essay (Due Tmrw)</span>
              </div>
            </div>
          </div>

          {/* Evaluation */}
          <div className="bg-card p-6 rounded-3xl border border-border bg-gradient-to-br from-card to-lime/5">
            <h2 className="text-xl font-bold text-text-dark mb-4">Latest Feedback</h2>
            {studentGrades.length > 0 ? (
              <div className="space-y-4">
                {studentGrades.slice(0, 2).map(grade => (
                  <div key={grade.id} className="border-l-2 border-primary/20 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="w-3 h-3 text-primary fill-primary" />
                      <span className="text-[10px] font-bold text-primary uppercase">{subjects.find(s => s.id === grade.subjectId)?.name}</span>
                    </div>
                    <p className="text-sm text-text-muted italic">"{grade.feedback}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted italic">"John has shown excellent progress in Mathematics this term. He participates actively in class discussions."</p>
            )}
            <div className="mt-4 text-xs font-bold text-primary uppercase tracking-wider">
              - Academic Review
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
