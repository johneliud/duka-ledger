import "./App.css";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SyncBadge } from "@/components/SyncBadge";
import { Header } from "@/components/Header";
import { LoginModal } from "@/components/LoginModal";
import { RegisterModal } from "@/components/RegisterModal";
import { JoinModal } from "@/components/JoinModal";
import { StorageWarning } from "@/components/StorageWarning";
import { Dashboard } from "@/pages/Dashboard";
import { RecordSale } from "@/pages/RecordSale";
import { SalesHistory } from "@/pages/SalesHistory";
import { Products } from "@/pages/Products";
import { Expenses } from "@/pages/Expenses";
import { DebtBook } from "@/pages/DebtBook";
import { Analytics } from "@/pages/Analytics";
import { SeedData } from "@/pages/SeedData";
import { Landing } from "@/pages/Landing";
import { useAuth } from "@/hooks/useAuth";
import { useNotification } from "@/hooks/useNotification";
import { useStorageQuota } from "@/hooks/useStorageQuota";

type AuthScreen = 'landing' | 'login' | 'register' | 'join';

function App() {
	const { isAuthenticated, login, register, joinShop } = useAuth();
	const { showSuccess, showError } = useNotification();
	const storageInfo = useStorageQuota();
	const [authScreen, setAuthScreen] = useState<AuthScreen>('landing');
	const [isLoading, setIsLoading] = useState(false);

	const handleExport = () => {
		window.location.href = '/analytics';
		showSuccess('Navigate to Analytics to export data');
	};

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

	return (
		<BrowserRouter>
			<Header />
			{isAuthenticated && <SyncBadge />}
			{isAuthenticated && storageInfo?.isWarning && (
				<StorageWarning
					percentUsed={storageInfo.percentUsed}
					isCritical={storageInfo.isCritical}
					onExport={handleExport}
				/>
			)}
			{!isAuthenticated ? (
				<>
					<Landing 
						onGetStarted={() => setAuthScreen('register')}
						onLogin={() => setAuthScreen('login')}
						isAuthenticated={false}
					/>
					{authScreen === 'login' && (
						<LoginModal
							onLogin={handleLogin}
							onSwitchToRegister={() => setAuthScreen('register')}
							onSwitchToJoin={() => setAuthScreen('join')}
							onBack={() => setAuthScreen('landing')}
							isLoading={isLoading}
						/>
					)}
					{authScreen === 'register' && (
						<RegisterModal
							onRegister={handleRegister}
							onBack={() => setAuthScreen('landing')}
							isLoading={isLoading}
						/>
					)}
					{authScreen === 'join' && (
						<JoinModal
							onJoin={handleJoin}
							onBack={() => setAuthScreen('landing')}
							isLoading={isLoading}
						/>
					)}
				</>
			) : (
				<Routes>
					<Route path="/" element={<Landing onGetStarted={() => window.location.href = '/dashboard'} onLogin={() => window.location.href = '/dashboard'} isAuthenticated={true} />} />
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/record-sale" element={<RecordSale />} />
					<Route path="/sales-history" element={<SalesHistory />} />
					<Route path="/products" element={<Products />} />
					<Route path="/expenses" element={<Expenses />} />
					<Route path="/debt-book" element={<DebtBook />} />
					<Route path="/analytics" element={<Analytics />} />
					<Route path="/seed" element={<SeedData />} />
				</Routes>
			)}
		</BrowserRouter>
	);
}

export default App;
