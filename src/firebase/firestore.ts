import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '../firebase'; 

export const storeEmailInFirestore = async (email: string) => {
  try {
    const emailRef = doc(firestore, 'newsletter', email); 
    await setDoc(emailRef, {
      email,
      timestamp: new Date().toISOString(),
    });
    console.log('Email stored in Firestore');
  } catch (error) {
    console.error('Error storing email: ', error);
  }
};
