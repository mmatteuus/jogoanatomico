import { useContext } from 'react';

import { AuthContext } from '../context/AuthContext';

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return ctx;
}
