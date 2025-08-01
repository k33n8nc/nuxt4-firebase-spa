import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';

export const useAuth = () => {
  const user = useState<User | null>('user', () => null);
  const isAuthReady = useState<boolean>('isAuthReady', () => false);
  const auth = getAuth();

  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser;
    isAuthReady.value = true;
  });

  return {
    user,
    isAuthReady,
  };
};
