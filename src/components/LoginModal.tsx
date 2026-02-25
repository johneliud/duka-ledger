import { useState } from 'react';
import { X } from 'lucide-react';

interface LoginModalProps {
	onLogin: (idNumber: string, pin: string) => void;
	onSwitchToRegister: () => void;
	onSwitchToJoin: () => void;
	onBack: () => void;
	isLoading?: boolean;
}

export function LoginModal({ onLogin, onSwitchToRegister, onSwitchToJoin, onBack, isLoading }: LoginModalProps) {
	const [idNumber, setIdNumber] = useState('');
	const [pin, setPin] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (idNumber && pin.length === 4) {
			onLogin(idNumber, pin);
		}
	};

	return (
		<div className="fixed inset-0 bg-text/50 backdrop-blur-lg flex items-center justify-center z-50 p-4">
			<div className="bg-surface rounded-2xl border border-border w-full max-w-md lg:max-w-4xl overflow-hidden flex flex-col lg:flex-row relative">
				<button
					onClick={onBack}
					className="absolute top-4 right-4 p-2 text-muted hover:text-text hover:bg-bg rounded-lg transition-colors z-10"
					aria-label="Close"
				>
					<X size={24} />
				</button>
				
				{/* Left Panel - Large Devices Only */}
				<div className="hidden lg:flex lg:w-1/2 bg-primary p-12 flex-col justify-center text-bg">
					<h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
					<p className="text-lg opacity-90">
						Access your shop's digital ledger to record sales, track inventory, and manage your business from anywhere.
					</p>
				</div>

				{/* Right Panel - Form */}
				<div className="w-full lg:w-1/2 p-8">
					<h2 className="text-text text-2xl font-bold mb-6">Login</h2>
					
					<form onSubmit={handleSubmit}>
						<div className="mb-4">
							<label className="block text-text text-sm mb-2">ID Number</label>
							<input
								type="text"
								inputMode="numeric"
								value={idNumber}
								onChange={(e) => setIdNumber(e.target.value.replace(/\D/g, ''))}
								className="w-full px-3 py-2 border border-border rounded-lg bg-bg text-text focus:outline-none focus:ring-2 focus:ring-primary/20"
								placeholder="12345678"
								required
							/>
						</div>

						<div className="mb-6">
							<label className="block text-text text-sm mb-2">PIN</label>
							<input
								type="password"
								inputMode="numeric"
								maxLength={4}
								value={pin}
								onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
								className="w-full px-3 py-2 border border-border rounded-lg bg-bg text-text tracking-[0.5rem] focus:outline-none focus:ring-2 focus:ring-primary/20"
								placeholder="••••"
								required
							/>
						</div>

						<button
							type="submit"
							disabled={isLoading || !idNumber || pin.length !== 4}
							className="w-full py-3 bg-primary text-bg rounded-lg font-bold disabled:opacity-50 transition-colors hover:bg-primary/90 mb-3"
						>
							{isLoading ? 'Logging in...' : 'Login'}
						</button>

						<button
							type="button"
							onClick={onBack}
							className="w-full py-3 border border-border text-text rounded-lg hover:bg-bg transition-colors"
						>
							Back to Home
						</button>
					</form>

					<div className="mt-8 pt-6 border-t border-border flex flex-col gap-3 text-center text-sm">
						<button
							onClick={onSwitchToRegister}
							className="text-primary font-medium hover:underline"
						>
							Register new shop
						</button>
						<button
							onClick={onSwitchToJoin}
							className="text-muted hover:text-text transition-colors"
						>
							Join existing shop
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
