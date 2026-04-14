import { Users, Download, UserPlus, Mail, Edit2, Eye } from "lucide-react";
import { motion } from "motion/react";

export default function ClassManagement() {
  const students = Array.from({ length: 24 }).map((_, i) => ({
    id: `STU-2025-${(i + 1).toString().padStart(3, '0')}`,
    name: ["John Doe", "Jane Smith", "Mike Johnson", "Emily Davis", "Chris Wilson", "Sarah Brown"][i % 6] + (i > 5 ? ` ${i}` : ''),
    parent: ["Robert Doe", "Mary Smith", "David Johnson", "Susan Davis", "James Wilson", "Linda Brown"][i % 6],
    email: `parent${i}@example.com`,
    status: i === 7 ? "Inactive" : "Active",
  }));

  const subjects = [
    { name: "Mathematics", teacher: "Mr. Smith", hours: 5 },
    { name: "Physics", teacher: "Dr. Jones", hours: 3 },
    { name: "Literature", teacher: "Ms. Davis", hours: 4 },
    { name: "History", teacher: "Mr. Wilson", hours: 2 },
    { name: "Biology", teacher: "Dr. Brown", hours: 3 },
    { name: "Chemistry", teacher: "Ms. Taylor", hours: 3 },
    { name: "Computer Science", teacher: "Mr. Clark", hours: 2 },
    { name: "Art", teacher: "Ms. White", hours: 2 },
    { name: "Physical Ed.", teacher: "Mr. Martin", hours: 2 },
    { name: "Geography", teacher: "Ms. Lee", hours: 2 },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card p-8 rounded-3xl border border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-text-dark">Class 10-A</h1>
          <p className="text-text-muted mt-2">Homeroom Teacher: Mr. Smith</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none bg-lime text-lime-900 px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#d4eb06] transition-colors">
            <UserPlus className="w-5 h-5" />
            Add Student
          </button>
          <button className="flex-1 md:flex-none bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
            <Download className="w-5 h-5" />
            Export List
          </button>
        </div>
      </motion.header>

      {/* Stats Row */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="bg-card p-6 rounded-3xl border border-border flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-bold text-text-dark">24</div>
          <div className="text-sm text-text-muted mt-1">Total Students</div>
        </div>
        <div className="bg-card p-6 rounded-3xl border border-border flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-bold text-green-600">23</div>
          <div className="text-sm text-text-muted mt-1">Active</div>
        </div>
        <div className="bg-card p-6 rounded-3xl border border-border flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-bold text-orange-500">1</div>
          <div className="text-sm text-text-muted mt-1">Inactive</div>
        </div>
        <div className="bg-card p-6 rounded-3xl border border-border flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-bold text-accent">10</div>
          <div className="text-sm text-text-muted mt-1">Subjects</div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Student Roster */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-card rounded-3xl border border-border overflow-hidden flex flex-col"
        >
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h2 className="text-xl font-bold text-text-dark flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Student Roster
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-bg text-text-muted font-medium border-b border-border">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Parent/Guardian</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-bg/50 transition-colors group">
                    <td className="px-6 py-4 font-mono text-xs text-text-muted">{student.id}</td>
                    <td className="px-6 py-4 font-bold text-text-dark">{student.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-text-dark">{student.parent}</span>
                        <span className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" /> {student.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        student.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-text-muted hover:text-accent hover:bg-accent/10 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Subjects & Timetable */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-6"
        >
          <div className="bg-card p-6 rounded-3xl border border-border">
            <h2 className="text-xl font-bold text-text-dark mb-6">Class Subjects</h2>
            <div className="flex flex-col gap-3">
              {subjects.map((sub, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-2xl border border-border hover:border-primary/50 transition-colors">
                  <div>
                    <div className="font-bold text-sm text-text-dark">{sub.name}</div>
                    <div className="text-xs text-text-muted mt-0.5">{sub.teacher}</div>
                  </div>
                  <div className="text-xs font-bold bg-bg px-2 py-1 rounded-md">
                    {sub.hours}h / wk
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
