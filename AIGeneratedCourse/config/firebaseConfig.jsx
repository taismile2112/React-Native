// @ts-nocheck
import { initializeApp, getApps } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC0q0H4zw26nsF7IFckvHGK1oiMJGPI7g0",
  authDomain: "ai-generated-course-410be.firebaseapp.com",
  projectId: "ai-generated-course-410be",
  storageBucket: "ai-generated-course-410be.appspot.com",
  messagingSenderId: "595267024795",
  appId: "1:595267024795:web:e8017a29a7b8c7eab6933e",
  measurementId: "G-RKLH5G260L"
};

// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// 🔥 Chỉ init Firebase 1 lần để tránh log spam
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// ========================= AUTH =========================

// 👉 Xử lý Auth tuỳ theo platform
let auth;

if (Platform.OS === "web") {
  // Web: dùng getAuth (không persistence)
  auth = getAuth(app);

  // ⭐ Optional: bật Analytics cho Web (không ảnh hưởng React Native)
  import("firebase/analytics").then(({ getAnalytics, isSupported }) => {
    isSupported().then((ok) => {
      if (ok) getAnalytics(app);
    });
  });

} else {
  // React Native: phải dùng initializeAuth
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
}

// ========================= FIRESTORE =========================

export const db = getFirestore(app);
export { auth };
