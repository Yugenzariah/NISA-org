import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAQ2PTVNRRIX1h5hNlkk6RsBA-77L39AmU",
    authDomain: "nisa-organization.firebaseapp.com",
    projectId: "nisa-organization",
    storageBucket: "nisa-organization.firebasestorage.app",
    messagingSenderId: "994598470661",
    appId: "1:994598470661:web:c77f4cb2fe4c60aee5c86c",
    measurementId: "G-KHJB0PT0ZL"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };