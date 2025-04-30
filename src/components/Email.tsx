
import React, { useState } from 'react';
import { sendConfirmationEmail } from '../services/emailService'; // Import the email sending service

// Validate Email (Arabic or English letters, numbers, hyphens allowed before @)
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[\u0600-\u06FF\u0660-\u0669a-zA-Z0-9\-\.]+@[\u0600-\u06FF\u0660-\u0669a-zA-Z0-9\-\.]+\.[\u0600-\u06FFa-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// Validate domain name according to IDNA2008 rules (though we already check in regex above)
const validateDomain = (domain: string): boolean => {
  const domainRegex = /^([\u0600-\u06FF\u0660-\u0669a-zA-Z0-9\-]+\.)+[\u0600-\u06FFa-zA-Z]{2,}$/;
  return domainRegex.test(domain);
};

const isArabic = (text: string): boolean => {
  const arabicRegex = /[\u0600-\u06FF]/;
  return arabicRegex.test(text);
};


const Email: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    if (!validateEmail(email)) {
      setError('يرجى إدخال بريد إلكتروني صحيح يحتوي على أحرف عربية أو إنجليزية فقط قبل @.');
      setLoading(false);
      return;
    }

    const [, domain] = email.split('@');
    if (!validateDomain(domain)) {
      setError('يرجى إدخال نطاق صحيح.');
      setLoading(false);
      return;
    }

    try {
      await sendConfirmationEmail(email);
      setSuccess(true);
      setEmail('');
    } catch (error) {
      setError('فشل إرسال البريد الإلكتروني. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Subscribe to Our Newsletter
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            // type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            dir={isArabic(email) ? 'rtl' : 'ltr'}
            className={`w-full p-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${isArabic(email) ? 'text-right' : 'text-left'
              }`}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold hover:from-purple-700 hover:to-pink-600 transition disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Subscribe Now'}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-red-400 text-center">{error}</p>
        )}
        {success && (
          <p className="mt-4 text-green-400 text-center">
            Confirmation email sent successfully!
          </p>
        )}
      </div>
    </div>
  );
};

export default Email;

