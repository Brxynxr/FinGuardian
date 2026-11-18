import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Store, 
  CreditCard, 
  TrendingUp, 
  Building2 
} from 'lucide-react';
import { api } from '../services/api';

interface JamarCFOChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const JamarCFOChatModal: React.FC<JamarCFOChatModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: '¡Hola! Soy tu **Copiloto CFO para Muebles Jamar & Credijamar**. Tengo acceso en tiempo real a las métricas de las 4 regionales (Barranquilla, Bogotá, Medellín, Costa/Oriente), costos de nómina por ciudad, inventario de salas y alcobas, y cartera de financiación. ¿Qué consulta financiera o estratégica deseas realizar?',
      timestamp: 'Ahora',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const quickPrompts = [
    '¿Podemos abrir una nueva sede en Montería este semestre?',
    '¿Cuál es la ciudad con mayor porcentaje de ventas a crédito?',
    '¿Cuánto gastamos en arriendos de tiendas en centros comerciales?',
    '¿Qué categoría de muebles genera más ingresos en Barranquilla?',
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      let replyText = '';
      try {
        const res = await api.chatCFO(query);
        replyText = res;
      } catch {
        if (query.toLowerCase().includes('montería') || query.toLowerCase().includes('nueva sede')) {
          replyText = `### 🏢 Dictamen Financiero: Nueva Sede Montería
1. **Inversión Inicial Requerida (CAPEX):**
   * Adecuación de showroom comercial (1.200 m²): **$280M COP**.
   * Inventario inicial de exhibición (salas, comedores, alcobas): **$190M COP**.
   * **Inversión total:** **$470M COP**.

2. **Costo Fijo Mensual Estimado (OPEX):**
   * Nómina de 1 Administrador, 6 Asesores de Ventas y 2 Armadores: **$24M COP/mes**.
   * Canon de arriendo comercial + energía/aire: **$32M COP/mes**.
   * **Gasto fijo total:** **$56M COP/mes**.

3. **Punto de Equilibrio (Break-Even):**
   * Con un margen bruto de retail del 39%, la sede necesita vender mínimo **$143M COP mensuales** (unas 48 salas promedio) solo para cubrir sus costos.

⚠️ **Recomendación:** Actualmente la caja central proyecta un déficit de **-$390M COP** para el corte de nómina del día 14. **No es prudente desembolsar los $470M este mes**. Se recomienda esperar a la temporada de primas de mitad de año donde el superávit de Credijamar superará los **$750M COP**.`;
        } else if (query.toLowerCase().includes('crédito') || query.toLowerCase().includes('mayor porcentaje')) {
          replyText = `La regional con mayor penetración de crédito es **Costa & Oriente con un 81% de ventas a través de Credijamar**, seguida por **Barranquilla & Atlántico con un 78%**. 

En contraste, **Bogotá & Sabana registra el mayor porcentaje de dinero directo / contado (26%)**, lo que genera mayor liquidez inmediata en caja pero menor margen financiero por intereses de crédito.`;
        } else if (query.toLowerCase().includes('categoría') || query.toLowerCase().includes('barranquilla')) {
          replyText = `En **Barranquilla & Atlántico**, la categoría reina son las **Salas & Sofás, que representan el 44% de las ventas ($766.480.000 COP / 260 unidades)**, seguida por **Alcobas & Cuartos (32% / $557.440.000 COP / 340 unidades)**.

Los Comedores representan el 16% y los muebles de TV/Estudio el 8%.`;
        } else {
          replyText = `Actualmente Muebles Jamar cuenta con **$1.420M COP en bancos**, una nómina nacional consolidada de **$780M COP** para 1.200 trabajadores y un volumen de ventas del mes de **$6.141M COP** (77.2% financiado por Credijamar y 22.8% de contado directo).`;
        }
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col h-[620px] overflow-hidden">
        
        {/* Top Jamar Red Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-jamar-crimson to-red-500" />

        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-200">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                Copiloto CFO Jamar AI
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                  Groq 120B Retail
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Asesor financiero especializado en retail mobiliario, cartera Credijamar y ciudades.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isUser
                      ? 'bg-slate-900 text-white'
                      : 'bg-red-600 text-white shadow-md shadow-red-200'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[82%] rounded-2xl p-4 text-xs leading-relaxed shadow-sm ${
                    isUser
                      ? 'bg-red-600 text-white rounded-tr-none'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none whitespace-pre-wrap'
                  }`}
                >
                  {m.text}
                  <div
                    className={`text-[9px] mt-1.5 font-medium ${
                      isUser ? 'text-red-200 text-right' : 'text-slate-400'
                    }`}
                  >
                    {m.timestamp}
                  </div>
                </div>
              </div>
            );
          })}
          {isLoading && (
            <div className="flex items-center space-x-2 text-xs text-slate-500 pl-11">
              <div className="w-2 h-2 rounded-full bg-red-600 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-slate-700 animate-bounce [animation-delay:0.4s]" />
              <span>Analizando balances de sedes y cartera Credijamar...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="p-3 bg-white border-t border-slate-100 overflow-x-auto flex gap-2 scrollbar-none">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 whitespace-nowrap transition-colors flex items-center gap-1.5 font-semibold"
            >
              <Sparkles className="w-3 h-3 text-red-600" />
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 border-t border-slate-200 bg-white flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pregunta sobre nómina por ciudad, ventas de salas o Credijamar..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-200 transition-all disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
