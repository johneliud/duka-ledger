import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { OfflineOnboarding } from "@/components/OfflineOnboarding";
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
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

type AuthScreen = 'landing' | 'login' | 'register' | 'join';

function App() {
	const { isAuthenticated, login, register, joinShop } = useAuth();
	const { showSuccess, showError } = useNotification();
	const storageInfo = useStorageQuota();
	const { isOnline } = useNetworkStatus();
	const [authScreen, setAuthScreen] = useState<AuthScreen>('landing');
	const [isLoading, setIsLoading] = useState(false);
	const [hasSession, setHasSession] = useState(false);

	useEffect(() => {
		const session = localStorage.getItem('duka_session');
		setHasSession(!!session);
	}, [isAuthenticated]);

	const handleLogin = async (idNumber: string, pin: string) => {
		setIsLoading(true);
		try {
			await login(idNumber, pin);
			showSuccess('Login successful!');
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Login failed';
			if (!isOnline) {
				showError('Cannot login while offline. Please connect to the internet.');
			} else {
				showError(message);
			}
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
			const message = err instanceof Error ? err.message : 'Registration failed';
			if (!isOnline) {
				showError('Cannot register while offline. Please connect to the internet.');
			} else {
				showError(message);
			}
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
			const message = err instanceof Error ? err.message : 'Failed to join shop';
			if (!isOnline) {
				showError('Cannot join shop while offline. Please connect to the internet.');
			} else {
				showError(message);
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<ErrorBoundary>
			<BrowserRouter>
				<Header />
				{isAuthenticated && storageInfo?.isWarning && (
					<StorageWarning
						percentUsed={storageInfo.percentUsed}
						isCritical={storageInfo.isCritical}
					/>
				)}
				{!isAuthenticated && !isOnline && !hasSession ? (
					<OfflineOnboarding />
				) : !isAuthenticated ? (
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
		</ErrorBoundary>
	);
}

export default App;
