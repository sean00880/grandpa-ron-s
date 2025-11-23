'use client';


import React, { useState } from 'react';
import { Send, Mail, Phone, User, MapPin, Briefcase, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ContactFormProps {
  prefilledLocation?: string;
  compact?: boolean;
}

export const ContactForm: React.FC<ContactFormProps> = ({ prefilledLocation, compact = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    location: prefilledLocation || '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://formspree.io/f/xdkogqvq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.custom((t) => (
          <div className={`${t.visible ? 'animate-fade-in' : 'opacity-0'} max-w-md w-full bg-white dark:bg-zinc-800 shadow-2xl rounded-2xl p-6 border border-green-200 dark:border-green-800`}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-zinc-900 dark:text-white mb-1">Message Sent!</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Thank you for contacting us. We'll get back to you within 24 hours.
                </p>
              </div>
            </div>
          </div>
        ), { duration: 5000 });
        
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: '',
          location: prefilledLocation || '',
          message: ''
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-fade-in' : 'opacity-0'} max-w-md w-full bg-white dark:bg-zinc-800 shadow-2xl rounded-2xl p-6 border border-red-200 dark:border-red-800`}>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <AlertCircle className="text-red-600 dark:text-red-400" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-zinc-900 dark:text-white mb-1">Error</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Failed to send message. Please try calling us at (220) 666-2520.
              </p>
            </div>
          </div>
        </div>
      ), { duration: 5000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (compact) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800 p-8">
        <h3 className="text-2xl font-heading font-bold text-zinc-900 dark:text-white mb-6">Quick Contact</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-zinc-900 dark:text-white placeholder-zinc-400"
            />
          </div>
          <div className="relative">
            <MessageSquare className="absolute left-4 top-4 text-zinc-400" size={18} />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              required
              rows={3}
              className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-zinc-900 dark:text-white placeholder-zinc-400 resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
            <Send size={18} />
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-100 dark:border-zinc-800 p-10">
      <div className="mb-8">
        <h3 className="text-3xl font-heading font-bold text-zinc-900 dark:text-white mb-2">Get a Free Quote</h3>
        <p className="text-zinc-600 dark:text-zinc-400">Fill out the form below and we'll get back to you within 24 hours</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative">
            <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
              focusedField === 'name' || formData.name ? 'top-2 text-xs text-green-600 dark:text-green-400' : 'top-1/2 -translate-y-1/2 text-zinc-400'
            }`}>
              Your Name
            </label>
            <User className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${
              focusedField === 'name' ? 'text-green-600' : 'text-zinc-400'
            }`} size={18} />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              required
              className="w-full px-4 pt-7 pb-3 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-0 focus:border-green-500 transition-all text-zinc-900 dark:text-white"
            />
          </div>

          <div className="relative">
            <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
              focusedField === 'email' || formData.email ? 'top-2 text-xs text-green-600 dark:text-green-400' : 'top-1/2 -translate-y-1/2 text-zinc-400'
            }`}>
              Email Address
            </label>
            <Mail className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${
              focusedField === 'email' ? 'text-green-600' : 'text-zinc-400'
            }`} size={18} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              required
              className="w-full px-4 pt-7 pb-3 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-0 focus:border-green-500 transition-all text-zinc-900 dark:text-white"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative">
            <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
              focusedField === 'phone' || formData.phone ? 'top-2 text-xs text-green-600 dark:text-green-400' : 'top-1/2 -translate-y-1/2 text-zinc-400'
            }`}>
              Phone Number
            </label>
            <Phone className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${
              focusedField === 'phone' ? 'text-green-600' : 'text-zinc-400'
            }`} size={18} />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onFocus={() => setFocusedField('phone')}
              onBlur={() => setFocusedField(null)}
              className="w-full px-4 pt-7 pb-3 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-0 focus:border-green-500 transition-all text-zinc-900 dark:text-white"
            />
          </div>

          <div className="relative">
            <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
              focusedField === 'service' || formData.service ? 'top-2 text-xs text-green-600 dark:text-green-400' : 'top-1/2 -translate-y-1/2 text-zinc-400'
            }`}>
              Service Needed
            </label>
            <Briefcase className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${
              focusedField === 'service' ? 'text-green-600' : 'text-zinc-400'
            }`} size={18} />
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              onFocus={() => setFocusedField('service')}
              onBlur={() => setFocusedField(null)}
              className="w-full px-4 pt-7 pb-3 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-0 focus:border-green-500 transition-all text-zinc-900 dark:text-white appearance-none cursor-pointer"
            >
              <option value=""></option>
              {services.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative">
          <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
            focusedField === 'location' || formData.location ? 'top-2 text-xs text-green-600 dark:text-green-400' : 'top-1/2 -translate-y-1/2 text-zinc-400'
          }`}>
            Your Location
          </label>
          <MapPin className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${
            focusedField === 'location' ? 'text-green-600' : 'text-zinc-400'
          }`} size={18} />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            onFocus={() => setFocusedField('location')}
            onBlur={() => setFocusedField(null)}
            placeholder={prefilledLocation ? '' : 'City, State'}
            className="w-full px-4 pt-7 pb-3 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-0 focus:border-green-500 transition-all text-zinc-900 dark:text-white"
          />
        </div>

        <div className="relative">
          <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
            focusedField === 'message' || formData.message ? 'top-4 text-xs text-green-600 dark:text-green-400' : 'top-6 text-zinc-400'
          }`}>
            Message / Project Details
          </label>
          <MessageSquare className={`absolute right-4 top-6 transition-colors ${
            focusedField === 'message' ? 'text-green-600' : 'text-zinc-400'
          }`} size={18} />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            onFocus={() => setFocusedField('message')}
            onBlur={() => setFocusedField(null)}
            required
            rows={5}
            className="w-full px-4 pt-10 pb-3 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-0 focus:border-green-500 transition-all text-zinc-900 dark:text-white resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-8 py-5 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-green-500/30 hover:-translate-y-1 transform"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sending...
            </>
          ) : (
            <>
              Send Message
              <Send size={20} />
            </>
          )}
        </button>

        <p className="text-center text-sm text-zinc-500 dark:text-zinc-500">
          Or call us directly at <a href="tel:2206662520" className="text-green-600 dark:text-green-400 font-semibold hover:underline">(220) 666-2520</a>
        </p>
      </form>
    </div>
  );
};
