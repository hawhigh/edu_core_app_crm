import { CheckCircle2, Clock, FileText, AlertCircle, Calendar } from "lucide-react";

export default function Homework() {
  const tasks = [
    { id: 1, title: "Quadratic Equations Worksheet", subject: "Mathematics", due: "Tomorrow, 08:00 AM", status: "pending", priority: "high" },
    { id: 2, title: "Read Chapter 4 & 5", subject: "Literature", due: "Wed, 10:00 AM", status: "pending", priority: "medium" },
    { id: 3, title: "Physics Lab Report", subject: "Physics", due: "Friday, 11:59 PM", status: "in-progress", priority: "high" },
    { id: 4, title: "History Essay Draft", subject: "History", due: "Next Monday", status: "completed", priority: "medium" },
    { id: 5, title: "Biology Cell Structure Diagram", subject: "Biology", due: "Last Friday", status: "completed", priority: "low" },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-dark">Homework & Tasks</h1>
          <p className="text-text-muted mt-2">Manage your assignments and upcoming deadlines.</p>
        </div>
        <div className="flex gap-3">
          <select className="bg-card border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option>All Subjects</option>
            <option>Mathematics</option>
            <option>Physics</option>
            <option>Literature</option>
          </select>
          <select className="bg-card border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option>Sort by Due Date</option>
            <option>Sort by Priority</option>
            <option>Sort by Status</option>
          </select>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-3xl border border-border flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div>
            <div className="text-2xl font-bold text-text-dark">2</div>
            <div className="text-sm text-text-muted">Due Soon</div>
          </div>
        </div>
        
        <div className="bg-card p-6 rounded-3xl border border-border flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <div className="text-2xl font-bold text-text-dark">1</div>
            <div className="text-sm text-text-muted">In Progress</div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-3xl border border-border flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <div className="text-2xl font-bold text-text-dark">12</div>
            <div className="text-sm text-text-muted">Completed (This Term)</div>
          </div>
        </div>
      </div>

      {/* Kanban / List View */}
      <div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* To Do Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-text-dark flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              To Do
            </h3>
            <span className="text-xs font-bold bg-border px-2 py-1 rounded-md text-text-muted">2</span>
          </div>
          
          {tasks.filter(t => t.status === 'pending').map(task => (
            <div key={task.id} className="bg-card p-5 rounded-2xl border border-border hover:border-orange-300 hover:shadow-md transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-bg text-text-muted">{task.subject}</span>
                {task.priority === 'high' && <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-50 px-2 py-1 rounded-md">High Priority</span>}
              </div>
              <h4 className="font-bold text-text-dark mb-4 group-hover:text-primary transition-colors">{task.title}</h4>
              <div className="flex items-center justify-between text-xs text-text-muted pt-4 border-t border-border/50">
                <div className="flex items-center gap-1.5 text-orange-600 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  {task.due}
                </div>
                <FileText className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

        {/* In Progress Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-text-dark flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              In Progress
            </h3>
            <span className="text-xs font-bold bg-border px-2 py-1 rounded-md text-text-muted">1</span>
          </div>
          
          {tasks.filter(t => t.status === 'in-progress').map(task => (
            <div key={task.id} className="bg-card p-5 rounded-2xl border border-border hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-bg text-text-muted">{task.subject}</span>
              </div>
              <h4 className="font-bold text-text-dark mb-4 group-hover:text-primary transition-colors">{task.title}</h4>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-[10px] font-bold text-text-muted mb-1.5">
                  <span>Progress</span>
                  <span>65%</span>
                </div>
                <div className="w-full h-1.5 bg-bg rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full w-[65%]"></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-text-muted pt-4 border-t border-border/50">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {task.due}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Completed Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-text-dark flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              Completed
            </h3>
            <span className="text-xs font-bold bg-border px-2 py-1 rounded-md text-text-muted">2</span>
          </div>
          
          {tasks.filter(t => t.status === 'completed').map(task => (
            <div key={task.id} className="bg-card p-5 rounded-2xl border border-border opacity-75 hover:opacity-100 transition-all cursor-pointer">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-bg text-text-muted">{task.subject}</span>
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              </div>
              <h4 className="font-bold text-text-dark mb-4 line-through decoration-text-muted/50">{task.title}</h4>
              <div className="flex items-center justify-between text-xs text-text-muted pt-4 border-t border-border/50">
                <div className="flex items-center gap-1.5">
                  Submitted: {task.due}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
