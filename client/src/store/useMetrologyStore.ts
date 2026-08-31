import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  ViewPage, 
  ProductInspection, 
  FlaggedViolation, 
  InspectorUser, 
  ComplianceStatus 
} from '../types/metrology';
import { SAMPLE_INSPECTIONS } from '../utils/sampleData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}

interface MetrologyStoreState {
  activePage: ViewPage;
  currentUser: InspectorUser;
  inspections: ProductInspection[];
  selectedInspection: ProductInspection | null;
  activeViolationForExplainability: FlaggedViolation | null;
  selectedCategoryFilter: string | null;
  toasts: ToastMessage[];

  // Upload & Analysis pipeline state
  uploadFiles: string[];
  isAnalyzing: boolean;
  analysisProgress: number; // 0 to 100

  // Actions
  setActivePage: (page: ViewPage) => void;
  setCurrentUser: (user: Partial<InspectorUser>) => void;
  addUploadFile: (dataUrl: string) => void;
  removeUploadFile: (index: number) => void;
  clearUploads: () => void;
  startAnalysisPipeline: () => void;
  selectInspection: (inspection: ProductInspection) => void;
  setExplainableViolation: (violation: FlaggedViolation | null) => void;
  setCategoryFilter: (cat: string | null) => void;
  loginUser: (userData?: Partial<InspectorUser>) => void;
  logoutUser: () => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useMetrologyStore = create<MetrologyStoreState>()(
  persist(
    (set, get) => ({
      activePage: 'login',
      currentUser: {
        id: 'insp-101',
        name: 'Inspector S. Verma',
        badgeId: 'LM-OFFICER-789',
        district: 'Pune District',
        role: 'Enforcement Officer',
        department: 'Dept. of Legal Metrology, Maharashtra',
        isLoggedIn: false,
      },
      inspections: SAMPLE_INSPECTIONS,
      selectedInspection: SAMPLE_INSPECTIONS[0],
      activeViolationForExplainability: null,
      selectedCategoryFilter: null,
      toasts: [],

      uploadFiles: [],
      isAnalyzing: false,
      analysisProgress: 0,

      addToast: (toast) => {
        const id = Math.random().toString(36).substring(2, 9);
        set((state) => ({
          toasts: [...state.toasts, { ...toast, id }],
        }));
        setTimeout(() => {
          get().removeToast(id);
        }, 3500);
      },

      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),

      setActivePage: (page) => set({ activePage: page }),

      setCurrentUser: (user) =>
        set((state) => ({
          currentUser: { ...state.currentUser, ...user },
        })),

      addUploadFile: (dataUrl) =>
        set((state) => ({ uploadFiles: [...state.uploadFiles, dataUrl] })),

      removeUploadFile: (index) =>
        set((state) => ({ uploadFiles: state.uploadFiles.filter((_, i) => i !== index) })),

      clearUploads: () => set({ uploadFiles: [] }),

      startAnalysisPipeline: async () => {
        set({ isAnalyzing: true, analysisProgress: 10, activePage: 'analysis' });

        try {
          const state = get();
          
          // Fake progress while waiting for API
          const interval = setInterval(() => {
            const currentProgress = get().analysisProgress;
            if (currentProgress < 85) {
              set({ analysisProgress: currentProgress + 15 });
            }
          }, 800);

          const { apiService } = await import('../services/api');
          const result = await apiService.analyzePackaging(state.uploadFiles);
          
          clearInterval(interval);
          set({ analysisProgress: 100 });
          
          setTimeout(() => {
             set((s) => ({ 
               isAnalyzing: false, 
               selectedInspection: result,
               inspections: [result, ...s.inspections],
               activePage: 'result' 
             }));
          }, 600);
          
        } catch (error) {
           clearInterval(interval);
           console.error("Analysis failed", error);
           set({ isAnalyzing: false, activePage: 'scan', analysisProgress: 0 });
           get().addToast({ type: 'error', title: 'Analysis Failed', message: 'Could not connect to OCR service.' });
        }
      },

      selectInspection: (inspection) => {
        set({ selectedInspection: inspection, activePage: 'result' });
      },

      setExplainableViolation: (violation) => set({ activeViolationForExplainability: violation }),

      setCategoryFilter: (cat) => {
        set({ selectedCategoryFilter: cat, activePage: 'violations' });
      },

      loginUser: (userData) => {
        set((state) => ({
          currentUser: { 
            ...state.currentUser, 
            ...userData, 
            isLoggedIn: true 
          },
          activePage: 'dashboard'
        }));
      },

      logoutUser: () => {
        set((state) => ({
          currentUser: { ...state.currentUser, isLoggedIn: false },
          activePage: 'login'
        }));
      },
    }),
    {
      name: 'legal-metrology-gov-store',
      partialize: (state) => ({
        inspections: state.inspections,
        currentUser: state.currentUser,
        activePage: state.activePage,
      }),
    }
  )
);
