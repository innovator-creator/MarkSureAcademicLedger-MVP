/**
 * API Configuration and Utility Functions
 * 
 * This file provides a centralized API configuration using the NEXT_PUBLIC_API_URL
 * environment variable. All API calls should use the getApiUrl() function to ensure
 * they point to the correct backend port.
 */

/**
 * Get the base API URL from environment variable
 * Falls back to http://localhost:5000 if not set
 */
export function getApiUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  // Remove trailing slash if present
  return apiUrl.replace(/\/$/, '');
}

/**
 * Build a full API endpoint URL
 * @param endpoint - The API endpoint path (e.g., '/api/certificates/verify')
 * @returns Full URL to the API endpoint
 */
export function buildApiUrl(endpoint: string): string {
  const baseUrl = getApiUrl();
  // Ensure endpoint starts with /
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${normalizedEndpoint}`;
}

/**
 * API Response types
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Certificate verification response (matches backend format)
 */
export interface CertificateVerificationResponse {
  verified: boolean;
  record?: {
    certificateCode: string;
    studentName: string;
    institution: string;
    program: string;
    issueDate: string;
    timestamp: string;
    blockHash: string;
  };
  message?: string;
}

/**
 * Certificate record (from backend)
 */
export interface CertificateRecord {
  certificateCode: string;
  studentName: string;
  institution: string;
  program: string;
  issueDate: string;
  timestamp: string;
  blockHash: string;
}

/**
 * Certificate issuance request (matches backend format)
 */
export interface CertificateIssuanceRequest {
  studentName: string;
  institution: string;
  program: string;
  issueDate: string;
  certificateBase64?: string;
}

/**
 * Certificate issuance response (matches backend format)
 */
export interface CertificateIssuanceResponse {
  record: CertificateRecord;
  pdfBase64: string;
  qrDataUrl: string;
}

/**
 * Login request
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Login response
 */
export interface LoginResponse {
  success: boolean;
  token?: string;
  message?: string;
}

/**
 * API Client Functions
 */

/**
 * Verify a certificate by code
 * GET /api/verify/:code
 */
export async function verifyCertificateByCode(code: string): Promise<CertificateVerificationResponse> {
  const url = buildApiUrl(`/api/verify/${encodeURIComponent(code)}`);
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse<CertificateVerificationResponse> = await response.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error(data.message || 'Verification failed');
  } catch (error) {
    console.error('Error verifying certificate:', error);
    throw error;
  }
}

/**
 * Verify a certificate by uploading a file
 * Note: Backend doesn't have this endpoint, so we'll convert file to base64 and extract code
 * For now, this will show an error message that file upload verification is not supported
 */
export async function verifyCertificateByFile(file: File): Promise<CertificateVerificationResponse> {
  // Backend doesn't support file upload verification
  // Return error response
  return {
    verified: false,
    message: 'File upload verification is not currently supported. Please use the certificate code to verify.'
  };
}

/**
 * Convert File to base64 string
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix if present
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Issue a new certificate
 * POST /api/issue
 */
export async function issueCertificate(
  request: CertificateIssuanceRequest & { certificateFile?: File }
): Promise<CertificateIssuanceResponse> {
  const url = buildApiUrl('/api/issue');
  
  try {
    // Convert file to base64 if provided
    let certificateBase64: string | undefined;
    if (request.certificateFile) {
      certificateBase64 = await fileToBase64(request.certificateFile);
    }

    const requestBody = {
      studentName: request.studentName,
      institution: request.institution,
      program: request.program,
      issueDate: request.issueDate,
      certificateBase64: certificateBase64 || request.certificateBase64 || null
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse<CertificateIssuanceResponse> = await response.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    throw new Error(data.message || 'Certificate issuance failed');
  } catch (error) {
    console.error('Error issuing certificate:', error);
    throw error;
  }
}

/**
 * Admin login
 * Note: Backend doesn't have an admin login endpoint
 * This is a mock function that always succeeds for demo purposes
 */
export async function adminLogin(credentials: LoginRequest): Promise<LoginResponse> {
  // Backend doesn't have admin authentication
  // For demo purposes, accept any credentials
  if (credentials.username && credentials.password) {
    return {
      success: true,
      message: 'Login successful (demo mode - no backend authentication)'
    };
  }
  
  return {
    success: false,
    message: 'Please enter both username and password'
  };
}

/**
 * Get certificate details by QR code
 * Uses the same verify endpoint: GET /api/verify/:code
 */
export async function getCertificateByQRCode(code: string): Promise<CertificateVerificationResponse> {
  // QR code verification uses the same endpoint as regular verification
  return verifyCertificateByCode(code);
}

