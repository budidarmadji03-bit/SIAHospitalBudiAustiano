export enum ClaimStatus {
  APPROVED = 'Layak Bayar (Approved)',
  PENDING = 'Pending (Tertunda)',
  DENIED = 'Gagal Bayar (Denied/Ditolak)',
}

export enum ClaimReason {
  NONE = '-',
  TECHNICAL_ERROR = 'Kendala Teknis E-Klaim Error',
  CODING_ERROR = 'Ketidaksesuaian/Kesalahan Koding',
  INCOMPLETE_DOCS = 'Dokumen Medis/Resume Tidak Lengkap',
  NON_EMERGENCY = 'Kasus Non-Gawat Darurat/Estetika',
}

export interface ClaimInput {
  rmNumber: string;
  claimValue: number;
  status: ClaimStatus;
  reason: ClaimReason;
}

export interface JournalEntry {
  account: string;
  debit: number;
  credit: number;
}

export interface AnalysisResponse {
  spiAnalysis: {
    riskWarning: string | null;
    correctiveAction: string;
    responsibleUnit: string;
    deadline: string;
  };
  accountingSimulation: {
    journalEntries: JournalEntry[];
    description: string;
    basis: string;
  };
  managerialAdvice: {
    trainingRecommendation: string | null;
    securityNotice: string;
  };
}