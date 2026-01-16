
import emailjs from '@emailjs/browser';

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
 * Submit quote request via EmailJS
 */
export const submitQuoteRequest = async (data: QuoteFormData): Promise<void> => {
  // Trim environment variables to handle any trailing whitespace/newlines from deployment
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID?.trim();
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID?.trim();
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY?.trim();

  if (!serviceId || !templateId || !publicKey) {
    throw new Error('EmailJS not configured. Please add credentials to .env file.');
  }

  // Prepare template parameters
  const templateParams = {
    to_name: 'Grandpa Ron\'s Team',
    from_name: data?.name ?? 'Unknown',
    from_email: data?.email ?? '',
    phone: data?.phone ?? '',
    service: data?.service ?? '',
    property_size: data?.propertySize ?? '',
    location: data?.location ?? '',
    address: data?.address ?? '',
    contact_method: data?.contactMethod ?? '',
    preferred_date: data?.preferredDate ?? '',
    message: data?.message ?? '',
    submission_date: new Date().toLocaleDateString(),
    submission_time: new Date().toLocaleTimeString(),
  };

  try {
    await emailjs.send(serviceId, templateId, templateParams, publicKey);
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
