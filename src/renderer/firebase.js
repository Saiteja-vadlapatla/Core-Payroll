// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBqOAI2aNuE8GPBNA3UEZAiYmGLIsA3OCY',
  authDomain: 'core-payroll.firebaseapp.com',
  projectId: 'core-payroll',
  storageBucket: 'core-payroll.appspot.com',
  messagingSenderId: '728771319854',
  appId: '1:728771319854:web:3dbb70749b70212e6527bf',
  measurementId: 'G-L8DEP3PN1R',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export default app;
export { db, analytics, firebaseConfig };
