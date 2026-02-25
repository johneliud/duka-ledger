import "./App.css";
import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { SyncBadge } from "@/components/SyncBadge";
import { LoginModal } from "@/components/LoginModal";
import { RegisterModal } from "@/components/RegisterModal";
import { JoinModal } from "@/components/JoinModal";
import { RecordSale } from "@/pages/RecordSale";
import { SalesHistory } from "@/pages/SalesHistory";
import { useAuth } from "@/hooks/useAuth";
import { useNotification } from "@/hooks/useNotification";
import { Plus, History } from "lucide-react";

type AuthScreen = 'login' | 'register' | 'join';

function App() {
	const { isAuthenticated, user, shop, login, register, joinShop } = useAuth();
	const { showSuccess, showError } = useNotification();
	const [authScreen, setAuthScreen] = useState<AuthScreen>('login');
	const [isLoading, setIsLoading] = useState(false);

	const handleLogin = async (idNumber: string, pin: string) => {
		setIsLoading(true);
		try {
			await login(idNumber, pin);
			showSuccess('Login successful!');
		} catch (err) {
			showError(err instanceof Error ? err.message : 'Login failed');
		} finally {
			setIsLoading(false);
		}
	};

	const handleRegister = async (name: string, idNumber: string, pin: string, shopName: string) => {
		setIsLoading(true);
		try {
			await register(name, idNumber, pin, shopName);
			showSuccess('Shop created successfully!');
		} catch (err) {
			showError(err instanceof Error ? err.message : 'Registration failed');
		} finally {
			setIsLoading(false);
		}
	};

	const handleJoin = async (name: string, idNumber: string, pin: string, inviteCode: string) => {
		setIsLoading(true);
		try {
			await joinShop(name, idNumber, pin, inviteCode);
			showSuccess('Joined shop successfully!');
		} catch (err) {
			showError(err instanceof Error ? err.message : 'Failed to join shop');
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
					/>
				)}
				{authScreen === 'register' && (
					<RegisterModal
						onRegister={handleRegister}
						onBack={() => setAuthScreen('login')}
						isLoading={isLoading}
					/>
				)}
				{authScreen === 'join' && (
					<JoinModal
						onJoin={handleJoin}
						onBack={() => setAuthScreen('login')}
						isLoading={isLoading}
					/>
				)}
			</>
		);
	}

	return (
		<BrowserRouter>
			<SyncBadge />
			<Routes>
				<Route path="/" element={
					<div className="p-8">
						<h1 className="text-2xl font-bold text-text mb-4">
							Welcome, {user?.name}!
						</h1>
						<p className="text-muted mb-6">Shop: {shop?.name}</p>
						<div className="flex gap-3">
							<Link
								to="/record-sale"
								className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded font-medium hover:bg-accent"
							>
								<Plus size={20} />
								Record Sale
							</Link>
							<Link
								to="/sales-history"
								className="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-border text-text rounded font-medium hover:bg-border"
							>
								<History size={20} />
								Sales History
							</Link>
						</div>
					</div>
				} />
				<Route path="/record-sale" element={<RecordSale />} />
				<Route path="/sales-history" element={<SalesHistory />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
