import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Save, ArrowLeft, Plus, Trash2, FileText, Link as LinkIcon, Clock, Calendar, Send } from "lucide-react";
import { useAcademic, Lesson, LessonStructure, LessonMaterial } from "../contexts/AcademicContext";

export default function LessonEditor() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getLesson, addLesson, updateLesson } = useAcademic();

  const subjectId = searchParams.get('subjectId') || 'sub-1';
  const topicId = searchParams.get('topicId') || '';

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

  useEffect(() => {
    if (id) {
      const lesson = getLesson(id);
      if (lesson) {
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

  const handleSave = (publish: boolean = false) => {
    const lessonData = {
      subjectId,
      topicId,
      title,
      date,
      time,
      duration,
      type,
      aims: aims.filter(a => a.trim() !== ""),
      structure: structure.filter(s => s.title.trim() !== ""),
      materials,
      status: publish ? 'published' : status
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

  const addMaterial = (type: 'file' | 'link') => setMaterials([...materials, { name: "", type }]);
  const updateMaterial = (index: number, value: string) => {
    const newMaterials = [...materials];
    newMaterials[index].name = value;
    setMaterials(newMaterials);
  };
  const removeMaterial = (index: number) => setMaterials(materials.filter((_, i) => i !== index));

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-bg rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-text-muted" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-text-dark">
              {id ? "Edit Lesson" : "Create New Lesson"}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-text-muted">Define the content and structure of your lesson.</p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                status === 'published' ? 'bg-green-100 text-green-600' : 
                status === 'rework' ? 'bg-red-100 text-red-600' :
                'bg-orange-100 text-orange-600'
              }`}>
                {status}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => handleSave(false)}
            className="bg-card text-text-dark border border-border px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-bg transition-colors"
          >
            <Save className="w-5 h-5" />
            Save Draft
          </button>
          <button 
            onClick={() => handleSave(true)}
            className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            <Send className="w-5 h-5" />
            {status === 'published' ? 'Update & Publish' : 'Save & Publish'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {/* Basic Info */}
        <section className="bg-card p-8 rounded-3xl border border-border shadow-sm">
          <h2 className="text-xl font-bold text-text-dark mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-text-dark mb-2">Lesson Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Quadratic Equations"
                className="w-full p-3 rounded-xl border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/50" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-text-dark mb-2">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/50" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-text-dark mb-2">Time Range</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input 
                  type="text" 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="e.g. 09:00 - 09:45 AM"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/50" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-text-dark mb-2">Duration</label>
              <input 
                type="text" 
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full p-3 rounded-xl border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/50" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-text-dark mb-2">Lesson Type</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-3 rounded-xl border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option>Lecture</option>
                <option>Practice</option>
                <option>Lab</option>
                <option>Test</option>
              </select>
            </div>
          </div>
        </section>

        {/* Aims */}
        <section className="bg-card p-8 rounded-3xl border border-border shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-text-dark flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Aims of Lesson
            </h2>
            <button 
              onClick={addAim}
              className="text-primary text-sm font-bold hover:underline"
            >
              + Add Aim
            </button>
          </div>
          <div className="space-y-4">
            {aims.map((aim, index) => (
              <div key={index} className="flex gap-3">
                <input 
                  type="text" 
                  value={aim}
                  onChange={(e) => updateAim(index, e.target.value)}
                  placeholder="What should students learn?"
                  className="flex-1 p-3 rounded-xl border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/50" 
                />
                <button 
                  onClick={() => removeAim(index)}
                  className="p-3 text-text-muted hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Structure */}
        <section className="bg-card p-8 rounded-3xl border border-border shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-text-dark flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Lesson Structure
            </h2>
            <button 
              onClick={addStructure}
              className="text-primary text-sm font-bold hover:underline"
            >
              + Add Phase
            </button>
          </div>
          <div className="space-y-6">
            {structure.map((phase, index) => (
              <div key={index} className="p-6 rounded-2xl border border-border bg-bg relative group">
                <button 
                  onClick={() => removeStructure(index)}
                  className="absolute top-4 right-4 p-2 text-text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-3">
                    <label className="block text-xs font-bold text-text-muted uppercase mb-1">Phase Title</label>
                    <input 
                      type="text" 
                      value={phase.title}
                      onChange={(e) => updateStructure(index, 'title', e.target.value)}
                      placeholder="e.g. Introduction"
                      className="w-full p-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/50" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase mb-1">Duration</label>
                    <input 
                      type="text" 
                      value={phase.duration}
                      onChange={(e) => updateStructure(index, 'duration', e.target.value)}
                      placeholder="e.g. 10 min"
                      className="w-full p-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/50" 
                    />
                  </div>
                  <div className="md:col-span-4">
                    <label className="block text-xs font-bold text-text-muted uppercase mb-1">Description</label>
                    <textarea 
                      rows={2}
                      value={phase.description}
                      onChange={(e) => updateStructure(index, 'description', e.target.value)}
                      placeholder="What happens in this phase?"
                      className="w-full p-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Materials */}
        <section className="bg-card p-8 rounded-3xl border border-border shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-text-dark flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Materials & Resources
            </h2>
            <div className="flex gap-4">
              <button 
                onClick={() => addMaterial('file')}
                className="text-primary text-sm font-bold hover:underline"
              >
                + Add File
              </button>
              <button 
                onClick={() => addMaterial('link')}
                className="text-accent text-sm font-bold hover:underline"
              >
                + Add Link
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {materials.map((material, index) => (
              <div key={index} className="flex gap-3 items-center p-4 rounded-xl border border-border bg-bg">
                {material.type === 'file' ? (
                  <FileText className="w-5 h-5 text-primary shrink-0" />
                ) : (
                  <LinkIcon className="w-5 h-5 text-accent shrink-0" />
                )}
                <input 
                  type="text" 
                  value={material.name}
                  onChange={(e) => updateMaterial(index, e.target.value)}
                  placeholder={material.type === 'file' ? "Filename.pdf" : "https://..."}
                  className="flex-1 bg-transparent border-none focus:outline-none text-sm font-medium" 
                />
                <button 
                  onClick={() => removeMaterial(index)}
                  className="p-2 text-text-muted hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {materials.length === 0 && (
              <p className="text-center py-8 text-text-muted italic border-2 border-dashed border-border rounded-2xl">
                No materials added yet.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
