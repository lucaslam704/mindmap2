import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  GoogleAuthProvider, 
  signInWithCredential,
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
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

// Initialize WebBrowser for OAuth
WebBrowser.maybeCompleteAuthSession();

const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address';
    case 'auth/user-disabled':
      return 'This account has been disabled';
    case 'auth/user-not-found':
      return 'No account found with this email';
    case 'auth/wrong-password':
      return 'Incorrect password';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters';
    case 'auth/operation-not-allowed':
      return 'Operation not allowed';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later';
    default:
      return 'Email or password is incorrect';
  }
};

export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code));
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code));
  }
};

export const signInWithGoogle = async () => {
  try {
    const [request, response, promptAsync] = Google.useAuthRequest({
      androidClientId: "208612764076-dppsfsoktqfcc6r990la6airkutteecn.apps.googleusercontent.com", // from google-services.json
      iosClientId: "208612764076-jmqb17e7a627elqoqa6lsbdrb1ivlg3c.apps.googleusercontent.com", // from GoogleService-Info.plist
      webClientId: "208612764076-dppsfsoktqfcc6r990la6airkutteecn.apps.googleusercontent.com", // from google-services.json
    });

    const result = await promptAsync();

    if (result?.type === 'success' && result.authentication) {
      // Create a Google credential with the token
      const credential = GoogleAuthProvider.credential(
        result.authentication.idToken,
        result.authentication.accessToken
      );

      // Sign in with the credential
      const userCredential = await signInWithCredential(auth, credential);
      return userCredential.user;
    } else {
      throw new Error('Google Sign In was cancelled or failed');
    }
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
    
    await setDoc(doc(db, 'userSecurity', user.uid), {
      securityQuestion,
      securityAnswer: securityAnswer.toLowerCase().trim(),
      email
    });
    
    return user;
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code));
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

export const signInWithGoogleCredential = async (idToken: string, accessToken: string) => {
  try {
    const credential = GoogleAuthProvider.credential(idToken, accessToken);
    const userCredential = await signInWithCredential(auth, credential);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};






