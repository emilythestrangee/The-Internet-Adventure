// src/services/emailService.ts

import emailjs from 'emailjs-com';
import { storeEmailInFirestore } from '../firebase/firestore'; // Import the Firestore function

const EMAILJS_USER_ID = import.meta.env.VITE_EMAILJS_USER_ID;
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

export const sendConfirmationEmail = (subscriberEmail: string) => {
    const templateParams = {
      email: subscriberEmail, // MATCH the placeholder name exactly
      from_name: 'Universal Acceptance Team',
      subject: 'شكراً للاشتراك في موقعنا',
      message: `مرحبًا،
  
  شكرًا للاشتراك في موقعنا. سنوافيك بأخبار حول قبول أسماء النطاقات الدولية وعناوين البريد الإلكتروني.
  
  مع تحيات فريق [موقع الويب]`
    };
  
    return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_USER_ID)
      .then((response) => {
        console.log('Email sent successfully', response);
        storeEmailInFirestore(subscriberEmail);
      })
      .catch((error) => {
        console.error('Error sending email', error);
      });
  };
  
