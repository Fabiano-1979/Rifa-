import React, { useState } from 'react';
import { BuyerInfo, RaffleConfig } from '../types';
import { X, CheckCircle, Loader2, ShieldCheck } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNumbers: number[];
  config: RaffleConfig;
  onSubmit: (info: BuyerInfo) => Promise<void>;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ 
  isOpen, onClose, selectedNumbers, config, onSubmit 
}) => {
  const [formData, setFormData] = useState<BuyerInfo>({ fullName: '', phone: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const total = selectedNumbers.length * config.ticketPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Call parent submit handler (which simulates API call)
    await onSubmit(formData);
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    // Auto close after success
    setTimeout(() => {
      setIsSuccess(false);
      setFormData({ fullName: '', phone: '', email: '' });
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={!isSubmitting ? onClose : undefined}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {isSuccess ? (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2 animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Sucesso!</h3>
              <p className="text-gray-500 mt-2">Seus dados foram salvos na planilha.</p>
              <p className="text-sm text-gray-400 mt-1">Redirecionando...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-gray-800">Finalizar Reserva</h3>
              </div>
              <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Summary */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-blue-700 font-medium">Números escolhidos:</span>
                  <span className="text-xs bg-white text-blue-600 px-2 py-1 rounded border border-blue-200 font-mono">
                    {selectedNumbers.join(', ')}
                  </span>
                </div>
                <div className="h-px bg-blue-200 w-full my-2"></div>
                <div className="flex justify-between text-xl font-bold text-blue-900">
                  <span>Total a Pagar:</span>
                  <span>{config.currencySymbol} {total.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              {/* Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nome Completo</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
                    placeholder="Como devemos lhe chamar?"
                    value={formData.fullName}
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">WhatsApp / Telefone</label>
                    <input 
                      required
                      type="tel" 
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
                      placeholder="(DD) 99999-9999"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                    <input 
                      required
                      type="email" 
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Security Note */}
              <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                 <ShieldCheck className="w-4 h-4 text-green-600" />
                 <span>Seus dados são armazenados de forma segura e utilizados apenas para contato do sorteio.</span>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Registrando no Sistema...
                    </>
                  ) : (
                    "Confirmar Compra"
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
