import React from 'react';
import { AnalysisResponse } from '../types';

interface AnalysisResultProps {
  data: AnalysisResponse;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
};

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ data }) => {
  return (
    <div className="space-y-6 mt-8 animate-fade-in-up">
      {/* Card 1: SPI Compliance */}
      <div className="bg-white rounded-xl shadow-md border-l-4 border-amber-500 overflow-hidden">
        <div className="bg-amber-50 px-6 py-4 border-b border-amber-100 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-800">Analisis Kepatuhan SPI & Dampak Operasional</h3>
        </div>
        <div className="p-6 text-sm text-gray-700 space-y-4">
          {data.spiAnalysis.riskWarning && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg border border-red-100 flex items-start gap-2">
              <span className="font-bold">⚠️ RISIKO:</span> {data.spiAnalysis.riskWarning}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <p className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-1">Aksi Korektif</p>
               <p className="font-medium">{data.spiAnalysis.correctiveAction}</p>
             </div>
             <div>
               <p className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-1">Unit Penanggung Jawab</p>
               <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold">
                 {data.spiAnalysis.responsibleUnit}
               </span>
             </div>
             <div className="md:col-span-2">
                <p className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-1">Batas Waktu (SLA)</p>
                <p className="font-medium text-amber-700">{data.spiAnalysis.deadline}</p>
             </div>
          </div>
        </div>
      </div>

      {/* Card 2: Accounting Simulation */}
      <div className="bg-white rounded-xl shadow-md border-l-4 border-indigo-600 overflow-hidden">
        <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 36v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-800">Simulasi Pencatatan Akuntansi (Jurnal Akrual)</h3>
        </div>
        <div className="p-6">
          <div className="mb-4">
             <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-1 rounded uppercase">
               {data.accountingSimulation.basis}
             </span>
          </div>
          
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Akun</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Debit</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Kredit</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 font-mono text-sm">
                {data.accountingSimulation.journalEntries.map((entry, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-900 font-medium">
                      {/* Indent credit accounts visually */}
                      <span className={entry.credit > 0 ? "pl-8" : ""}>{entry.account}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-gray-700">
                      {entry.debit > 0 ? formatCurrency(entry.debit) : '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-gray-700">
                      {entry.credit > 0 ? formatCurrency(entry.credit) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-gray-600 italic border-l-2 border-gray-300 pl-3">
            "{data.accountingSimulation.description}"
          </p>
        </div>
      </div>

      {/* Card 3: Managerial Advice */}
      <div className="bg-white rounded-xl shadow-md border-l-4 border-emerald-500 overflow-hidden">
        <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-800">Saran Manajerial & Pendidikan Staf</h3>
        </div>
        <div className="p-6 space-y-4">
           {data.managerialAdvice.trainingRecommendation && (
             <div className="flex items-start gap-3">
               <div className="bg-blue-100 p-2 rounded-full mt-1">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path d="M12 14l9-5-9-5-9 5 9 5z" />
                   <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                 </svg>
               </div>
               <div>
                 <h4 className="font-bold text-gray-800 text-sm">Rekomendasi Pelatihan</h4>
                 <p className="text-gray-600 text-sm mt-1">{data.managerialAdvice.trainingRecommendation}</p>
               </div>
             </div>
           )}
           
           <div className="flex items-start gap-3">
             <div className="bg-gray-100 p-2 rounded-full mt-1">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
               </svg>
             </div>
             <div>
               <h4 className="font-bold text-gray-800 text-sm">Keamanan Data (Compliance)</h4>
               <p className="text-gray-600 text-sm mt-1">{data.managerialAdvice.securityNotice}</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};