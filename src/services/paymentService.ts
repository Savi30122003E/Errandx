import { PaymentGatewayTransaction, PaymentGatewayMethod } from '../types';

export class PaymentService {
  /**
   * Process payment through simulated payment gateway
   */
  public static async processPayment(
    amount: number,
    method: PaymentGatewayMethod,
    orderId: string,
    details?: {
      upiVpa?: string;
      cardLast4?: string;
      cardBrand?: string;
      bankName?: string;
    }
  ): Promise<PaymentGatewayTransaction> {
    // Realistic simulated network latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    const txnId = `TXN-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const receiptNum = `RCP-${Date.now().toString().slice(-6)}`;

    const transaction: PaymentGatewayTransaction = {
      id: txnId,
      orderId,
      amount,
      currency: 'INR',
      method,
      status: 'success',
      upiVpa: details?.upiVpa,
      cardLast4: details?.cardLast4,
      cardBrand: details?.cardBrand || 'Visa',
      bankName: details?.bankName,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      receiptNumber: receiptNum
    };

    return transaction;
  }
}
