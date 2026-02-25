import "./App.css";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SyncBadge } from "@/components/SyncBadge";
import { Header } from "@/components/Header";
import { LoginModal } from "@/components/LoginModal";
import { RegisterModal } from "@/components/RegisterModal";
import { JoinModal } from "@/components/JoinModal";
import { Dashboard } from "@/pages/Dashboard";
import { RecordSale } from "@/pages/RecordSale";
import { SalesHistory } from "@/pages/SalesHistory";
import { Products } from "@/pages/Products";
import { Expenses } from "@/pages/Expenses";
import { DebtBook } from "@/pages/DebtBook";
import { SeedData } from "@/pages/SeedData";
import { useAuth } from "@/hooks/useAuth";
import { useNotification } from "@/hooks/useNotification";

type AuthScreen = 'login' | 'register' | 'join';

function App() {
	const { isAuthenticated, login, register, joinShop } = useAuth();
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
			<Header />
			<SyncBadge />
			<Routes>
				<Route path="/" element={<Dashboard />} />
				<Route path="/record-sale" element={<RecordSale />} />
				<Route path="/sales-history" element={<SalesHistory />} />
				<Route path="/products" element={<Products />} />
				<Route path="/expenses" element={<Expenses />} />
				<Route path="/debt-book" element={<DebtBook />} />
				<Route path="/seed" element={<SeedData />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
