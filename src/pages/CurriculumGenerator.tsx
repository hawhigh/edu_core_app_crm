import { useState } from "react";
import { useAcademic, ReferenceMaterial } from "../contexts/AcademicContext";
import { Sparkles, BookOpen, GraduationCap, FileText, ChevronRight, Loader2, Save, Trash2, Wand2 } from "lucide-react";
import Markdown from "react-markdown";
import { generateCurriculum } from "../services/geminiService";

export default function CurriculumGenerator() {
  const { referenceMaterials, curriculumPreparations, addCurriculumPreparation, deleteCurriculumPreparation, subjects, classes } = useAcademic();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [grade, setGrade] = useState("1");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");

  // Get unique subject names from the coordinator's subjects
  const coordinatorSubjects = Array.from(new Set(subjects.map(s => s.name)));
  
  // If no subjects exist, provide defaults
  const subjectOptions = coordinatorSubjects.length > 0 ? coordinatorSubjects : ["English", "Grammar", "Literature", "Speaking", "Writing", "Phonics"];

  const handleToggleMaterial = (id: string) => {
    setSelectedMaterials(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    if (!topic) {
      alert("Please enter a topic for the lesson.");
      return;
    }

    if (!subject) {
      alert("Please select a subject.");
      return;
    }

    setIsGenerating(true);
    try {
      const selectedContext = referenceMaterials
        .filter(m => selectedMaterials.includes(m.id))
        .map(m => `[${m.type.toUpperCase()}]: ${m.title}\n${m.content}`)
        .join("\n\n");

      const targetClassName = selectedClassId ? classes.find(c => c.id === selectedClassId)?.name : undefined;

      const content = await generateCurriculum({
        grade,
        subject,
        topic,
        className: targetClassName,
        context: selectedContext
      });

      setGeneratedContent(content);
    } catch (error: any) {
      console.error("Generation failed:", error);
      alert(`Generation failed: ${error.message || "Unknown error"}. Please ensure your GEMINI_API_KEY is configured in the application settings.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!generatedContent) return;
    addCurriculumPreparation({
      title: `${subject} - Grade ${grade}: ${topic}`,
      grade,
      subject,
      topic,
      content: generatedContent,
      dateGenerated: new Date().toISOString().split('T')[0],
      sourceMaterialIds: selectedMaterials
    });
    setGeneratedContent("");
    setTopic("");
    alert("Preparation saved to library!");
  };

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <header className="bg-card p-6 md:p-8 rounded-3xl border border-border flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text-dark">AI Curriculum Generator</h1>
            <p className="text-text-muted mt-1">Generate professional lesson preparations using AI and your own resources.</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <section className="bg-card p-6 rounded-3xl border border-border shadow-sm">
            <h2 className="text-xl font-bold text-text-dark mb-6 flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-primary" />
              Generator Settings
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Class (Optional)</label>
                  <select 
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    className="w-full bg-bg border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="">Select Class</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Grade</label>
                  <select 
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full bg-bg border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary"
                  >
                    {Array.from({ length: 9 }).map((_, i) => (
                      <option key={i+1} value={i+1}>Grade {i+1}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Subject</label>
                <select 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-bg border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary"
                >
                  <option value="">Select Subject</option>
                  {subjectOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Lesson Topic</label>
                <input 
                  type="text" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Present Continuous Tense"
                  className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Reference Materials</label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {referenceMaterials.map(material => (
                    <button
                      key={material.id}
                      onClick={() => handleToggleMaterial(material.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                        selectedMaterials.includes(material.id) 
                          ? 'bg-primary/5 border-primary text-primary' 
                          : 'bg-bg border-border text-text-muted hover:border-primary/30'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${selectedMaterials.includes(material.id) ? 'bg-primary' : 'bg-border'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate">{material.title}</p>
                        <p className="text-[10px] uppercase opacity-70">{material.type.replace('_', ' ')}</p>
                      </div>
                    </button>
                  ))}
                  {referenceMaterials.length === 0 && (
                    <p className="text-xs text-text-muted italic text-center py-4">No reference materials found. Add some in the Resources section.</p>
                  )}
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !topic}
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Preparation
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Saved Preparations List */}
          <section className="bg-card p-6 rounded-3xl border border-border shadow-sm">
            <h2 className="text-xl font-bold text-text-dark mb-6">Saved Library</h2>
            <div className="space-y-3">
              {curriculumPreparations.map(prep => (
                <div key={prep.id} className="p-4 rounded-2xl bg-bg border border-border flex items-center justify-between group">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-text-dark truncate">{prep.title}</p>
                    <p className="text-[10px] text-text-muted uppercase font-bold">{prep.dateGenerated}</p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setGeneratedContent(prep.content)}
                      className="p-2 text-primary hover:bg-primary/5 rounded-lg"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteCurriculumPreparation(prep.id)}
                      className="p-2 text-text-muted hover:text-red-500 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {curriculumPreparations.length === 0 && (
                <p className="text-xs text-text-muted italic text-center py-4">No saved preparations yet.</p>
              )}
            </div>
          </section>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <section className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm min-h-[600px] flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-text-dark flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-primary" />
                Lesson Preparation
              </h2>
              {generatedContent && (
                <button 
                  onClick={handleSave}
                  className="bg-green-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-green-600 transition-all shadow-lg shadow-green-500/20"
                >
                  <Save className="w-4 h-4" />
                  Save to Library
                </button>
              )}
            </div>

            {generatedContent ? (
              <div className="prose prose-slate max-w-none flex-1 overflow-y-auto pr-4 custom-scrollbar">
                <div className="markdown-body">
                  <Markdown>{generatedContent}</Markdown>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
                <div className="w-24 h-24 rounded-full bg-bg border-4 border-dashed border-border flex items-center justify-center mb-6">
                  <Sparkles className="w-10 h-10 text-text-muted" />
                </div>
                <h3 className="text-xl font-bold text-text-dark">Ready to Generate</h3>
                <p className="text-sm text-text-muted max-w-xs mt-2">
                  Configure your settings on the left and click generate to create a professional curriculum preparation.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
