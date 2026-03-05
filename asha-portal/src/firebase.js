import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCKEjnrlyMw0Fk81V09WnKasHPKoGg9eus",
    authDomain: "asha-portal-30695.firebaseapp.com",
    projectId: "asha-portal-30695",
    storageBucket: "asha-portal-30695.firebasestorage.app",
    messagingSenderId: "794000208212",
    appId: "1:794000208212:web:195999b8c9efe17a36d8c1",
    measurementId: "G-75Q70RYEXV"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
