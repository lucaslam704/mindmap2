import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  GoogleAuthProvider, 
  signInWithPopup,
  onAuthStateChanged,
  User,
  updatePassword
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  collection, 
  query, 
  where 
} from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';

export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const signUpWithEmailAndSecurityQuestion = async (
  email: string, 
  password: string,
  securityQuestion: string,
  securityAnswer: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Store security question and answer in Firestore
    await setDoc(doc(db, 'userSecurity', user.uid), {
      securityQuestion,
      securityAnswer: securityAnswer.toLowerCase().trim(),
      email
    });
    
    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const verifySecurityQuestionAndResetPassword = async (
  email: string,
  securityAnswer: string,
  newPassword: string
) => {
  try {
    // Query Firestore to find user by email
    const querySnapshot = await getDocs(
      query(collection(db, 'userSecurity'), where('email', '==', email))
    );
    
    if (querySnapshot.empty) {
      throw new Error('Email not found');
    }

    const userSecurity = querySnapshot.docs[0].data();
    const storedAnswer = userSecurity.securityAnswer;

    if (securityAnswer.toLowerCase().trim() !== storedAnswer) {
      throw new Error('Incorrect security answer');
    }

    // Update password in Firebase Auth
    const user = auth.currentUser;
    if (user) {
      await updatePassword(user, newPassword);
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getSecurityQuestion = async (email: string) => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, 'userSecurity'), where('email', '==', email))
    );
    
    if (querySnapshot.empty) {
      throw new Error('Email not found');
    }

    const userSecurity = querySnapshot.docs[0].data();
    return userSecurity.securityQuestion;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const verifySecurityAnswer = async (email: string, securityAnswer: string) => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, 'userSecurity'), where('email', '==', email))
    );
    
    if (querySnapshot.empty) {
      throw new Error('Email not found');
    }

    const userSecurity = querySnapshot.docs[0].data();
    if (securityAnswer.toLowerCase().trim() !== userSecurity.securityAnswer) {
      throw new Error('Incorrect security answer');
    }
    
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
};



