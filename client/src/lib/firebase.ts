import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  onAuthStateChanged, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  User
} from 'firebase/auth';

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: "AIzaSyBJDs6jy7NnSg9d3I5l0Pg-RDM2alztUIQ",
  authDomain: "mangat-friend.firebaseapp.com",
  projectId: "mangat-friend",
  storageBucket: "mangat-friend.firebasestorage.app",
  messagingSenderId: "118999499620",
  appId: "1:118999499620:web:3a7f0ee4c2c497eff4b071",
  measurementId: "G-JMG0BMDXKM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Email and password authentication
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error('Error signing in with email:', error);
    throw error;
  }
};

export const signUpWithEmail = async (email: string, password: string, displayName: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update the user's profile with the provided display name
    if (result.user) {
      await updateProfile(result.user, { displayName });
    }
    
    return result.user;
  } catch (error) {
    console.error('Error signing up with email:', error);
    throw error;
  }
};

// Google authentication
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// Sign out
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Auth state observer
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export default app;