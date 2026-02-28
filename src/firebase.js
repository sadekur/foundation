// // salsabilfoubdtion@gmail.com
// shadekur.rahman60@gmail.com pass: 111111
// salsabilfoubdtion@gmail.com pass: 111111
// databaseURL: "https://as-salsabil-foundation-default-rtdb.firebaseio.com",
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  // Replace with your actual Firebase config
  apiKey: "AIzaSyCCKkFADRBxCntebH1isPYrKrHB0qpN26I",
  authDomain: "as-salsabil-foundation.firebaseapp.com",
  projectId: "as-salsabil-foundation",
  storageBucket: "as-salsabil-foundation.firebasestorage.app",
  messagingSenderId: "589960728860",
  appId: "1:589960728860:web:49ada3445fdbcf92672ad9",
  // measurementId: "G-3SY22ZVD2Z"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
