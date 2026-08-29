import React, { useState } from 'react';
import { FileDown, ArrowLeft, ShieldAlert, CheckCircle2, Eye, EyeOff, Loader2, ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';
import { useMetrologyStore } from '../store/useMetrologyStore';
import { ComplianceCard } from '../components/ComplianceCard';
import { ViolationCard } from '../components/ViolationCard';
import { ExplainableAIModal } from '../components/ExplainableAIModal';
import { generateInspectionPDF } from '../utils/pdfGenerator';

export const Result: React.FC = () => {
  const { selectedInspection, setActivePage } = useMetrologyStore();
  const [showOverlay, setShowOverlay] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [rotations, setRotations] = useState<Record<number, number>>({});

  if (!selectedInspection) {
    return (
      <div className="p-8 text-center text-slate-500">
        No inspection selected. Return to{' '}
        <button onClick={() => setActivePage('dashboard')} className="text-blue-700 underline font-bold btn-press">
          Dashboard
        </button>
        .
      </div>
    );
  }

  const record = selectedInspection;

  const images = record.uploadedImages && record.uploadedImages.length > 0
    ? record.uploadedImages
    : [record.frontImage, record.backImage, record.sideImage].filter(Boolean) as string[];

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const targetImage = images[currentImageIndex];
      const rotationDeg = rotations[currentImageIndex] || 0;
      await generateInspectionPDF(record, targetImage, rotationDeg);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleRotate = () => {
    setRotations(prev => ({
      ...prev,
      [currentImageIndex]: ((prev[currentImageIndex] || 0) + 90) % 360
    }));
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1);
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 animate-fade-in-up">
      
      <ExplainableAIModal />

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActivePage('dashboard')}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition btn-press"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Inspection Audit & Compliance Verdict</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-bold text-blue-700 font-mono">
                {record.department}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs shadow-md shadow-blue-700/25 transition btn-ripple btn-press disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingPDF ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
            {isGeneratingPDF ? 'GENERATING PDF...' : 'GENERATE OFFICIAL PDF REPORT'}
          </button>
        </div>
      </div>

      {/* Main Result Dual-Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Product Image Carousel (6 cols) */}
        <div className="lg:col-span-6 gov-card p-6 border rounded-2xl space-y-4 shadow-sm bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Package Evidence Visualizer</h3>
              <p className="text-[11px] text-slate-500">Image {currentImageIndex + 1} of {images.length}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRotate}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition btn-press select-none"
              >
                <RotateCw className="w-3.5 h-3.5 text-blue-700" />
                <span>Rotate</span>
              </button>
              <button
                onClick={() => setShowOverlay(!showOverlay)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition btn-press select-none"
              >
                {showOverlay ? <EyeOff className="w-3.5 h-3.5 text-slate-500" /> : <Eye className="w-3.5 h-3.5 text-blue-700" />}
                <span>{showOverlay ? 'Hide Overlay' : 'Show Overlay'}</span>
              </button>
            </div>
          </div>

          <div className="h-[460px] rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center p-4 relative overflow-hidden group">
            <img 
              src={images[currentImageIndex]} 
              alt={record.productName} 
              className="max-h-full max-w-full object-contain transition-transform duration-300"
              style={{ transform: `rotate(${rotations[currentImageIndex] || 0}deg)` }}
            />
            
            {images.length > 1 && (
              <>
                <button 
                  onClick={handlePrevImage}
                  className="absolute left-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 opacity-0 group-hover:opacity-100 transition shadow-lg btn-press"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={handleNextImage}
                  className="absolute right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 opacity-0 group-hover:opacity-100 transition shadow-lg btn-press"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md">
                  {images.map((_, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`transition-all duration-300 ${idx === currentImageIndex ? 'w-4 h-1.5 bg-blue-500 rounded-full' : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80 rounded-full'}`}
                      aria-label={`Go to image ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="text-[11px] text-slate-500 text-center font-mono">
            Image successfully captured and analyzed via OCR.
          </div>
        </div>

        {/* Right Side: Compliance Status & Declarations (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Compliance Status Card */}
          <ComplianceCard
            declarations={record.declarations}
            overallStatus={record.overallStatus}
            confidenceScore={record.confidenceScore}
          />

          {/* Extracted Data Section instead of Violations */}
          <div className="gov-card p-6 border border-emerald-200 bg-emerald-50/40 rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="font-extrabold text-emerald-900 text-base">Scan Complete</h4>
            <p className="text-xs text-emerald-700">
              Data successfully extracted via OCR.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
