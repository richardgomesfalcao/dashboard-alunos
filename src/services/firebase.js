import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDEwSXqLdHiseUS3hHO508D00miZsSe1w0",
  authDomain: "dashboard-alunos-6af62.firebaseapp.com",
  projectId: "dashboard-alunos-6af62",
  storageBucket: "dashboard-alunos-6af62.appspot.com", // CORRIGIDO
  messagingSenderId: "1074894680761",
  appId: "1:1074894680761:web:8d5451b79a07e05d086168"
};

// Inicializa o app
const app = initializeApp(firebaseConfig);

// Auth (login)
export const auth = getAuth(app);

// Banco de dados (Firestore)
export const db = getFirestore(app);