import { Link } from "react-router-dom";
import { Users, BookOpen, GraduationCap, School } from "lucide-react";

export default function Overview() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold text-text-dark">Welcome to EDUCORE</h1>
        <p className="text-text-muted mt-2">Select a dashboard to view the CRM interfaces.</p>
      </header>

      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div>
          <Link to="/student" className="block h-full bg-card p-6 rounded-3xl border border-border hover:shadow-lg transition-all group">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold mb-2">Student Portal</h2>
            <p className="text-text-muted text-sm">View grades, subjects, homework, and teacher feedback.</p>
          </Link>
        </div>

        <div>
          <Link to="/parent" className="block h-full bg-card p-6 rounded-3xl border border-border hover:shadow-lg transition-all group">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold mb-2">Parent Portal</h2>
            <p className="text-text-muted text-sm">Monitor your child's progress, attendance, and contact teachers.</p>
          </Link>
        </div>

        <div>
          <Link to="/teacher" className="block h-full bg-card p-6 rounded-3xl border border-border hover:shadow-lg transition-all group">
            <div className="w-12 h-12 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold mb-2">Teacher & Lector</h2>
            <p className="text-text-muted text-sm">Manage classes, timetable, curriculum, and student evaluations.</p>
          </Link>
        </div>

        <div>
          <Link to="/coordinator" className="block h-full bg-card p-6 rounded-3xl border border-border hover:shadow-lg transition-all group">
            <div className="w-12 h-12 bg-lime/20 text-lime-700 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold mb-2">Coordinator</h2>
            <p className="text-text-muted text-sm">Oversee school operations, teachers, classes, and subjects.</p>
          </Link>
        </div>

        <div>
          <Link to="/schools" className="block h-full bg-card p-6 rounded-3xl border border-border hover:shadow-lg transition-all group">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <School className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold mb-2">Schools Directory</h2>
            <p className="text-text-muted text-sm">Manage network of 30 schools and their respective coordinators.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
