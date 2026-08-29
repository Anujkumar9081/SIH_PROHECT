import React from 'react';
import { Camera, Upload, Sparkles, CheckCircle2, Image as ImageIcon, Trash2, ArrowRight } from 'lucide-react';
import { useMetrologyStore } from '../store/useMetrologyStore';

export const ProductUpload: React.FC = () => {
  const { uploadFiles, addUploadFile, removeUploadFile, startAnalysisPipeline } = useMetrologyStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            addUploadFile(event.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };


  const handleRemove = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    removeUploadFile(index);
  };

  const isReady = uploadFiles.length > 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
      
      {/* Big Main Upload Card */}
      <div className="gov-card p-8 sm:p-10 text-center space-y-6 border-2 border-dashed border-slate-300 hover:border-blue-500 transition-all rounded-3xl bg-white shadow-md">
        
        <div className="w-18 h-18 mx-auto rounded-3xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-700 shadow-inner group hover:scale-105 transition-transform">
          <Camera className="w-9 h-9 text-blue-700" />
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">SCAN PRODUCT PACKAGING</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-lg mx-auto">
            Upload as many package images as you need for automated OCR data extraction.
          </p>
        </div>

        {/* Dynamic Upload Slots Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          
          {uploadFiles.map((file, index) => (
            <div key={index} className="p-2 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col items-center justify-center space-y-2 relative group hover:border-blue-300 transition">
              <div className="w-full h-32 rounded-xl bg-slate-900 border border-slate-700 relative overflow-hidden flex items-center justify-center p-1 group/img">
                <img src={file} alt={`Upload ${index + 1}`} className="max-h-full object-contain" />
                <button
                  onClick={(e) => handleRemove(index, e)}
                  className="absolute top-1.5 right-1.5 p-1 rounded-md bg-red-600/90 text-white opacity-0 group-hover/img:opacity-100 transition btn-press shadow-md"
                  title="Remove image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {/* Add Photos Slot */}
          <div className="p-2 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col items-center justify-center relative group hover:border-blue-300 transition">
            <label className="w-full h-32 rounded-xl border-2 border-dashed border-slate-300/90 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100/80 transition btn-press">
              <Upload className="w-5 h-5 text-slate-400 mb-1.5" />
              <span className="text-[11px] font-bold text-blue-700">Add Photos</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Multiple Allowed</span>
              <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
            </label>
          </div>
        </div>



        {/* Big Analyze Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={startAnalysisPipeline}
            disabled={!isReady}
            className={`w-full py-4 rounded-2xl font-black text-sm tracking-wider uppercase shadow-xl transition-all btn-ripple btn-press flex items-center justify-center gap-2 ${
              isReady
                ? 'bg-blue-700 hover:bg-blue-800 text-white shadow-blue-700/30 cursor-pointer animate-subtle-glow'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>START AI METROLOGY AUDIT</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
