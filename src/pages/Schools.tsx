import { Search, MapPin, Phone, Mail, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Schools() {
  const schools = Array.from({ length: 30 }).map((_, i) => ({
    id: i + 1,
    name: `EDUCORE Academy ${String.fromCharCode(65 + (i % 26))}${i > 25 ? '2' : ''}`,
    city: ["Bratislava", "Kosice", "Presov", "Zilina", "Nitra", "Trnava"][i % 6],
    students: 300 + (i * 45) % 500,
    teachers: 25 + (i * 3) % 40,
    status: i % 7 === 0 ? "Onboarding" : "Active",
  }));

  return (
    <div className="flex flex-col gap-8">
      <header 
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-text-dark">Schools Directory</h1>
          <p className="text-text-muted mt-2">Manage all 30 schools in the EDUCORE network.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search schools..." 
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </header>

      <div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {schools.map((school) => (
          <div key={school.id}>
            <Link 
              to="/coordinator"
              className="h-full bg-card p-6 rounded-3xl border border-border hover:shadow-lg transition-all group flex flex-col gap-4"
            >
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center font-bold text-xl">
                  {school.name.charAt(8)}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  school.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {school.status}
                </span>
              </div>
              
              <div>
                <h3 className="font-bold text-lg text-text-dark group-hover:text-primary transition-colors">{school.name}</h3>
                <div className="flex items-center gap-1 text-text-muted text-sm mt-1">
                  <MapPin className="w-4 h-4" />
                  {school.city}, Slovakia
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/50">
                <div>
                  <div className="text-2xl font-bold text-text-dark">{school.students}</div>
                  <div className="text-xs text-text-muted uppercase tracking-wider">Students</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-text-dark">{school.teachers}</div>
                  <div className="text-xs text-text-muted uppercase tracking-wider">Teachers</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm font-medium text-primary mt-auto pt-2">
                <span>View Dashboard</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
