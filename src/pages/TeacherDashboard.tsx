import { Calendar, Users, MessageSquare, Star, BookOpen, LayoutGrid, List, Clock, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { useAcademic } from "../contexts/AcademicContext";

export default function TeacherDashboard() {
  const { subjects, classes, teachers } = useAcademic();
  const [view, setView] = useState<"list" | "calendar">("list");

  // Mocking the current teacher as Mr. Smith (tch-1)
  const currentTeacherId = 'tch-1';
  const teacherSubjects = subjects.filter(s => s.teacherId === currentTeacherId);

  const timetable = [
    { day: "Mon", lessons: ["Math 10-A", "Physics 11-B", "Free", "Math 12-C", "Math 10-A"] },
    { day: "Tue", lessons: ["Physics 11-B", "Math 10-A", "Math 12-C", "Free", "Physics 11-B"] },
    { day: "Wed", lessons: ["Free", "Math 12-C", "Math 10-A", "Physics 11-B", "Math 12-C"] },
    { day: "Thu", lessons: ["Math 10-A", "Free", "Physics 11-B", "Math 12-C", "Math 10-A"] },
    { day: "Fri", lessons: ["Physics 11-B", "Math 12-C", "Math 10-A", "Free", "Physics 11-B"] },
  ];

  const lessonTimes = [
    "08:00 - 08:45",
    "09:00 - 09:45",
    "10:00 - 10:45",
    "11:00 - 11:45",
    "12:00 - 12:45",
  ];

  const getSubjectColor = (lesson: string) => {
    if (lesson.includes("Math")) return "bg-primary/10 text-primary border-primary/20 hover:bg-primary hover:text-white";
    if (lesson.includes("Physics")) return "bg-accent/10 text-accent border-accent/20 hover:bg-accent hover:text-white";
    return "bg-bg border-border text-text-muted";
  };

  const currentDayIndex = new Date().getDay(); // 1-5 for Mon-Fri

  return (
    <div className="flex flex-col gap-8">
      {/* Header / Teacher Details */}
      <header 
        className="bg-card p-8 rounded-3xl border border-border flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm"
      >
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center text-3xl font-bold text-accent">
            MS
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text-dark">Mr. Smith</h1>
            <p className="text-text-muted mt-1">ID: #TCH-1029 • EDUCORE Academy A</p>
          </div>
        </div>
        <div className="flex gap-3">
          <span className="bg-primary/10 text-primary px-4 py-2 rounded-xl font-bold text-sm border border-primary/20">Mathematics</span>
          <span className="bg-accent/10 text-accent px-4 py-2 rounded-xl font-bold text-sm border border-accent/20">Physics</span>
        </div>
      </header>

      {/* My Subjects & Classes */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-text-dark">My Subjects & Classes</h2>
          <Link to="/teacher/curriculum" className="text-primary font-bold hover:underline text-sm">View All Curriculum</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teacherSubjects.map((sub) => {
            const cls = classes.find(c => c.id === sub.classId);
            return (
              <div key={sub.id} className="bg-card p-6 rounded-3xl border border-border hover:border-primary/50 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${sub.name === 'Mathematics' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <span className="bg-bg px-3 py-1 rounded-full text-[10px] font-bold text-text-muted uppercase tracking-wider border border-border">
                    Class {cls?.name}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-text-dark mb-2">{sub.name}</h3>
                <p className="text-sm text-text-muted mb-6">Manage lessons, topics and materials for this class.</p>
                <Link 
                  to={`/teacher/curriculum?subjectId=${sub.id}`}
                  className="w-full py-3 rounded-xl bg-bg border border-border text-text-dark font-bold flex items-center justify-center gap-2 hover:bg-primary hover:text-white hover:border-primary transition-all"
                >
                  Go to Curriculum
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Timetable */}
        <div 
          className="lg:col-span-2 flex flex-col gap-6"
        >
          <div className="bg-card p-6 rounded-3xl border border-border">
            <div className="flex justify-between items-center mb-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold text-text-dark flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Weekly Timetable
                </h2>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Math</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-accent"></div>
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Physics</span>
                  </div>
                </div>
              </div>
              <div className="flex bg-bg p-1 rounded-xl border border-border">
                <button 
                  onClick={() => setView("list")}
                  className={`p-2 rounded-lg transition-all ${view === "list" ? "bg-card shadow-sm text-primary" : "text-text-muted hover:text-text-dark"}`}
                  title="List View"
                >
                  <List className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setView("calendar")}
                  className={`p-2 rounded-lg transition-all ${view === "calendar" ? "bg-card shadow-sm text-primary" : "text-text-muted hover:text-text-dark"}`}
                  title="Calendar View"
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="mt-6">
              {view === "list" ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr>
                        <th className="p-3 text-left text-text-muted font-medium w-20">Day</th>
                        {[1, 2, 3, 4, 5].map(num => (
                          <th key={num} className="p-3 text-center text-text-muted font-medium">Lesson {num}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {timetable.map((row, idx) => (
                        <tr key={row.day} className={`border-t border-border/50 ${currentDayIndex === idx + 1 ? "bg-primary/5" : ""}`}>
                          <td className="p-3 font-bold text-text-dark">
                            <div className="flex flex-col">
                              <span>{row.day}</span>
                              {currentDayIndex === idx + 1 && <span className="text-[10px] text-primary uppercase">Today</span>}
                            </div>
                          </td>
                          {row.lessons.map((lesson, idx) => (
                            <td key={idx} className="p-2">
                              {lesson === "Free" ? (
                                <div className="h-16 rounded-xl bg-bg border border-dashed border-border flex items-center justify-center text-text-muted text-sm">
                                  Free
                                </div>
                              ) : (
                                <Link to="/subject" className={`h-16 rounded-xl border flex flex-col items-center justify-center transition-all group cursor-pointer ${getSubjectColor(lesson)}`}>
                                  <span className="font-bold text-sm">{lesson.split(' ')[0]}</span>
                                  <span className="text-xs opacity-80">{lesson.split(' ')[1]}</span>
                                </Link>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-6 gap-2">
                    <div className="p-2"></div>
                    {timetable.map((day, idx) => (
                      <div key={day.day} className={`p-2 text-center font-bold text-text-dark border-b-2 transition-colors ${currentDayIndex === idx + 1 ? "border-primary text-primary bg-primary/5 rounded-t-xl" : "border-primary/20"}`}>
                        <div className="flex flex-col">
                          <span>{day.day}</span>
                          {currentDayIndex === idx + 1 && <span className="text-[8px] uppercase tracking-widest">Today</span>}
                        </div>
                      </div>
                    ))}
                    
                    {lessonTimes.map((time, lessonIdx) => (
                      <React.Fragment key={`time-row-${lessonIdx}`}>
                        <div className="p-2 flex flex-col justify-center text-[10px] font-bold text-text-muted border-r border-border/50">
                          <span className="whitespace-nowrap">{time.split(' - ')[0]}</span>
                          <span className="whitespace-nowrap opacity-50">{time.split(' - ')[1]}</span>
                        </div>
                        {timetable.map((day, dayIdx) => {
                          const lesson = day.lessons[lessonIdx];
                          const isToday = currentDayIndex === dayIdx + 1;
                          return (
                            <div key={`cell-${dayIdx}-${lessonIdx}`} className={`p-1 transition-colors ${isToday ? "bg-primary/5" : ""}`}>
                              {lesson === "Free" ? (
                                <div className="h-24 rounded-xl bg-bg/50 border border-dashed border-border flex items-center justify-center text-[10px] text-text-muted italic">
                                  -
                                </div>
                              ) : (
                                <Link to="/subject" className={`h-24 rounded-xl border p-2 flex flex-col items-center justify-center text-center transition-all group shadow-sm ${getSubjectColor(lesson)}`}>
                                  <span className="font-bold text-xs leading-tight">{lesson.split(' ')[0]}</span>
                                  <span className="text-[10px] opacity-70 font-medium mt-1">{lesson.split(' ')[1]}</span>
                                  <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="text-[8px] bg-white/20 px-1.5 py-0.5 rounded uppercase font-bold">View Lesson</div>
                                  </div>
                                </Link>
                              )}
                            </div>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div 
          className="flex flex-col gap-8"
        >
          {/* Today's Schedule Summary */}
          <div className="bg-card p-6 rounded-3xl border border-border">
            <h2 className="text-xl font-bold text-text-dark mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Today's Schedule
            </h2>
            <div className="flex flex-col gap-4">
              {timetable[currentDayIndex - 1]?.lessons.map((lesson, i) => (
                lesson !== "Free" && (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-2xl bg-bg border border-border">
                    <div className="text-[10px] font-bold text-text-muted w-16 shrink-0">
                      {lessonTimes[i].split(' - ')[0]}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm text-text-dark">{lesson}</div>
                      <div className="text-[10px] text-text-muted uppercase">Room 302</div>
                    </div>
                  </div>
                )
              ))}
              {(!timetable[currentDayIndex - 1] || timetable[currentDayIndex - 1].lessons.every(l => l === "Free")) && (
                <p className="text-sm text-text-muted italic">No lessons scheduled for today.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
