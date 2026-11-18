import React, { useState, useEffect } from 'react';
import { JamarNavbar } from './components/JamarNavbar';
import { NationalView } from './components/NationalView';
import { CityDetailView } from './components/CityDetailView';
import { JamarCFOChatModal } from './components/JamarCFOChatModal';
import { 
  CITIES_DATA, 
  JAMAR_STORES, 
  JAMAR_SUMMARY, 
  JAMAR_PROJECTION, 
  JAMAR_PENDING_PROPOSAL 
} from './services/jamarMockData';
import { 
  CompanySummary, 
  CityFinancials, 
  StoreLocation, 
  ProjectionData, 
  AgentProposal 
} from './types';
import { X, RefreshCw, ShieldCheck } from 'lucide-react';

export function App() {
  const [summary, setSummary] = useState<CompanySummary>(JAMAR_SUMMARY);
  const [cities, setCities] = useState<CityFinancials[]>(CITIES_DATA);
  const [stores, setStores] = useState<StoreLocation[]>(JAMAR_STORES);
  const [projection, setProjection] = useState<ProjectionData>(JAMAR_PROJECTION);
  const [proposal, setProposal] = useState<AgentProposal | null>(JAMAR_PENDING_PROPOSAL);

  // Navegación: Vista Nacional vs Vista de Ciudad Detallada
  const [selectedCity, setSelectedCity] = useState<CityFinancials | null>(null);

  // Modals
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [emailPreviewHtml, setEmailPreviewHtml] = useState<string | null>(null);
  const [emailPreviewTitle, setEmailPreviewTitle] = useState('');

  // Status
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRescued, setIsRescued] = useState(false);

  // Simulación interactiva de aprobación del rescate
  const handleApproveProposal = (id: number) => {
    setIsProcessing(true);
    setTimeout(() => {
      const updatedTimeline = projection.timeline.map((point) => {
        if (point.day_offset >= 11) {
          const rescuedBalance = point.balance + 580000000;
          return {
            ...point,
            balance: rescuedBalance,
            pessimistic_balance: Math.round(rescuedBalance * 0.95),
            expected_balance: rescuedBalance,
            optimistic_balance: Math.round(rescuedBalance * 1.05),
            is_deficit: false,
          };
        }
        return point;
      });

      setProjection({
        has_deficit: false,
        minimum_balance: 195000000,
        health_score: 94,
        timeline: updatedTimeline,
      });

      setSummary((prev) => ({
        ...prev,
        has_deficit: false,
        health_score: 94,
        minimum_balance: 195000000,
        worst_deficit: 0,
      }));

      setProposal(null);
      setIsRescued(true);
      setIsProcessing(false);
    }, 800);
  };

  const handleRejectProposal = (id: number, reason: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setProposal(null);
      setIsProcessing(false);
    }, 500);
  };

  const handleResetScenario = () => {
    setSummary(JAMAR_SUMMARY);
    setProjection(JAMAR_PROJECTION);
    setProposal(JAMAR_PENDING_PROPOSAL);
    setIsRescued(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      
      {/* 1. Clean White Jamar Header with Breadcrumbs & Live Stats */}
      <JamarNavbar
        summary={summary}
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Rescued Success Banner (If Approved) */}
        {isRescued && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm animate-fade-in">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-emerald-600 text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-emerald-900">
                  ¡Plan de Rescate Autorizado y en Ejecución!
                </h3>
                <p className="text-xs text-emerald-800/90 font-medium">
                  Se activó la condonación de intereses de mora a 2.450 familias en Credijamar (recaudo estimado: <strong>+$340M COP</strong>) y se aplazó la factura de Maderas del Darién en Galapa. La nómina del día 14 está 100% blindada.
                </p>
              </div>
            </div>

            <button
              onClick={handleResetScenario}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 border border-slate-300 flex items-center gap-1.5 shrink-0 transition-all shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restablecer Demostración</span>
            </button>
          </div>
        )}

        {/* Dynamic View: City Detail View vs National Consolidated View */}
        {selectedCity ? (
          <CityDetailView
            city={selectedCity}
            stores={stores}
            onBackToNational={() => setSelectedCity(null)}
          />
        ) : (
          <NationalView
            summary={summary}
            cities={cities}
            projection={projection}
            proposal={proposal}
            onSelectCity={setSelectedCity}
            onApproveProposal={handleApproveProposal}
            onRejectProposal={handleRejectProposal}
            onPreviewEmail={(title, html) => {
              setEmailPreviewTitle(title);
              setEmailPreviewHtml(html);
            }}
            isProcessing={isProcessing}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-5 text-center text-xs text-slate-500 font-medium">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            FinGuardian AI © 2026 — Sistema Financiero & CFO Autónomo para <strong>Muebles Jamar S.A. & Credijamar</strong>.
          </p>
          <p className="text-slate-400">
            Complejo Industrial CILA Galapa • Red Nacional: Barranquilla, Bogotá, Medellín, Costa y Oriente.
          </p>
        </div>
      </footer>

      {/* CFO Chat Modal */}
      <JamarCFOChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      {/* HTML Email / Message Preview Modal */}
      {emailPreviewHtml && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-slate-200">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">
                {emailPreviewTitle}
              </h3>
              <button
                onClick={() => setEmailPreviewHtml(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div
              className="p-6 overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: emailPreviewHtml }}
            />
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
