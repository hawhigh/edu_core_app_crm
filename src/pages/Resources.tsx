import { useState } from "react";
import { useAcademic, ReferenceMaterial } from "../contexts/AcademicContext";
import { FileText, Plus, Trash2, ExternalLink, Database, Server, Link as LinkIcon, X } from "lucide-react";

export default function Resources() {
  const { referenceMaterials, addReferenceMaterial, deleteReferenceMaterial, nasUrl, setNasUrl } = useAcademic();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<ReferenceMaterial>>({
    type: 'government_plan'
  });
  
  const handleSaveNasUrl = () => {
    // nasUrl is now managed by setNasUrl and persisted via AcademicContext
    alert("NAS URL updated successfully!");
  };

  const handleAddMaterial = () => {
    if (!formData.title || !formData.content) return;
    addReferenceMaterial({
      title: formData.title,
      type: formData.type as any,
      content: formData.content,
      url: formData.url,
      dateAdded: new Date().toISOString().split('T')[0]
    });
    setShowModal(false);
    setFormData({ type: 'government_plan' });
  };

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-text-dark">Educational Resources</h1>
          <p className="text-text-muted mt-1">Manage government plans, lector scripts, and external data sources.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 w-full md:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          Add Resource
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* NAS Configuration */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <section className="bg-card p-6 rounded-3xl border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Server className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-text-dark">NAS Connection</h2>
            </div>
            <p className="text-sm text-text-muted mb-6">
              Connect your local NAS or server to link large files directly into your curriculum preparations.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Server Base URL</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={nasUrl}
                    onChange={(e) => setNasUrl(e.target.value)}
                    placeholder="http://192.168.1.100:5000"
                    className="flex-1 bg-bg border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                  <button 
                    onClick={handleSaveNasUrl}
                    className="bg-primary/10 text-primary px-4 py-2 rounded-xl font-bold text-sm hover:bg-primary hover:text-white transition-all"
                  >
                    Save
                  </button>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-bg border border-border flex items-center gap-3">
                <Database className="w-5 h-5 text-text-muted" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-text-dark">Status</p>
                  <p className="text-[10px] text-green-500 font-bold uppercase">Connected (Local)</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Resources List */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {referenceMaterials.map((material) => (
              <div key={material.id} className="bg-card p-6 rounded-3xl border border-border hover:border-primary/50 transition-all group relative">
                <button 
                  onClick={() => deleteReferenceMaterial(material.id)}
                  className="absolute top-4 right-4 p-2 text-text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    material.type === 'government_plan' ? 'bg-purple-100 text-purple-600' : 
                    material.type === 'lector_script' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-text-dark">{material.title}</h3>
                    <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider">
                      {material.type.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                
                <p className="text-sm text-text-muted mb-6 line-clamp-3">
                  {material.content}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                  <span className="text-[10px] text-text-muted font-bold">{material.dateAdded}</span>
                  {material.url && (
                    <a 
                      href={material.url.startsWith('http') ? material.url : `${nasUrl}${material.url}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary text-xs font-bold flex items-center gap-1 hover:underline"
                    >
                      View Source <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
            {referenceMaterials.length === 0 && (
              <div className="col-span-full py-20 bg-card rounded-3xl border border-dashed border-border flex flex-col items-center justify-center text-center px-6">
                <FileText className="w-12 h-12 text-text-muted mb-4 opacity-20" />
                <p className="text-text-muted font-medium">No resources added yet.</p>
                <p className="text-xs text-text-muted mt-1">Add government plans or lector scripts to use them in the generator.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Resource Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-card w-full max-w-lg rounded-3xl p-8 border border-border shadow-2xl relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-text-muted hover:text-text-dark"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-text-dark mb-6">Add New Resource</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Resource Title</label>
                <input 
                  type="text" 
                  value={formData.title || ''}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-bg border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                  placeholder="e.g. English Curriculum 2025"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Type</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                  className="w-full bg-bg border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="government_plan">Government Education Plan</option>
                  <option value="lector_script">Lector Script</option>
                  <option value="other">Other Data</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Content / Summary</label>
                <textarea 
                  value={formData.content || ''}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full bg-bg border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors h-32 resize-none"
                  placeholder="Paste the content or a summary of the resource here..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">NAS Path / URL (Optional)</label>
                <div className="flex gap-2">
                  <div className="bg-bg border border-border rounded-xl px-4 py-3 flex items-center text-text-muted">
                    <LinkIcon className="w-4 h-4" />
                  </div>
                  <input 
                    type="text" 
                    value={formData.url || ''}
                    onChange={(e) => setFormData({...formData, url: e.target.value})}
                    className="flex-1 bg-bg border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    placeholder="/path/to/file.pdf or https://..."
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-2xl border border-border font-bold hover:bg-bg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddMaterial}
                className="flex-1 py-3 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                Save Resource
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
