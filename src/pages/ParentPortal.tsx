import { Users, GraduationCap, BookOpen, Calendar, Clock, CheckCircle2, MessageSquare, ChevronRight, ArrowRight, Star, AlertCircle, FileText } from "lucide-react";
import { useState } from "react";
import { useAcademic } from "../contexts/AcademicContext";
import { Link } from "react-router-dom";

export default function ParentPortal() {
  const { students, classes, subjects, lessons, grades, timetable, teachers } = useAcademic();
  const [parentEmail, setParentEmail] = useState("hawino@gmail.com"); // Mock login
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Find children associated with this parent email
  const children = students.filter(s => s.parentEmail === parentEmail);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  
  const selectedChild = children.find(c => c.id === (selectedChildId || children[0]?.id));
  const childClass = classes.find(c => c.id === selectedChild?.classId);
  const childSubjects = subjects.filter(s => s.classId === selectedChild?.classId);
  const childGrades = grades.filter(g => g.studentId === selectedChild?.id);
  const childLessons = lessons.filter(l => l.subjectId && childSubjects.some(s => s.id === l.subjectId) && l.status === 'published');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (children.length > 0) {
      setIsLoggedIn(true);
      setSelectedChildId(children[0].id);
    } else {
      alert("No children found with this email. Try 'hawino@gmail.com'");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-[32px] p-10 shadow-sm border border-black/5">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">Parent Portal</h1>
          <p className="text-[#9e9e9e] mb-8">Enter your email to access your child's academic progress.</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-[#9e9e9e] uppercase tracking-widest mb-2">Parent Email</label>
              <input 
                type="email" 
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                className="w-full bg-[#f5f5f5] border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                placeholder="e.g. parent@example.com"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-primary text-white font-bold py-4 rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
              Access Portal <ArrowRight className="w-5 h-5" />
            </button>
          </form>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <p className="text-xs text-blue-600 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Demo: Use 'hawino@gmail.com'
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-20">
      {/* Top Nav */}
      <nav className="bg-white border-b border-black/5 px-8 py-4 sticky top-0 z-40 backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold">E</div>
            <span className="font-bold text-[#1a1a1a]">EDUCORE Parent</span>
          </div>
          
          <div className="flex items-center gap-6">
            {children.length > 1 && (
              <select 
                value={selectedChildId || ""}
                onChange={(e) => setSelectedChildId(e.target.value)}
                className="bg-[#f5f5f5] border-none rounded-xl px-4 py-2 text-sm font-bold focus:ring-0 outline-none"
              >
                {children.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            )}
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="text-xs font-bold text-[#9e9e9e] hover:text-red-500 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 pt-12">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Student Profile
              </span>
            </div>
            <h1 className="text-5xl font-bold text-[#1a1a1a] tracking-tight">{selectedChild?.name}</h1>
            <p className="text-[#9e9e9e] mt-2 text-lg">
              Class {childClass?.name} • {childSubjects.length} Subjects Enrolled
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white p-6 rounded-[24px] border border-black/5 shadow-sm min-w-[160px]">
              <p className="text-[10px] font-bold text-[#9e9e9e] uppercase tracking-widest mb-1">Average Grade</p>
              <p className="text-3xl font-bold text-[#1a1a1a]">
                {childGrades.length > 0 
                  ? Math.round(childGrades.reduce((acc, g) => acc + (g.score/g.maxScore)*100, 0) / childGrades.length)
                  : '--'}%
              </p>
            </div>
            <div className="bg-white p-6 rounded-[24px] border border-black/5 shadow-sm min-w-[160px]">
              <p className="text-[10px] font-bold text-[#9e9e9e] uppercase tracking-widest mb-1">Attendance</p>
              <p className="text-3xl font-bold text-green-500">98%</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Recent Progress */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Grades */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#1a1a1a]">Recent Performance</h2>
                <button className="text-sm font-bold text-primary flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {childGrades.map(grade => (
                  <div key={grade.id} className="bg-white p-6 rounded-[24px] border border-black/5 shadow-sm hover:border-primary/20 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 bg-[#f5f5f5] rounded-xl flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                        <Star className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-[#1a1a1a]">{grade.score}</span>
                        <span className="text-sm text-[#9e9e9e]">/{grade.maxScore}</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-[#1a1a1a] mb-1">
                      {subjects.find(s => s.id === grade.subjectId)?.name}
                    </h3>
                    <p className="text-sm text-[#9e9e9e] line-clamp-2 italic">"{grade.feedback}"</p>
                    <div className="mt-4 pt-4 border-t border-black/5 flex justify-between items-center">
                      <span className="text-[10px] font-bold text-[#9e9e9e] uppercase tracking-widest">{grade.date}</span>
                      <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Verified</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Upcoming Lessons */}
            <section>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6">Learning Timeline</h2>
              <div className="bg-white rounded-[32px] border border-black/5 shadow-sm overflow-hidden">
                {childLessons.slice(0, 5).map((lesson, i) => (
                  <div key={lesson.id} className={`p-6 flex items-center gap-6 ${i !== 4 ? 'border-b border-black/5' : ''} hover:bg-[#fcfcfc] transition-colors`}>
                    <div className="w-12 h-12 bg-[#f5f5f5] rounded-2xl flex flex-col items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-[#9e9e9e] uppercase leading-none mb-1">Oct</span>
                      <span className="text-lg font-bold text-[#1a1a1a] leading-none">{15 + i}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-[#1a1a1a]">{lesson.title}</h4>
                      <p className="text-xs text-[#9e9e9e] mt-1">
                        {subjects.find(s => s.id === lesson.subjectId)?.name} • {lesson.duration}
                      </p>
                    </div>
                    <div className="hidden md:flex items-center gap-2 text-xs font-bold text-green-500 bg-green-50 px-3 py-1 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Published
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#9e9e9e]" />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Schedule & Communication */}
          <div className="space-y-8">
            {/* Today's Schedule */}
            <section className="bg-white p-8 rounded-[32px] border border-black/5 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold text-[#1a1a1a]">Today's Schedule</h3>
              </div>
              <div className="space-y-6">
                {timetable
                  .filter(t => t.classId === selectedChild?.classId && t.day === 'Monday') // Mocking Monday
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map(entry => (
                    <div key={entry.id} className="relative pl-6 border-l-2 border-primary/20">
                      <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-primary"></div>
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">
                        {entry.startTime} - {entry.endTime}
                      </p>
                      <h4 className="font-bold text-[#1a1a1a] text-sm">
                        {subjects.find(s => s.id === entry.subjectId)?.name}
                      </h4>
                      <p className="text-xs text-[#9e9e9e]">
                        Teacher: {teachers.find(t => t.id === subjects.find(s => s.id === entry.subjectId)?.teacherId)?.name}
                      </p>
                    </div>
                  ))}
              </div>
            </section>

            {/* Quick Contact */}
            <section className="bg-primary p-8 rounded-[32px] text-white shadow-lg shadow-primary/20">
              <MessageSquare className="w-8 h-8 mb-4" />
              <h3 className="text-xl font-bold mb-2">Teacher Contact</h3>
              <p className="text-white/70 text-sm mb-6">Have questions about your child's progress? Send a direct message to their teachers.</p>
              <button className="w-full bg-white text-primary font-bold py-3 rounded-2xl hover:bg-white/90 transition-all flex items-center justify-center gap-2">
                New Message <ArrowRight className="w-4 h-4" />
              </button>
            </section>

            {/* Resources */}
            <section className="bg-white p-8 rounded-[32px] border border-black/5 shadow-sm">
              <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">Parent Resources</h3>
              <div className="space-y-3">
                {[
                  { name: "School Calendar 2025", icon: Calendar },
                  { name: "Parent-Teacher Guide", icon: FileText },
                  { name: "Extracurricular Activities", icon: Star }
                ].map((item, i) => (
                  <button key={i} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#f5f5f5] transition-colors group">
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4 text-[#9e9e9e] group-hover:text-primary transition-colors" />
                      <span className="text-sm font-medium text-[#1a1a1a]">{item.name}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#9e9e9e]" />
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
