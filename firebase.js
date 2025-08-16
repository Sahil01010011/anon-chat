import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDGEpBoRUdVY7k8cdbvWiGhgKsDMNXE5aE",
  authDomain: "anonchat-c6ac8.firebaseapp.com",
  databaseURL: "https://anonchat-c6ac8-default-rtdb.firebaseio.com",
  projectId: "anonchat-c6ac8",
  storageBucket: "anonchat-c6ac8.firebasestorage.app",
  messagingSenderId: "157788192653",
  appId: "1:157788192653:web:5746c9bf6533c1845087c4",
  measurementId: "G-ZDRF21G037"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);