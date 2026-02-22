import "./App.css";
import { useState } from "react";
import { SyncBadge } from "@/components/SyncBadge";
import { LoginModal } from "@/components/LoginModal";
import { RegisterModal } from "@/components/RegisterModal";
import { JoinModal } from "@/components/JoinModal";
import { useAuth } from "@/hooks/useAuth";

type AuthScreen = 'login' | 'register' | 'join';

function App() {
	const { isAuthenticated, user, shop, login, register, joinShop } = useAuth();
	const [authScreen, setAuthScreen] = useState<AuthScreen>('login');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string>('');

	const handleLogin = async (name: string, pin: string) => {
		setIsLoading(true);
		setError('');
		try {
			await login(name, pin);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Login failed');
		} finally {
			setIsLoading(false);
		}
	};

	const handleRegister = async (name: string, pin: string, shopName: string) => {
		setIsLoading(true);
		setError('');
		try {
			await register(name, pin, shopName);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Registration failed');
		} finally {
			setIsLoading(false);
		}
	};

	const handleJoin = async (name: string, pin: string, inviteCode: string) => {
		setIsLoading(true);
		setError('');
		try {
			await joinShop(name, pin, inviteCode);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to join shop');
		} finally {
			setIsLoading(false);
		}
	};

	if (!isAuthenticated) {
		return (
			<>
				{authScreen === 'login' && (
					<LoginModal
						onLogin={handleLogin}
						onSwitchToRegister={() => setAuthScreen('register')}
						onSwitchToJoin={() => setAuthScreen('join')}
						isLoading={isLoading}
						error={error}
					/>
				)}
				{authScreen === 'register' && (
					<RegisterModal
						onRegister={handleRegister}
						onBack={() => setAuthScreen('login')}
						isLoading={isLoading}
						error={error}
					/>
				)}
				{authScreen === 'join' && (
					<JoinModal
						onJoin={handleJoin}
						onBack={() => setAuthScreen('login')}
						isLoading={isLoading}
						error={error}
					/>
				)}
			</>
		);
	}

	return (
		<>
			<SyncBadge />
			<div className="p-8">
				<h1 className="text-2xl font-bold text-text mb-4">
					Welcome, {user?.name}!
				</h1>
				<p className="text-muted">Shop: {shop?.name}</p>
			</div>
		</>
	);
}

export default App;
