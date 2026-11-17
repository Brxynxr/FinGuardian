import React, { useState } from 'react';
import { UploadCloud, X, FileText, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

export const InvoiceUploaderModal: React.FC<Props> = ({ isOpen, onClose, onUploadSuccess }) => {
  const [docType, setDocType] = useState('INVOICE');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [resultMsg, setResultMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setResultMsg(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    try {
      const res = await api.uploadCSV(selectedFile, docType);
      if (res.success) {
        setResultMsg(`¡Éxito! Se ingresaron ${res.inserted_count} registros y se actualizó la base de datos.`);
        setTimeout(() => {
          onUploadSuccess();
          onClose();
        }, 1500);
      } else {
        setResultMsg('Error al procesar el archivo.');
      }
    } catch (e: any) {
      setResultMsg(`Error: ${e.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 max-w-lg w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <UploadCloud className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Ingesta de Facturas & Documentos</h3>
            <p className="text-xs text-slate-400">Carga por lotes mediante CSV. Sincronización instantánea con la tesorería.</p>
          </div>
        </div>

        <div className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Tipo de Documento</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDocType('INVOICE')}
                className={`py-2 px-3 rounded-lg border font-semibold text-center transition ${
                  docType === 'INVOICE'
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                📄 Facturas de Clientes (Cobros)
              </button>
              <button
                type="button"
                onClick={() => setDocType('PAYMENT')}
                className={`py-2 px-3 rounded-lg border font-semibold text-center transition ${
                  docType === 'PAYMENT'
                    ? 'bg-sky-600/20 border-sky-500 text-sky-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                📑 Facturas de Proveedores (Pagos)
              </button>
            </div>
          </div>

          <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center hover:border-emerald-500/50 transition">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              id="file-upload"
              className="hidden"
            />
            <label htmlFor="file-upload" className="cursor-pointer block">
              <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="font-semibold text-slate-200">
                {selectedFile ? selectedFile.name : 'Haz clic para seleccionar tu archivo CSV'}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Formato soportado: CSV delimitado por comas</p>
            </label>
          </div>

          {resultMsg && (
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{resultMsg}</span>
            </div>
          )}

          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              Cerrar
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold transition disabled:opacity-50"
            >
              {isUploading ? 'Procesando...' : 'Subir y Procesar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
