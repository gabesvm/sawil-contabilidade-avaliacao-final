import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Config oficial (igual ao Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyCVOSPZPrtYGbdvcIvGE6Y6cu15RygnqsM",
  authDomain: "aplicativoreactnative-3e139.firebaseapp.com",
  databaseURL: "https://aplicativoreactnative-3e139-default-rtdb.firebaseio.com",
  projectId: "aplicativoreactnative-3e139",
  storageBucket: "aplicativoreactnative-3e139.firebasestorage.app",
  messagingSenderId: "232737014416",
  appId: "1:232737014416:web:83e3875db00d0f73a68e15",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);

export default app;