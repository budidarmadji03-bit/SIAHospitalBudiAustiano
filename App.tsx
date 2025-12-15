import React, { useState } from 'react';
import { ClaimInput, ClaimStatus, ClaimReason, AnalysisResponse } from './types';
import { analyzeClaim } from './services/geminiService';
import { AnalysisResult } from './components/AnalysisResult';

const App: React.FC = () => {
  const [input, setInput] = useState<ClaimInput>({
    rmNumber: '',
    claimValue: 0,
    status: ClaimStatus.PENDING,
    reason: ClaimReason.NONE,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'claimValue') {
      setInput(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setInput(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.rmNumber || input.claimValue <= 0) {
      alert("Mohon lengkapi No RM dan Nilai Klaim.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysis = await analyzeClaim(input);
      setResult(analysis);
    } catch (err) {
      setError("Terjadi kesalahan saat menghubungi FICS Agent. Pastikan API Key valid dan coba lagi.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-slate-800 text-white pt-10 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
             <div className="h-12 w-12 bg-teal-500 rounded-lg flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
             </div>
             <div>
               <h1 className="text-3xl font-bold">FICS Agent</h1>
               <p className="text-slate-300">Financial Claims Integrity System - BLUD Support</p>
             </div>
          </div>
          <p className="text-slate-400 max-w-2xl">
            Sistem cerdas untuk analisis integritas klaim BPJS, kepatuhan SPI, dan simulasi akuntansi berbasis akrual sesuai standar rumah sakit pemerintah daerah.
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 -mt-10">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Input RM */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Rekam Medis (RM)</label>
              <input
                type="text"
                name="rmNumber"
                value={input.rmNumber}
                onChange={handleInputChange}
                placeholder="Contoh: 12-34-56"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                required
              />
            </div>

            {/* Input Nilai */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nilai Total Klaim (IDR)</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">Rp</span>
                <input
                  type="number"
                  name="claimValue"
                  value={input.claimValue || ''}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Input Status */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status Klaim Saat Ini</label>
              <select
                name="status"
                value={input.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
              >
                {Object.values(ClaimStatus).map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Input Reason (Conditional Disabled if Approved) */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Alasan Kendala (Jika Pending/Gagal)</label>
              <select
                name="reason"
                value={input.reason}
                onChange={handleInputChange}
                disabled={input.status === ClaimStatus.APPROVED}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white ${input.status === ClaimStatus.APPROVED ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}`}
              >
                <option value={ClaimReason.NONE}>- Pilih Alasan -</option>
                {Object.values(ClaimReason).filter(r => r !== ClaimReason.NONE).map((reason) => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div className="col-span-1 md:col-span-2 mt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all ${loading ? 'opacity-75 cursor-wait' : ''}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    FICS Agent Sedang Menganalisis...
                  </>
                ) : (
                  'Lakukan Analisis & Jurnal Otomatis'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4">
             <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
             </div>
          </div>
        )}

        {/* Results Container */}
        {result && <AnalysisResult data={result} />}

      </main>

      <footer className="max-w-4xl mx-auto px-6 mt-16 text-center text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} BLUD Hospital Finance System. Powered by Gemini AI.</p>
        <p className="mt-1">Prototipe ini untuk tujuan demonstrasi akuntansi akrual.</p>
      </footer>
    </div>
  );
};

export default App;