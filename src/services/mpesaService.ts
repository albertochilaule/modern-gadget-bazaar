
// M-Pesa Payment Service
// This service handles communication with the M-Pesa API

// Constants for the API
const MPESA_API_URL = "https://api.sandbox.vm.co.mz:18352/ipg/v1x/c2bPayment/singleStage/";
const MPESA_API_KEY = "ahy5sfmc2k6iniaqtvz9q6f3lbjkz6uj";

// Interface for payment request
export interface MpesaPaymentRequest {
  input_TransactionReference: string;
  input_CustomerMSISDN: string;
  input_Amount: string;
  input_ThirdPartyReference: string;
  input_ServiceProviderCode: string;
}

// Interface for payment response
export interface MpesaPaymentResponse {
  output_ResponseCode: string;
  output_ResponseDesc: string;
  output_TransactionID?: string;
  output_ConversationID?: string;
  output_ThirdPartyReference?: string;
}

/**
 * Generate a unique transaction reference
 * @returns A unique transaction reference string
 */
export const generateTransactionReference = (): string => {
  // Generate a reference with 'T' prefix + timestamp + random numbers
  return `T${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)}`;
};

/**
 * Process a payment through M-Pesa
 * @param phoneNumber Customer's phone number (format: 258XXXXXXXXX)
 * @param amount Amount to be paid
 * @param reference Optional custom reference
 * @returns Promise with payment response
 */
export const processPayment = async (
  phoneNumber: string,
  amount: number,
  reference?: string
): Promise<MpesaPaymentResponse> => {
  try {
    // Format phone number to ensure it has the country code
    const formattedPhone = formatPhoneNumber(phoneNumber);
    
    // Validate phone number format
    if (!isValidMozambiqueNumber(formattedPhone)) {
      console.error("Invalid phone number format:", formattedPhone);
      return {
        output_ResponseCode: "INS-2051",
        output_ResponseDesc: "Número de telefone inválido"
      };
    }
    
    // Prepare the payment request
    const paymentData: MpesaPaymentRequest = {
      input_TransactionReference: reference || generateTransactionReference(),
      input_CustomerMSISDN: formattedPhone,
      input_Amount: amount.toString(),
      input_ThirdPartyReference: `REF${Date.now().toString().slice(-5)}`,
      input_ServiceProviderCode: "171717" // The merchant/business code
    };

    console.log("Sending M-Pesa payment request:", paymentData);

    // Send the payment request to M-Pesa API
    const response = await fetch(MPESA_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${MPESA_API_KEY}`,
        "Origin": "developer.mpesa.vm.co.mz"
      },
      body: JSON.stringify(paymentData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("M-Pesa API error:", response.status, errorText);
      
      // Try to parse the error response
      try {
        const errorData = JSON.parse(errorText);
        return {
          output_ResponseCode: errorData.output_ResponseCode || "INS-1",
          output_ResponseDesc: errorData.output_ResponseDesc || `Error ${response.status}: ${response.statusText}`
        };
      } catch (e) {
        return {
          output_ResponseCode: "INS-1",
          output_ResponseDesc: `Error ${response.status}: ${response.statusText}`
        };
      }
    }

    // Parse the response
    const responseData = await response.json();
    console.log("M-Pesa payment response:", responseData);

    return responseData;
  } catch (error) {
    console.error("Error processing M-Pesa payment:", error);
    return {
      output_ResponseCode: "INS-1",
      output_ResponseDesc: "Error processing payment request"
    };
  }
};

/**
 * Format phone number to ensure it has the country code (258)
 * @param phoneNumber Phone number to format
 * @returns Formatted phone number
 */
const formatPhoneNumber = (phoneNumber: string): string => {
  // Remove any non-digit characters
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  
  // Check if the number already has the country code
  if (digitsOnly.startsWith('258') && digitsOnly.length === 12) {
    return digitsOnly;
  }
  
  // If the number is 9 digits, add the country code
  if (digitsOnly.length === 9) {
    return `258${digitsOnly}`;
  }
  
  // Otherwise return the original digits
  return digitsOnly;
};

/**
 * Check if a phone number is valid for Mozambique
 * @param phoneNumber Phone number to validate
 * @returns boolean indicating if the number is valid
 */
const isValidMozambiqueNumber = (phoneNumber: string): boolean => {
  // Mozambique phone numbers: 258 followed by 9 digits
  // Valid prefixes for mobile operators: 82, 83, 84, 85, 86, 87
  const validPattern = /^258(8[2-7])\d{7}$/;
  return validPattern.test(phoneNumber);
};

/**
 * Check if a payment response was successful
 * @param response The M-Pesa payment response
 * @returns boolean indicating success
 */
export const isPaymentSuccessful = (response: MpesaPaymentResponse): boolean => {
  return response.output_ResponseCode === "INS-0";
};

/**
 * Get a user-friendly message from response code
 * @param responseCode The M-Pesa response code
 * @returns User-friendly message
 */
export const getResponseMessage = (responseCode: string): string => {
  const messages: {[key: string]: string} = {
    "INS-0": "Pagamento processado com sucesso",
    "INS-1": "Erro interno ao processar o pagamento",
    "INS-2": "Chave API inválida",
    "INS-4": "Usuário não está ativo",
    "INS-5": "Transação cancelada pelo cliente",
    "INS-6": "Falha na transação",
    "INS-9": "Tempo limite da solicitação excedido",
    "INS-10": "Transação duplicada",
    "INS-13": "Código de comerciante inválido",
    "INS-14": "Referência inválida",
    "INS-15": "Valor inválido",
    "INS-16": "Não é possível processar a solicitação devido a uma sobrecarga temporária",
    "INS-17": "Referência de transação inválida",
    "INS-2006": "Saldo insuficiente",
    "INS-2051": "Número de telefone inválido"
  };

  return messages[responseCode] || "Erro desconhecido no processamento do pagamento";
};
