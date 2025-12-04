'use client';


import React, { useState } from 'react';
import {
  Send,
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Home,
  FileText
} from 'lucide-react';
import { submitQuoteRequest, validateEmail, validatePhone, formatPhone, QuoteFormData } from '../services/quoteService';
import { locationRegistry } from '../services/locationRegistry';
import toast from 'react-hot-toast';

interface QuoteRequestFormProps {
  defaultLocation?: string;
  onSuccess?: () => void;
  /** Compact mode shows fewer fields - ideal for sidebars and embedded forms */
  compact?: boolean;
  /** Optional title override */
  title?: string;
  /** Optional subtitle override */
  subtitle?: string;
}

export const QuoteRequestForm: React.FC<QuoteRequestFormProps> = ({
  defaultLocation,
  onSuccess,
  compact = false,
  title,
  subtitle
}) => {
  const [formData, setFormData] = useState<QuoteFormData>({
    name: '',
    email: '',
    phone: '',
    service: '',
    propertySize: '',
    location: defaultLocation ?? '',
    address: '',
    contactMethod: 'phone',
    preferredDate: '',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof QuoteFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const services = [
    'Mulching',
    'Mowing',
    'Tree Removal/Pruning',
    'Landscaping',
    'Lawn Treatments',
    'Gutter Cleaning',
    'Leaf Removal',
    'Snow Removal',
    'Other'
  ];

  const propertySizes = [
    { value: 'small', label: 'Small (< 5,000 sq ft)' },
    { value: 'medium', label: 'Medium (5,000 - 10,000 sq ft)' },
    { value: 'large', label: 'Large (> 10,000 sq ft)' },
    { value: 'commercial', label: 'Commercial Property' }
  ];

  const contactMethods = [
    { value: 'phone', label: 'Phone Call' },
    { value: 'email', label: 'Email' },
    { value: 'text', label: 'Text Message' }
  ];

  const locations = locationRegistry?.getAllLocations() ?? [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target ?? {};
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors?.[name as keyof QuoteFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof QuoteFormData, string>> = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData?.service) {
      newErrors.service = 'Please select a service';
    }

    // Only require these fields in full mode
    if (!compact) {
      if (!formData?.propertySize) {
        newErrors.propertySize = 'Please select property size';
      }

      if (!formData?.location) {
        newErrors.location = 'Please select your location';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Format phone number before submission
      const formattedData = {
        ...formData,
        phone: formatPhone(formData.phone)
      };

      await submitQuoteRequest(formattedData);
      
      setSubmitStatus('success');
      toast.success('Quote request submitted successfully! We\'ll contact you soon.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        propertySize: '',
        location: defaultLocation ?? '',
        address: '',
        contactMethod: 'phone',
        preferredDate: '',
        message: '',
      });

      onSuccess?.();
    } catch (error) {
      setSubmitStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit quote request';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = (fieldName: keyof QuoteFormData) => `
    w-full pl-12 pr-4 py-3.5 
    border-2 rounded-xl 
    transition-all duration-200
    bg-white dark:bg-zinc-900
    ${errors?.[fieldName] 
      ? 'border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-200' 
      : 'border-zinc-200 dark:border-zinc-700 focus:border-green-500 focus:ring-green-200 dark:focus:ring-green-900'
    }
    text-zinc-900 dark:text-white
    placeholder-zinc-400 dark:placeholder-zinc-500
    focus:outline-none focus:ring-2
  `;

  // Success state
  if (submitStatus === 'success') {
    return (
      <div className={`${compact ? 'py-8' : 'max-w-md mx-auto py-12'} text-center`}>
        <div className={`${compact ? 'w-16 h-16' : 'w-20 h-20'} bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6`}>
          <CheckCircle2 size={compact ? 32 : 40} className="text-green-600 dark:text-green-400" />
        </div>
        <h3 className={`${compact ? 'text-xl' : 'text-2xl'} font-bold text-zinc-900 dark:text-white mb-3`}>
          Thank You!
        </h3>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
          We've received your quote request and will get back to you within 24 hours.
        </p>
        <button
          onClick={() => setSubmitStatus('idle')}
          className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-full font-semibold transition-colors"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  // Compact mode - simplified form
  if (compact) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-100 dark:border-zinc-800 p-8 md:p-10">
        {(title || subtitle) && (
          <div className="mb-8">
            {title && (
              <h3 className="text-2xl md:text-3xl font-heading font-bold text-zinc-900 dark:text-white mb-2">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-zinc-600 dark:text-zinc-400">{subtitle}</p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name & Email Row */}
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData?.name ?? ''}
                  onChange={handleChange}
                  placeholder="Your name"
                  className={inputClasses('name')}
                />
              </div>
              {errors?.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData?.email ?? ''}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className={inputClasses('email')}
                />
              </div>
              {errors?.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Phone & Service Row */}
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData?.phone ?? ''}
                  onChange={handleChange}
                  placeholder="(555) 123-4567"
                  className={inputClasses('phone')}
                />
              </div>
              {errors?.phone && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="service" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                Service Needed <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <select
                  id="service"
                  name="service"
                  value={formData?.service ?? ''}
                  onChange={handleChange}
                  className={inputClasses('service')}
                >
                  <option value="">Select a service</option>
                  {services?.map(service => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>
              {errors?.service && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.service}
                </p>
              )}
            </div>
          </div>

          {/* Location - Show if defaultLocation provided or as text input */}
          {defaultLocation ? (
            <input type="hidden" name="location" value={defaultLocation} />
          ) : (
            <div>
              <label htmlFor="location" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                Your Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData?.location ?? ''}
                  onChange={handleChange}
                  placeholder="City, State"
                  className={inputClasses('location')}
                />
              </div>
            </div>
          )}

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              Project Details
            </label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 text-zinc-400" size={18} />
              <textarea
                id="message"
                name="message"
                value={formData?.message ?? ''}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us about your project..."
                className={`${inputClasses('message')} pt-3.5 resize-none`}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send size={20} />
                Get Free Quote
              </>
            )}
          </button>

          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            Or call us at{' '}
            <a href="tel:2206662520" className="text-green-600 hover:text-green-500 font-semibold">
              (220) 666-2520
            </a>
          </p>
        </form>
      </div>
    );
  }

  // Full mode - complete form with all fields
  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
      {/* Personal Information */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
            <input
              type="text"
              id="name"
              name="name"
              value={formData?.name ?? ''}
              onChange={handleChange}
              placeholder="John Doe"
              className={inputClasses('name')}
            />
          </div>
          {errors?.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
            <input
              type="email"
              id="email"
              name="email"
              value={formData?.email ?? ''}
              onChange={handleChange}
              placeholder="john@example.com"
              className={inputClasses('email')}
            />
          </div>
          {errors?.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.email}
            </p>
          )}
        </div>
      </div>

      {/* Phone and Contact Method */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData?.phone ?? ''}
              onChange={handleChange}
              placeholder="(555) 123-4567"
              className={inputClasses('phone')}
            />
          </div>
          {errors?.phone && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.phone}
            </p>
          )}
        </div>

        {/* Contact Method */}
        <div>
          <label htmlFor="contactMethod" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
            Preferred Contact Method
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
            <select
              id="contactMethod"
              name="contactMethod"
              value={formData?.contactMethod ?? ''}
              onChange={handleChange}
              className={inputClasses('contactMethod')}
            >
              {contactMethods?.map(method => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Service Details */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Service */}
        <div>
          <label htmlFor="service" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
            Service Needed <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
            <select
              id="service"
              name="service"
              value={formData?.service ?? ''}
              onChange={handleChange}
              className={inputClasses('service')}
            >
              <option value="">Select a service</option>
              {services?.map(service => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>
          {errors?.service && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.service}
            </p>
          )}
        </div>

        {/* Property Size */}
        <div>
          <label htmlFor="propertySize" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
            Property Size <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
            <select
              id="propertySize"
              name="propertySize"
              value={formData?.propertySize ?? ''}
              onChange={handleChange}
              className={inputClasses('propertySize')}
            >
              <option value="">Select property size</option>
              {propertySizes?.map(size => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
          </div>
          {errors?.propertySize && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.propertySize}
            </p>
          )}
        </div>
      </div>

      {/* Location and Address */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
            City/Location <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
            <select
              id="location"
              name="location"
              value={formData?.location ?? ''}
              onChange={handleChange}
              className={inputClasses('location')}
            >
              <option value="">Select your city</option>
              {locations?.map(loc => (
                <option key={loc?.slug} value={loc?.name}>
                  {loc?.name} ({loc?.distance_miles?.toFixed(1)} mi)
                </option>
              ))}
            </select>
          </div>
          {errors?.location && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.location}
            </p>
          )}
        </div>

        {/* Preferred Date */}
        <div>
          <label htmlFor="preferredDate" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
            Preferred Start Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
            <input
              type="date"
              id="preferredDate"
              name="preferredDate"
              value={formData?.preferredDate ?? ''}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className={inputClasses('preferredDate')}
            />
          </div>
        </div>
      </div>

      {/* Property Address */}
      <div>
        <label htmlFor="address" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
          Property Address (Optional)
        </label>
        <div className="relative">
          <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
          <input
            type="text"
            id="address"
            name="address"
            value={formData?.address ?? ''}
            onChange={handleChange}
            placeholder="123 Main St, Canal Winchester, OH 43110"
            className={inputClasses('address')}
          />
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
          Additional Details
        </label>
        <div className="relative">
          <FileText className="absolute left-4 top-4 text-zinc-400" size={20} />
          <textarea
            id="message"
            name="message"
            value={formData?.message ?? ''}
            onChange={handleChange}
            rows={5}
            placeholder="Tell us more about your project, any specific requirements, or questions you have..."
            className={`${inputClasses('message')} pt-3.5 resize-none`}
          />
        </div>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          {formData?.message?.length ?? 0}/500 characters
        </p>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Sending Request...
            </>
          ) : (
            <>
              <Send size={20} />
              Request Free Quote
            </>
          )}
        </button>
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-3">
          We'll respond within 24 hours or call us at{' '}
          <a href="tel:2206662520" className="text-green-600 hover:text-green-500 font-semibold">
            (220) 666-2520
          </a>
        </p>
      </div>
    </form>
  );
};
