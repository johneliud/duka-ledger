import { useState } from 'react';

interface LoginModalProps {
	onLogin: (idNumber: string, pin: string) => void;
	onSwitchToRegister: () => void;
	onSwitchToJoin: () => void;
	isLoading?: boolean;
}

export function LoginModal({ onLogin, onSwitchToRegister, onSwitchToJoin, isLoading }: LoginModalProps) {
	const [idNumber, setIdNumber] = useState('');
	const [pin, setPin] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (idNumber && pin.length === 4) {
			onLogin(idNumber, pin);
		}
	};

	return (
		<div className="fixed inset-0 bg-text/50 backdrop-blur-lg flex items-center justify-center z-50">
			<div className="bg-surface p-8 rounded-2xl border border-border w-[90%] max-w-md">
				<h2 className="text-text text-2xl font-bold mb-6">Login</h2>
				
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label className="block text-text text-sm mb-2">ID Number</label>
						<input
							type="text"
							inputMode="numeric"
							value={idNumber}
							onChange={(e) => setIdNumber(e.target.value.replace(/\D/g, ''))}
							className="w-full px-3 py-2 border border-border rounded-lg bg-bg text-text"
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
							className="w-full px-3 py-2 border border-border rounded-lg bg-bg text-text tracking-[0.5rem]"
							placeholder="••••"
							required
						/>
					</div>

					<button
						type="submit"
						disabled={isLoading || !idNumber || pin.length !== 4}
						className="w-full py-3 bg-primary text-bg rounded-lg font-bold disabled:opacity-50"
					>
						{isLoading ? 'Logging in...' : 'Login'}
					</button>
				</form>

				<div className="mt-6 text-center text-sm text-muted">
					<button
						onClick={onSwitchToRegister}
						className="text-primary underline mr-4"
					>
						Register new shop
					</button>
					<button
						onClick={onSwitchToJoin}
						className="text-primary underline"
					>
						Join existing shop
					</button>
				</div>
			</div>
		</div>
	);
}
