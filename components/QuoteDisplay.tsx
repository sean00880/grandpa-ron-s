import React from 'react';
import { Quote } from '../types';
import { FileText, CheckCircle, Clock } from 'lucide-react';

interface QuoteDisplayProps {
  quote: Quote;
}

export const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg animate-fade-in-up">
      <div className="bg-gray-900 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText size={20} className="text-green-400" />
          <h3 className="font-bold">Estimated Quote</h3>
        </div>
        <div className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300">
          AI Generated Estimate
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-gray-500">
                <th className="pb-2 font-medium">Service</th>
                <th className="pb-2 font-medium text-right">Qty</th>
                <th className="pb-2 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {quote.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-3 text-gray-800">
                    <div className="font-medium">{item.description}</div>
                  </td>
                  <td className="py-3 text-right text-gray-500">
                    {item.quantity}
                  </td>
                  <td className="py-3 text-right font-medium text-gray-900">
                    ${item.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-2 mb-6">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span>${quote.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Est. Tax (8%)</span>
            <span>${quote.tax.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between text-base font-bold text-gray-900">
            <span>Total Estimate</span>
            <span className="text-green-600">${quote.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
           <Clock size={14} />
           <span>Estimated duration: {quote.estimatedDuration}</span>
        </div>

        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
          <CheckCircle size={18} />
          Approve & Book Consultation
        </button>
      </div>
    </div>
  );
};