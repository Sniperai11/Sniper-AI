import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';

export const authApi = {
  getFirebaseAuth: () => getAuth(),
  logout: () => signOut(getAuth()),
};
