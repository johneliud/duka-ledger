import "./App.css";
import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { SyncBadge } from "@/components/SyncBadge";
import { Header } from "@/components/Header";
import { LoginModal } from "@/components/LoginModal";
import { RegisterModal } from "@/components/RegisterModal";
import { JoinModal } from "@/components/JoinModal";
import { RecordSale } from "@/pages/RecordSale";
import { SalesHistory } from "@/pages/SalesHistory";
import { Products } from "@/pages/Products";
import { Expenses } from "@/pages/Expenses";
import { useAuth } from "@/hooks/useAuth";
import { useNotification } from "@/hooks/useNotification";
import { Plus, History, Package, Receipt } from "lucide-react";

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
			<div className="min-h-screen bg-bg">
				<Header />
				<SyncBadge />
				<main>
					<Routes>
						<Route path="/" element={
							<div className="p-8">
								<h1 className="text-2xl font-bold text-text mb-4">
									Welcome, {user?.name}!
								</h1>
								<p className="text-muted mb-6">Shop: {shop?.name}</p>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
									<Link
										to="/record-sale"
										className="inline-flex items-center gap-3 px-6 py-4 bg-primary text-white rounded-xl font-bold hover:bg-accent transition-all shadow-sm hover:shadow-md"
									>
										<Plus size={24} />
										Record Sale
									</Link>
									<Link
										to="/sales-history"
										className="inline-flex items-center gap-3 px-6 py-4 bg-surface border border-border text-text rounded-xl font-bold hover:bg-bg transition-all shadow-sm hover:shadow-md"
									>
										<History size={24} />
										Sales History
									</Link>
									<Link
										to="/products"
										className="inline-flex items-center gap-3 px-6 py-4 bg-surface border border-border text-text rounded-xl font-bold hover:bg-bg transition-all shadow-sm hover:shadow-md"
									>
										<Package size={24} />
										Products
									</Link>
									<Link
										to="/expenses"
										className="inline-flex items-center gap-3 px-6 py-4 bg-surface border border-border text-text rounded-xl font-bold hover:bg-bg transition-all shadow-sm hover:shadow-md"
									>
										<Receipt size={24} />
										Expenses
									</Link>
								</div>
							</div>
						} />
						<Route path="/record-sale" element={<RecordSale />} />
						<Route path="/sales-history" element={<SalesHistory />} />
						<Route path="/products" element={<Products />} />
						<Route path="/expenses" element={<Expenses />} />
					</Routes>
				</main>
			</div>
		</BrowserRouter>
	);
}

export default App;
