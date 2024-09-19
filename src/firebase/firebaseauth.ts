// firebaseauth.ts
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification, User } from 'firebase/auth';
import { auth } from './firebaseconfig';

export const registerWithEmailPassword = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    if (user) {
      await sendEmailVerification(user); 
    }
    return userCredential;
  } catch (error) {
    throw error;
  }
};

export const loginWithEmailPassword = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (user && !user.emailVerified) {
      throw new Error('Please verify your email before logging in.');
    }

    return userCredential;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

export const resendVerificationEmail = async (user: User) => {
  try {
    await sendEmailVerification(user);
  } catch (error) {
    throw error;
  }
};
