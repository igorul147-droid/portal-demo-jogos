import { NextRequest, NextResponse } from 'next/server';

// Configuração Exacta Pay
const EXACTA_API_URL = process.env.EXACTA_API_URL || 'https://api.exactapay.com/v1';
const EXACTA_API_KEY = process.env.EXACTA_API_KEY;
const EXACTA_SECRET_KEY = process.env.EXACTA_SECRET_KEY;
const EXACTA_MERCHANT_ID = process.env.EXACTA_MERCHANT_ID;

// Tipos para Exacta Pay
interface ExactaPixRequest {
  amount: number;
  currency: 'BRL';
  description: string;
  customer_email?: string;
  customer_name?: string;
  reference_id: string;
}

interface ExactaPixResponse {
  id: string;
  qr_code: string;
  qr_code_base64: string;
  amount: number;
  status: 'pending' | 'paid' | 'expired';
  expires_at: string;
  pix_key: string;
}

interface ExactaCryptoRequest {
  amount: number;
  currency: 'BRL';
  crypto_currency: 'BTC' | 'ETH' | 'USDT';
  description: string;
  customer_email?: string;
  reference_id: string;
}

interface ExactaCryptoResponse {
  id: string;
  address: string;
  amount: number;
  crypto_amount: number;
  crypto_currency: string;
  status: 'pending' | 'received' | 'expired';
  expires_at: string;
  qr_code?: string;
}

// Classe para integração Exacta Pay
class ExactaPayService {
  private apiUrl: string;
  private apiKey: string;
  private secretKey: string;
  private merchantId: string;

  constructor() {
    this.apiUrl = EXACTA_API_URL;
    this.apiKey = EXACTA_API_KEY || '';
    this.secretKey = EXACTA_SECRET_KEY || '';
    this.merchantId = EXACTA_MERCHANT_ID || '';

    if (!this.apiKey || !this.secretKey) {
      console.warn('⚠️ Exacta Pay credentials not configured. Using mock mode.');
    }
  }

  // Verifica se está em modo produção
  private isProduction(): boolean {
    return !!(this.apiKey && this.secretKey && this.merchantId);
  }

  // Headers para autenticação
  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      'X-Merchant-ID': this.merchantId,
      'X-Secret-Key': this.secretKey,
    };
  }

  // Criar transação Pix
  async createPixTransaction(request: ExactaPixRequest): Promise<ExactaPixResponse> {
    if (!this.isProduction()) {
      // Modo mock para desenvolvimento
      return this.mockPixTransaction(request);
    }

    try {
      const response = await fetch(`${this.apiUrl}/pix/transactions`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Exacta Pay API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar transação Pix:', error);
      throw error;
    }
  }

  // Criar transação Cripto
  async createCryptoTransaction(request: ExactaCryptoRequest): Promise<ExactaCryptoResponse> {
    if (!this.isProduction()) {
      // Modo mock para desenvolvimento
      return this.mockCryptoTransaction(request);
    }

    try {
      const response = await fetch(`${this.apiUrl}/crypto/transactions`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Exacta Pay API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar transação cripto:', error);
      throw error;
    }
  }

  // Verificar status da transação
  async getTransactionStatus(transactionId: string, type: 'pix' | 'crypto') {
    if (!this.isProduction()) {
      return { status: 'pending' };
    }

    try {
      const response = await fetch(`${this.apiUrl}/${type}/transactions/${transactionId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Exacta Pay API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      throw error;
    }
  }

  // Mock para desenvolvimento (Pix)
  private mockPixTransaction(request: ExactaPixRequest): ExactaPixResponse {
    const transactionId = `PIX-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    return {
      id: transactionId,
      qr_code: `00020126580014br.gov.bcb.pix0136${transactionId}@pix520400005303986540510.005802BR5913BETCLEAN6009SAO PAULO62410503***63045E8A`,
      qr_code_base64: 'mock_qr_base64',
      amount: request.amount,
      status: 'pending',
      expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutos
      pix_key: 'betclean@pix.com.br',
    };
  }

  // Mock para desenvolvimento (Crypto)
  private mockCryptoTransaction(request: ExactaCryptoRequest): ExactaCryptoResponse {
    const addresses = {
      BTC: `1A1z7agoat${Math.random().toString(36).substr(2, 20).toUpperCase()}`,
      ETH: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
      USDT: `T${Array.from({ length: 34 }, () => Math.floor(Math.random() * 10)).join("")}`,
    };

    const cryptoAmount = request.crypto_currency === 'BTC' ? request.amount / 500000 : request.amount / 15000;

    return {
      id: `CRYPTO-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      address: addresses[request.crypto_currency],
      amount: request.amount,
      crypto_amount: cryptoAmount,
      crypto_currency: request.crypto_currency,
      status: 'pending',
      expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hora
    };
  }
}

// Instância singleton
const exactaPay = new ExactaPayService();

export default exactaPay;