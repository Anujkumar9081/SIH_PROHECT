import React from 'react';
import { ProductUpload } from '../components/ProductUpload';

export const ScanProduct: React.FC = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in-up">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">COMMODITY PACKAGING SCANNER</h2>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">
          Legal Metrology AI Automatic Compliance Scanner & OCR Field Extractor under PCR 2011
        </p>
      </div>

      <ProductUpload />
    </div>
  );
};
