export interface QuoteFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  propertySize: string;
  location: string;
  address: string;
  contactMethod: string;
  preferredDate: string;
  message: string;
  files?: File[];
}

/**
 * Submit quote request via server-side API route
 * This uses server-side EmailJS to avoid CORS/domain whitelisting issues
 */
export const submitQuoteRequest = async (data: QuoteFormData): Promise<void> => {
  try {
    const response = await fetch('/api/quote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data?.name ?? '',
        email: data?.email ?? '',
        phone: data?.phone ?? '',
        service: data?.service ?? '',
        propertySize: data?.propertySize ?? '',
        location: data?.location ?? '',
        address: data?.address ?? '',
        contactMethod: data?.contactMethod ?? '',
        preferredDate: data?.preferredDate ?? '',
        message: data?.message ?? '',
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to submit quote request');
    }
  } catch (error) {
    console.error('Failed to send quote request:', error);
    throw new Error('Failed to send quote request. Please try again or call us directly.');
  }
};

/**
 * Validate phone number format
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\(\)]+$/;
  const digitsOnly = phone?.replace(/\D/g, '') ?? '';
  return phoneRegex.test(phone) && digitsOnly?.length >= 10;
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email ?? '');
};

/**
 * Format phone number for display
 */
export const formatPhone = (phone: string): string => {
  const digitsOnly = phone?.replace(/\D/g, '') ?? '';
  if (digitsOnly?.length === 10) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
  }
  return phone;
};
