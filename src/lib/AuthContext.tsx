import { createContext } from 'react';

interface User {
	id: string;
	name: string;
}

interface Shop {
	id: string;
	name: string;
}

export interface AuthContextType {
	user: User | null;
	shop: Shop | null;
	role: string | null;
	token: string | null;
	isAuthenticated: boolean;
	login: (name: string, pin: string) => Promise<void>;
	register: (name: string, pin: string, shopName: string) => Promise<void>;
	joinShop: (name: string, pin: string, inviteCode: string) => Promise<void>;
	logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

