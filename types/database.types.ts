export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type LoanStatus = "open" | "funded" | "active" | "repaid" | "defaulted";
export type LoanPurpose = "business" | "education" | "medical" | "home" | "vehicle" | "personal";
export type TransactionType = "deposit" | "withdrawal" | "investment" | "repayment" | "interest";

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          full_name: string;
          avatar_url: string | null;
          phone: string | null;
          balance: number;
          total_invested: number;
          total_borrowed: number;
          credit_score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string;
          avatar_url?: string | null;
          phone?: string | null;
          balance?: number;
          total_invested?: number;
          total_borrowed?: number;
          credit_score?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string;
          avatar_url?: string | null;
          phone?: string | null;
          balance?: number;
          total_invested?: number;
          total_borrowed?: number;
          credit_score?: number;
          updated_at?: string;
        };
      };
      loans: {
        Row: {
          id: string;
          borrower_id: string;
          title: string;
          purpose: LoanPurpose;
          amount: number;
          funded_amount: number;
          interest_rate: number;
          duration_months: number;
          status: LoanStatus;
          description: string | null;
          risk_grade: string;
          funded_at: string | null;
          due_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          borrower_id: string;
          title: string;
          purpose: LoanPurpose;
          amount: number;
          funded_amount?: number;
          interest_rate: number;
          duration_months: number;
          status?: LoanStatus;
          description?: string | null;
          risk_grade?: string;
          funded_at?: string | null;
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          purpose?: LoanPurpose;
          amount?: number;
          funded_amount?: number;
          interest_rate?: number;
          duration_months?: number;
          status?: LoanStatus;
          description?: string | null;
          risk_grade?: string;
          funded_at?: string | null;
          due_date?: string | null;
          updated_at?: string;
        };
      };
      loan_investments: {
        Row: {
          id: string;
          loan_id: string;
          investor_id: string;
          amount: number;
          returns: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          loan_id: string;
          investor_id: string;
          amount: number;
          returns?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          amount?: number;
          returns?: number;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          type: TransactionType;
          amount: number;
          description: string;
          ref_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: TransactionType;
          amount: number;
          description: string;
          ref_id?: string | null;
          created_at?: string;
        };
        Update: never;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      loan_status: LoanStatus;
      loan_purpose: LoanPurpose;
      transaction_type: TransactionType;
    };
  };
}
