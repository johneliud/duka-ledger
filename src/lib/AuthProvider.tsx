import { useState, useEffect, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { login as apiLogin, register as apiRegister, joinShop as apiJoinShop } from './auth';
import { connector } from '@/db/connector';

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<{ id: string; name: string; id_number: string } | null>(null);
	const [shop, setShop] = useState<{ id: string; name: string } | null>(null);
	const [role, setRole] = useState<string | null>(null);
	const [token, setToken] = useState<string | null>(null);

	useEffect(() => {
		const savedSession = localStorage.getItem('duka_session');
		if (savedSession) {
			try {
				const { user, shop, role, token } = JSON.parse(savedSession);
				setUser(user);
				setShop(shop);
				setRole(role);
				setToken(token);
				connector.setCredentials(shop.id, user.id);
			} catch (e) {
				console.error('Failed to restore session:', e);
				localStorage.removeItem('duka_session');
			}
		}
	}, []);

	const saveSession = (user: any, shop: any, role: string, token: string) => {
		localStorage.setItem('duka_session', JSON.stringify({ user, shop, role, token }));
	};

	const login = async (idNumber: string, pin: string) => {
		const response = await apiLogin(idNumber, pin);
		const user = response.user;
		const shop = response.shop;
		const role = response.role || 'member';
		const token = response.token;

		setUser(user);
		setShop(shop);
		setRole(role);
		setToken(token);
		
		saveSession(user, shop, role, token);
		connector.setCredentials(shop.id, user.id);
	};

	const register = async (name: string, idNumber: string, pin: string, shopName: string) => {
		const response = await apiRegister(name, idNumber, pin, shopName);
		const user = response.user;
		const shop = response.shop;
		const role = 'owner';
		const token = response.token;

		setUser(user);
		setShop(shop);
		setRole(role);
		setToken(token);
		
		saveSession(user, shop, role, token);
		connector.setCredentials(shop.id, user.id);
	};

	const joinShop = async (name: string, idNumber: string, pin: string, inviteCode: string) => {
		const response = await apiJoinShop(name, idNumber, pin, inviteCode);
		const user = response.user;
		const shop = response.shop;
		const role = 'member';
		const token = response.token;

		setUser(user);
		setShop(shop);
		setRole(role);
		setToken(token);
		
		saveSession(user, shop, role, token);
		connector.setCredentials(shop.id, user.id);
	};

	const logout = () => {
		setUser(null);
		setShop(null);
		setRole(null);
		setToken(null);
		localStorage.removeItem('duka_session');
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
