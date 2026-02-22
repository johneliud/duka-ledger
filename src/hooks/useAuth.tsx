import { useContext } from 'react';
import { AuthContext, type AuthContextType } from '@/lib/AuthContext';

export function useAuth(): AuthContextType {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within AuthProvider');
	}
	return context;
}

