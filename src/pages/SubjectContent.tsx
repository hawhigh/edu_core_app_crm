import { Clock, FileText, Link as LinkIcon, CheckCircle2, History, ChevronRight, Calendar, ArrowLeft, BookOpen, Atom, Calculator, Languages, History as HistoryIcon, FlaskConical, Cpu, Palette, Music, Globe, Book } from "lucide-react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useAcademic } from "../contexts/AcademicContext";
import { useEffect, useState } from "react";

export default function SubjectContent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getLesson, lessons, subjects, classes, topics, teachers } = useAcademic();
  
  const lessonId = searchParams.get("id");
  const subjectId = searchParams.get("subjectId");

  let lesson = lessonId ? getLesson(lessonId) : null;
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [lessonId]);
  
  // If no specific lesson ID, but subjectId is provided, find the latest published lesson for that subject
  if (!lesson && subjectId) {
    const subjectLessons = lessons
      .filter(l => l.subjectId === subjectId && l.status === 'published')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    lesson = subjectLessons[0];
  }

  // Fallback to first published lesson if still nothing
  if (!lesson && !subjectId && !lessonId) {
    lesson = lessons.find(l => l.status === 'published');
  }

  const subject = subjects.find(s => s.id === (lesson?.subjectId || subjectId));
  const cls = classes.find(c => c.id === subject?.classId);
  const topic = topics.find(t => t.id === lesson?.topicId);
  const teacher = teachers.find(t => t.id === subject?.teacherId);

  const [showAllHistory, setShowAllHistory] = useState(false);

  const getSubjectStyle = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('math')) return { icon: Calculator, color: 'bg-blue-100 text-blue-700' };
    if (n.includes('physic')) return { icon: Atom, color: 'bg-purple-100 text-purple-700' };
    if (n.includes('chem')) return { icon: FlaskConical, color: 'bg-teal-100 text-teal-700' };
    if (n.includes('biol')) return { icon: FlaskConical, color: 'bg-green-100 text-green-700' };
    if (n.includes('hist')) return { icon: HistoryIcon, color: 'bg-orange-100 text-orange-700' };
    if (n.includes('lit') || n.includes('lang') || n.includes('english')) return { icon: Languages, color: 'bg-pink-100 text-pink-700' };
    if (n.includes('comp') || n.includes('it') || n.includes('tech')) return { icon: Cpu, color: 'bg-indigo-100 text-indigo-700' };
    if (n.includes('art')) return { icon: Palette, color: 'bg-rose-100 text-rose-700' };
    if (n.includes('music')) return { icon: Music, color: 'bg-cyan-100 text-cyan-700' };
    if (n.includes('geog')) return { icon: Globe, color: 'bg-yellow-100 text-yellow-700' };
    return { icon: Book, color: 'bg-gray-100 text-gray-700' };
  };

  const subjectStyle = subject ? getSubjectStyle(subject.name) : { icon: BookOpen, color: 'bg-gray-100 text-gray-700' };
  const SubjectIcon = subjectStyle.icon;

  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 bg-card rounded-3xl border border-border">
        <BookOpen className="w-16 h-16 text-text-muted" />
        <h2 className="text-2xl font-bold text-text-dark">No Lessons Found</h2>
        <p className="text-text-muted">There are no published lessons for this subject yet.</p>
        <button onClick={() => navigate(-1)} className="text-primary font-bold hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div key={lesson.id} className="flex flex-col gap-8">
      {/* Header */}
      <header 
        className="bg-card p-8 rounded-3xl border border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm"
      >
        <div className="flex items-center gap-6">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${subjectStyle.color}`}>
            <SubjectIcon className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Class {cls?.name}</span>
              <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{topic?.title || 'General'}</span>
            </div>
            <h1 className="text-3xl font-bold text-text-dark">{subject?.name}: {lesson.title}</h1>
            <p className="text-text-muted mt-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {lesson.date} • {lesson.time}
            </p>
          </div>
        </div>
        <div className="text-right flex flex-col items-end gap-3">
          <Link to="/student" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Back to Dashboard
          </Link>
          <div>
            <div className="text-sm text-text-muted mb-1 font-medium">Teacher</div>
            <div className="font-bold text-lg text-primary">{teacher?.name || 'Mr. Smith'}</div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Current Lesson Details */}
          <div className="flex flex-col gap-6">
            {/* Aim of Lesson */}
            <div className="bg-card p-6 rounded-3xl border border-border shadow-sm">
              <h2 className="text-xl font-bold text-text-dark mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                Aim of Lesson
              </h2>
              <ul className="space-y-3">
                {lesson.aims.map((aim, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-lime-500 mt-2 shrink-0"></div>
                    <span className="text-text-dark">{aim}</span>
                  </li>
                ))}
                {lesson.aims.length === 0 && (
                  <li className="text-text-muted italic">No specific aims defined for this lesson.</li>
                )}
              </ul>
            </div>

            {/* Lesson Structure */}
            <div className="bg-card p-6 rounded-3xl border border-border shadow-sm">
              <h2 className="text-xl font-bold text-text-dark mb-6">Lesson Structure</h2>
              
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                
                {lesson.structure.map((phase, index) => (
                  <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-card font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 ${
                      index === 0 ? "bg-primary text-white" : index === 1 ? "bg-accent text-white" : "bg-lime-500 text-white"
                    }`}>
                      {index + 1}
                    </div>
                    <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-border bg-bg transition-colors ${
                      index === 0 ? "hover:border-primary/50" : index === 1 ? "hover:border-accent/50" : "hover:border-lime-500/50"
                    }`}>
                      <h3 className="font-bold text-text-dark mb-1">{phase.title} ({phase.duration})</h3>
                      <p className="text-sm text-text-muted">{phase.description}</p>
                    </div>
                  </div>
                ))}
                {lesson.structure.length === 0 && (
                  <p className="text-center py-8 text-text-muted italic">No structure defined.</p>
                )}

              </div>
            </div>
          </div>

          {/* Detailed History Section */}
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-text-dark flex items-center gap-2">
                <History className="w-6 h-6 text-primary" />
                Lesson History
              </h2>
              <span className="text-sm font-medium text-text-muted bg-bg px-3 py-1 rounded-full border border-border">Last 10 Lessons</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {lessons
                .filter(l => l.status === 'published' && l.subjectId === lesson.subjectId)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, showAllHistory ? undefined : 10)
                .map((l) => (
                <button 
                  onClick={() => navigate(`/subject?id=${l.id}`)}
                  key={l.id}
                  className={`bg-card p-5 rounded-3xl border text-left transition-all group flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    l.id === lesson.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-bg border border-border flex flex-col items-center justify-center shrink-0 group-hover:bg-primary/5 group-hover:border-primary/20 transition-colors">
                      <span className="text-[10px] font-bold text-text-muted uppercase leading-none mb-1">Lsn</span>
                      <span className="text-lg font-bold text-text-dark leading-none">{l.id.toString().slice(-2)}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-text-dark group-hover:text-primary transition-colors">{l.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs text-text-muted">
                          <Calendar className="w-3 h-3" />
                          {l.date}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-border"></span>
                        <span className="text-xs text-text-muted font-medium">{l.type}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-border/50">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Duration</span>
                        <span className="text-xs font-bold text-text-dark">{l.duration}</span>
                      </div>
                      <div className="w-px h-8 bg-border"></div>
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Files</span>
                        <span className="text-xs font-bold text-text-dark">{l.materials.length}</span>
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 transition-all ${l.id === lesson.id ? "text-primary" : "text-text-muted group-hover:text-primary group-hover:translate-x-1"}`} />
                  </div>
                </button>
              ))}
            </div>
            
            {!showAllHistory && lessons.filter(l => l.status === 'published' && l.subjectId === lesson.subjectId).length > 10 && (
              <button 
                onClick={() => setShowAllHistory(true)}
                className="w-full py-4 rounded-2xl border-2 border-dashed border-border text-text-muted font-bold hover:border-primary hover:text-primary transition-colors"
              >
                View All Previous Lessons
              </button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          {/* Materials */}
          <div className="bg-card p-6 rounded-3xl border border-border shadow-sm">
            <h2 className="text-xl font-bold text-text-dark mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Materials
            </h2>
            
            <div className="space-y-3 mb-6">
              <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Files ({lesson.materials.filter(m => m.type === 'file').length})</h3>
              {lesson.materials.filter(m => m.type === 'file').map((file, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-bg border border-border hover:border-primary/50 cursor-pointer transition-all group">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium truncate text-text-dark">{file.name}</span>
                </div>
              ))}
              {lesson.materials.filter(m => m.type === 'file').length === 0 && (
                <p className="text-xs text-text-muted italic">No files attached.</p>
              )}
            </div>

            <div className="space-y-3">
              <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest">External Links</h3>
              {lesson.materials.filter(m => m.type === 'link').map((link, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-bg border border-border hover:border-accent/50 cursor-pointer transition-all group">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-white transition-colors">
                    <LinkIcon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium truncate text-text-dark">{link.name}</span>
                </div>
              ))}
              {lesson.materials.filter(m => m.type === 'link').length === 0 && (
                <p className="text-xs text-text-muted italic">No links attached.</p>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-card p-6 rounded-3xl border border-border shadow-sm bg-gradient-to-br from-card to-primary/5">
            <h2 className="text-xl font-bold text-text-dark mb-4">Subject Overview</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-muted">Total Lessons</span>
                <span className="font-bold text-text-dark">{lessons.filter(l => l.subjectId === lesson.subjectId).length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-muted">Attendance</span>
                <span className="font-bold text-green-600">96%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-muted">Avg. Grade</span>
                <span className="font-bold text-primary">A-</span>
              </div>
              <div className="w-full h-2 bg-bg rounded-full overflow-hidden mt-2">
                <div className="h-full bg-primary rounded-full w-[85%]"></div>
              </div>
              <p className="text-[10px] text-text-muted text-center mt-1">85% of curriculum completed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
