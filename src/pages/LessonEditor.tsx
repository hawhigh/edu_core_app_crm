import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Save, ArrowLeft, Plus, Trash2, FileText, Link as LinkIcon, Clock, Calendar, Send, AlertCircle, ChevronDown } from "lucide-react";
import { useAcademic, Lesson, LessonStructure, LessonMaterial } from "../contexts/AcademicContext";
import { motion, AnimatePresence } from "motion/react";

export default function LessonEditor() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getLesson, addLesson, updateLesson, topics, subjects } = useAcademic();

  const urlSubjectId = searchParams.get('subjectId');
  const urlTopicId = searchParams.get('topicId');

  const [subjectId, setSubjectId] = useState(urlSubjectId || "");
  const [topicId, setTopicId] = useState(urlTopicId || "");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("45 min");
  const [type, setType] = useState("Lecture");
  const [aims, setAims] = useState<string[]>([""]);
  const [structure, setStructure] = useState<LessonStructure[]>([
    { title: "", duration: "", description: "" }
  ]);
  const [materials, setMaterials] = useState<LessonMaterial[]>([]);
  const [status, setStatus] = useState<'draft' | 'published' | 'rework'>('draft');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) {
      const lesson = getLesson(id);
      if (lesson) {
        setSubjectId(lesson.subjectId);
        setTopicId(lesson.topicId || "");
        setTitle(lesson.title);
        setDate(lesson.date);
        setTime(lesson.time);
        setDuration(lesson.duration);
        setType(lesson.type);
        setAims(lesson.aims.length > 0 ? lesson.aims : [""]);
        setStructure(lesson.structure.length > 0 ? lesson.structure : [{ title: "", duration: "", description: "" }]);
        setMaterials(lesson.materials);
        setStatus(lesson.status);
      }
    }
  }, [id, getLesson]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!subjectId) newErrors.subjectId = "Subject is required";
    if (!date) newErrors.date = "Date is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (publish: boolean = false) => {
    if (!validate()) return;

    const lessonData: Omit<Lesson, 'id'> = {
      subjectId,
      topicId: topicId || undefined,
      title,
      date,
      time,
      duration,
      type,
      aims: aims.filter(a => a.trim() !== ""),
      structure: structure.filter(s => s.title.trim() !== ""),
      materials: materials.filter(m => m.name.trim() !== ""),
      status: publish ? 'published' : (id ? status : 'draft')
    };

    if (id) {
      updateLesson(id, lessonData);
    } else {
      addLesson(lessonData);
    }
    navigate(`/teacher/curriculum?subjectId=${subjectId}`);
  };

  const addAim = () => setAims([...aims, ""]);
  const updateAim = (index: number, value: string) => {
    const newAims = [...aims];
    newAims[index] = value;
    setAims(newAims);
  };
  const removeAim = (index: number) => setAims(aims.filter((_, i) => i !== index));

  const addStructure = () => setStructure([...structure, { title: "", duration: "", description: "" }]);
  const updateStructure = (index: number, field: keyof LessonStructure, value: string) => {
    const newStructure = [...structure];
    newStructure[index] = { ...newStructure[index], [field]: value };
    setStructure(newStructure);
  };
  const removeStructure = (index: number) => setStructure(structure.filter((_, i) => i !== index));

  const addMaterial = (type: 'file' | 'link') => setMaterials([...materials, { name: "", type, url: "" }]);
  const updateMaterial = (index: number, field: keyof LessonMaterial, value: string) => {
    const newMaterials = [...materials];
    newMaterials[index] = { ...newMaterials[index], [field]: value };
    setMaterials(newMaterials);
  };
  const removeMaterial = (index: number) => setMaterials(materials.filter((_, i) => i !== index));

  const filteredTopics = topics.filter(t => t.subjectId === subjectId);

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 hover:bg-bg rounded-2xl border border-transparent hover:border-border transition-all"
          >
            <ArrowLeft className="w-6 h-6 text-text-muted" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-text-dark tracking-tight">
              {id ? "Edit Lesson" : "Create New Lesson"}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-text-muted text-sm">Define the content and structure of your lesson.</p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest border ${
                status === 'published' ? 'bg-green-50 text-green-600 border-green-200' : 
                status === 'rework' ? 'bg-red-50 text-red-600 border-red-200' :
                'bg-orange-50 text-orange-600 border-orange-200'
              }`}>
                {status}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => handleSave(false)}
            className="flex-1 md:flex-none bg-card text-text-dark border border-border px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-bg transition-all active:scale-95"
          >
            <Save className="w-5 h-5" />
            Save Draft
          </button>
          <button 
            onClick={() => handleSave(true)}
            className="flex-1 md:flex-none bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
          >
            <Send className="w-5 h-5" />
            {status === 'published' ? 'Update & Publish' : 'Save & Publish'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Basic Info */}
          <section className="bg-card p-6 md:p-8 rounded-[2rem] border border-border shadow-sm">
            <h2 className="text-xl font-bold text-text-dark mb-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Lesson Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Quadratic Equations"
                  className={`w-full p-4 rounded-2xl border bg-bg focus:outline-none focus:ring-2 transition-all ${
                    errors.title ? 'border-red-500 ring-red-500/20' : 'border-border focus:ring-primary/50'
                  }`} 
                />
                {errors.title && <p className="text-red-500 text-xs mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.title}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Subject</label>
                <div className="relative">
                  <select 
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className={`w-full p-4 rounded-2xl border bg-bg focus:outline-none focus:ring-2 transition-all appearance-none ${
                      errors.subjectId ? 'border-red-500 ring-red-500/20' : 'border-border focus:ring-primary/50'
                    }`}
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Topic (Optional)</label>
                <div className="relative">
                  <select 
                    value={topicId}
                    onChange={(e) => setTopicId(e.target.value)}
                    className="w-full p-4 rounded-2xl border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                  >
                    <option value="">Select Topic</option>
                    {filteredTopics.map(t => (
                      <option key={t.id} value={t.id}>{t.title}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 rounded-2xl border bg-bg focus:outline-none focus:ring-2 transition-all ${
                      errors.date ? 'border-red-500 ring-red-500/20' : 'border-border focus:ring-primary/50'
                    }`} 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Time Range</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input 
                    type="text" 
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 09:00 - 09:45 AM"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Duration</label>
                <input 
                  type="text" 
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full p-4 rounded-2xl border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Lesson Type</label>
                <div className="relative">
                  <select 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full p-4 rounded-2xl border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                  >
                    <option>Lecture</option>
                    <option>Practice</option>
                    <option>Lab</option>
                    <option>Test</option>
                    <option>Seminar</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                </div>
              </div>
            </div>
          </section>

          {/* Aims */}
          <section className="bg-card p-6 md:p-8 rounded-[2rem] border border-border shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-text-dark flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-accent" />
                </div>
                Aims of Lesson
              </h2>
              <button 
                onClick={addAim}
                className="bg-accent/10 text-accent px-4 py-2 rounded-xl text-xs font-bold hover:bg-accent hover:text-white transition-all"
              >
                Add Aim
              </button>
            </div>
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {aims.map((aim, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex gap-3"
                  >
                    <div className="flex-1 relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-xs font-bold">{index + 1}.</span>
                      <input 
                        type="text" 
                        value={aim}
                        onChange={(e) => updateAim(index, e.target.value)}
                        placeholder="What should students learn?"
                        className="w-full pl-10 pr-4 py-4 rounded-2xl border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" 
                      />
                    </div>
                    <button 
                      onClick={() => removeAim(index)}
                      className="p-4 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>

          {/* Structure */}
          <section className="bg-card p-6 md:p-8 rounded-[2rem] border border-border shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-text-dark flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                Lesson Structure
              </h2>
              <button 
                onClick={addStructure}
                className="bg-purple-50 text-purple-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-purple-600 hover:text-white transition-all"
              >
                Add Phase
              </button>
            </div>
            <div className="space-y-6">
              <AnimatePresence initial={false}>
                {structure.map((phase, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="p-6 rounded-3xl border border-border bg-bg relative group"
                  >
                    <button 
                      onClick={() => removeStructure(index)}
                      className="absolute top-4 right-4 p-2 text-text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="md:col-span-3">
                        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Phase Title</label>
                        <input 
                          type="text" 
                          value={phase.title}
                          onChange={(e) => updateStructure(index, 'title', e.target.value)}
                          placeholder="e.g. Introduction"
                          className="w-full p-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Duration</label>
                        <input 
                          type="text" 
                          value={phase.duration}
                          onChange={(e) => updateStructure(index, 'duration', e.target.value)}
                          placeholder="e.g. 10 min"
                          className="w-full p-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" 
                        />
                      </div>
                      <div className="md:col-span-4">
                        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Description</label>
                        <textarea 
                          rows={3}
                          value={phase.description}
                          onChange={(e) => updateStructure(index, 'description', e.target.value)}
                          placeholder="What happens in this phase?"
                          className="w-full p-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-8">
          {/* Materials */}
          <section className="bg-card p-6 md:p-8 rounded-[2rem] border border-border shadow-sm sticky top-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-text-dark flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                Materials
              </h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => addMaterial('file')}
                  className="p-2 bg-bg border border-border rounded-xl text-primary hover:bg-primary hover:text-white transition-all"
                  title="Add File"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => addMaterial('link')}
                  className="p-2 bg-bg border border-border rounded-xl text-accent hover:bg-accent hover:text-white transition-all"
                  title="Add Link"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {materials.map((material, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-4 rounded-2xl border border-border bg-bg group"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        {material.type === 'file' ? (
                          <FileText className="w-4 h-4 text-primary" />
                        ) : (
                          <LinkIcon className="w-4 h-4 text-accent" />
                        )}
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{material.type}</span>
                      </div>
                      <button 
                        onClick={() => removeMaterial(index)}
                        className="text-text-muted hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <input 
                        type="text" 
                        value={material.name}
                        onChange={(e) => updateMaterial(index, 'name', e.target.value)}
                        placeholder="Material Name"
                        className="w-full bg-card border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary" 
                      />
                      <input 
                        type="text" 
                        value={material.url || ""}
                        onChange={(e) => updateMaterial(index, 'url', e.target.value)}
                        placeholder={material.type === 'file' ? "Filename.pdf" : "https://..."}
                        className="w-full bg-card border border-border rounded-lg px-3 py-2 text-[10px] focus:outline-none focus:border-primary font-mono" 
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {materials.length === 0 && (
                <div className="text-center py-12 px-4 border-2 border-dashed border-border rounded-3xl">
                  <FileText className="w-8 h-8 text-text-muted mx-auto mb-3 opacity-20" />
                  <p className="text-xs text-text-muted font-medium">No materials added yet.</p>
                </div>
              )}
            </div>
          </section>

          {/* Tips */}
          <section className="bg-primary/5 p-6 rounded-[2rem] border border-primary/10">
            <h3 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Editor Tips
            </h3>
            <ul className="text-xs text-primary/80 space-y-2 list-disc pl-4">
              <li>Save drafts frequently to avoid losing progress.</li>
              <li>Publishing a lesson makes it visible to students.</li>
              <li>You can link files from your NAS in the materials section.</li>
              <li>Use phases to break down the lesson into manageable parts.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
