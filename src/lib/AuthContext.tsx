import { createContext } from 'react';

interface User {
	id: string;
	name: string;
	id_number: string;
	role?: string;
}

interface Shop {
	id: string;
	name: string;
	invite_code?: string;
}

export interface AuthContextType {
	user: User | null;
	shop: Shop | null;
	role: string | null;
	token: string | null;
	isAuthenticated: boolean;
	login: (idNumber: string, pin: string) => Promise<void>;
	register: (name: string, idNumber: string, pin: string, shopName: string) => Promise<void>;
	joinShop: (name: string, idNumber: string, pin: string, inviteCode: string) => Promise<void>;
	logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

