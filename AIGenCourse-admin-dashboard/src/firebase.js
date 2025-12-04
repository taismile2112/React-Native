// app/firebaseConfig.js

// 1. Import thêm getFirestore và getAuth
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; 
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC0q0H4zw26nsF7IFckvHGK1oiMJGPI7g0",
  authDomain: "ai-generated-course-410be.firebaseapp.com",
  projectId: "ai-generated-course-410be",
  storageBucket: "ai-generated-course-410be.firebasestorage.app",
  messagingSenderId: "595267024795",
  appId: "1:595267024795:web:e8017a29a7b8c7eab6933e",
  measurementId: "G-RKLH5G260L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 2. Khởi tạo Database và Auth
const db = getFirestore(app);
const auth = getAuth(app);

// 3. Export để dùng ở các trang khác (Quan trọng)
export { app, db, auth, analytics };