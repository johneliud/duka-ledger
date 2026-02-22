import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { login as apiLogin, register as apiRegister, joinShop as apiJoinShop } from '@/lib/auth';
import { connector } from '@/db/connector';

interface User {
	id: string;
	name: string;
}

interface Shop {
	id: string;
	name: string;
}

interface AuthContextType {
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

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [shop, setShop] = useState<Shop | null>(null);
	const [role, setRole] = useState<string | null>(null);
	const [token, setToken] = useState<string | null>(null);

	useEffect(() => {
		// Check for existing session in memory (will be lost on refresh for now)
		// TODO: Add IndexedDB persistence for "Remember this device"
	}, []);

	const login = async (name: string, pin: string) => {
		const response = await apiLogin(name, pin);
		setUser(response.user);
		setShop(response.shop);
		setRole(response.role || 'member');
		setToken(response.token);
		
		// Set credentials for PowerSync connector
		connector.setCredentials(response.shop.id, response.user.id);
	};

	const register = async (name: string, pin: string, shopName: string) => {
		const response = await apiRegister(name, pin, shopName);
		setUser(response.user);
		setShop(response.shop);
		setRole('owner');
		setToken(response.token);
		
		connector.setCredentials(response.shop.id, response.user.id);
	};

	const joinShop = async (name: string, pin: string, inviteCode: string) => {
		const response = await apiJoinShop(name, pin, inviteCode);
		setUser(response.user);
		setShop(response.shop);
		setRole('member');
		setToken(response.token);
		
		connector.setCredentials(response.shop.id, response.user.id);
	};

	const logout = () => {
		setUser(null);
		setShop(null);
		setRole(null);
		setToken(null);
	};

	return (
		<AuthContext.Provider value={{
			user,
			shop,
			role,
			token,
			isAuthenticated: !!user && !!shop,
			login,
			register,
			joinShop,
			logout
		}}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within AuthProvider');
	}
	return context;
}
