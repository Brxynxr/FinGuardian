import React, { useState, useEffect } from 'react';
import { JamarHeader } from './components/JamarHeader';
import { CredijamarCard } from './components/CredijamarCard';
import { SedesCounterGrid } from './components/SedesCounterGrid';
import { JamarLiquidityChart } from './components/JamarLiquidityChart';
import { JamarRescueCenter } from './components/JamarRescueCenter';
import { JamarCFOChatModal } from './components/JamarCFOChatModal';
import { 
  JAMAR_STORES, 
  JAMAR_CREDIJAMAR_PORTFOLIO, 
  JAMAR_SUMMARY, 
  JAMAR_PROJECTION, 
  JAMAR_PENDING_PROPOSAL 
} from './services/jamarMockData';
import { api } from './services/api';
import { 
  CompanySummary, 
  ProjectionData, 
  AgentProposal, 
  StoreLocation, 
  CredijamarPortfolio 
} from './types';
import { X, RefreshCw, Sparkles, ShieldCheck } from 'lucide-react';

export function App() {
  const [summary, setSummary] = useState<CompanySummary>(JAMAR_SUMMARY);
  const [projection, setProjection] = useState<ProjectionData>(JAMAR_PROJECTION);
  const [stores, setStores] = useState<StoreLocation[]>(JAMAR_STORES);
  const [portfolio, setPortfolio] = useState<CredijamarPortfolio>(JAMAR_CREDIJAMAR_PORTFOLIO);
  const [proposal, setProposal] = useState<AgentProposal | null>(JAMAR_PENDING_PROPOSAL);

  // Modals
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [emailPreviewHtml, setEmailPreviewHtml] = useState<string | null>(null);
  const [emailPreviewTitle, setEmailPreviewTitle] = useState('');

  // Status
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRescued, setIsRescued] = useState(false);

  // Intentar sincronizar con backend si está arriba
  const syncWithBackend = async () => {
    try {
      const sum = await api.getSummary();
      if (sum && sum.name.includes('Jamar')) {
        setSummary(sum);
      }
    } catch {
      // Usar mock local perfectamente calibrado
    }
  };

  useEffect(() => {
    syncWithBackend();
  }, []);

  // Simulación interactiva de aprobación del rescate
  const handleApproveProposal = (id: number) => {
    setIsProcessing(true);
    setTimeout(() => {
      // 1. Curar el déficit en la proyección
      const updatedTimeline = projection.timeline.map((point) => {
        // En los días de nómina (día 14 en adelante), sumamos los $340M del recaudo y $240M de la prórroga de madera
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

      // 2. Actualizar resumen
      setSummary((prev) => ({
        ...prev,
        has_deficit: false,
        health_score: 94,
        minimum_balance: 195000000,
        worst_deficit: 0,
      }));

      // 3. Limpiar propuesta pendiente
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
    <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col font-sans selection:bg-jamar-crimson selection:text-white">
      
      {/* 1. Executive Jamar Header */}
      <JamarHeader
        summary={summary}
        onOpenChat={() => setIsChatOpen(true)}
        onTriggerAnalysis={() => {}}
        isProcessing={isProcessing}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Rescued Success Banner (If Approved) */}
        {isRescued && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-obsidian-950 border border-emerald-600/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xl animate-fade-in">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-emerald-500 text-black">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">
                  ¡Plan de Rescate Ejecutado Exitosamente!
                </h3>
                <p className="text-xs text-slate-300">
                  Se autorizó la campaña flash Credijamar a 2.450 clientes (recaudo estimado: <strong>+$340M COP</strong>) y se aplazó la factura de Maderas del Darién por 18 días. La nómina del día 14 está 100% blindada.
                </p>
              </div>
            </div>

            <button
              onClick={handleResetScenario}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center gap-1.5 shrink-0 self-start sm:self-auto transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restablecer Demostración</span>
            </button>
          </div>
        )}

        {/* 2. Rescue Protocol Center (If proposal exists) */}
        <JamarRescueCenter
          proposal={proposal}
          onApprove={handleApproveProposal}
          onReject={handleRejectProposal}
          onPreviewEmail={(title, html) => {
            setEmailPreviewTitle(title);
            setEmailPreviewHtml(html);
          }}
          isProcessing={isProcessing}
        />

        {/* 3. Credijamar Portfolio Breakdown */}
        <CredijamarCard
          portfolio={portfolio}
          onTargetEarlyArrears={() => {
            // Scroll suave hacia la propuesta o abrir chat
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* 4. Liquidity Projection Curve (40 days COP) */}
        <JamarLiquidityChart
          projection={projection}
          safeThreshold={summary.safe_threshold}
        />

        {/* 5. Sedes Counter Grid (Grouped by City) */}
        <SedesCounterGrid stores={stores} />

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-obsidian-950/80 py-4 text-center text-xs text-slate-400">
        <p>
          FinGuardian AI © 2026 — Edición Especial <strong>Muebles Jamar S.A. & Credijamar</strong> • Sede Central: Barranquilla & Clúster CILA Galapa.
        </p>
      </footer>

      {/* CFO Chat Modal */}
      <JamarCFOChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      {/* HTML Email / Message Preview Modal */}
      {emailPreviewHtml && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 bg-slate-100 border-b flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">
                {emailPreviewTitle}
              </h3>
              <button
                onClick={() => setEmailPreviewHtml(null)}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200"
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
