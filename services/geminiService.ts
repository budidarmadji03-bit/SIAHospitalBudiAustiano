import { GoogleGenAI, Type } from "@google/genai";
import { ClaimInput, AnalysisResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    spiAnalysis: {
      type: Type.OBJECT,
      properties: {
        riskWarning: { type: Type.STRING, nullable: true, description: "Warning regarding receivable risks if pending/denied." },
        correctiveAction: { type: Type.STRING, description: "Specific action to fix the claim." },
        responsibleUnit: { type: Type.STRING, description: "Department responsible (e.g., Keuangan, Koder)." },
        deadline: { type: Type.STRING, description: "Time limit for correction." },
      },
      required: ["correctiveAction", "responsibleUnit", "deadline"],
    },
    accountingSimulation: {
      type: Type.OBJECT,
      properties: {
        journalEntries: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              account: { type: Type.STRING },
              debit: { type: Type.NUMBER },
              credit: { type: Type.NUMBER },
            },
            required: ["account", "debit", "credit"],
          },
        },
        description: { type: Type.STRING, description: "Explanation of the journal entry context." },
        basis: { type: Type.STRING, description: "Accounting basis used (e.g., Basis Akrual)." },
      },
      required: ["journalEntries", "description", "basis"],
    },
    managerialAdvice: {
      type: Type.OBJECT,
      properties: {
        trainingRecommendation: { type: Type.STRING, nullable: true, description: "Training advice if error is human-related." },
        securityNotice: { type: Type.STRING, description: "Standard security warning." },
      },
      required: ["securityNotice"],
    },
  },
  required: ["spiAnalysis", "accountingSimulation", "managerialAdvice"],
};

export const analyzeClaim = async (input: ClaimInput): Promise<AnalysisResponse> => {
  const modelId = "gemini-2.5-flash"; // Using 2.5 Flash for speed and good reasoning on structured tasks
  
  const systemInstruction = `
    Anda adalah Agen Analisis Integritas Klaim Finansial (FICS) untuk rumah sakit BLUD di Indonesia.
    Tugas Anda adalah menganalisis klaim BPJS dan menghasilkan output akuntansi yang ketat sesuai Standar Akuntansi Pemerintahan (SAP) Berbasis Akrual.

    ATURAN LOGIKA KETAT:

    1. KARTU 1: Analisis SPI
       - Jika Status = Pending/Gagal: Berikan peringatan risiko Piutang Tidak Tertagih.
       - Tentukan aksi korektif spesifik berdasarkan 'Alasan'.
       - Batas waktu: Sebutkan 10 hari atau batas kadaluarsa 6 bulan.

    2. KARTU 2: Simulasi Akuntansi (PENTING)
       - Nilai Klaim: ${input.claimValue}
       - Jika Status = LAYAK BAYAR (Approved):
         Jurnal Penerimaan Kas (karena asumsi piutang sudah diakui sebelumnya atau bersamaan):
         Debit: Kas di Kas BLUD
         Kredit: Piutang BLUD
       - Jika Status = PENDING atau GAGAL BAYAR:
         Jurnal Pengakuan Hak (Akrual) - karena layanan sudah diberikan walau uang belum masuk:
         Debit: Piutang Klaim BPJS
         Kredit: Pendapatan-LO
         (Penjelasan: Jurnal ini mengakui Pendapatan-LO dan Piutang sesuai Basis Akrual untuk Laporan Operasional).

    3. KARTU 3: Saran Manajerial
       - Jika alasan terkait Koding atau Dokumen: Sarankan pelatihan staf.
       - Selalu sertakan peringatan keamanan PHI/RBAC.

    Output harus dalam Format JSON sesuai schema. Gunakan Bahasa Indonesia yang formal dan profesional akuntansi.
  `;

  const prompt = `
    Data Klaim:
    No RM: ${input.rmNumber}
    Nilai: ${input.claimValue}
    Status: ${input.status}
    Alasan: ${input.reason}
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.2, // Low temperature for consistent accounting logic
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No data returned from AI");
    
    return JSON.parse(jsonText) as AnalysisResponse;
  } catch (error) {
    console.error("FICS Agent Error:", error);
    throw error;
  }
};