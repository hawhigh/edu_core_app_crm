import { BookOpen, Plus, Save, Trash2, GripVertical, Edit2, ExternalLink, CheckCircle, Send, ChevronRight, ChevronDown, RotateCcw, ArrowUp, ArrowDown, ClipboardCheck } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAcademic } from "../contexts/AcademicContext";
import { useState } from "react";

export default function CurriculumPreparation() {
  const { lessons, deleteLesson, publishAll, publishLesson, subjects, classes, topics, addTopic, updateLesson, moveLesson } = useAcademic();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const subjectId = searchParams.get('subjectId') || 'sub-1';
  const subject = subjects.find(s => s.id === subjectId);
  const cls = classes.find(c => c.id === subject?.classId);
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [showAddTopic, setShowAddTopic] = useState(false);

  const handlePublishAll = () => {
    publishAll(subjectId);
    setSuccessMessage("Curriculum published successfully! All lessons are now visible to students and parents.");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleSaveDraft = () => {
    setSuccessMessage("Curriculum draft saved successfully.");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleAddTopic = () => {
    if (!newTopicTitle.trim()) return;
    addTopic({
      subjectId,
      title: newTopicTitle,
      order: topics.filter(t => t.subjectId === subjectId).length + 1
    });
    setNewTopicTitle("");
    setShowAddTopic(false);
  };

  const subjectTopics = topics.filter(t => t.subjectId === subjectId).sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <header 
        className="bg-card p-8 rounded-3xl border border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{subject?.name || 'Subject'}</span>
            <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Grade {cls?.name || 'Class'}</span>
          </div>
          <h1 className="text-3xl font-bold text-text-dark">Curriculum Preparation</h1>
          <p className="text-text-muted mt-2">Plan and organize your course structure for the semester.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={handleSaveDraft}
            className="flex-1 md:flex-none bg-card text-text-dark border border-border px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-bg transition-colors"
          >
            <Save className="w-5 h-5" />
            Save Draft
          </button>
          <button 
            onClick={handlePublishAll}
            className="flex-1 md:flex-none bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
          >
            <Send className="w-5 h-5" />
            Publish All
          </button>
        </div>
      </header>

      {showSuccess && (
        <div className="bg-green-100 border border-green-200 text-green-700 px-6 py-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle className="w-5 h-5" />
          <div className="flex flex-col">
            <span className="font-bold">Success!</span>
            <span className="text-sm">{successMessage}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Lesson Plan */}
        <div 
          className="lg:col-span-2 flex flex-col gap-6"
        >
          {subjectTopics.map((topic, topicIdx) => (
            <div key={topic.id} className="bg-card p-6 rounded-3xl border border-border">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-text-dark flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Topic {topicIdx + 1}: {topic.title}
                </h2>
                <Link 
                  to={`/teacher/lesson-editor?subjectId=${subjectId}&topicId=${topic.id}`}
                  className="text-primary font-medium hover:underline text-sm flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add Lesson
                </Link>
              </div>
              
              <div className="flex flex-col gap-3">
                {lessons.filter(l => l.topicId === topic.id).map((lesson, index) => (
                  <div 
                    key={lesson.id} 
                    className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-bg group hover:border-primary/50 transition-colors"
                  >
                    <div className="cursor-grab text-text-muted hover:text-text-dark">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-text-dark">{lesson.title}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          lesson.status === 'published' ? 'bg-green-100 text-green-600' : 
                          lesson.status === 'rework' ? 'bg-red-100 text-red-600' :
                          'bg-orange-100 text-orange-600'
                        }`}>
                          {lesson.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
                        <span>{lesson.duration}</span>
                        <span className="w-1 h-1 rounded-full bg-border"></span>
                        <span>{lesson.type}</span>
                        {lesson.date && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-border"></span>
                            <span>{lesson.date}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {lesson.status === 'published' && (
                        <button 
                          onClick={() => updateLesson(lesson.id, { status: 'rework' })}
                          className="p-2 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Mark for Rework"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      )}
                      {(lesson.status === 'draft' || lesson.status === 'rework') && (
                        <button 
                          onClick={() => publishLesson(lesson.id)}
                          className="p-2 text-text-muted hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Publish Lesson"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      )}
                      <Link 
                        to={`/subject?id=${lesson.id}`}
                        className="p-2 text-text-muted hover:text-accent hover:bg-accent/5 rounded-lg transition-colors"
                        title="View as Student"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => navigate(`/teacher/lesson-editor/${lesson.id}`)}
                        className="p-2 text-text-muted hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                        title="Edit Lesson"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteLesson(lesson.id)}
                        className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Lesson"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2 border-l border-border pl-2">
                      <button 
                        onClick={() => moveLesson(lesson.id, 'up')}
                        className="p-1 text-text-muted hover:text-primary hover:bg-primary/5 rounded transition-colors"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => moveLesson(lesson.id, 'down')}
                        className="p-1 text-text-muted hover:text-primary hover:bg-primary/5 rounded transition-colors"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
                {lessons.filter(l => l.topicId === topic.id).length === 0 && (
                  <div className="text-center py-8 text-text-muted italic border-2 border-dashed border-border rounded-3xl">
                    No lessons in this topic yet.
                  </div>
                )}
              </div>
            </div>
          ))}

          {showAddTopic ? (
            <div className="bg-card p-6 rounded-3xl border border-border">
              <h3 className="font-bold text-text-dark mb-4">Add New Topic</h3>
              <input 
                type="text" 
                value={newTopicTitle}
                onChange={(e) => setNewTopicTitle(e.target.value)}
                placeholder="Topic Title"
                className="w-full p-3 rounded-xl border border-border bg-bg mb-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <div className="flex gap-3">
                <button 
                  onClick={handleAddTopic}
                  className="bg-primary text-white px-6 py-2 rounded-xl font-bold hover:bg-primary/90 transition-colors"
                >
                  Add Topic
                </button>
                <button 
                  onClick={() => setShowAddTopic(false)}
                  className="bg-bg text-text-dark border border-border px-6 py-2 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setShowAddTopic(true)}
              className="w-full py-4 rounded-2xl border-2 border-dashed border-border text-text-muted font-bold hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Topic
            </button>
          )}
        </div>

        {/* Sidebar - Settings */}
        <div 
          className="flex flex-col gap-6"
        >
          <div className="bg-card p-6 rounded-3xl border border-border">
            <h2 className="text-xl font-bold text-text-dark mb-6">Course Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-text-dark mb-2">Course Title</label>
                <input type="text" defaultValue={subject?.name} className="w-full p-3 rounded-xl border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-text-dark mb-2">Description</label>
                <textarea rows={4} defaultValue="Foundational concepts for this grade level." className="w-full p-3 rounded-xl border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-text-dark mb-2">Total Hours</label>
                <input type="number" defaultValue={120} className="w-full p-3 rounded-xl border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>

              <div className="pt-4 border-t border-border">
                <Link 
                  to={`/teacher/grades?subjectId=${subjectId}`}
                  className="w-full py-4 rounded-2xl bg-accent text-white font-bold flex items-center justify-center gap-2 hover:bg-accent/90 transition-all shadow-lg shadow-accent/20"
                >
                  <ClipboardCheck className="w-5 h-5" />
                  Manage Student Grades
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
